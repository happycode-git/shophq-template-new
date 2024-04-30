import { useEffect, useState } from "react";
import {
  ButtonOne,
  ButtonTwo,
  LinkOne,
  SafeArea,
  SeparatedView,
  TextFieldOne,
  TextView,
  auth_ResetPassword,
  auth_SignIn,
  format,
  getInDevice,
  layout,
  secondaryThemedBackgroundColor,
  setInDevice,
  themedButtonColor,
  themedButtonTextColor,
  themedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { Image, KeyboardAvoidingView, Platform, View } from "react-native";

export function Login({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");

  //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSignIn() {
    auth_SignIn(
      setLoading,
      email,
      password,
      navigation,
      null,
      "collections",
      (person) => {
        setInDevice("user", person);
      }
    );
  }

  useEffect(() => {
    // setInDevice("theme", "dark");
    getInDevice("theme", setTheme);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeArea loading={loading} theme={theme}>
        <View style={[layout.separate_vertical]}>
          <View style={[layout.padding]}>
            <SeparatedView>
              {/* BROWSE */}
              <LinkOne
                onPress={() => {
                  navigation.navigate("browse");
                }}
                theme={theme}
              >
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                >
                  browse
                </TextView>
              </LinkOne>
              {/* SIGN UP */}
              <LinkOne
                onPress={() => {
                  navigation.navigate("signup");
                }}
                theme={theme}
              >
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                >
                  sign up
                </TextView>
              </LinkOne>
            </SeparatedView>
          </View>
          {/* MIDDLE */}
          <View style={[]}>
            <View style={[layout.center]}>
              <Image
                source={require("../assets/loading.png")}
                style={[{ width: width * 0.6, height: width * 0.6 }]}
              />
            </View>
            {/* LOGIN */}
            {/* <View
              style={[
                {
                  backgroundColor: themedButtonColor(theme),
                  transform: [{ rotate: "4deg" }],
                },
              ]}
            >
              <TextView
                color={themedButtonTextColor(theme)}
                size={30}
                theme={theme}
                center={true}
                styles={[format.all_caps]}
                bold={true}
              >
                Login
              </TextView>
            </View> */}
          </View>
          {/* BOTTOM */}
          <View style={[layout.padding, layout.vertical]}>
            <TextFieldOne
              placeholder="email"
              value={email}
              setter={setEmail}
              radius={8}
              autoCap={false}
              isPassword={false}
              theme={theme}
            />
            <TextFieldOne
              placeholder="password"
              value={password}
              setter={setPassword}
              radius={8}
              autoCap={false}
              isPassword={true}
              theme={theme}
            />
            {email !== "" && password !== "" && password.length >= 8 && (
              <ButtonTwo
                borderColor={themedTextColor(theme)}
                borderWidth={2}
                radius={100}
                padding={10}
                onPress={() => {
                  onSignIn();
                }}
              >
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                  center={true}
                >
                  Log In
                </TextView>
              </ButtonTwo>
            )}
            <LinkOne
              onPress={() => {
                auth_ResetPassword(email);
              }}
              theme={theme}
              styles={[layout.center]}
            >
              <TextView
                color={themedTextColor(theme)}
                size={14}
                theme={theme}
                center={true}
              >
                Forgot Password?
              </TextView>
            </LinkOne>
          </View>
        </View>
      </SafeArea>
    </KeyboardAvoidingView>
  );
}
