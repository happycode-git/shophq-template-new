import { useEffect, useState } from "react";
import {
  ButtonOne,
  Grid,
  Icon,
  LinkOne,
  SafeArea,
  SideBySide,
  Spacer,
  TextFieldOne,
  TextView,
  auth_CreateUser,
  colors,
  firebase_GetAllDocuments,
  firebase_GetDocument,
  format,
  getInDevice,
  layout,
  secondaryThemedBackgroundColor,
  setInDevice,
  themedTextColor,
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

export function SignUp({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");

  //
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  function onSignUp() {
    Alert.alert(
      "Confirmation",
      "Would you like to continue with creating a ShopHQ account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          style: "default",
          onPress: () => {
            setLoading(true);
            firebase_GetAllDocuments(
              setFakeLoading,
              "Users",
              (people) => {
                if (people.length > 0) {
                  // SOMEONE FOUND
                  Alert.alert(
                    "Email already used.",
                    "Please provide another email, or log in with this existing email."
                  );
                } else {
                  // SIGN ME UP!!!
                  setLoading(true);
                  const args = {
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                  };
                  auth_CreateUser(
                    setLoading,
                    email,
                    password,
                    args,
                    navigation,
                    null,
                    "collections",
                    (userID) => {
                      firebase_GetDocument(
                        setLoading,
                        "Users",
                        userID,
                        (person) => {
                          setInDevice("user", person);
                        }
                      );
                    }
                  );
                }
              },
              0,
              "Email",
              "==",
              email,
              false,
              null,
              null
            );
          },
        },
      ]
    );
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeArea loading={loading} theme={theme}>
        <View style={[layout.separate_vertical]}>
          {/* TOP */}
          <View style={[layout.padding]}>
            <LinkOne
              onPress={() => {
                navigation.navigate("login");
              }}
              theme={theme}
            >
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                back
              </TextView>
            </LinkOne>
          </View>
          <View style={[layout.padding_horizontal]}>
            <Image
              source={require("../assets/shophq.png")}
              style={[{ width: 100, height: 100 }, layout.center]}
            />
            <Spacer height={10} />
            <TextView color={themedTextColor(theme)} size={16} theme={theme}>
              You do not need to create a new account if you have already signed
              up on another Shop HQ vendor app.
            </TextView>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[layout.padding, layout.vertical]}>
              <Grid columns={2} gap={10}>
                <TextFieldOne
                  placeholder="First Name"
                  value={firstName}
                  setter={setFirstName}
                  radius={8}
                  autoCap={true}
                  isPassword={false}
                  theme={theme}
                />
                <TextFieldOne
                  placeholder="Last Name"
                  value={lastName}
                  setter={setLastName}
                  radius={8}
                  autoCap={true}
                  isPassword={false}
                  theme={theme}
                />
              </Grid>
              <TextFieldOne
                placeholder="Email"
                value={email}
                setter={setEmail}
                radius={8}
                isPassword={false}
                theme={theme}
              />
              <View style={[]}>
                <TextFieldOne
                  placeholder="Password"
                  value={password}
                  setter={setPassword}
                  radius={8}
                  autoCap={false}
                  isPassword={true}
                  theme={theme}
                />
                {password !== "" && password.length < 8 && (
                  <View style={[]}>
                    <Spacer height={4} />
                    <TextView color={"orange"} size={14} theme={theme}>
                      Password must be at least 8 characters.
                    </TextView>
                  </View>
                )}
              </View>
              <View style={[]}>
                <TextFieldOne
                  placeholder="Confirm Password"
                  value={passwordConf}
                  setter={setPasswordConf}
                  radius={8}
                  autoCap={false}
                  isPassword={true}
                  theme={theme}
                />
                {password !== "" &&
                  passwordConf !== "" &&
                  password.length >= 8 &&
                  passwordConf.length > 0 &&
                  password !== passwordConf && (
                    <View style={[]}>
                      <Spacer height={4} />
                      <TextView color={"#D6133B"} size={14} theme={theme}>
                        Passwords do not match
                      </TextView>
                    </View>
                  )}
                {password !== "" &&
                  passwordConf !== "" &&
                  password.length >= 8 &&
                  passwordConf.length >= 8 &&
                  password === passwordConf && (
                    <View style={[]}>
                      <Spacer height={4} />
                      <TextView color={"#28D782"} size={14} theme={theme}>
                        Passwords match!
                      </TextView>
                    </View>
                  )}
              </View>
            </View>
          </ScrollView>
          {email !== "" &&
            firstName !== "" &&
            lastName !== "" &&
            password !== "" &&
            passwordConf !== "" &&
            password.length >= 8 &&
            password === passwordConf && (
              <View style={[layout.padding]}>
                <ButtonOne
                  backgroundColor={"#117DFA"}
                  radius={100}
                  padding={10}
                  onPress={() => {
                    onSignUp();
                  }}
                >
                  <TextView
                    color={"white"}
                    size={18}
                    theme={theme}
                    center={true}
                  >
                    Sign Up
                  </TextView>
                </ButtonOne>
              </View>
            )}
        </View>
      </SafeArea>
    </KeyboardAvoidingView>
  );
}
