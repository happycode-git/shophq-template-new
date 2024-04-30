import { useEffect, useState } from "react";
import {
  Grid,
  IconButtonOne,
  LinkOne,
  MenuBar,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  TextView,
  firebase_GetAllDocuments,
  format,
  getInDevice,
  layout,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  setInDevice,
  shopifyURL,
  shopify_GetAllCollections,
  themedBackgroundColor,
  themedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { Alert, Image, ScrollView, TouchableOpacity, View } from "react-native";

export function Collections({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [colls, setColls] = useState([]);
  //
  const [me, setMe] = useState({});
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Your code to run when the screen is focused
      getInDevice("theme", setTheme);
      console.log("GETTING THEME")
      getInDevice("user", (person) => {
        setMe(person);
        if (person.Address1 === undefined || person.Address1 === "") {
          Alert.alert("Shipping Address", "Filling out your shipping address before you add any items to your cart will allow a quicker checkout process. Do you want to set up your address?", [
            {text: "Later", style: "cancel"},
            {text: "Go to Settings", style: "default", onPress: () => {
              navigation.navigate("profile")
            }}
          ])
        }
      });
      firebase_GetAllDocuments(
        setLoading,
        "Keys",
        (keys) => {
          const storefrontAPI = keys[0].StorefrontAPI;
          console.log(keys)
          shopify_GetAllCollections(storefrontAPI, setLoading, (cs) => {
            setColls(cs);
          });
        },
        0,
        "URL",
        "==",
        shopifyURL,
        false,
        null,
        null
      );
    });
  
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeArea loading={loading} theme={theme}>
      {/* TOP */}
      <View style={[layout.padding]}>
        <SeparatedView>
          <TextView
            color={themedTextColor(theme)}
            size={20}
            theme={theme}
            styles={[format.all_caps]}
          >
            Collections
          </TextView>
          {/*  */}
          <SideBySide gap={15}>
          <IconButtonOne
            name="bookmark-outline"
            size={26}
            onPress={() => {
              navigation.navigate("favorites")
            }}
            theme={theme}
          />
          <IconButtonOne
            name="settings-outline"
            size={26}
            onPress={() => {
              navigation.navigate("profile")
            }}
            theme={theme}
          />
          </SideBySide>
        </SeparatedView>
      </View>

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[]}>
          {colls.map((cs, i) => {
            return (
              <View key={i}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("items", { collection: cs });
                  }}
                >
                  {cs.image !== null && <Image
                    source={{ uri: cs.image.src }}
                    style={[
                      {
                        width: "100%",
                        height: width * 0.88,
                        //   borderRadius: 6,
                      },
                    ]}
                  />}
                  {
                    cs.image === null && 
                    <Image
                    source={require("../assets/IMAGES/stock1.jpg")}
                    style={[
                      {
                        width: "100%",
                        height: width * 0.88,
                        //   borderRadius: 6,
                      },
                    ]}
                  />
                  }
                  <View
                    style={[
                      layout.padding,
                      layout.absolute,
                      { backgroundColor: themedBackgroundColor(theme) },
                    ]}
                  >
                    <TextView
                      color={themedTextColor(theme)}
                      size={18}
                      theme={theme}
                      styles={[format.all_caps]}
                      // bold={true}
                    >
                      {cs.title}
                    </TextView>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/*  */}
        <Spacer height={60} />
      </ScrollView>

      <View
        style={[
          layout.absolute,
          {
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: themedBackgroundColor(theme),
            paddingBottom: 10
          },
        ]}
      >
        <Grid columns={3} gap={10} styles={[{}]}>
        <View
            style={[
              layout.padding,
            ]}
          >
            <LinkOne onPress={() => {
              navigation.navigate("collections")
            }} theme={theme} styles={[layout.center]}>
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                collections
              </TextView>
            </LinkOne>
          </View>
          <View
            style={[
              layout.padding,
              {
                borderLeftColor: secondaryThemedTextColor(theme),
                borderLeftWidth: 1,
              },
            ]}
          >
            <LinkOne onPress={() => {
              navigation.navigate("orders")
            }} theme={theme} styles={[layout.center]}>
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                orders
              </TextView>
            </LinkOne>
          </View>
          <View
            style={[
              layout.padding,
              {
                borderLeftColor: secondaryThemedTextColor(theme),
                borderLeftWidth: 1,
              },
            ]}
          >
            <LinkOne onPress={() => {
              navigation.navigate("cart")
            }} theme={theme} styles={[layout.center]}>
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                cart
              </TextView>
            </LinkOne>
          </View>
        </Grid>
      </View>
    </SafeArea>
  );
}
