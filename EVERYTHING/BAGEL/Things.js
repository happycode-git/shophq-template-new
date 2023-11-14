// #region IMPORTS
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Keyboard,
  Text,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import { Ionicons } from "react-native-vector-icons";
import { initializeApp, setLogLevel } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
// #endregion

// CONSTANTS
export const { height, width } = Dimensions.get("window");
export function randomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// COMPONENTS
export function SafeArea({ statusBar, loading, children, styles }) {
  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: Platform.OS === "ios" ? 50 : 35,
          paddingBottom: Platform.OS === "ios" ? 35 : 10,
        },
        styles,
      ]}
    >
      <StatusBar style={statusBar === "light" ? "light" : "dark"}></StatusBar>
      {loading && <Loading />}
      {children}
    </View>
  );
}
export function SplitView({ children, leftSize, rightSize, styles }) {
  const [left, right] = React.Children.toArray(children);
  return (
    <View
      style={[
        { flex: 1, flexDirection: "row", alignItems: "flex-start" },
        styles,
      ]}
    >
      <View style={[{ flex: leftSize }]}>{left}</View>
      <View style={[{ flex: rightSize }]}>{right}</View>
    </View>
  );
}
export function Spacer({ height }) {
  return <View style={[{ height: height !== undefined ? height : 15 }]}></View>;
}
export function Loading() {
  return (
    <View
      style={[
        {
          position: "absolute",
          height: height,
          width: width,
          backgroundColor: "rgba(0,0,0,0.75)",
          zIndex: 10000,
        },
      ]}
    >
      <View style={[{ flex: 1 }]}></View>
      <ActivityIndicator />
      <View style={[{ flex: 1 }]}></View>
    </View>
  );
}
export function ButtonOne({
  children,
  backgroundColor,
  radius,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            backgroundColor:
              backgroundColor !== undefined ? backgroundColor : "black",
            borderRadius: radius !== undefined ? radius : 6,
            padding: 14,
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function LinkOne({ children, underlineColor, onPress, styles }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            borderBottomWidth: 1,
            borderBottomColor:
              underlineColor !== undefined ? underlineColor : "black",
            alignSelf: "flex-start",
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function TextFieldOne({
  placeholder,
  textSize,
  radius,
  onTyping,
  isPassword,
  autoCap,
  isNum,
  value,
  styles,
}) {
  function onType(text) {
    onTyping(text);
  }
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={"rgba(0,0,0,0.5)"}
      onChangeText={onType}
      value={value}
      secureTextEntry={isPassword}
      autoCapitalize={autoCap ? "sentences" : "none"}
      keyboardType={isNum ? "number-pad" : "default"}
      style={[
        {
          padding: 14,
          backgroundColor: "#dae0e3",
          fontSize: textSize !== undefined ? textSize : 16,
          borderRadius: radius !== undefined ? radius : 6,
        },
        styles,
      ]}
    />
  );
}
export function TextAreaOne({
  placeholder,
  textSize,
  radius,
  onTyping,
  value,
  styles,
}) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  function onType(text) {
    onTyping(text);
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners when component is unmounted
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View>
      <View
        style={[
          {
            backgroundColor: "#dae0e3",
            padding: 14,
            borderRadius: radius !== undefined ? radius : 6,
          },
        ]}
      >
        <TextInput
          multiline={true}
          placeholder={placeholder}
          placeholderTextColor={"rgba(0,0,0,0.5)"}
          onChangeText={onType}
          value={value}
          style={[
            {
              fontSize: textSize !== undefined ? textSize : 16,
            },
            styles,
          ]}
        />
      </View>
      {isKeyboardVisible && (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <Text
            style={[{ textAlign: "right", paddingVertical: 6, fontSize: 16 }]}
          >
            Done
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
export function CameraPicker({ setToggle, setLoading, setImage }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = React.useRef(null);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  async function takePicture() {
    if (cameraRef.current && isCameraReady && !capturing) {
      setCapturing(true);
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
        setLoading(false);
        setToggle(false);
      } finally {
        setCapturing(false);
        setLoading(false);
        setToggle(false);
      }
    }
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={[
          layout.absolute,
          layout.full_height,
          layout.full_width,
          backgrounds.white,
          layout.separate_vertical,
        ]}
      >
        <View></View>
        <View style={[layout.vertical]}>
          <Text style={{ textAlign: "center" }}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity
            onPress={() => {
              requestPermission();
              console.log("GRANTED");
              setToggle(true);
            }}
          >
            <Text style={[format.center_text, sizes.medium_text, colors.blue]}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
        <View></View>
      </View>
    );
  }

  return (
    <View
      style={[
        backgrounds.black,
        layout.absolute,
        layout.full_height,
        layout.full_width,
        { paddingVertical: 55 },
      ]}
    >
      <Camera
        style={[{ height: "100%" }]}
        type={type}
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View
          style={[
            layout.padding,
            layout.margin,
            layout.fit_width,
            { backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 30 },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setToggle(false);
            }}
          >
            <Text style={[colors.white]}>Close</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            layout.separate_horizontal,
            layout.padding,
            layout.absolute,
            layout.bottom,
            layout.full_width,
            layout.fit_height,
            layout.align_bottom,
          ]}
        >
          <TouchableOpacity
            style={[
              {
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: 30,
                paddingVertical: 8,
                paddingHorizontal: 14,
              },
              layout.fit_height,
            ]}
            onPress={toggleCameraType}
          >
            <Text style={[colors.white]}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={takePicture}
          >
            <Ionicons name="camera-outline" size={25} style={[colors.black]} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
export function AsyncImage({ path, width, height, radius }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const storageRef = ref(storage, path);
    getDownloadURL(storageRef)
      .then((url) => {
        // Image has been successfully loaded
        setImageUrl(url);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error loading image:", error);
      })
      .finally(() => {
        // Update loading state when the operation is complete
        setLoading(false);
      });
  }, [path]);

  return (
    <View style={[layout.relative]}>
      {loading ? (
        <View
          style={[
            {
              width: width !== undefined ? width : 100,
              height: height !== undefined ? height : 100,
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: radius !== undefined ? radius : 10,
            },
            layout.separate_vertical,
          ]}
        >
          <View></View>
          <ActivityIndicator />
          <View></View>
        </View>
      ) : (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: width !== undefined ? width : 100,
            height: height !== undefined ? height : 100,
            borderRadius: radius !== undefined ? radius : 10
          }}
          resizeMode="cover"
          onLoadStart={() => setImageLoaded(false)} // Set imageLoaded to false when loading starts
          onLoad={() => setImageLoaded(true)} // Set imageLoaded to true when the image has finished loading
        />
      )}
      {!imageLoaded && (
        <View
        style={[
          {
            width: width !== undefined ? width : 100,
            height: height !== undefined ? height : 100,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: radius !== undefined ? radius : 10,
          },
          layout.separate_vertical,
          layout.absolute
        ]}
      >
        <View></View>
        <ActivityIndicator />
        <View></View>
      </View>
      )}
    </View>
  );
}

