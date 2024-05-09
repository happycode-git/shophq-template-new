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
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocuments,
  format,
  getInDevice,
  height,
  layout,
  randomString,
  reduceArray,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  setInDevice,
  shopifyURL,
  shopify_AddItemCheckout,
  shopify_CreateCheckout,
  shopify_GetCheckOut,
  shopify_GetProduct,
  shopify_GetProductAdmin,
  themedButtonColor,
  themedButtonTextColor,
  themedTextColor,
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export function Item({ navigation, route }) {
  const { collection, product } = route.params;
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  //
  const [quantity, setQuantity] = useState(1);
  const [tempOptions, setTempOptions] = useState([]);
  const [chosenOption, setChosenOption] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [savedID, setSavedID] = useState("");
  const [soldOut, setSoldOut] = useState(false);
  const [inStock, setInStock] = useState(0);

  //
  function onAddToCart() {
    if (tempOptions.length > 0) {
      if (quantity !== "" && chosenOption.id !== undefined) {
        Alert.alert(
          "Confirmation",
          "Are you sure you want to add this item to your cart?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Proceed",
              style: "default",
              onPress: () => {
                setLoading(true);
                getInDevice("keys", (keys) => {
                  const storefront = keys[0].StorefrontAPI;
                  firebase_GetAllDocuments(
                    setFakeLoading,
                    "Carts",
                    (carts) => {
                      const thisCart = carts.find(
                        (ting) => ting.URL === shopifyURL
                      );
                      if (thisCart !== undefined) {
                        // CHECK OUT EXISTS
                        shopify_GetCheckOut(
                          storefront,
                          thisCart.CheckoutID,
                          (checkout) => {
                            shopify_AddItemCheckout(
                              storefront,
                              checkout.id,
                              chosenOption.id !== undefined
                                ? chosenOption.id
                                : product.variants[0].id,
                              parseInt(quantity),
                              null,
                              (checkout) => {
                                setLoading(false);
                                Alert.alert(
                                  "Success!",
                                  "Item added to your cart.",
                                  [
                                    {
                                      text: "Okay",
                                      style: "default",
                                      onPress: () => {
                                        navigation.navigate("items", {
                                          collection,
                                        });
                                      },
                                    },
                                  ]
                                );
                              }
                            );
                            setLoading(false);
                          }
                        );
                      } else {
                        // DOES NOT EXIST
                        shopify_CreateCheckout(
                          storefront,
                          (checkout) => {
                            firebase_CreateDocument(
                              {
                                UserID: me.id,
                                URL: shopifyURL,
                                CheckoutID: checkout.id,
                              },
                              "Carts",
                              randomString(25)
                            );
                            shopify_AddItemCheckout(
                              storefront,
                              checkout.id,
                              chosenOption.id !== undefined
                                ? chosenOption.id
                                : product.variants[0].id,
                              parseInt(quantity),
                              null,
                              (checkout) => {
                                setLoading(false);
                                Alert.alert(
                                  "Success!",
                                  "Item added to your cart.",
                                  [
                                    {
                                      text: "Okay",
                                      style: "default",
                                      onPress: () => {
                                        navigation.navigate("items", {
                                          collection,
                                        });
                                      },
                                    },
                                  ]
                                );
                              }
                            );
                          },
                          me
                        );
                      }
                    },
                    0,
                    "UserID",
                    "==",
                    me.id
                  );
                });
              },
            },
          ]
        );
      } else {
        Alert.alert("Missing Info", "Please enter a valid quantity and choose an option.");
      }
    } else {
      if (quantity !== "") {
        Alert.alert(
          "Confirmation",
          "Are you sure you want to add this item to your cart?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Proceed",
              style: "default",
              onPress: () => {
                setLoading(true);
                getInDevice("keys", (keys) => {
                  const storefront = keys[0].StorefrontAPI;
                  firebase_GetAllDocuments(
                    setFakeLoading,
                    "Carts",
                    (carts) => {
                      const thisCart = carts.find(
                        (ting) => ting.URL === shopifyURL
                      );
                      if (thisCart !== undefined) {
                        // CHECK OUT EXISTS
                        shopify_GetCheckOut(
                          storefront,
                          thisCart.CheckoutID,
                          (checkout) => {
                            shopify_AddItemCheckout(
                              storefront,
                              checkout.id,
                              chosenOption.id !== undefined
                                ? chosenOption.id
                                : product.variants[0].id,
                              parseInt(quantity),
                              null,
                              (checkout) => {
                                setLoading(false);
                                Alert.alert(
                                  "Success!",
                                  "Item added to your cart.",
                                  [
                                    {
                                      text: "Okay",
                                      style: "default",
                                      onPress: () => {
                                        navigation.navigate("items", {
                                          collection,
                                        });
                                      },
                                    },
                                  ]
                                );
                              }
                            );
                            setLoading(false);
                          }
                        );
                      } else {
                        // DOES NOT EXIST
                        shopify_CreateCheckout(
                          storefront,
                          (checkout) => {
                            firebase_CreateDocument(
                              {
                                UserID: me.id,
                                URL: shopifyURL,
                                CheckoutID: checkout.id,
                              },
                              "Carts",
                              randomString(25)
                            );
                            shopify_AddItemCheckout(
                              storefront,
                              checkout.id,
                              chosenOption.id !== undefined
                                ? chosenOption.id
                                : product.variants[0].id,
                              parseInt(quantity),
                              null,
                              (checkout) => {
                                setLoading(false);
                                Alert.alert(
                                  "Success!",
                                  "Item added to your cart.",
                                  [
                                    {
                                      text: "Okay",
                                      style: "default",
                                      onPress: () => {
                                        navigation.navigate("items", {
                                          collection,
                                        });
                                      },
                                    },
                                  ]
                                );
                              }
                            );
                          },
                          me
                        );
                      }
                    },
                    0,
                    "UserID",
                    "==",
                    me.id
                  );
                });
              },
            },
          ]
        );
      } else {
        Alert.alert("Missing Info", "Please enter a valid quantity");
      }
    }
  }
  function onSaveUnsave() {
    if (isSaved) {
      // ALREADY SAVED

      firebase_DeleteDocument(setLoading, "Saved", savedID);
      setIsSaved(false);
      setSavedID("");
    } else {
      const thing = randomString(25);
      setSavedID(thing);
      firebase_CreateDocument(
        { UserID: me.id, ItemID: product.id, URL: shopifyURL },
        "Saved",
        thing
      );
      setIsSaved(true);
    }
  }

  useEffect(() => {
    // setInDevice("theme", "dark")
    getInDevice("theme", setTheme);

    getInDevice("user", (person) => {
      setMe(person);
      firebase_GetAllDocuments(
        setLoading,
        "Saved",
        (saved) => {
          const thisSaved = saved.find((ting) => ting.ItemID === product.id);
          if (thisSaved !== undefined) {
            setIsSaved(true);
            setSavedID(thisSaved.id);
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
    if (product.variants[0].title !== "Default Title") {
      setChosenOption(product.variants[0]);
    }
    getInDevice("keys", (keys) => {
      const adminAPI = keys[0].AdminAPI;
      const parts = product.id.split("/");
      const thisID = parts[parts.length - 1];
      shopify_GetProductAdmin(adminAPI, thisID, (prod) => {
        const thisArr = prod.variants.filter(
          (ting) =>
            ting.title !== "Default Title" && ting.inventory_quantity > 0
        );
        const newArr = thisArr.map((ting) => {
          return ting.inventory_quantity;
        });
        const allQty = newArr.reduce((total, current) => total + current, 0);
        if (thisArr.length > 0) {
          setChosenOption(thisArr[0]);
        }
        setInStock(allQty);
        setTempOptions(thisArr);

        if (allQty === 0) {
          setSoldOut(true);
        }
      });
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
                navigation.navigate("items", { collection });
              }}
              theme={theme}
            >
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                back to {collection.title}
              </TextView>
            </LinkOne>
            <LinkOne
              onPress={() => {
                // navigation.navigate("items", { collection });
                onSaveUnsave();
              }}
              theme={theme}
            >
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                {isSaved ? "unsave" : "save"}
              </TextView>
            </LinkOne>
          </SeparatedView>
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
              {product.images.length > 0 && (
                <ImagesView
                  urls={product.images.map((ting) => {
                    return ting.src;
                  })}
                  radius={0}
                  styles={[{ objectFit: "contain" }]}
                />
              )}
              {product.images.length === 0 && (
                <Image
                  source={require("../assets/shophq.png")}
                  style={[{ width: "100%", height: height * 0.4 }]}
                />
              )}
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

              <SeparatedView>
                <View>
                  {tempOptions.length === 0 && (
                    <TextView size={20} theme={theme}>
                      ${parseFloat(product.variants[0].price.amount).toFixed(2)}
                    </TextView>
                  )}
                </View>
                <TextView size={18} theme={theme} color={inStock > 0 ? "#28D782" : "#D6133B"}>
                  {inStock} in stock
                </TextView>
              </SeparatedView>

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
                    {tempOptions
                      .filter((ting) => ting.inventory_quantity > 0)
                      .map((opt, i) => {
                        console.log(opt);
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
                                <SideBySide>
                                  <TextView
                                    color={
                                      chosenOption.id !== opt.id
                                        ? themedTextColor(theme)
                                        : "white"
                                    }
                                    size={16}
                                    theme={theme}
                                  >
                                    {opt.inventory_quantity} in stock
                                  </TextView>
                                  <TextView
                                    color={
                                      chosenOption.id !== opt.id
                                        ? "#117DFA"
                                        : "white"
                                    }
                                    size={18}
                                    theme={theme}
                                    bold={true}
                                  >
                                    ${parseFloat(opt.price).toFixed(2)}
                                  </TextView>
                                </SideBySide>
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
        {!soldOut && (
          <View style={[layout.padding_horizontal]}>
            <Spacer height={6} />
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
                    setter={(value) => {
                      if (tempOptions.length > 0) {
                        if (value > chosenOption.inventory_quantity) {
                          setQuantity(chosenOption.inventory_quantity);
                        } else {
                          setQuantity(value);
                        }
                      } else {
                        // HAS NO OPTIONS
                        if (value > inStock) {
                          setQuantity(inStock);
                        } else {
                          setQuantity(value);
                        }
                      }
                    }}
                    radius={8}
                    isNum={true}
                    theme={theme}
                  />
                </SideBySide>
              </View>

              {/* ADD TO CART */}
              <View style={[{ flex: 1 }]}>
                <ButtonOne
                  backgroundColor={themedButtonColor(theme)}
                  radius={0}
                  padding={10}
                  onPress={() => {
                    onAddToCart();
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
                          bold={true}
                        >
                          $
                          {(
                            parseFloat(chosenOption.price) * quantity
                          ).toFixed(2)}
                        </TextView>
                      )}
                      {chosenOption.price === undefined && (
                        <TextView
                          color={themedButtonTextColor(theme)}
                          size={18}
                          theme={theme}
                          bold={true}
                        >
                          $
                          {(
                            parseFloat(product.variants[0].price.amount) *
                            quantity
                          ).toFixed(2)}
                        </TextView>
                      )}
                    </View>
                  </SeparatedView>
                </ButtonOne>
              </View>
            </SideBySide>
          </View>
        )}
        {soldOut && (
          <View style={[layout.padding]}>
            <TextView
              color={themedTextColor(theme)}
              size={16}
              theme={theme}
              center={true}
            >
              This item is currently sold out.
            </TextView>
          </View>
        )}
      </SafeArea>
    </KeyboardAvoidingView>
  );
}
