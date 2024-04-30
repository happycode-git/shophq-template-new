import { useEffect, useState } from "react";
import {
  Grid,
  LinkOne,
  SafeArea,
  Spacer,
  TextView,
  format,
  getInDevice,
  layout,
  themedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

export function Items({ navigation, route }) {
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
                      navigation.navigate("item", {
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
