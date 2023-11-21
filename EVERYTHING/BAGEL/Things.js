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
  Pressable,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import { Ionicons } from "react-native-vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import CheckBox from "expo-checkbox";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { initializeApp, setLogLevel } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
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
export const c_projectID = "e4044789-90d5-4a16-829a-79b8868a1a43";
export var me = {};
export var myID = "test";
export var myToken = "";

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
export function Grid({ columns, children, styles }) {
  const childrenArray = React.Children.toArray(children);
  const rows = Math.ceil(childrenArray.length / columns);

  return (
    <View
      style={[{ flex: 1, flexDirection: "column", flexWrap: "wrap" }, styles]}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {childrenArray
            .slice(rowIndex * columns, (rowIndex + 1) * columns)
            .map((child, colIndex) => (
              <View key={colIndex} style={[{ flex: 1 / columns }]}>
                {child}
              </View>
            ))}
        </View>
      ))}
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
export function IconButtonOne({
  name,
  size,
  padding,
  background,
  color,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity
      style={[
        {
          padding: padding !== undefined ? padding : 10,
          backgroundColor:
            background !== undefined ? background : "rgba(0,0,0,0.2)",
          color: color !== undefined ? color : "black",
          borderRadius: 100,
          alignSelf: "flex-start",
        },
      ]}
      onPress={onPress}
    >
      <Ionicons name={name} size={size} />
    </TouchableOpacity>
  );
}
export function IconButtonTwo({ name, size, color, onPress, styles }) {
  return (
    <TouchableOpacity
      style={[
        {
          padding: 10,
          color: color !== undefined ? color : "black",
        },
        styles,
      ]}
      onPress={onPress}
    >
      <Ionicons name={name} size={size} />
    </TouchableOpacity>
  );
}
export function Icon({ name, size, color, styles }) {
  return (
    <Ionicons
      name={name}
      size={size}
      style={[{ color: color !== undefined ? color : "black" }, styles]}
    />
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
export function DropdownOne({ options, radius, value, setter }) {
  const [toggle, setToggle] = useState(false);
  return (
    <View>
      <View>
        <TouchableOpacity
          onPress={() => {
            setToggle(!toggle);
          }}
        >
          <View
            style={[
              {
                backgroundColor: "#dae0e3",
                padding: 14,
                borderRadius: radius !== undefined ? radius : 10,
              },
              layout.separate_horizontal,
              layout.relative,
            ]}
          >
            <Text style={[sizes.medium_text]}>{value}</Text>
            <Ionicons name="chevron-down-outline" size={25} />
          </View>
        </TouchableOpacity>
        {toggle && (
          <View>
            {options.map((option, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  style={[{ padding: 14 }]}
                  onPress={() => {
                    setter(option);
                    setToggle(false);
                  }}
                >
                  <Text style={[sizes.medium_text]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
export function CheckboxOne({ value, setter, text }) {
  function onCheck() {
    setter(!value);
  }
  return (
    <View style={[layout.horizontal]}>
      <CheckBox value={value} onValueChange={onCheck} />
      <Text style={[sizes.medium_text]}>{text}</Text>
    </View>
  );
}
export function SegmentedPicker({ options, value, setter }) {
  return (
    <View style={[layout.horizontal]}>
      {options.map((option, i) => {
        return (
          <TouchableOpacity
            key={i}
            style={[
              {
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 50,
                backgroundColor: value === option ? "black" : "rgba(0,0,0,0.2)",
              },
            ]}
            onPress={() => {
              setter(option);
            }}
          >
            <Text
              style={[
                { color: value === option ? "white" : "black" },
                sizes.medium_text,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
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
            borderRadius: radius !== undefined ? radius : 10,
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
            layout.absolute,
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
export function Map({ coords, delta, height, radius }) {
  // Default location for the app's headquarters
  const defaultLocation = {
    latitude: 37.7749, // Default latitude
    longitude: -122.4194, // Default longitude
  };

  useEffect(() => {
    console.log("----------");
    console.log(coords.latitude);
  }, []);

  return (
    <View style={[{ flex: 1 }]}>
      <MapView
        style={[
          {
            width: "100%",
            height: height !== undefined ? height : 125,
            borderRadius: radius !== undefined ? radius : 10,
          },
        ]}
        region={{
          latitude:
            coords.latitude !== undefined
              ? coords.latitude
              : defaultLocation.longitude,
          longitude:
            coords.longitude !== undefined
              ? coords.longitude
              : defaultLocation.longitude,
          latitudeDelta: delta !== undefined ? delta : 0.005,
          longitudeDelta: delta !== undefined ? delta : 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
        >
          <Image
            source={require("../../assets/marker.png")}
            style={[{ width: 40, height: 40 }]}
          />
        </Marker>
      </MapView>
    </View>
  );
}
export function LocalNotification({
  icon,
  title,
  message,
  color,
  setToggle,
  seconds,
}) {
  useEffect(() => {
    console.log("NOTIFICATION");
    setTimeout(() => {
      setToggle(false);
      console.log("NOTIFICATION ENDED");
    }, seconds * 1000);
  }, []);

  return (
    <TouchableOpacity
      style={[
        layout.absolute,
        { top: Platform.OS === "ios" ? 60 : 35, right: 0, left: 0 },
      ]}
      onPress={() => {
        setToggle(false);
      }}
    >
      <View
        style={[
          backgrounds.white,
          layout.padding,
          layout.margin,
          format.radius,
          layout.horizontal,
          {
            elevation: 5, // Android shadow
            shadowColor: "rgba(0,0,0,0.3)",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
        ]}
      >
        <Icon
          name={icon !== undefined ? icon : "close-outline"}
          size={35}
          color={color}
        />
        <View>
          <Text style={[format.bold, sizes.small_text]}>{title}</Text>
          <Text style={[sizes.small_text]}>{message}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
export async function function_GetLocation(setLoading, setLocation) {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied."
      );
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation);
    setLoading(false);
    console.log(status);
    console.log(userLocation.coords);
  } catch (error) {
    console.error("Error getting location:", error);
    setLoading(false);
  }
}
export async function function_NotificationsSetup() {
  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;

  if (finalStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Permission Required",
      "Push notifications need the appropriate permissions."
    );
    return;
  }

  const pushTokenData = await Notifications.getExpoPushTokenAsync({
    projectId: c_projectID,
  });
  console.log(pushTokenData);
  firebase_UpdateToken(pushTokenData.data);
  myToken = pushTokenData.data;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}
export function sendPushNotification(token, title, body) {
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      title: title,
      body: body,
    }),
  });
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
  radius: {
    borderRadius: 10,
  },
  radius_full: {
    borderRadius: 100,
  },
});
export const sizes = StyleSheet.create({
  xsmall_text: {
    fontSize: 12,
  },
  small_text: {
    fontSize: 16,
  },
  medium_text: {
    fontSize: 20,
  },
  large_text: {
    fontSize: 25,
  },
  xlarge_text: {
    fontSize: 30,
  },
  xxlarge_text: {
    fontSize: 35,
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
    gap: 8,
    alignItems: "center",
  },
  vertical: {
    flexDirection: "column",
    gap: 14,
  },
  separate_horizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flex: 1,
  },
  full_width: {
    flex: 1,
    flexDirection: "row",
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
  shadow: {
    elevation: 4, // Android shadow
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
      myID = uid;
      firebase_UpdateToken(myToken);
      firebase_GetMe(uid);
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
      firebase_UpdateToken(myToken);
      firebase_GetMe(userID);
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
export function auth_CreateUser(setLoading, email, password, args, navigation, redirect) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      const uid = user.uid;
      myID = uid;
      firebase_UpdateToken(myToken);
      firebase_CreateUser(args, uid)
      .then(() => {
        setLoading(false)
        navigation.navigate(redirect)
      })
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert("Try Again", errorMessage);
      setLoading(false);
      // ..
    });
}
export async function firebase_CreateUser(args, uid) {
  await setDoc(doc(db, "Users", uid), args);
}
export async function firebase_GetMe(uid) {
  const docRef = doc(db, "Users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const user = {
      id: docSnap.id,
      ...docSnap.data(),
    };
    me = user;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
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
export async function firebase_CreateDocument(args, table, documentID) {
  await setDoc(doc(db, table, documentID), args);
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
export async function firebase_UpdateToken(token) {
  const washingtonRef = doc(db, "Users", myID);

  // Set the "capital" field of the city 'DC'
  await updateDoc(washingtonRef, {
    Token: token,
  });
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
