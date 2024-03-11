// #region IMPORTS
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
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
  Platform,
  Animated,
  Easing,
  ScrollView,
  PanResponder,
  Button,
} from "react-native";
import * as Linking from "expo-linking";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import { Ionicons } from "react-native-vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import CheckBox from "expo-checkbox";
import * as Notifications from "expo-notifications";
import { Audio, Video, ResizeMode } from "expo-av";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import * as MailComposer from "expo-mail-composer";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import PagerView from "react-native-pager-view";
import * as FileSystem from "expo-file-system";
import * as ngeohash from "ngeohash";
import algoliasearch from "algoliasearch";
import QRCode from "react-native-qrcode-svg";
//
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
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
  orderBy,
  query,
  updateDoc,
  limit,
  setDoc,
  startAfter,
  where,
  documentId,
} from "firebase/firestore";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
// #endregion

// CONSTANTS
export const { height, width } = Dimensions.get("window");
// Bagel Algolia Account
export const searchClient = algoliasearch(
  "2DOEMGLWFB",
  "7cb8106771824a1a327f1e7cb9d81feb"
);
export const c_projectID = "178e14d8-0dce-4f61-8732-26291c7f545e";
export const c_googleMapsAPI = "AIzaSyD0y3c_it9f63AILxXHR-Y8YprSynEfxsY";
export var me = {};
export var myID = "test";
export var myToken = "";
export var stripePublishableKey =
  "pk_test_51NuJfZIDyFPNiK5CPKgovhg5fen3VM4SzxvBqdYAfwriYKzoqacsfIOiNAt5ErXss3eHYF45ak5PPFHeAD0AXit900imYxFTry";
//
export var serverURL = "https://garnet-private-hisser.glitch.me";
export var myCoords = {
  latitude: 35.66526085,
  longitude: 139.69219744,
};

// APP INFO
export var appName = "Happy Code Dev";

