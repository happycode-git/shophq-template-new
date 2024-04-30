import { useEffect, useState } from "react";
import {
  ButtonOne,
  ButtonTwo,
  SafeArea,
  Spacer,
  TextView,
  auth_IsUserSignedIn,
  firebase_GetAllDocuments,
  format,
  getInDevice,
  height,
  layout,
  secondaryThemedBackgroundColor,
  setInDevice,
  shopifyURL,
  themedButtonColor,
  themedButtonTextColor,
  themedTextColor,
} from "../EVERYTHING/BAGEL/Things";
import { Image, View } from "react-native";

export function Start({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    setInDevice("theme", "light");
    setLoading(true);
    getInDevice("theme", setTheme);
    auth_IsUserSignedIn(
      setLoading,
      navigation,
      "collections",
      "start",
      null,
      (person) => {
        console.log(person);
        setInDevice("user", person);
        firebase_GetAllDocuments(
          setLoading,
          "Keys",
          (keys) => {
            setInDevice("keys", keys);
          },
          0,
          "URL",
          "==",
          shopifyURL,
          false,
          null,
          null
        );
      }
    );
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <View style={[layout.separate_vertical]}>
        <View style={[]}>
          <View style={[layout.padding]}>
            <TextView
              color={themedTextColor(theme)}
              size={22}
              theme={theme}
              styles={[format.all_caps]}
            >
              An incredible new way of shopping. Everything sold on Shopify, is
              sold here.
            </TextView>
          </View>
          <Spacer height={20} />
          <View
            style={[
              { backgroundColor: themedButtonColor(theme) },
              layout.padding,
              { transform: [{ rotate: "4deg" }] },
            ]}
          >
            <TextView
              color={themedButtonTextColor(theme)}
              size={18}
              theme={theme}
              styles={[format.all_caps]}
              center={true}
              bold={true}
            >
              bags, shirts, pants, necklaces
            </TextView>
          </View>
          <Spacer height={20} />
          <View
            style={[
              { backgroundColor: themedButtonColor(theme) },
              layout.padding,
              { transform: [{ rotate: "-4deg" }] },
            ]}
          >
            <TextView
              color={themedButtonTextColor(theme)}
              size={18}
              theme={theme}
              styles={[format.all_caps]}
              center={true}
              bold={true}
            >
              socks, hats, chains, jackets
            </TextView>
          </View>
        </View>
        <View>
          <Image
            source={require("../assets/loading.png")}
            style={[
              { width: "100%", height: height * 0.5, objectFit: "cover" },
              // format.radius,
            ]}
          />
         <View style={[layout.padding]}>
         <ButtonTwo
            borderColor={themedTextColor(theme)}
            borderWidth={2}
            radius={100}
            padding={10}
            onPress={() => {
              navigation.navigate("login");
            }}
          >
            <TextView
              color={themedTextColor(theme)}
              size={18}
              theme={theme}
              center={true}
              styles={[format.all_caps]}
            >
              Get Started
            </TextView>
          </ButtonTwo>
         </View>
        </View>
      </View>
    </SafeArea>
  );
}