// FUNCTIONS
export async function function_PickImage(setLoading, setImage) {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    setLoading(false);
    setImage(result.assets[0].uri);
  }
}

// STYLES
export const format = StyleSheet.create({
  center_text: {
    textAlign: "center",
  },
  right_text: {
    textAlign: "right",
  },
  left_text: {
    textAlign: "left",
  },
  bold: {
    fontWeight: "bold",
  },
});
export const sizes = StyleSheet.create({
  xsmall_text: {
    fontSize: 12,
    width: "100%",
  },
  small_text: {
    fontSize: 16,
    width: "100%",
  },
  medium_text: {
    fontSize: 20,
    width: "100%",
  },
  large_text: {
    fontSize: 25,
    width: "100%",
  },
  xlarge_text: {
    fontSize: 30,
    width: "100%",
  },
  xxlarge_text: {
    fontSize: 35,
    width: "100%",
  },
});
export const colors = StyleSheet.create({
  white: {
    color: "white",
  },
  black: {
    color: "black",
  },
  blue: {
    color: "#169FFF",
  },
});
export const layout = StyleSheet.create({
  padding: {
    padding: 14,
  },
  margin: {
    margin: 14,
  },
  horizontal: {
    flexDirection: "row",
    gap: 14,
  },
  vertical: {
    flexDirection: "column",
    gap: 14,
  },
  separate_horizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separate_vertical: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
    zIndex: 1000,
  },
  bottom: {
    bottom: 0,
  },
  full_height: {
    height: height,
  },
  full_width: {
    width: width,
  },
  fit_height: {
    alignItems: "flex-start",
  },
  fit_width: {
    alignSelf: "flex-start",
  },
  center_horizontal: {
    alignSelf: "center",
  },
  align_bottom: {
    alignItems: "flex-end",
  },
  align_top: {
    alignItems: "flex-start",
  },
  image_cover: {
    objectFit: "cover",
  },
  image_contain: {
    objectFit: "contain",
  },
  image_fill: {
    objectFit: "fill",
  },
});
export const backgrounds = StyleSheet.create({
  black: {
    backgroundColor: "black",
  },
  white: {
    backgroundColor: "white",
  },
});

