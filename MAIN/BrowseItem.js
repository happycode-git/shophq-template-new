import { useEffect, useState } from "react";
import {
  ButtonOne,
  DropdownOne,
  IconButtonTwo,
  ImagesView,
  LinkOne,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  TextFieldOne,
  TextView,
  format,
  getInDevice,
  height,
  layout,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  setInDevice,
  themedButtonColor,
  themedButtonTextColor,
  themedTextColor,
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export function BrowseItem({ navigation, route }) {
  const { collection, product } = route.params;
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  //
  const [quantity, setQuantity] = useState(1);
  const [tempOptions, setTempOptions] = useState([]);
  const [chosenOption, setChosenOption] = useState({});

  useEffect(() => {
    // setInDevice("theme", "dark")
    getInDevice("theme", setTheme);
    setTempOptions(product.variants);
    if (product.variants[0].title !== "Default Title") {
      setChosenOption(product.variants[0]);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeArea loading={loading} theme={theme}>
        {/* TOP */}
        <View style={[layout.padding]}>
          <TextView color={themedTextColor(theme)} size={18} theme={theme}>
            <LinkOne
              onPress={() => {
                navigation.navigate("browse-items", { collection });
              }}
              theme={theme}
            >
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                back to {collection.title}
              </TextView>
            </LinkOne>
          </TextView>
        </View>
        {/* BODY */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[]}>
            {/* IMAGE */}
            <View
              style={[
                {
                  width: "100%",
                  height: height * 0.4,
                  backgroundColor: secondaryThemedBackgroundColor(theme),
                },
              ]}
            >
              <ImagesView
                urls={product.images.map((ting) => {
                  return ting.src;
                })}
                radius={0}
                styles={[{ objectFit: "contain" }]}
              />
            </View>
            {/* REST */}
            <View style={[layout.padding]}>
              <TextView
                color={themedTextColor(theme)}
                size={26}
                theme={theme}
                bold={true}
              >
                {product.title}
              </TextView>

              <View style={[layout.padding_vertical]}>
                <TextView
                  color={secondaryThemedTextColor(theme)}
                  size={14}
                  theme={theme}
                  styles={[format.all_caps]}
                >
                  Description
                </TextView>
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                >
                  {product.description}
                </TextView>
              </View>
            </View>
            {/* OPTIONS */}
            {tempOptions.length > 0 &&
              tempOptions[0].title !== "Default Title" && (
                <View style={[]}>
                  <View style={[layout.padding_horizontal]}>
                    <TextView
                      color={secondaryThemedTextColor(theme)}
                      size={14}
                      theme={theme}
                      styles={[format.all_caps]}
                    >
                      Options
                    </TextView>
                  </View>
                  {/*  */}
                  <View style={[layout.margin_vertical_small, { flex: 1 }]}>
                    {tempOptions.map((opt, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            layout.padding,
                            {
                              backgroundColor:
                                chosenOption.id !== opt.id
                                  ? secondaryThemedBackgroundColor(theme)
                                  : "#117DFA",
                            },
                            layout.full_width,
                          ]}
                          onPress={() => {
                            setChosenOption(opt);
                            console.log(opt);
                          }}
                        >
                          <View style={[{ flex: 1 }]}>
                            <SeparatedView>
                              <TextView
                                color={
                                  chosenOption.id !== opt.id
                                    ? themedTextColor(theme)
                                    : "white"
                                }
                                size={18}
                                theme={theme}
                              >
                                {opt.title}
                              </TextView>
                              <TextView
                                color={
                                  chosenOption.id !== opt.id
                                    ? themedTextColor(theme)
                                    : "white"
                                }
                                size={18}
                                theme={theme}
                              >
                                ${opt.price.amount}
                              </TextView>
                            </SeparatedView>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
          </View>
        </ScrollView>
        {/* ADD TO CART */}
        <View style={[layout.padding]}>
          <View style={[layout.center]}>
            <LinkOne
              onPress={() => {
                navigation.navigate("login");
              }}
              theme={theme}
            >
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                go to login
              </TextView>
            </LinkOne>
          </View>
        </View>
        {/* <View style={[layout.padding_horizontal]}>
          <SideBySide gap={10}>
            <View style={[]}>
              <SideBySide gap={10}>
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                >
                  Qty:
                </TextView>
                <TextFieldOne
                  placeholder="Qty"
                  value={`${quantity}`}
                  setter={setQuantity}
                  radius={8}
                  isNum={true}
                  theme={theme}
                />
              </SideBySide>
            </View>
            <View style={[{ flex: 1 }]}>
              <ButtonOne
                backgroundColor={themedButtonColor(theme)}
                radius={100}
                padding={10}
                onPress={() => {
                  Alert.alert(
                    "Log In",
                    "Log in to add this item to your cart.",
                    [
                      { text: "Continue Browsing", style: "default" },
                      {
                        text: "Log In",
                        style: "default",
                        onPress: () => {
                          navigation.navigate("login");
                        },
                      },
                    ]
                  );
                }}
              >
                <SeparatedView>
                  <View style={[layout.padding_horizontal]}>
                    <TextView
                      color={themedButtonTextColor(theme)}
                      size={16}
                      theme={theme}
                    >
                      Add To Cart
                    </TextView>
                  </View>
                  <View style={[layout.padding_horizontal]}>
                    {chosenOption.price !== undefined && (
                      <TextView
                        color={themedButtonTextColor(theme)}
                        size={18}
                        theme={theme}
                      >
                        $
                        {(
                          parseFloat(chosenOption.price.amount) * quantity
                        ).toFixed(2)}
                      </TextView>
                    )}
                    {chosenOption.price === undefined && (
                      <TextView
                        color={themedButtonTextColor(theme)}
                        size={18}
                        theme={theme}
                      >
                        $
                        {(parseFloat(product.variants[0].price.amount) * quantity).toFixed(
                          2
                        )}
                      </TextView>
                    )}
                  </View>
                </SeparatedView>
              </ButtonOne>
            </View>
          </SideBySide>
        </View> */}
      </SafeArea>
    </KeyboardAvoidingView>
  );
}
