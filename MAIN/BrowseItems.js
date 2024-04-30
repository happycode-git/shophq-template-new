import { useEffect, useState } from "react";
import {
  Grid,
  IconButtonOne,
  LinkOne,
  SafeArea,
  SeparatedView,
  Spacer,
  TextView,
  format,
  getInDevice,
  layout,
  themedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

export function BrowseItems({ navigation, route }) {
  const { collection } = route.params;
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    getInDevice("theme", setTheme);
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      {/* TOP */}
      <View style={[layout.padding]}>
        <SeparatedView>
          <LinkOne
            onPress={() => {
              navigation.navigate("browse");
            }}
            theme={theme}
          >
            <TextView color={themedTextColor(theme)} size={18} theme={theme}>
              back
            </TextView>
          </LinkOne>
          <IconButtonOne
            name="search-outline"
            size={26}
            onPress={() => {}}
            theme={theme}
          />
        </SeparatedView>
      </View>
      {/* BODY */}
      <View style={[layout.padding]}>
        <TextView
          color={themedTextColor(theme)}
          size={26}
          theme={theme}
          styles={[format.all_caps]}
        >
          {collection.title}
        </TextView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[layout.horizontal]}>
          <Grid columns={2} gap={5}>
            {collection.products.map((prod, i) => {
              return (
                <View key={i} style={[]}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("browse-item", {
                        collection,
                        product: prod,
                      });
                    }}
                  >
                    <Image
                      source={{ uri: prod.images[0].src }}
                      style={[{ width: "100%", height: width * 0.45 }]}
                    />
                    <View style={[layout.padding_small]}>
                      <TextView
                        color={themedTextColor(theme)}
                        size={14}
                        theme={theme}
                      >
                        {prod.title}
                      </TextView>
                      <TextView color={"#117DFA"} size={16} theme={theme}>
                        ${prod.variants[0].price.amount}
                      </TextView>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </Grid>
        </View>

        {/*  */}
        <Spacer height={60} />
      </ScrollView>
    </SafeArea>
  );
}