// COMPONENTS
export function SafeArea({
  statusBar,
  loading,
  children,
  backgroundColor,
  imageBackground,
  blurIntensity,
  styles,
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor:
            backgroundColor !== undefined ? backgroundColor : "white",
        },
        styles,
      ]}
    >
      <StatusBar style={statusBar === "light" ? "light" : "dark"}></StatusBar>
      {loading && <Loading />}
      {imageBackground !== undefined && (
        <ImageBackground
          blurIntensity={blurIntensity}
          image={imageBackground}
        />
      )}
      <View
        style={[
          {
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 42 : 30,
            paddingBottom: Platform.OS === "ios" ? 25 : 10,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}
export function SplitView({ children, leftSize, rightSize, styles }) {
  const [left, right] = React.Children.toArray(children);
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "flex-start", gap: 10 },
        styles,
      ]}
    >
      <View style={[{ flex: leftSize }]}>{left}</View>
      <View style={[{ flex: rightSize }]}>{right}</View>
    </View>
  );
}
export function Grid({ columns, children, styles, gap }) {
  const childrenArray = React.Children.toArray(children);
  const rows = Math.ceil(childrenArray.length / columns);

  return (
    <View
      style={[
        { flex: 1, flexDirection: "column", flexWrap: "wrap", gap },
        styles,
      ]}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {childrenArray
            .slice(rowIndex * columns, (rowIndex + 1) * columns)
            .map((child, colIndex) => (
              <View
                key={colIndex}
                style={[{ flex: 1 / columns, marginRight: gap }]}
              >
                {child}
              </View>
            ))}
        </View>
      ))}
    </View>
  );
}
export function FadeWrapper({ children, seconds }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const milliseconds = seconds * 1000;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: milliseconds !== undefined ? milliseconds : 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[{ opacity: fadeAnim }]}>{children}</Animated.View>
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
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          height: height,
        },
      ]}
    >
      <BlurWrapper
        intensity={40}
        radius={0}
        styles={[
          {
            flex: 1,
            height: height,
          },
        ]}
      >
        <View style={[{ flex: 1 }]}></View>
        <View style={[format.center_text, layout.padding]}>
          <PulsingView speed={0.5} scale={1.1}>
            <Image
              source={require("../../assets/loading.png")}
              style={[
                { width: 140, height: 140 },
                format.radius,
                layout.center,
              ]}
            />
          </PulsingView>
        </View>
        {/* <ActivityIndicator color={"white"} /> */}
        <View style={[{ flex: 1 }]}></View>
      </BlurWrapper>
    </View>
  );
}
export function RoundedCorners({
  children,
  topRight = 0,
  topLeft = 0,
  bottomRight = 0,
  bottomLeft = 0,
  styles,
}) {
  return (
    <View
      style={[
        styles,
        {
          borderTopRightRadius: topRight,
          borderTopLeftRadius: topLeft,
          borderBottomRightRadius: bottomRight,
          borderBottomLeftRadius: bottomLeft,
        },
      ]}
    >
      {children}
    </View>
  );
}
export function PulsingView({ children, speed = 1, scale = 1.4 }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: scale,
        duration: 300 / speed, // Adjust duration based on speed
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300 / speed, // Adjust duration based on speed
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => pulseAnimation());
  };

  useEffect(() => {
    pulseAnimation();
  }, [speed]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      {children}
    </Animated.View>
  );
}
export function BlurWrapper({ intensity, tint, radius, children, styles }) {
  return (
    <View
      style={[
        styles,
        {
          borderRadius: radius !== undefined ? radius : 100,
          overflow: "hidden",
        },
      ]}
    >
      <BlurView
        blurReductionFactor={3}
        intensity={intensity !== undefined ? intensity : 50}
        tint={tint !== undefined ? tint : "dark"}
        style={[
          styles,
          {
            borderRadius: radius !== undefined ? radius : 100,
            overflow: "hidden",
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}
export function SlideWrapper({
  mainContent,
  mainContentBackground,
  sideContent,
  sideContentBackground,
  height,
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            width: width,
            height: height !== undefined ? height : 60,
            backgroundColor:
              mainContentBackground !== undefined
                ? mainContentBackground
                : "white",
          }}
        >
          {mainContent}
        </View>
        <View
          style={{
            height: height !== undefined ? height : 60,
            backgroundColor:
              sideContentBackground !== undefined
                ? sideContentBackground
                : "white",
          }}
        >
          {sideContent}
        </View>
      </ScrollView>
    </View>
  );
}
export function ShowMoreView({ height, children }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <View>
      <View
        style={[
          { overflow: "hidden", height: showMore ? undefined : height },
          layout.padding,
        ]}
      >
        {children}
        {!showMore && (
          <LinearGradient
            colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80, // Adjust the faded area height as needed
            }}
          />
        )}
      </View>
      <TouchableOpacity onPress={() => setShowMore(!showMore)}>
        <View
          style={[
            {
              paddingVertical: 2,
              paddingHorizontal: 2,
              marginTop: !showMore ? -15 : -10,
            },
          ]}
        >
          <Text
            style={[
              {
                fontSize: 12,
                textAlign: "center",
                marginRight: 15,
                color: "gray",
              },
            ]}
          >
            {showMore ? "Show Less" : "Show More"}
          </Text>
        </View>
      </TouchableOpacity>
      <View></View>
    </View>
  );
}
export function TimedView({ seconds, children }) {
  const [toggle, setToggle] = useState(true);
  useEffect(() => {
    const totalSec = (seconds !== undefined ? seconds : 5) * 1000;
    setTimeout(() => {
      setToggle(false);
    }, totalSec);
  }, []);

  return <View>{toggle && <View>{children}</View>}</View>;
}
export function GradientView({ colors, children, styles }) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles]}
    >
      {children}
    </LinearGradient>
  );
}
export function MenuBar({
  options,
  iconSize,
  color,
  backgroundColor,
  padding,
  radius,
  navigation,
  route,
  styles,
}) {
  return (
    <View
      style={[
        styles,
        {
          justifyContent: "space-around",
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor:
            backgroundColor !== undefined ? backgroundColor : "rgba(0,0,0,0.1)",
          paddingVertical: padding !== undefined ? padding : 5,
          borderRadius: radius !== undefined ? radius : 10,
        },
        layout.horizontal,
      ]}
    >
      {options.map((opt, i) => {
        return (
          <TouchableOpacity
            key={i}
            onPress={() => {
              navigation.navigate(`${opt.route}`);
            }}
          >
            <Icon
              name={route.name === opt.route ? opt.icon : `${opt.icon}-outline`}
              size={iconSize !== undefined ? iconSize : 24}
              color={color !== undefined ? color : "black"}
            />
            {opt.text && (
              <Text
                style={[
                  {
                    fontSize: 12,
                    color: color !== undefined ? color : "black",
                  },
                ]}
              >
                {opt.text}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export function CSVtoJSONConverterView({ func }) {
  const [jsonData, setJsonData] = useState(null);
  const [headers, setHeaders] = useState(null);
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
      });
      const res = result.assets[0];
      if (!result.canceled) {
        const csvData = await FileSystem.readAsStringAsync(res.uri);
        // Parse CSV to JSON
        const parsedData = parseCSV(csvData);
        setHeaders(parsedData.headers);
        setJsonData(parsedData.data);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };
  const parseCSV = (csvData) => {
    // console.log(csvData);
    const lines = csvData.trim().split("\n");
    const firstLine = lines[0].trim();

    // Determine the separator (`,` or `;`)
    const separator = firstLine.includes(";") ? ";" : ",";

    const headers = firstLine.split(separator);

    const jsonData = lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });

    return { headers, data: jsonData };
  };
  const renderTable = () => {
    if (!jsonData || jsonData.length === 0) {
      return null;
    }

    return (
      <View>
        <View style={{ flexDirection: "column" }}>
          {/* Table Header */}

          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            {headers.map((header, index) => (
              <View
                key={index}
                style={{
                  width: 300,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  backgroundColor: "rgba(0,0,0,0.2)",
                }}
              >
                <Text style={[format.bold]}>{header}</Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {jsonData.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              {headers.map((header, index) => (
                <View
                  key={index}
                  style={{
                    width: 300,
                    padding: 10,
                    borderRightWidth: 1,
                    borderRightColor: "#ccc",
                  }}
                >
                  <Text>{row[header]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };
  const saveData = () => {
    // console.log(jsonData);
  };

  return (
    <View style={[backgrounds.white]}>
      <View style={[layout.padding, layout.vertical]}>
        <ButtonOne
          onPress={handleFilePick}
          styles={[layout.separate_horizontal]}
        >
          <Text style={[colors.white, sizes.medium_text]}>Choose CSV File</Text>
          <Icon name="document-outline" color="white" size={30} />
        </ButtonOne>
        {jsonData && jsonData.length > 0 && (
          <View>
            <ButtonOne
              onPress={() => {
                func(jsonData);
              }}
              backgroundColor={"#2F70D5"}
            >
              <Text
                style={[colors.white, sizes.medium_text, format.center_text]}
              >
                Do Something
              </Text>
            </ButtonOne>
          </View>
        )}
      </View>
      <ScrollView horizontal>
        <ScrollView>{renderTable()}</ScrollView>
      </ScrollView>
      {jsonData && (
        <View style={[layout.padding]}>
          <ButtonOne onPress={saveData} styles={[layout.separate_horizontal]}>
            <Text style={[colors.white, sizes.medium_text]}>Save CSV Data</Text>
            <Icon name="save-outline" color="white" size={30} />
          </ButtonOne>
        </View>
      )}
    </View>
  );
}
export function ImageBackground({ image, blurIntensity }) {
  return (
    <BlurWrapper
      radius={0}
      intensity={blurIntensity !== undefined ? blurIntensity : 0}
      styles={[
        {
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          zIndex: -5,
          height: height,
          width: width,
        },
      ]}
    >
      <View style={[{ zIndex: -10 }]}>
        <Image
          source={image}
          style={[
            {
              zIndex: -10,
              height: height,
              width: width,
            },
            layout.image_cover,
          ]}
        />
      </View>
    </BlurWrapper>
  );
}

//
export function ButtonOne({
  children,
  backgroundColor,
  radius,
  padding,
  width,
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
            padding: padding !== undefined ? padding : 14,
            width: width !== undefined ? width : "100%",
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function ButtonTwo({
  children,
  borderWidth,
  borderColor,
  radius,
  padding,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            borderWidth: borderWidth !== undefined ? borderWidth : 1,
            borderColor: borderColor !== undefined ? borderColor : "black",
            borderRadius: radius !== undefined ? radius : 6,
            padding: padding !== undefined ? padding : 14,
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function SelectedButton({
  children,
  func,
  color,
  backgroundColor,
  selectedBackgroundColor,
  styles,
}) {
  const [selected, setSelected] = useState(false);
  function selectFunc() {
    setSelected((prev) => !prev);
    func();
  }
  return (
    <TouchableOpacity
      onPress={() => {
        selectFunc();
      }}
      style={[
        styles,
        {
          backgroundColor: selected
            ? selectedBackgroundColor !== undefined
              ? selectedBackgroundColor
              : "rgba(0,0,0,0.2)"
            : backgroundColor !== undefined
            ? backgroundColor
            : "rgba(0,0,0,0.05)",
          borderWidth: selected ? 1 : 0,
          borderColor: selected
            ? color !== undefined
              ? color
              : "rgba(0,0,0,0.8)"
            : "rgba(0,0,0,0)",
        },
      ]}
    >
      <View style={[styles]}>{children}</View>
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
          borderRadius: 100,
          alignSelf: "flex-start",
        },
        styles,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={name}
        size={size}
        style={[{ color: color !== undefined ? color : "black" }]}
      />
    </TouchableOpacity>
  );
}
export function IconButtonTwo({ name, size, color, onPress, styles }) {
  return (
    <TouchableOpacity style={[styles]} onPress={onPress}>
      <Ionicons
        name={name}
        size={size}
        style={[
          {
            color: color !== undefined ? color : "black",
          },
        ]}
      />
    </TouchableOpacity>
  );
}
export function IconButtonThree({
  name,
  size,
  color,
  borderColor,
  radius,
  padding,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles,
        {
          borderWidth: 1,
          borderColor: borderColor !== undefined ? borderColor : "black",
          padding: padding !== undefined ? padding : 12,
          borderRadius: radius !== undefined ? radius : 100,
          alignSelf: "flex-start",
        },
      ]}
    >
      <Ionicons
        name={name}
        size={size}
        style={{ color: color !== undefined ? color : "black" }}
      />
    </TouchableOpacity>
  );
}
export function TextIconButton({
  text,
  textSize,
  icon,
  iconSize,
  backgroundColor,
  radius,
  paddingH,
  paddingV,
  onPress,
}) {
  function onThing() {
    onPress();
  }
  return (
    <TouchableOpacity onPress={onThing}>
      <View
        style={[
          layout.horizontal,
          {
            alignItems: "center",
            backgroundColor:
              backgroundColor !== undefined
                ? backgroundColor
                : "rgba(0,0,0,0.1)",
            borderRadius: radius !== undefined ? radius : 10,
            alignSelf: "flex-start",
            paddingHorizontal: paddingH !== undefined ? paddingH : 20,
            paddingVertical: paddingV !== undefined ? paddingV : 10,
          },
        ]}
      >
        <Text style={[{ fontSize: textSize !== undefined ? textSize : 16 }]}>
          {text}
        </Text>
        <Icon size={iconSize !== undefined ? iconSize : 22} name={icon} />
      </View>
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
  placeholderColor,
  backgroundColor,
  borderBottomWidth,
  borderBottomColor,
  paddingH,
  paddingV,
  textSize,
  textColor,
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
      placeholderTextColor={
        placeholderColor !== undefined ? placeholderColor : "rgba(0,0,0,0.5)"
      }
      onChangeText={onType}
      value={value}
      secureTextEntry={isPassword}
      autoCapitalize={autoCap ? "sentences" : "none"}
      keyboardType={isNum ? "decimal-pad" : "default"}
      style={[
        {
          paddingHorizontal: paddingH !== undefined ? paddingH : 14,
          paddingVertical: paddingV !== undefined ? paddingV : 14,
          backgroundColor:
            backgroundColor !== undefined ? backgroundColor : "#dae0e3",
          fontSize: textSize !== undefined ? textSize : 16,
          borderRadius: radius !== undefined ? radius : 6,
          borderBottomColor:
            borderBottomColor !== undefined
              ? borderBottomColor
              : "rgba(0,0,0,0)",
          borderBottomWidth:
            borderBottomWidth !== undefined ? borderBottomWidth : 0,
          color: textColor !== undefined ? textColor : "black",
        },
        styles,
      ]}
    />
  );
}
export function TextAreaOne({
  placeholder,
  placeholderColor,
  backgroundColor,
  textSize,
  textColor,
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
            backgroundColor:
              backgroundColor !== undefined ? backgroundColor : "#dae0e3",
            padding: 14,
            borderRadius: radius !== undefined ? radius : 6,
          },
        ]}
      >
        <TextInput
          multiline={true}
          placeholder={placeholder}
          placeholderTextColor={
            placeholderColor !== undefined
              ? placeholderColor
              : "rgba(0,0,0,0.5)"
          }
          onChangeText={onType}
          value={value}
          style={[
            {
              fontSize: textSize !== undefined ? textSize : 16,
              color: textColor !== undefined ? textColor : "black",
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
export function DropdownOne({
  options,
  radius,
  value,
  setter,
  backgroundColor,
  textColor,
  styles,
}) {
  const [toggle, setToggle] = useState(false);
  return (
    <View style={styles}>
      <TouchableOpacity
        onPress={() => {
          setToggle(!toggle);
        }}
      >
        <View
          style={[
            {
              backgroundColor:
                backgroundColor !== undefined ? backgroundColor : "#dae0e3",
              padding: 14,
              borderRadius: radius !== undefined ? radius : 10,
            },
            layout.separate_horizontal,
            layout.relative,
          ]}
        >
          <Text
            style={[
              sizes.medium_text,
              { color: textColor !== undefined ? textColor : "black" },
            ]}
          >
            {value}
          </Text>
          <Ionicons
            name="chevron-down-outline"
            size={25}
            color={textColor !== undefined ? textColor : "black"}
          />
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
                <Text
                  style={[
                    sizes.medium_text,
                    { color: textColor !== undefined ? textColor : "black" },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
export function CheckboxOne({ value, setter, text, textColor }) {
  function onCheck() {
    setter(!value);
  }
  return (
    <View style={[layout.horizontal]}>
      <CheckBox value={value} onValueChange={onCheck} />
      <Text
        style={[
          sizes.medium_text,
          { color: textColor !== undefined ? textColor : "black" },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}
export function DatePicker({ date, setDate, backgroundColor }) {
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <View
      style={[
        layout.horizontal,
        {
          backgroundColor:
            backgroundColor !== undefined ? backgroundColor : "rgba(0,0,0,0)",
        },
        format.radius,
        layout.padding_small,
        { width: "100%" },
      ]}
    >
      <DateTimePicker
        testID="datePicker"
        value={date}
        mode="date"
        is24Hour={true}
        display="calendar"
        onChange={onDateChange}
      />
    </View>
  );
}
export function TimePicker({ time, setTime, backgroundColor }) {
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  return (
    <View
      style={[
        layout.horizontal,
        {
          backgroundColor:
            backgroundColor !== undefined ? backgroundColor : "rgba(0,0,0,0)",
        },
        format.radius,
        layout.padding_small,
        { width: "100%" },
      ]}
    >
      <DateTimePicker
        testID="timePicker"
        value={time}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={onTimeChange}
      />
    </View>
  );
}
export function DateTime({ date, time, setDate, setTime, backgroundColor }) {
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  return (
    <View
      style={[
        layout.horizontal,
        {
          backgroundColor:
            backgroundColor !== undefined ? backgroundColor : "rgba(0,0,0,0)",
        },
        format.radius,
        layout.padding_small,
        { width: "100%" },
      ]}
    >
      <DateTimePicker
        testID="datePicker"
        value={date}
        mode="date"
        is24Hour={true}
        display="calendar"
        onChange={onDateChange}
      />
      <DateTimePicker
        testID="timePicker"
        value={time}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={onTimeChange}
      />
    </View>
  );
}
export function SegmentedPicker({ options, value, setter, backgroundColor }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                  backgroundColor:
                    value === option
                      ? backgroundColor !== undefined
                        ? backgroundColor
                        : "black"
                      : "rgba(0,0,0,0.2)",
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
    </ScrollView>
  );
}
export function SegmentedPickerTwo({
  options,
  value,
  setter,
  borderBottomColor,
  selectedColor,
  color,
  fontSize,
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[layout.horizontal]}>
        {options.map((option, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[
                {
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 0,
                  borderBottomWidth: 2,
                  borderBottomColor:
                    value === option
                      ? borderBottomColor !== undefined
                        ? borderBottomColor
                        : "black"
                      : "rgba(0,0,0,0.0)",
                },
              ]}
              onPress={() => {
                setter(option);
              }}
            >
              <Text
                style={[
                  {
                    color:
                      value === option
                        ? selectedColor !== undefined
                          ? selectedColor
                          : "black"
                        : color !== undefined
                        ? color
                        : "black",
                    fontSize: fontSize !== undefined ? fontSize : 18,
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
export function IconSegmentedPicker({
  icons,
  backgroundColor,
  radius,
  setter,
  value,
}) {
  return (
    <View
      style={[
        {
          backgroundColor:
            backgroundColor !== undefined ? backgroundColor : "rgba(0,0,0,0.1)",
          borderRadius: radius !== undefined ? radius : 10,
          paddingHorizontal: 8,
        },
        layout.horizontal,
        layout.no_gap,
        layout.fit_width,
      ]}
    >
      {icons.map((icon, i) => {
        return (
          <TouchableOpacity
            style={[{ padding: 8 }]}
            key={i}
            onPress={() => {
              setter(icon.Value);
            }}
          >
            <Icon
              name={value === icon.Value ? icon.Icon : `${icon.Icon}-outline`}
              size={25}
              color={icon.Color !== undefined ? icon.Color : "black"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export function Accordion({ children, top, func }) {
  const [toggle, setToggle] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        if (func !== undefined) {
          func();
        }
        setToggle(!toggle);
      }}
    >
      <View>{top}</View>
      {toggle && <View>{children}</View>}
    </TouchableOpacity>
  );
}
export function CameraView({ setToggle, setLoading, func }) {
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
        func(photo.uri);
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
          { top: 0, bottom: 0, left: 0, right: 0 },
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
              // setToggle(true);
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
        { top: 0, right: 0, left: 0, bottom: 0 },
        layout.full_height,
        layout.full_width,
        { paddingVertical: 55 },
      ]}
    >
      <Camera
        style={[{ height: "100%", width: "100%" }]}
        type={type}
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View
          style={[
            layout.separate_horizontal,
            layout.padding,
            layout.absolute,
            { top: 0, right: 0, left: 0, bottom: 0 },
            layout.full_width,
            layout.fit_height,
            layout.align_bottom,
          ]}
        >
          <View style={[layout.separate_horizontal]}>
            <TouchableOpacity
              style={[
                { paddingVertical: 8, paddingHorizontal: 14 },
                layout.margin,
                layout.fit_width,
                { backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 30 },
              ]}
              onPress={() => {
                setToggle(false);
              }}
            >
              <View>
                <Text style={[colors.white]}>Close</Text>
              </View>
            </TouchableOpacity>
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
          </View>
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
    const newPath = `${
      !path.startsWith("Images/") && !path.startsWith("Stock/") ? "Images/" : ""
    }${path}`;

    var storageRef = ref(storage, newPath);
    if (path === "") {
      storageRef = ref(storage, "Stock/abstract.jpg");
    }
    // console.log(path)
    getDownloadURL(storageRef)
      .then((url) => {
        // Image has been successfully loaded
        setImageUrl(url);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error loading image:", error);
        getDownloadURL(ref(storage, "Stock/abstract.jpg")).then((url) => {
          setImageUrl(url);
        });
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
              backgroundColor: "rgba(255,255,255,0.1)",
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
              backgroundColor: "rgba(255,255,255,0.1)",
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
export function AsyncImagesView({ paths, radius, styles }) {
  const [currentPage, setCurrentPage] = useState(0);
  const total = paths.length;

  const handlePageSelected = (event) => {
    const { position } = event.nativeEvent;
    setCurrentPage(position);
    if (onPageSelected) {
      onPageSelected(position);
    }
  };

  useEffect(() => {
    // console.log(paths);
  }, []);

  return (
    <View style={{ height: "100%" }}>
      <PagerView
        style={[styles, { height: "100%" }]}
        onPageSelected={handlePageSelected}
      >
        {paths.map((path, i) => (
          <View key={i}>
            <AsyncImage
              path={path}
              width={"100%"}
              height={"100%"}
              radius={radius !== undefined ? radius : 10}
            />
          </View>
        ))}
      </PagerView>
      {paths.length > 1 && (
        <View style={[layout.absolute, { right: 10, bottom: 10 }]}>
          <BlurWrapper intensity={80}>
            <Text
              style={[
                colors.white,
                { fontSize: 10, paddingVertical: 4, paddingHorizontal: 8 },
              ]}
            >
              {currentPage + 1}/{total}
            </Text>
          </BlurWrapper>
        </View>
      )}
    </View>
  );
}
export function Map({
  coordsArray,
  delta,
  height,
  radius,
  markerSize,
  func,
  scrollEnabled = true,
}) {
  // Default location for the app's headquarters
  const defaultLocation = {
    latitude: 37.7749, // Default latitude
    longitude: -122.4194, // Default longitude
  };

  useEffect(() => {}, []);

  const getMapRegion = () => {
    if (coordsArray.length === 0) {
      return {
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
        latitudeDelta: delta !== undefined ? delta : 0.005,
        longitudeDelta: delta !== undefined ? delta : 0.005,
      };
    }

    let minX = coordsArray[0].latitude;
    let maxX = coordsArray[0].latitude;
    let minY = coordsArray[0].longitude;
    let maxY = coordsArray[0].longitude;

    coordsArray.forEach((coord) => {
      minX = Math.min(minX, coord.latitude);
      maxX = Math.max(maxX, coord.latitude);
      minY = Math.min(minY, coord.longitude);
      maxY = Math.max(maxY, coord.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const latitudeDistance = maxX - minX;
    const longitudeDistance = maxY - minY;
    const padding = Math.max(latitudeDistance, longitudeDistance) * 0.2; // 10% of the larger distance as padding
    const deltaX = latitudeDistance + padding; // Add padding to latitudeDelta
    const deltaY = longitudeDistance + padding; // Add padding to longitudeDelta

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY,
    };
  };

  return (
    <View>
      <MapView
        style={{
          width: "100%",
          height: height !== undefined ? height : 125,
          borderRadius: radius !== undefined ? radius : 10,
        }}
        region={getMapRegion()}
        scrollEnabled={scrollEnabled}
      >
        {coordsArray.map((coords, index) => (
          <TouchableOpacity
            onPress={() => {
              func({ latitude: coords.latitude, longitude: coords.longitude });
            }}
          >
            <Marker
              key={index}
              coordinate={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
            >
              <Image
                source={require("../../assets/marker.png")}
                style={{
                  width: markerSize !== undefined ? markerSize : 45,
                  height: markerSize !== undefined ? markerSize : 45,
                }}
              />
            </Marker>
          </TouchableOpacity>
        ))}
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
  radius,
  seconds,
}) {
  useEffect(() => {
    console.log("NOTIFICATION START");
    setTimeout(() => {
      setToggle(false);
      console.log("NOTIFICATION ENDED");
    }, (seconds !== undefined ? seconds : 5) * 1000);
  }, []);

  return (
    <View>
      <TouchableOpacity
      style={[
        layout.absolute,
        layout.margin_horizontal,
        layout.padding,
        {
          top: Platform.OS === "ios" ? 25 : 35,
          right: 0,
          left: 0,
          borderColor: "rgba(0,0,0,0.1)",
          borderWidth: 1,
          borderRadius: radius !== undefined ? radius : 10,
        },
      ]}
      onPress={() => {
        setToggle(false);
      }}
    >
      <View style={[backgrounds.white, format.radius, layout.horizontal]}>
        <Icon
          name={icon !== undefined ? icon : "close-outline"}
          size={35}
          color={color !== undefined ? color : "red"}
        />
        <View>
          <Text style={[format.bold, sizes.small_text]}>
            {title !== undefined ? title : "Everything Bagel"}
          </Text>
          <Text style={[sizes.small_text, {width: "85%"}]}>
            {message !== undefined
              ? message
              : "There are many things to know about the bagel."}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    </View>
  );
}
export function AudioPlayer({ audioName, audioPath }) {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const path = audioPath || require("../../assets/AUDIO/sample.mp3");
  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  async function playPauseSound() {
    if (sound) {
      if (isPlaying) {
        console.log("Pausing Sound");
        await sound.pauseAsync();
      } else {
        console.log("Resuming Sound");
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      console.log("Loading Sound");
      const { sound, status } = await Audio.Sound.createAsync(path, {
        shouldPlay: true,
      });

      setSound(sound);
      setIsPlaying(true);
      console.log("Playing Sound");

      // Update the duration of the audio
      setDuration(status.durationMillis);

      // Set up a periodic callback to update the position of the slider
      sound.setOnPlaybackStatusUpdate((status) => {
        setPosition(status.positionMillis);

        // Check if audio has finished playing
        if (status.didJustFinish) {
          // Reset position to the beginning
          sound.setPositionAsync(0);
          setPosition(0);
          setIsPlaying(false);
        }
      });
    }
  }
  async function stopSound() {
    if (sound) {
      console.log("Stopping Sound");
      await sound.stopAsync();
      // Reset position to the beginning
      sound.setPositionAsync(0);
      setPosition(0);
      setIsPlaying(false);
    }
  }
  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading Sound");
        sound.unloadAsync();
      }
    };
  }, [sound]);
  const onSliderValueChange = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  return (
    <View style={[layout.padding, backgrounds.white, format.radius]}>
      <View style={[layout.horizontal]}>
        <IconButtonTwo
          name={isPlaying ? "pause" : "play"}
          onPress={playPauseSound}
          size={30}
        />
        <IconButtonTwo name="stop" onPress={stopSound} size={30} />
        <Text style={[sizes.medium_text]}>{audioName}</Text>
      </View>
      <View style={[layout.horizontal]}>
        <Slider
          style={{ width: "75%", height: 10 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor="black"
        />
        <Text>{`${formatTime(position)} / ${formatTime(duration)}`}</Text>
      </View>
    </View>
  );
}
export function VideoPlayer({ videoPath, radius }) {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoad = async (loadStatus) => {
    setIsLoading(false);
    setStatus(loadStatus);
    setDuration(loadStatus.durationMillis);
  };

  const seekBackward = async () => {
    if (video.current) {
      const newPosition = Math.max(0, status.positionMillis - 10000); // Go back 10 seconds
      await video.current.setPositionAsync(newPosition);
    }
  };

  const seekForward = async () => {
    if (video.current) {
      const newPosition = Math.min(
        status.durationMillis,
        status.positionMillis + 10000
      ); // Go forward 10 seconds
      await video.current.setPositionAsync(newPosition);
    }
  };

  const onSliderValueChange = (value) => {
    if (video.current) {
      setPosition(value);
    }
  };

  const onSlidingComplete = async (value) => {
    if (video.current) {
      await video.current.setPositionAsync(value);
    }
  };

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  useEffect(() => {
    console.log("Video Path:", videoPath);

    const loadVideo = async () => {
      try {
        if (typeof videoPath === "string") {
          // If videoPath is a string, assume it's a URI
          await video.current.loadAsync({ uri: videoPath }, {}, false);
        } else {
          // If videoPath is not a string, assume it's a local require statement
          await video.current.loadAsync(videoPath, {}, false);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };

    loadVideo();
  }, [videoPath]);

  return (
    <View>
      <Video
        style={{
          height: "auto",
          aspectRatio: 16 / 9,
          borderRadius: radius !== undefined ? radius : 10,
        }}
        ref={video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(newStatus) => {
          setStatus(newStatus);
          setPosition(newStatus.positionMillis);
        }}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
      />
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 10,
          }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </View>
  );
}
export function TimerView({ isActive, setSeconds, seconds, textSize, styles }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, setSeconds]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <View>
      <Text
        style={[styles, { fontSize: textSize !== undefined ? textSize : 18 }]}
      >
        {formatTime(seconds)}
      </Text>
    </View>
  );
}
export function BarGraphView({
  stats,
  barWidth,
  barRadius,
  graphHeight,
  showValue = true,
  showHeading = true,
  textSize,
  gap,
}) {
  const maxValue = Math.max(...stats.map((stat) => stat.Value));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View
        style={{
          flexDirection: "row",
          padding: 16,
          height: graphHeight !== undefined ? graphHeight : height * 0.3,
          gap: gap !== undefined ? gap : 4,
        }}
      >
        {stats.map((stat, index) => (
          <View key={index} style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, marginBottom: 4 }}>
              {showValue ? stat.Value : ""}
            </Text>
            <View
              style={{
                backgroundColor: `${
                  stat.Color !== undefined ? stat.Color : "black"
                }`,
                width: barWidth !== undefined ? barWidth : "100%",
                height: (stat.Value / maxValue) * 70 + "%",
                marginTop: "auto", // Align at the bottom
                borderRadius: barRadius !== undefined ? barRadius : 10,
              }}
            />
            <Text
              style={{
                fontSize: textSize !== undefined ? textSize : 14,
                marginTop: 8,
              }}
            >
              {showHeading ? stat.Heading : ""}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
export function ProgressBar({
  progress,
  radius,
  color,
  backgroundColor,
  height,
  limit,
}) {
  const normalizedProgress = Math.min(100, Math.max(0, progress)); // Ensure progress is within the range 0-100

  const normalizedLimit = limit !== undefined ? limit : 100;
  const normalizedWidth = (normalizedProgress / normalizedLimit) * 100;

  return (
    <View
      style={{
        height: height !== undefined ? height : 20,
        width: "100%",
        backgroundColor:
          backgroundColor !== undefined ? backgroundColor : "rgba(0,0,0,0.1)",
        borderRadius: radius !== undefined ? radius : 6,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${normalizedWidth}%`,
          backgroundColor: color !== undefined ? color : "blue",
          borderRadius: radius !== undefined ? radius : 6,
        }}
      ></View>
    </View>
  );
}
export function ImagesView({ images, styles, onPageSelected }) {
  const [currentPage, setCurrentPage] = useState(0);
  const total = images.length;

  const handlePageSelected = (event) => {
    const { position } = event.nativeEvent;
    setCurrentPage(position);
    if (onPageSelected) {
      onPageSelected(position);
    }
  };

  return (
    <View style={{ height: "100%" }}>
      <PagerView
        style={[{ height: "100%" }]}
        onPageSelected={handlePageSelected}
      >
        {images.map((img, i) => (
          <View key={i}>
            <Image
              source={img}
              style={[styles, { width: "100%", height: "100%" }]}
            />
          </View>
        ))}
      </PagerView>
      <View style={[layout.absolute, { right: 10, bottom: 10 }]}>
        <BlurWrapper intensity={80}>
          <Text
            style={[
              colors.white,
              { fontSize: 10, paddingVertical: 4, paddingHorizontal: 12 },
            ]}
          >
            {currentPage + 1}/{total}
          </Text>
        </BlurWrapper>
      </View>
    </View>
  );
}
export function NotificationCircle({ text, textSize, color, children }) {
  return (
    <View style={[{ position: "relative" }, layout.fit_width]}>
      <View
        style={[
          {
            position: "absolute",
            top: -14,
            right: -16,
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: color !== undefined ? color : "#F40202",
            zIndex: 800,
          },
          format.radius_full,
        ]}
      >
        <Text
          style={[
            { fontSize: textSize !== undefined ? textSize : 10},
            colors.white,
          ]}
        >
          {text !== undefined ? text : "1"}
        </Text>
      </View>
      {children}
    </View>
  );
}
export function SliderView({ func, padding, icon, text, textSize }) {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const circleSize = 50; // Adjust this based on the desired size of the circle

  useEffect(() => {
    const handleScreenResize = () => {
      setScreenWidth(Dimensions.get("window").width);
    };

    Dimensions.addEventListener("change", handleScreenResize);

    return () => {
      Dimensions.removeEventListener("change", handleScreenResize);
    };
  }, []);

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gesture) => {
      // Check if the circle has reached the end (right edge of the screen)
      const endPositionX = screenWidth - circleSize;
      if (gesture.moveX >= endPositionX) {
        // Trigger the function when the circle reaches the end
        func();
      }

      // Reset the position of the circle to the starting position
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: circleSize + (padding !== undefined ? padding : 10), // Set the height of the container to the size of the circle
        backgroundColor: "black",
        borderRadius: 100,
        position: "relative", // Added to position the icon relative to the container
      }}
    >
      <View style={[layout.absolute, format.center_text]}>
        <Text style={[colors.white, {fontSize: textSize !== undefined ? textSize : 16}]}>
          {text !== undefined ? text : "Everything Bagel"}
        </Text>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: "absolute",
          left: 0,
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: "white",
          transform: [{ translateX: pan.x }],
          marginLeft: padding !== undefined ? padding / 2 : 5,
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {/* Use your preferred icon component here */}
          <Icon
            name={icon !== undefined ? icon : "cart-outline"}
            size={25}
            color={"black"}
          />
        </View>
      </Animated.View>
    </View>
  );
}
export function NumberPad({ setter, value, text }) {
  function onTypeNum(num) {
    const thing = `${num}`;
    if (thing !== "back") {
      setter((prev) => `${prev}${thing}`);
    } else {
      if (value.length > 0) {
        // REMOVE CHAR
        setter((prev) => prev.slice(0, -1));
      }
    }
  }
  return (
    <View style={[{ flex: 1 }]}>
      <View
        style={[
          layout.padding_horizontal,
          layout.padding_vertical_small,
          { backgroundColor: "#F7F8FC" },
        ]}
      >
        <Text style={[sizes.small_text, { color: "gray" }]}>
          {text !== undefined ? text : "Price"}
        </Text>
        <Text style={[sizes.xlarge_text, format.bold]}>{value}</Text>
      </View>
      <View
        style={[{ borderBottomColor: "rgba(0,0,0,0.1)", borderBottomWidth: 1 }]}
      ></View>
      <Grid columns={3}>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(1);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              1
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(2);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              2
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(3);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              3
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(4);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              4
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(5);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              5
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(6);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              6
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(7);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              7
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(8);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              8
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(9);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              9
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(".");
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              .
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(0);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Text style={[sizes.xlarge_text, format.bold, format.center_text]}>
              0
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum("back");
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Icon
              styles={[layout.center]}
              name={"backspace-outline"}
              size={40}
            />
          </View>
        </TouchableOpacity>
      </Grid>
      <View style={[layout.padding_horizontal]}>
        <ButtonOne backgroundColor={"#F5F7FD"} radius={14} padding={10}>
          <Text style={[format.center_text, format.bold]}>Done</Text>
        </ButtonOne>
      </View>
    </View>
  );
}
export function QRCodeView({ value, background, color, size }) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <QRCode
        value={
          value !== undefined
            ? value
            : "https://innovativeinternetcreations.com"
        }
        size={size !== undefined ? size : 200}
        bgColor={background !== undefined ? background : "black"}
        fgColor={color !== undefined ? color : "white"}
      />
    </View>
  );
}
export function QRReader({ func }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [qrValue, setQrValue] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      requestPermission();
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    setQrValue(data);
    func(data);
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>We need your permission to show the camera</Text>
        <ButtonTwo borderColor={"#2F70D5"}>
          <Text style={[sizes.small_text, { color: "#2F70D5" }]}>
            Grant Permission
          </Text>
        </ButtonTwo>
        <TouchableOpacity
          onPress={() => {
            requestPermission();
            console.log("GRANTED");
            // setToggle(true);
          }}
        ></TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        backgrounds.black,
        layout.absolute,
        { top: 0, right: 0, left: 0, bottom: 0 },
      ]}
    >
      {qrValue === null && (
        <View
          style={[
            backgrounds.black,
            layout.absolute,
            { top: 0, right: 0, left: 0, bottom: 0 },
            layout.full_height,
            layout.full_width,
            layout.padding_vertical,
          ]}
        >
          <View style={[layout.vertical]}>
            <Text style={[colors.white, layout.padding_horizontal]}>
              Scanning for QR Code...
            </Text>
            <Camera
              style={[{ width: width, height: "100%" }]}
              type={Camera.Constants.Type.back}
              onBarCodeScanned={handleBarCodeScanned}
            />
          </View>
        </View>
      )}
    </View>
  );
}
export function PaymentView({ children, showPayButton, total, successFunc }) {
  const [pi, setPi] = useState("");
  const [stripeLoading, setStripeLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const newTotal = total !== undefined ? total : 1000;
  //
  const fetchPaymentSheetParams = async () => {
    const customerID = me.CustomerID !== undefined ? me.CustomerID : null;
    const response = await fetch(`${serverURL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: customerID,
        total: newTotal, // Pass existing CustomerID if available
      }),
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    setPi(`${paymentIntent.split("_")[0]}_${paymentIntent.split("_")[1]}`);

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };
  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      merchantDisplayName: appName,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      // applePay: {
      //   merchantCountryCode: "usd",
      // },
      // googlePay: {
      //   merchantCountryCode: "usd",
      //   testEnv: true,
      //   currencyCode: "usd",
      // },
    });
    if (!error) {
      if (me.CustomerID === undefined) {
        console.log(ephemeralKey);
        firebase_UpdateDocument(setStripeLoading, "Users", me.id, {
          CustomerID: customer,
        });
      }
      setStripeLoading(true);
    }
  };
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      successFunc(pi);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <StripeProvider
      publishableKey={stripePublishableKey}
      merchantIdentifier={`iicdev.com.${appName}`}
    >
      <View>{children}</View>
      <View style={[layout.absolute, { bottom: 25, right: 0, left: 0 }]}>
        {showPayButton && stripeLoading && (
          <ButtonOne
            backgroundColor={"#117DFA"}
            radius={0}
            onPress={openPaymentSheet}
          >
            <View style={[layout.separate_horizontal]}>
              <Text style={[colors.white, sizes.small_text]}>Pay Now</Text>
              <Icon name={"arrow-forward-outline"} size={20} color={"white"} />
            </View>
          </ButtonOne>
        )}
      </View>
    </StripeProvider>
  );
}

// BASIC FUNCTIONS
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
export function filterArr(array, property, value) {
  return array.filter((item) => item[property] === value);
}
export function filterArrayMultiple(array, filters) {
  return array.filter((item) =>
    filters.every((filter) => item[filter.property] === filter.value)
  );
}
export function reduceArray(array, property) {
  return array.reduce(
    (total, item) => total + parseFloat(item[property] || 0),
    0
  );
}
export function removeDuplicates(array) {
  const seen = new Set();
  return array.filter((item) => {
    if (seen.has(item)) {
      return false;
    } else {
      seen.add(item);
      return true;
    }
  });
}
export function removeDuplicatesByProperty(array, property) {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[property];
    if (seen.has(value)) {
      return false;
    } else {
      seen.add(value);
      return true;
    }
  });
}
export function formatDate(date) {
  const tempDate = date;

  const formattedDate = tempDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formattedDate;
}
export function formatLongDate(date) {
  const tempDate = date;

  const formattedDate = tempDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
}
export function formatDateTime(date) {
  const tempDate = date;

  const formattedDateTime = `${tempDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })} ${tempDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return formattedDateTime;
}
export function compareDates(date1, date2) {
  const timestamp1 = date1 instanceof Date ? date1.getTime() : NaN;
  const timestamp2 = date2 instanceof Date ? date2.getTime() : NaN;

  if (isNaN(timestamp1) || isNaN(timestamp2)) {
    throw new Error("Invalid date format");
  }

  return timestamp1 > timestamp2;
}
export function checkDate(date, checkedDate) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00.000

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59.999

  return checkedDate >= startOfDay && checkedDate <= endOfDay;
}
export async function getDistanceInMiles(coords1, coords2) {
  const apiKey = c_googleMapsAPI;
  const apiUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

  const origin = `${coords1.latitude},${coords1.longitude}`;
  const destination = `${coords2.latitude},${coords2.longitude}`;
  const requestUrl = `${apiUrl}?origins=${origin}&destinations=${destination}&key=${apiKey}`;

  console.log("Request URL:", requestUrl);

  try {
    const response = await fetch(requestUrl);
    const data = await response.json();

    console.log("API Response:", data);

    if (
      data.status === "OK" &&
      data.rows.length > 0 &&
      data.rows[0].elements.length > 0
    ) {
      const distanceInMeters = data.rows[0].elements[0].distance.value;
      const distanceInMiles = (distanceInMeters * 0.000621371).toFixed(2);
      console.log(distanceInMiles);
      return distanceInMiles;
    } else {
      throw new Error("Error fetching distance data");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
export async function getDistanceInKilometers(coords1, coords2) {
  const apiKey = c_googleMapsAPI;
  const apiUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

  const origin = `${coords1.latitude},${coords1.longitude}`;
  const destination = `${coords2.latitude},${coords2.longitude}`;

  try {
    const response = await fetch(
      `${apiUrl}?origins=${origin}&destinations=${destination}&key=${apiKey}`
    );

    const data = await response.json();

    if (
      data.status === "OK" &&
      data.rows.length > 0 &&
      data.rows[0].elements.length > 0
    ) {
      const distanceInMeters = data.rows[0].elements[0].distance.value;
      const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);
      return distanceInKilometers;
    } else {
      throw new Error("Error fetching distance data");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
export function separateKeys(inputArray) {
  const resultArray = [];

  inputArray.forEach((obj) => {
    // Iterate through each key in the object
    Object.keys(obj).forEach((key) => {
      // Create a new object with a single key
      const newObj = { [key]: obj[key] };
      // Add the new object to the result array
      resultArray.push(newObj);
    });
  });

  return resultArray;
}
export function createGeohash(latitude, longitude) {
  // Generate a geohash from latitude and longitude
  const geohash = ngeohash.encode(latitude, longitude, 10);

  return geohash;
}
export async function addRecordToAlgolia(args, indexName) {
  const index = searchClient.initIndex(`${indexName}`);
  try {
    const objectID = `${args.id}`; // Provide a unique object ID for each record
    const record = {
      objectID,
      ...args,
    };

    // Add the record to Algolia index
    const result = await index.saveObject(record);

    console.log("Record added to Algolia:", result);
  } catch (error) {
    console.error("Error adding record to Algolia:", error);
  }
}
export async function removeRecordFromAlgolia(objectID, indexName) {
  try {
    const index = client.initIndex(indexName);

    // Remove the record from Algolia index
    const result = await index.deleteObject(objectID);

    console.log("Record removed from Algolia:", result);
  } catch (error) {
    console.error("Error removing record from Algolia:", error);
  }
}
export function convertToPrecision10(geohash) {
  // Ensure the geohash is at least 10 characters long
  while (geohash.length < 10) {
    geohash += "0";
  }

  // Trim extra characters if the geohash is longer than 10 characters
  return geohash.substring(0, 10);
}
export function ensurePrecision10(geohash) {
  // Ensure the geohash has at least 10 characters
  while (geohash.length < 10) {
    geohash += "0";
  }

  return geohash;
}
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
}

// LOCAL FUNCTIONS
function milesToLat(miles) {
  return miles / 69.172; // Approximate degrees of latitude per mile
}
function milesToLon(miles, longitude) {
  const milesPerDegreeLon = 69.172 * Math.cos(longitude * (Math.PI / 180));
  return miles / milesPerDegreeLon;
}
export function kmToLat(km) {
  return km / 110.574;
}
export function kmToLon(km, latitude) {
  const kmPerDegreeLon = 111.32 * Math.cos(latitude * (Math.PI / 180));
  return km / kmPerDegreeLon;
}

// FUNCTIONS
export async function function_PickImage(setLoading, setImage, func) {
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
    func(result.assets[0].uri);
  }
}
export async function function_PickImageWithParams(
  setLoading,
  setImage,
  func,
  returnParams
) {
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
    func(result.assets[0].uri, returnParams);
  }
}
export async function function_PickImageToArr(
  setLoading,
  setImages,
  setImage,
  func
) {
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
    setImages((prev) => {
      const newUri = result.assets[0].uri;

      // Check if the newUri already exists in the array
      if (!prev.includes(newUri)) {
        // Add the newUri to the array
        return [...prev, newUri];
      }

      // If it already exists, return the current array without changes
      return prev;
    });
    // console.log(result.assets[0].uri)
    func(result.assets[0].uri);
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
    myCoords = userLocation.coords;
  } catch (error) {
    console.error("Error getting location:", error);
    setLoading(false);
  }
}
export async function function_NotificationsSetup(userID) {
  try {
    // Always request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();

    if (status === "denied") {
      Alert.alert(
        "Permission Required",
        "Push notifications are required for this app. Please enable notifications in your device settings."
      );

      // Optionally provide a button to open device settings
      Alert.alert(
        "Enable Notifications",
        "To receive notifications, go to your device settings and enable notifications for this app.",
        [
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );

      return;
    }

    // Force generation of a new push token
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received while app is open:", notification);
      // Handle the notification as needed
    });
    const pushTokenData = await Notifications.getExpoPushTokenAsync({
      projectId: c_projectID,
    });
    console.log(pushTokenData);
    firebase_UpdateToken(pushTokenData.data, userID);
    myToken = pushTokenData.data;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
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
export function function_GetDirections(lat, lon) {
  const destination = `${lat},${lon}`;
  console.log(destination);
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  Linking.openURL(url).catch((err) =>
    console.error("Error opening Google Maps:", err)
  );
}
export async function function_AddressToLatLon(address, setter, apiKey) {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  console.log(apiUrl);
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.results.length > 0) {
      console.log("HERE WE ARE");
      const location = data.results[0].geometry.location;
      const { lat, lng } = location;
      setter({ latitude: lat, longitude: lng });
    } else {
      throw new Error(`No results found for the given address: ${address}`);
    }
  } catch (error) {
    console.error("Error geocoding address:", error.message);
    throw error;
  }
}
export async function function_SendEmail(toEmails, subject, HTML) {
  try {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Email functionality is not available on this device.");
      return;
    }

    await MailComposer.composeAsync({
      recipients: toEmails,
      subject: subject,
      body: HTML,
      isHtml: true,
    });
  } catch (error) {
    console.error("Error opening email composer:", error);
    Alert.alert("Error", "Failed to open email composer");
  }
}
export async function function_AsyncString(asyncFunction, setter) {
  try {
    const result = await asyncFunction();
    console.log(result);
    return result.toString(); // Convert the result to a string
  } catch (error) {
    console.error("Error:", error);
    // You might want to set an error state here or handle the error differently
  }
}
export async function function_PlaySound(audio) {
  const { sound } = await Audio.Sound.createAsync(audio, { shouldPlay: true });
}
export function function_TimedFunction(func, timesPerMinute) {
  const millisecondsPerMinute = 60 * 1000;
  const interval = millisecondsPerMinute / timesPerMinute;

  const executeAtNextInterval = () => {
    const now = Date.now();
    const nextExecution = Math.ceil(now / interval) * interval;
    const delay = nextExecution - now;

    setTimeout(() => {
      func();
      executeAtNextInterval();
    }, delay);
  };

  executeAtNextInterval();

  // Return a function to stop the timer when needed
  return () => clearTimeout(timerId);
}
export async function function_OpenLink(url) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error("An error occurred while opening the link:", error);
  }
}
export async function function_ChooseFile(setter, setterType) {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "image/*",
        "application/msword",
        "application/vnd.ms-excel",
        "audio/*",
        "video/*",
      ],
    });
    const newResult = result.assets[0];
    const type = result.assets[0].mimeType;
    if (newResult.uri !== undefined) {
      console.log(newResult);
      setter(newResult);
      setterType(type);
    } else {
      // Handle the case where the user cancels the picker or selects an unsupported file type
      console.log("Document picker canceled or unsupported file type");
    }
  } catch (error) {
    console.error("Error picking document:", error);
    // Handle other errors if needed
  }
}
export function function_CallPhoneNumber(phoneNumber) {
  const formattedPhoneNumber = phoneNumber.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  const phoneNumberUrl = `tel:${formattedPhoneNumber}`;

  Linking.canOpenURL(phoneNumberUrl)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(phoneNumberUrl);
      } else {
        console.error("Cannot open phone dialer");
      }
    })
    .catch((error) => console.error("An error occurred", error));
}
export async function function_AlgoliaSearch(searchText, index, setter) {
  // Initialize Algolia index
  const thisIndex = searchClient.initIndex(index);

  // Example search query
  const query = searchText;

  // Perform search
  thisIndex
    .search(query)
    .then(({ hits }) => {
      console.log(hits.length);
      setter(hits);
      // Handle the search results
    })
    .catch((error) => {
      console.error("Search Error:", error);
      // Handle the error
    });
}
export async function function_AlgoliaCreateRecord(index, args) {
  const thisIndex = searchClient.initIndex(index);

  console.log(args);
  const record = args;

  // Add the record to the index
  thisIndex
    .saveObject(record)
    .then(({ objectID }) => {
      console.log(
        `---------------------------------------------Record added with objectID: ${objectID}`
      );
    })
    .catch((error) => {
      console.error(
        "-------------------------------------------Error adding record:",
        error
      );
    });
}
export async function function_AlgoliaDeleteRecord(index, objectID) {
  // Specify the index name
  const thisIndex = searchClient.initIndex(index);
  // Define the objectID of the record to be deleted
  const objectIDToDelete = objectID;
  // Delete the record
  thisIndex
    .deleteObject(objectIDToDelete)
    .then(({ taskID }) => {
      console.log(
        `----------------------------------------------Record deletion taskID: ${taskID}`
      );
    })
    .catch((error) => {
      console.error(
        "-----------------------------------------------Error deleting record:",
        error
      );
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
  all_caps: {
    textTransform: "uppercase",
  },
  strike: {
    textDecorationLine: "line-through",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
  gray: {
    color: "#CFCFD0",
  },
});
export const layout = StyleSheet.create({
  padding: {
    padding: 14,
  },
  padding_small: {
    padding: 6,
  },
  padding_vertical: {
    paddingVertical: 14,
  },
  padding_vertical_small: {
    paddingVertical: 6,
  },
  padding_horizontal: {
    paddingHorizontal: 14,
  },
  padding_horizontal_small: {
    paddingHorizontal: 6,
  },
  margin: {
    margin: 14,
  },
  margin_small: {
    margin: 6,
  },
  margin_vertical: {
    marginVertical: 14,
  },
  margin_vertical_small: {
    marginVertical: 6,
  },
  margin_horizontal: {
    marginHorizontal: 14,
  },
  margin_horizontal_small: {
    marginHorizontal: 6,
  },
  horizontal: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    overflow: "hidden",
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
    flex: 1,
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
    height: "100%",
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
  center: {
    alignSelf: "center",
    justifyContent: "center",
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
  no_gap: {
    gap: 0,
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
  apiKey: "AIzaSyAMkZs0qvSSYVfA4pOMzSkXl-Nkut7raqw",
  authDomain: "iic-appline-template.firebaseapp.com",
  projectId: "iic-appline-template",
  storageBucket: "iic-appline-template.appspot.com",
  messagingSenderId: "957439211423",
  appId: "1:957439211423:web:57d7872b6486b922102faa",
  measurementId: "G-D2Y4Q8QLJW",
};
// Initializations
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage();
export const db = getFirestore(app);

export function auth_IsUserSignedIn(
  setLoading,
  navigation,
  ifLoggedIn,
  ifNotLoggedIn,
  params,
  setter
) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      myID = uid;
      firebase_UpdateToken(myToken);
      firebase_GetMe(user.email, setter);
      setLoading(false);
      if (params !== null) {
        navigation.navigate(ifLoggedIn, params);
      } else {
        navigation.navigate(ifLoggedIn);
      }
    } else {
      setLoading(false);
      console.log("USER IS NOT LOGGED IN");
      if (params !== null) {
        navigation.navigate(ifNotLoggedIn, params);
      } else {
        navigation.navigate(ifNotLoggedIn);
      }
    }
  });

  // Unsubscribe from the auth state listener when the component unmounts
  return unsubscribe;
}
export function auth_SignIn(
  setLoading,
  email,
  password,
  navigation,
  params,
  redirect,
  setter
) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const userID = user.uid;
      myID = userID;
      firebase_UpdateToken(myToken);
      firebase_GetMe(user.email, setter);
      console.log(userID);
      setLoading(false);
      if (params !== null) {
        navigation.navigate(redirect, params);
      } else {
        navigation.navigate(redirect);
      }
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
export function auth_CreateUser(
  setLoading,
  email,
  password,
  args,
  navigation,
  params,
  redirect
) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      const uid = user.uid;
      myID = uid;
      firebase_UpdateToken(myToken);
      firebase_CreateUser(args, uid).then(() => {
        setLoading(false);
        if (params !== null) {
          navigation.navigate(redirect, params);
        } else {
          navigation.navigate(redirect);
        }
      });
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
export function auth_ResetPassword(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      // ..
      Alert.alert(
        "Email Sent",
        "Please check your email for a reset password link."
      );
    })
    .catch((error) => {
      const errorMessage = error.message;
      Alert.alert("Error", errorMessage);
      // ..
    });
}
export function auth_DeleteUser() {
  const user = auth.currentUser;

  deleteUser(user)
    .then(() => {
      // User deleted.
    })
    .catch((error) => {
      // An error ocurred
      // ...
    });
}
export async function firebase_CreateUser(args, uid) {
  await setDoc(doc(db, "Users", uid), args);
}
export async function firebase_GetMe(email, setter) {
  const q = query(collection(db, "Users"), where("Email", "==", email));
  const _ = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const user = {
        id: doc.id,
        ...doc.data(),
      };
      me = user;
      console.log(`I am ${user.DisplayName}`);
      setter(user);
    });
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
export async function firebase_GetAllDocuments(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereField,
  whereCondition,
  whereValue
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);
  let queryRef = collectionRef;

  if (docLimit > 0) {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
        orderBy(orderField, order),
        limit(docLimit)
      );
    } else {
      queryRef = query(queryRef, orderBy(orderField, order), limit(docLimit));
    }
  } else {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
        orderBy(orderField, order)
      );
    } else {
      queryRef = query(queryRef, orderBy(orderField, order));
    }
  }

  const querySnapshot = await getDocs(queryRef);
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
export async function firebase_GetAllDocumentsByIds(
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereArray,
  paginated = false,
  lastDoc = null
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);

  let baseQuery = query(collectionRef);

  if (whereArray) {
    baseQuery = query(baseQuery, where(documentId(), "in", whereArray));
  }

  baseQuery = query(baseQuery, orderBy(orderField, order));

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    finalQuery = query(baseQuery, startAfter(lastDoc[orderField]));
  }

  const querySnapshot = await getDocs(finalQuery);
  const things = [];

  querySnapshot.forEach((doc) => {
    const thing = {
      id: doc.id,
      ...doc.data(),
    };
    things.push(thing);
  });

  setter(things);
}
export function firebase_GetAllDocumentsListener(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereField,
  whereCondition,
  whereValue,
  paginated = false,
  lastDoc = null,
  setLastDoc,
  funcAdded,
  funcUpdated,
  funcRemoved
) {
  console.log("GETTING DOCS");
  setLoading(true);
  const collectionRef = collection(db, table);

  let baseQuery = query(collectionRef);

  if (whereField && whereCondition && whereValue) {
    baseQuery = query(baseQuery, where(whereField, whereCondition, whereValue));
  }

  baseQuery = query(baseQuery, orderBy(orderField, order));

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    finalQuery = query(baseQuery, startAfter(lastDoc[orderField]));
  }
  let initialSnapshotReceived = false;
  const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        funcUpdated();
        console.log("Document modified:", change.doc.id);
      } else if (change.type === "added" && initialSnapshotReceived) {
        funcAdded();
        console.log("Document added:", change.doc.id);
      } else if (change.type === "removed") {
        funcRemoved();
        console.log("Document removed:", change.doc.id);
      }
    });
    const things = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update lastDoc if there are new documents and setLastDoc is available
    if (things.length > 0 && setLastDoc) {
      setLastDoc(things[things.length - 1]);
    }
    if (!initialSnapshotReceived) {
      initialSnapshotReceived = true;
    }

    if (paginated) {
      setter((prev) => {
        const uniqueThings = [...prev, ...things].reduce(
          (acc, current) =>
            acc.some((thing) => thing.id === current.id)
              ? acc
              : [...acc, current],
          []
        );
        return uniqueThings;
      });
    } else {
      setter(things);
    }

    setLoading(false);
  });

  return unsubscribe;
}
export function firebase_GetAllDocumentsListenerByIds(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereArray,
  paginated = false,
  lastDoc = null,
  setLastDoc,
  funcAdded,
  funcUpdated,
  funcRemoved
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);

  let baseQuery = query(collectionRef);

  if (whereArray) {
    baseQuery = query(baseQuery, where(documentId(), "in", whereArray));
  }

  baseQuery = query(baseQuery, orderBy(orderField, order));

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    finalQuery = query(baseQuery, startAfter(lastDoc[orderField]));
  }
  let initialSnapshotReceived = false;
  const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        funcUpdated();
        console.log("Document modified:", change.doc.id);
      } else if (change.type === "added" && initialSnapshotReceived) {
        funcAdded();
        console.log("Document added:", change.doc.id);
      } else if (change.type === "removed") {
        funcRemoved();
        console.log("Document removed:", change.doc.id);
      }
    });
    const things = [];
    querySnapshot.forEach((doc) => {
      const thing = {
        id: doc.id,
        ...doc.data(),
      };
      things.push(thing);
    });

    // Update lastDoc if there are new documents and setLastDoc is available
    if (things.length > 0 && setLastDoc) {
      setLastDoc(things[things.length - 1]);
    }
    if (!initialSnapshotReceived) {
      initialSnapshotReceived = true;
    }
    setter((prev) => removeDuplicatesByProperty([...prev, ...things], "id"));
    setLoading(false);
  });

  return unsubscribe;
}
export function firebase_GetAllDocumentsListenerByDistance(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  whereField,
  whereCondition,
  whereValue,
  paginated = false,
  lastDoc = null,
  setLastDoc,
  coordinates,
  funcAdded,
  funcUpdated,
  funcRemoved
) {
  setLoading(true);
  console.log("GETTING DOCUMENTS LISTENER");
  const collectionRef = collection(db, table);
  let baseQuery = query(collectionRef);
  const precision = 10;
  const distance = 100;

  if (whereField && whereCondition && whereValue) {
    baseQuery = query(baseQuery, where(whereField, whereCondition, whereValue));
  }
  const latDiff = kmToLat(distance);
  const lonDiff = kmToLon(distance, coordinates.latitude);

  const minGeohash = convertToPrecision10(
    ngeohash.encode(
      coordinates.latitude - latDiff,
      coordinates.longitude - lonDiff,
      precision
    )
  );
  const maxGeohash = convertToPrecision10(
    ngeohash.encode(
      coordinates.latitude + latDiff,
      coordinates.longitude + lonDiff,
      precision
    )
  );

  baseQuery = query(
    baseQuery,
    where("geohash", ">=", minGeohash),
    where("geohash", "<=", maxGeohash),
    where("Active", "==", true),
    orderBy("geohash", order)
  );

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    const lastDocData = lastDoc;
    finalQuery = query(baseQuery, startAfter(lastDocData));
  }
  let initialSnapshotReceived = false;
  const unsubscribe = onSnapshot(finalQuery, async (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        funcUpdated();
        console.log("Document modified:", change.doc.id);
      } else if (change.type === "added" && initialSnapshotReceived) {
        funcAdded();
        console.log("Document added:", change.doc.id);
      } else if (change.type === "removed") {
        funcRemoved();
        console.log("Document removed:", change.doc.id);
      }
    });
    const things = [];
    for (const doc of querySnapshot.docs) {
      const distance = haversineDistance(
        myCoords.latitude,
        myCoords.longitude,
        doc.data().Lat,
        doc.data().Lon
      );
      const thing = {
        id: doc.id,
        ...doc.data(),
        Distance: distance.toFixed(2),
      };
      things.push(thing);
    }
    if (things.length > 0 && setLastDoc) {
      const lastDocSnapshot = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastDocSnapshot);
    }
    if (!initialSnapshotReceived) {
      initialSnapshotReceived = true;
    }
    things.sort((a, b) => a.Distance - b.Distance);

    setter((prev) => removeDuplicatesByProperty([...prev, ...things], "id"));
    setLoading(false);
  });

  return unsubscribe;
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
export async function firebase_UpdateToken(token, userID) {
  const washingtonRef = doc(db, "Users", userID);

  // Set the "capital" field of the city 'DC'
  await updateDoc(washingtonRef, {
    Token: token,
  });
}
export async function storage_UploadImage(
  setLoading,
  image,
  path,
  setProgress
) {
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
        setProgress(progress);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle errors
        console.error("Error uploading image:", error);
        setLoading(false); // Update loading state in case of an error
        Alert.alert("Error", "Please try again.");
      },
      async () => {
        // Handle successful completion
        setProgress(0);
        setLoading(false); // Update loading state
      }
    );
  } catch (error) {
    console.error("Error creating document: ", error);
    setLoading(false); // Update loading state in case of an error
  }
}
export async function storage_UploadFile(setLoading, file, path, setProgress) {
  setLoading(true);

  try {
    // Convert the file to a Blob
    const fileBlob = await fetch(file).then((res) => res.blob());

    // Upload the Blob to Firebase Storage
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, fileBlob);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress changes, if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle errors
        console.error("Error uploading file:", error);
        setLoading(false); // Update loading state in case of an error
        Alert.alert("Error", "Please try again.");
      },
      async () => {
        // Handle successful completion
        setLoading(false); // Update loading state
      }
    );
  } catch (error) {
    console.error("Error uploading file: ", error);
    setLoading(false); // Update loading state in case of an error
  }
}
export async function storage_DownloadFile(setLoading, path, setter) {
  setLoading(true);
  console.log("DOWNLOADING");
  try {
    // Get the download URL for the file
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);

    // Set the file using the provided setter
    setter(downloadURL);

    // Update loading state
    setLoading(false);
  } catch (error) {
    console.error("Error downloading file:", error);
    setLoading(false); // Update loading state in case of an error
    Alert.alert("Error", "Please try again.");
  }
}
export async function storage_DownloadFiles(setLoading, path, setter) {
  setLoading(true);
  console.log("DOWNLOADING");
  console.log(path);
  try {
    // Get the download URL for the file
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);

    // Set the file using the provided setter
    console.log(downloadURL);
    setter((prev) => [...prev, downloadURL]);

    // Update loading state
    setLoading(false);
  } catch (error) {
    console.error("Error downloading file:", error);
    setLoading(false); // Update loading state in case of an error
    Alert.alert("Error", "Please try again.");
  }
}
export async function storage_DeleteImage(setLoading, path) {
  try {
    const imageRef = ref(storage, path);

    // Delete the file
    await deleteObject(imageRef);

    console.log(`Image at path ${path} deleted successfully`);
  } catch (error) {
    console.error("Error deleting image:", error.message);
  } finally {
    setLoading(false);
  }
}
