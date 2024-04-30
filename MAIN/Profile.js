import { useEffect, useState } from "react";
import {
  ButtonTwo,
  Divider,
  Grid,
  Icon,
  LinkOne,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  SwitchOne,
  TextFieldOne,
  TextView,
  appName,
  auth_DeleteUser,
  auth_SignOut,
  firebase_DeleteDocument,
  firebase_UpdateDocument,
  format,
  getInDevice,
  layout,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  setInDevice,
  themedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

export function Profile({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  //
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [toggleTheme, setToggleTheme] = useState(false);

  function onSaveDetails() {
    setLoading(true);
    const args = {
      Address1: address1,
      Address2: address2,
      City: city,
      Country: country,
      Company: company,
      State: state,
      Zip: zip,
    };
    firebase_UpdateDocument(setLoading, "Users", me.id, args).then(() => {
      Alert.alert("Success", "Your changes have been saved.");
    });
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      console.log(person);
      setMe(person);
      if (person.Address1 !== undefined && person.Address !== "") {
        setAddress1(person.Address1);
        setAddress2(person.Address2);
        setCity(person.City);
        setCountry(person.Country);
        setCompany(person.Company);
        setState(person.State);
        setZip(person.Zip);
      }
    });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeArea loading={loading} theme={theme}>
        {/* TOP */}
        <View style={[layout.padding]}>
          <SeparatedView>
            <LinkOne
              onPress={() => {
                navigation.navigate("collections");
              }}
              theme={theme}
            >
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                back
              </TextView>
            </LinkOne>
            <ButtonTwo
              // backgroundColor={secondaryThemedBackgroundColor(theme)}
              borderColor={themedTextColor(theme)}
              radius={100}
              padding={8}
              onPress={() => {
                onSaveDetails();
              }}
            >
              <View style={[layout.padding_horizontal]}>
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                >
                  save
                </TextView>
              </View>
            </ButtonTwo>
          </SeparatedView>
        </View>
        {/* BODY */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[layout.padding_horizontal]}>
            <View
              style={[
                layout.padding,
                { backgroundColor: secondaryThemedBackgroundColor(theme) },
                format.radius,
              ]}
            >
              <SideBySide gap={10}>
                <Icon name="bulb-outline" size={26} theme={theme} />
                <TextView
                  color={themedTextColor(theme)}
                  size={15}
                  theme={theme}
                  styles={[{width: width * 0.8}]}
                >
                  Consider entering your shipping address before adding any
                  items to your cart. These details will auto-populate in your
                  checkout.
                </TextView>
              </SideBySide>
            </View>
            <Spacer height={10} />
            <TextView color={themedTextColor(theme)} size={20} theme={theme}>
              Customer Details
            </TextView>
            <Spacer height={10} />
            <View style={[layout.vertical]}>
              <TextFieldOne
                placeholder="Address 1"
                value={address1}
                setter={setAddress1}
                radius={8}
                theme={theme}
              />
              <TextFieldOne
                placeholder="Address 2"
                value={address2}
                setter={setAddress2}
                radius={8}
                theme={theme}
              />
              <Grid columns={2} gap={10}>
                <TextFieldOne
                  placeholder="City"
                  value={city}
                  setter={setCity}
                  radius={8}
                  theme={theme}
                />
                <TextFieldOne
                  placeholder="State / Province"
                  value={state}
                  setter={setState}
                  radius={8}
                  theme={theme}
                />
              </Grid>
              <TextFieldOne
                placeholder="Company (optional)"
                value={company}
                setter={setCompany}
                radius={8}
                theme={theme}
              />
              <Grid columns={2} gap={10}>
                <TextFieldOne
                  placeholder="Zip"
                  value={zip}
                  setter={setZip}
                  radius={8}
                  theme={theme}
                />
                <TextFieldOne
                  placeholder="Country"
                  value={country}
                  setter={setCountry}
                  radius={8}
                  theme={theme}
                />
              </Grid>
            </View>
            <Spacer height={20} />
            <View style={[]}>
              <TextView color={themedTextColor(theme)} size={20} theme={theme}>
                Settings
              </TextView>
              <View style={[layout.padding_vertical]}>
                <SideBySide gap={10}>
                  <TextView
                    color={themedTextColor(theme)}
                    size={18}
                    theme={theme}
                  >
                    Light
                  </TextView>
                  <SwitchOne
                    value={theme === "light" ? false : true}
                    setter={setToggleTheme}
                    theme={theme}
                    func={() => {
                      getInDevice("theme", (thisTheme) => {
                        if (thisTheme === "light") {
                          setTheme("dark");
                          setInDevice("theme", "dark");
                        } else {
                          setTheme("light");
                          setInDevice("theme", "light");
                        }
                      });
                    }}
                  />
                  <TextView
                    color={themedTextColor(theme)}
                    size={18}
                    theme={theme}
                  >
                    Dark
                  </TextView>
                </SideBySide>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[layout.padding]}>
          <LinkOne
            onPress={() => {
              Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Sign Out",
                  style: "destructive",
                  onPress: () => {
                    auth_SignOut(setLoading, navigation, "start");
                  },
                },
              ]);
            }}
            theme={theme}
            styles={[layout.center]}
            lightUnderlineColor={"#D6133B"}
            darkUnderlineColor={"#D6133B"}
          >
            <TextView color={"#D6133B"} size={18} theme={theme}>
              Sign Out
            </TextView>
          </LinkOne>
          <Divider
            color={secondaryThemedBackgroundColor(theme)}
            marginV={10}
            theme={theme}
          />
          <LinkOne
            onPress={() => {
              Alert.alert(
                "Delete Account",
                "Are you sure you want to delete this account? These actions cannot be reversed.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete Account",
                    style: "destructive",
                    onPress: () => {
                      setLoading(true);
                      firebase_DeleteDocument(setLoading, "Users", me.id).then(
                        () => {
                          auth_DeleteUser();
                          navigation.navigate("start");
                        }
                      );
                    },
                  },
                ]
              );
            }}
            theme={theme}
            styles={[layout.center]}
            lightUnderlineColor={secondaryThemedTextColor(theme)}
            darkUnderlineColor={secondaryThemedTextColor(theme)}
          >
            <TextView
              color={secondaryThemedTextColor(theme)}
              size={14}
              theme={theme}
            >
              Delete Account
            </TextView>
          </LinkOne>
          <Spacer height={10} />
          <TextView
            color={themedTextColor(theme)}
            size={12}
            theme={theme}
            center={true}
          >
            Copyright 2024 {appName}. All Rights Reserved.
          </TextView>
        </View>
      </SafeArea>
    </KeyboardAvoidingView>
  );
}
