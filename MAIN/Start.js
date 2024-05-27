import { useEffect, useState } from "react";
import {
  ButtonOne,
  ButtonTwo,
  SafeArea,
  Spacer,
  TextView,
  auth_IsUserSignedIn,
  backgrounds,
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
        <View style={[layout.padding_horizontal]}>
        <Image
          source={require("../assets/loading.png")}
          style={[
            { width: "100%", height: height * 0.4, objectFit: "cover" },
            // format.radius,
          ]}
        />
        </View>

        <View>
          <View style={[]}>
            <View style={[layout.padding, layout.margin, format.radius, {backgroundColor: secondaryThemedBackgroundColor(theme)}]}>
              <TextView
                color={themedTextColor(theme)}
                size={20}
                theme={theme}
                // bold={true}
                // styles={[format.all_caps]}
              >
                Welcome to our app! Discover our latest items, track your orders
                effortlessly, and feel free to chat with us anytime for any
                questions or assistance you need!
              </TextView>
            </View>
            <Spacer height={20} />
          </View>
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
                // styles={[format.all_caps]}
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
