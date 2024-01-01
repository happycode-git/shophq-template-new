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
import ngeohash from "ngeohash";
//
import { initializeApp } from "firebase/app";
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
} from "firebase/firestore";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
// #endregion

// CONSTANTS
export const { height, width } = Dimensions.get("window");

export const c_projectID = "e4044789-90d5-4a16-829a-79b8868a1a43";
export const c_googleMapsAPI = "AIzaSyBtE2qvx3l_A-a5ldpcFvQHu7qdT9CMVH4";
export var me = {};
export var myID = "test";
export var myToken = "";
export var stripePublishableKey =
  "pk_test_51NuJfZIDyFPNiK5CPKgovhg5fen3VM4SzxvBqdYAfwriYKzoqacsfIOiNAt5ErXss3eHYF45ak5PPFHeAD0AXit900imYxFTry";
export var serverURL = "https://garnet-private-hisser.glitch.me";
export var myCoords = {};

// APP INFO
export var appName = "Happy Code Dev";

// COMPONENTS
export function SafeArea({
  statusBar,
  loading,
  children,
  backgroundColor,
  styles,
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: Platform.OS === "ios" ? 50 : 35,
          paddingBottom: Platform.OS === "ios" ? 35 : 10,
          backgroundColor:
            backgroundColor !== undefined ? backgroundColor : "white",
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
        { flexDirection: "row", alignItems: "flex-start", gap: 10 },
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
          height: height,
          width: width,
          backgroundColor: "rgba(0,0,0,0.75)",
          zIndex: 10000,
        },
      ]}
    >
      <View style={[{ flex: 1 }]}></View>
      <View style={[layout.center_horizontal, layout.padding]}>
        <Image
          source={require("../../assets/logo.png")}
          style={[{ width: 80, height: 80 }, format.radius]}
        />
      </View>
      <ActivityIndicator />
      <View style={[{ flex: 1 }]}></View>
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
    <View style={[styles, { borderRadius: radius || 100, overflow: "hidden" }]}>
      <BlurView
        intensity={intensity !== undefined ? intensity : 50}
        tint={tint !== undefined ? tint : "dark"}
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
export function GradientView({ colors, children }) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      // style={{ flex: 1 }}
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
          backgroundColor: backgroundColor || "rgba(0,0,0,0.1)",
          paddingVertical: padding || 5,
          borderRadius: radius || 10,
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
              size={iconSize || 24}
              color={color || "black"}
            />
            {opt.text && (
              <Text style={[{ fontSize: 12, color: color || "black" }]}>
                {opt.text}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export function CSVtoJSONConverterView() {
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
    const lines = csvData.trim().split("\n");
    const firstLine = lines[0].trim();

    // Determine the separator (`,` or `;`)
    const separator = firstLine.includes(";") ? ";" : ",";

    const headers = firstLine.split(separator);

    const jsonData = lines.slice(1).map((line) => {
      const values = line.split(separator);
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
    console.log(jsonData);
  };

  return (
    <View style={[backgrounds.white]}>
      <View style={[layout.padding]}>
        <ButtonOne
          onPress={handleFilePick}
          styles={[layout.separate_horizontal]}
        >
          <Text style={[colors.white, sizes.medium_text]}>Choose CSV File</Text>
          <Icon name="document-outline" color="white" size={30} />
        </ButtonOne>
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
            ? selectedBackgroundColor || "rgba(0,0,0,0.2)"
            : backgroundColor || "rgba(0,0,0,0.05)",
          borderWidth: selected ? 1 : 0,
          borderColor: selected ? color || "rgba(0,0,0,0.8)" : "rgba(0,0,0,0)",
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
        <Text style={[{ fontSize: textSize || 16 }]}>{text}</Text>
        <Icon size={iconSize || 22} name={icon} />
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
  backgroundColor,
  borderBottomWidth,
  borderBottomColor,
  paddingH,
  paddingV,
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
export function DropdownOne({ options, radius, value, setter, styles }) {
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
                  },
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
export function Accordion({ children, top }) {
  const [toggle, setToggle] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        setToggle(!toggle);
      }}
    >
      <View>{top}</View>
      {toggle && <View>{children}</View>}
    </TouchableOpacity>
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
export function Map({ coords, delta, height, radius, scrollEnabled = true }) {
  // Default location for the app's headquarters
  const defaultLocation = {
    latitude: 37.7749, // Default latitude
    longitude: -122.4194, // Default longitude
  };

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{
          width: "100%",
          height: height !== undefined ? height : 125,
          borderRadius: radius !== undefined ? radius : 10,
        }}
        region={{
          latitude:
            coords.latitude !== undefined
              ? coords.latitude
              : defaultLocation.latitude,
          longitude:
            coords.longitude !== undefined
              ? coords.longitude
              : defaultLocation.longitude,
          latitudeDelta: delta !== undefined ? delta : 0.005,
          longitudeDelta: delta !== undefined ? delta : 0.005,
        }}
        scrollEnabled={scrollEnabled}
      >
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
        >
          <Image
            source={require("../../assets/marker.png")}
            style={{ width: 40, height: 40 }}
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
    console.log("NOTIFICATION START");
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
export function DateTime({ date, time, setDate, setTime }) {
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
        { backgroundColor: "rgba(0,0,0,0.4)" },
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
      successFunc();
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
          height: graphHeight || height * 0.3,
          gap: gap || 4,
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
                borderRadius: barRadius || 10,
              }}
            />
            <Text style={{ fontSize: textSize || 14, marginTop: 8 }}>
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

  const normalizedLimit = limit || 100;
  const normalizedWidth = (normalizedProgress / normalizedLimit) * 100;

  return (
    <View
      style={{
        height: height || 20,
        width: "100%",
        backgroundColor: backgroundColor || "rgba(0,0,0,0.1)",
        borderRadius: radius || 6,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${normalizedWidth}%`,
          backgroundColor: color || "blue",
          borderRadius: radius || 6,
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
    <View style={[{ position: "relative" }]}>
      <View
        style={[
          {
            position: "absolute",
            top: 5,
            right: 5,
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: color || "#60D0FF",
            zIndex: 500,
          },
          format.radius_full,
        ]}
      >
        <Text style={[{ fontSize: textSize || 10 }, colors.white]}>{text}</Text>
      </View>
      {children}
    </View>
  );
}
export function SliderView({ func, padding, icon, text }) {
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
        <Text style={[colors.white, format.bold]}>
          {text || "Everything Bagel"}
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
          <Icon name={icon || "star-outline"} size={20} color={"black"} />
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
          {text || "Price"}
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
export function checkDate(date1, date2) {
  const startOfDay = new Date(date1);
  startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00.000

  const endOfDay = new Date(date1);
  endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59.999

  return date2 >= startOfDay && date2 <= endOfDay;
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

// LOCAL FUNCTIONS
function milesToLat(miles) {
  return miles / 69.172; // Approximate degrees of latitude per mile
}
function milesToLon(miles, latitude) {
  const milesPerDegreeLon = 69.172 * Math.cos(latitude * (Math.PI / 180));
  return miles / milesPerDegreeLon;
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
    myCoords = userLocation.coords;
  } catch (error) {
    console.error("Error getting location:", error);
    setLoading(false);
  }
}
export async function function_NotificationsSetup() {
  try {
    // Always request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();

    if (status === 'denied') {
      Alert.alert(
        'Permission Required',
        'Push notifications are required for this app. Please enable notifications in your device settings.'
      );

      // Optionally provide a button to open device settings
      Alert.alert(
        'Enable Notifications',
        'To receive notifications, go to your device settings and enable notifications for this app.',
        [
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );

      return;
    }

    // Force generation of a new push token
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received while app is open:', notification);
      // Handle the notification as needed
    });
    const pushTokenData = await Notifications.getExpoPushTokenAsync({
      projectId: c_projectID,
    });
    console.log(pushTokenData);
    firebase_UpdateToken(pushTokenData.data);
    myToken = pushTokenData.data;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
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
export async function function_AddressToLatLon(address, setter) {
  const apiKey = c_googleMapsAPI; // Replace with your own API key
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results.length > 0) {
      const location = data.results[0].geometry.location;
      const { lat, lng } = location;
      setter({ latitude: lat, longitude: lng });
    } else {
      throw new Error("No results found for the given address.");
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
    const result = await asyncFunction;
    setter(result.toString()); // Convert the result to a string
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
const db = getFirestore(app);

export function auth_IsUserSignedIn(
  setLoading,
  navigation,
  ifLoggedIn,
  ifNotLoggedIn,
  params
) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      myID = uid;
      firebase_UpdateToken(myToken);
      firebase_GetMe(uid);
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
}
export function auth_SignIn(
  setLoading,
  email,
  password,
  navigation,
  params,
  redirect
) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const userID = user.uid;
      myID = userID;
      firebase_UpdateToken(myToken);
      firebase_GetMe(userID);
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
  setLastDoc
) {
  console.log("GETTING DOCS");
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

  const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
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

    setter((prev) => [...prev, ...things]); // Append to the existing state
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
  orderField,
  whereField,
  whereCondition,
  whereValue,
  paginated = false,
  lastDoc = null,
  setLastDoc,
  distance,
  coordinates
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);
  let baseQuery = query(collectionRef);

  if (whereField && whereCondition && whereValue) {
    baseQuery = query(baseQuery, where(whereField, whereCondition, whereValue));
  }

  const latDiff = milesToLat(distance);
  const lonDiff = milesToLon(distance, coordinates.latitude);
  const minGeohash = ngeohash.encode(
    coordinates.latitude - latDiff,
    coordinates.longitude - lonDiff
  );
  const maxGeohash = ngeohash.encode(
    coordinates.latitude + latDiff,
    coordinates.longitude + lonDiff
  );
  baseQuery = query(
    baseQuery,
    where("geohash", ">=", minGeohash),
    where("geohash", "<=", maxGeohash),
    orderBy("geohash", order)
  );

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    console.log("Using startAfter:", lastDoc.data());
    finalQuery = query(baseQuery, startAfter(lastDoc));
  }

  const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
    const things = [];
    querySnapshot.forEach((doc) => {
      const thing = {
        id: doc.id,
        ...doc.data(),
      };
      things.push(thing);
    });

    if (things.length > 0 && setLastDoc) {
      const lastDocSnapshot = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastDocSnapshot);
    }

    setter((prev) => [...prev, ...things]);
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
export async function firebase_UpdateToken(token) {
  const washingtonRef = doc(db, "Users", myID);

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
