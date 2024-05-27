import { useEffect, useState } from "react";
import {
  Grid,
  LinkOne,
  SafeArea,
  TextView,
  firebase_GetAllDocuments,
  format,
  getInDevice,
  layout,
  removeDuplicatesByProperty,
  secondaryThemedBackgroundColor,
  shopifyURL,
  shopify_GetProduct,
  themedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

export function Favorites({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  //
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
      getInDevice("keys", (keys) => {
        const storefront = keys[0].StorefrontAPI;
        firebase_GetAllDocuments(
          setLoading,
          "Saved",
          (tings) => {
            const theseThings = tings.filter((ting) => ting.URL === shopifyURL);
            for (var i in theseThings) {
              const savedItem = theseThings[i];
              shopify_GetProduct(storefront, savedItem.ItemID, (prod) => {
                setProducts((prev) =>
                  removeDuplicatesByProperty([...prev, prod], "id")
                );
              });
            }
          },
          0,
          "UserID",
          "==",
          person.id,
          false,
          null,
          null
        );
      });
    });
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      {/* TOP */}
      <View style={[layout.padding]}>
        <LinkOne
          onPress={() => {
            navigation.navigate("collections");
          }}
          theme={theme}
        >
          <TextView color={themedTextColor(theme)} size={18} theme={theme}>
            back to collections
          </TextView>
        </LinkOne>
      </View>
      {/* BODY */}
      <View style={[layout.padding_horizontal]}>
        <TextView
          color={themedTextColor(theme)}
          size={22}
          theme={theme}
          styles={[format.all_caps]}
        >
          FAVORITES
        </TextView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[layout.padding, layout.horizontal]}>
          <Grid columns={2} gap={6}>
            {products.map((prod, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    navigation.navigate("favorite-item", { product: prod });
                  }}
                >
                  <View
                    style={[
                      layout.padding_horizontal,
                      {
                        backgroundColor: secondaryThemedBackgroundColor(theme),
                      },
                      //   format.radius,
                    ]}
                  >
                    <Image
                      source={{ uri: prod.variants[0].image.src }}
                      style={[
                        {
                          width: "100%",
                          height: width * 0.5,
                          objectFit: "cover",
                        },
                      ]}
                    />
                  </View>
                  <TextView
                    color={themedTextColor(theme)}
                    size={16}
                    theme={theme}
                    styles={[layout.padding_vertical_small]}
                  >
                    {prod.title}
                  </TextView>
                </TouchableOpacity>
              );
            })}
          </Grid>
        </View>
      </ScrollView>
    </SafeArea>
  );
}