// AUTH
// Config
const firebaseConfig = {
  apiKey: "AIzaSyDR8zoNJPj1AC5xRbuD92BCACDADPAnpJM",
  authDomain: "iic-appline-library.firebaseapp.com",
  projectId: "iic-appline-library",
  storageBucket: "iic-appline-library.appspot.com",
  messagingSenderId: "592200952214",
  appId: "1:592200952214:web:37732adf2306768ff655b7",
  measurementId: "G-YKNCN415JB",
};
// Initializations
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage();
const db = getFirestore(app);

export function auth_IsUserSignedIn(
  setLoading,
  navigation,
  ifLoggedIn,
  ifNotLoggedIn
) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setLoading(false);
      navigation.navigate(ifLoggedIn);
    } else {
      setLoading(false);
      console.log("USER IS NOT LOGGED IN");
      navigation.navigate(ifNotLoggedIn);
    }
  });
}
export function auth_SignIn(setLoading, email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const userID = user.uid;
      console.log(userID);
      setLoading(false);
      // ...
    })
    .catch((error) => {
      const errorMessage = error.message;
      setLoading(false);
      Alert.alert("Invalid Login", errorMessage);
    });
}
export function auth_SignOut(setLoading, navigation, redirect) {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      setLoading(false);
      console.log("USER SIGNED OUT");
      navigation.navigate(redirect);
    })
    .catch((error) => {
      // An error happened.
      setLoading(false);
      Alert.alert("Error", "There was an issue. Check your connection.");
    });
}
export async function firebase_GetDocument(
  setLoading,
  table,
  documentID,
  setter
) {
  const docRef = doc(db, table, documentID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const thing = {
      id: docSnap.id,
      ...docSnap.data(),
    };
    setter(thing);
    setLoading(false);
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    setLoading(false);
  }
}
export async function firebase_GetAllDocuments(setLoading, table, setter) {
  const querySnapshot = await getDocs(collection(db, table));
  const things = [];
  querySnapshot.forEach((doc) => {
    const thing = {
      id: doc.id,
      ...doc.data(),
    };
    things.push(thing);
  });
  setter(things);
  setLoading(false);
}
export async function firebase_GetAllDocumentsListener(
  setLoading,
  table,
  setter
) {
  const q = query(collection(db, table));
  const _ = onSnapshot(q, (querySnapshot) => {
    const things = [];
    querySnapshot.forEach((doc) => {
      const thing = {
        id: doc.id,
        ...doc.data(),
      };
      things.push(thing);
    });
    setter(things);
    setLoading(false);
  });
}
export async function firebase_UpdateDocument(
  setLoading,
  table,
  documentID,
  args
) {
  const washingtonRef = doc(db, table, documentID);
  await updateDoc(washingtonRef, args);
  setLoading(false);
}
export async function firebase_DeleteDocument(setLoading, table, documentID) {
  await deleteDoc(doc(db, table, documentID));
  setLoading(false);
}
export async function storage_UploadImage(setLoading, image, path) {
  setLoading(true);
  try {
    // Convert the data URL to a Blob
    const imageBlob = await fetch(image).then((res) => res.blob());

    // Upload the Blob to Firebase Storage
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, imageBlob);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress changes, if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle errors
        console.error("Error uploading image:", error);
        setLoading(false); // Update loading state in case of an error
      },
      async () => {
        // Handle successful completion
        setLoading(false); // Update loading state
      }
    );
  } catch (error) {
    console.error("Error creating document: ", error);
    setLoading(false); // Update loading state in case of an error
  }
}
