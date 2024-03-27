import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import {
  ButtonOne,
  LinkOne,
  TextFieldOne,
  TextView,
  auth_ResetPassword,
  auth_SignIn,
  format,
  layout,
  themedButtonColor,
  themedButtonTextColor,
} from "../EVERYTHING/BAGEL/Things";
import { useState } from "react";

export function Login({ navigation, setLoading, redirect, theme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onLogIn() {
    if (email !== "") {
      if (password !== "") {
        // LOGIN
        auth_SignIn(
          setLoading,
          email,
          password,
          navigation,
          null,
          redirect,
          (user) => {
            console.log(user);
          }
        );
      } else {
        Alert.alert(
          "Missing Password",
          "Please provide a valid password before continuing."
        );
      }
    } else {
      Alert.alert(
        "Missing Email",
        "Please provide a valid email before continuing."
      );
    }
  }
  function onForgotPassword() {
    auth_ResetPassword(email);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={[{ flex: 1 }, layout.separate_vertical, layout.padding]}>
        <View>
          <TextView theme={theme} size={36}>
            Login
          </TextView>
          <TextView theme={theme}>Welcome back!</TextView>
        </View>
        <View style={[layout.vertical]}>
          <TextFieldOne
            placeholder={"Email"}
            value={email}
            setter={setEmail}
            theme={theme}
          />
          <TextFieldOne
            placeholder={"Password"}
            value={password}
            setter={setPassword}
            isPassword={true}
            theme={theme}
          />
          <ButtonOne
            radius={100}
            backgroundColor={themedButtonColor(theme)}
            onPress={onLogIn}
          >
            <TextView
              styles={[format.center_text]}
              theme={theme}
              size={16}
              color={themedButtonTextColor(theme)}
            >
              Log In
            </TextView>
          </ButtonOne>
          <LinkOne
            theme={theme}
            onPress={onForgotPassword}
            styles={[layout.center]}
          >
            <TextView theme={theme}>Forgot Password?</TextView>
          </LinkOne>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
