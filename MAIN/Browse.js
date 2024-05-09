import { useEffect, useState } from "react";
import {
  Grid,
  Icon,
  LinkOne,
  SafeArea,
  SeparatedView,
  Spacer,
  TextPill,
  TextView,
  firebase_GetAllDocuments,
  format,
  getInDevice,
  layout,
  secondaryThemedBackgroundColor,
  setInDevice,
  shopifyURL,
  shopify_GetAllCollections,
  shopify_GetAllProducts,
  themedBackgroundColor,
  themedButtonColor,
  themedButtonTextColor,
  themedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

export function Browse({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  //
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // setInDevice("theme", "dark");
    getInDevice("theme", setTheme);
    setLoading(true);
    firebase_GetAllDocuments(
      setFakeLoading,
      "Keys",
      (keys) => {
        const storefrontAPI = keys[0].StorefrontAPI;
        shopify_GetAllCollections(storefrontAPI, setLoading, setCollections);
      },
      0,
      "URL",
      "==",
      shopifyURL,
      false,
      null,
      null
    );
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <View style={[]}>
        <View style={[layout.padding]}>
          <SeparatedView>
            <View style={[]}></View>
            <LinkOne
              onPress={() => {
                navigation.navigate("login");
              }}
              theme={theme}
            >
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                login
              </TextView>
            </LinkOne>
          </SeparatedView>
        </View>
        {/* PRODUCTS */}
        <View style={[layout.padding]}>
          <TextView
            color={themedTextColor(theme)}
            size={20}
            theme={theme}
            styles={[format.all_caps]}
          >
            Collections
          </TextView>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View>
              {collections
                .filter(
                  (ting) => ting.title !== "Home page" && ting.image !== null
                )
                .map((collection, i) => {
                  return (
                    <View key={i}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("browse-items", {
                            collection,
                          });
                        }}
                      >
                        {collection.image !== null && (
                          <Image
                            source={{ uri: collection.image.src }}
                            style={[
                              {
                                width: "100%",
                                height: width * 0.88,
                                //   borderRadius: 6,
                              },
                            ]}
                          />
                        )}
                        {collection.image === null && (
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
                        )}
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
                            // styles={[format.all_caps]}
                            // bold={true}
                          >
                            {collection.title}
                          </TextView>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
            {/* NO IMAGES */}
            <View>
              {collections
                .filter(
                  (ting) => ting.title !== "Home page" && ting.image === null
                )
                .map((collection, i) => {
                  return (
                    <View key={i}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("browse-items", {
                            collection,
                          });
                        }}
                        style={[layout.padding]}
                      >
                        <SeparatedView>
                          <TextView
                            color={themedTextColor(theme)}
                            size={18}
                            theme={theme}
                            // styles={[format.all_caps]}
                            // bold={true}
                          >
                            {collection.title}
                          </TextView>
                          <Icon theme={theme} name={"arrow-forward-outline"} size={22} />
                        </SeparatedView>
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          </View>

          {/*  */}
          <Spacer height={60} />
        </ScrollView>
      </View>
    </SafeArea>
  );
}
