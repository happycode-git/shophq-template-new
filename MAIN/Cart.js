import { useEffect, useState } from "react";
import {
  ButtonOne,
  IconButtonOne,
  IconButtonThree,
  IconButtonTwo,
  LinkOne,
  MenuBar,
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
  layout,
  randomString,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  setInDevice,
  shopifyURL,
  shopify_AddDiscountItemCheckout,
  shopify_GetCheckOut,
  shopify_RemoveItemCheckout,
  shopify_UpdateItemCheckout,
  themedButtonColor,
  themedButtonTextColor,
  themedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { Image, Linking, ScrollView, View } from "react-native";

export function Cart({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [storefrontKey, setStorefrontKey] = useState("");

  //
  const [cartItems, setCartItems] = useState([]);
  const [checkout, setCheckout] = useState({});
  //
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [code, setCode] = useState("");

  function onDecrease(item) {
    if (item.quantity > 1) {
      setLoading(true);
      const newQty = item.quantity - 1;
      shopify_UpdateItemCheckout(
        storefrontKey,
        checkout.id,
        item.id,
        newQty,
        null,
        (checkout) => {
          setLoading(false);
          setCheckout(checkout);
          setCartItems(checkout.lineItems);
        }
      );
    }
  }
  function onIncrease(item) {
    // setLoading(true);
    setLoading(true);
    const newQty = item.quantity + 1;
    shopify_UpdateItemCheckout(
      storefrontKey,
      checkout.id,
      item.id,
      newQty,
      null,
      (checkout) => {
        setLoading(false);
        setCheckout(checkout);
        setCartItems(checkout.lineItems);
      }
    );
  }
  function onRemove(item) {
    setLoading(true);
    shopify_RemoveItemCheckout(
      storefrontKey,
      checkout.id,
      item.id,
      (checkout) => {
        setCheckout(checkout);
        setCartItems(checkout.lineItems);
        setLoading(false);
      }
    );
  }
  function onConfirmCode() {
    setLoading(true);
    shopify_AddDiscountItemCheckout(
      storefrontKey,
      checkout.id,
      code,
      (checkout) => {
        setCheckout(checkout);
        setCartItems(checkout.lineItems);
        setLoading(false);
        setShowDiscountInput(false);
        setCode("");
      }
    );
  }

  useEffect(() => {
    // setInDevice("theme", "dark")
    getInDevice("theme", setTheme);
    setLoading(true);
    // GET EVERYTHING
    getInDevice("user", (person) => {
      firebase_GetAllDocuments(
        setLoading,
        "Carts",
        (carts) => {
          const thisCart = carts.find((ting) => ting.URL === shopifyURL);
          if (thisCart !== undefined) {
            getInDevice("keys", (keys) => {
              setStorefrontKey(keys[0].StorefrontAPI);
              const storefront = keys[0].StorefrontAPI;
              const checkoutID = thisCart.CheckoutID;
              const thisID = thisCart.id;
              shopify_GetCheckOut(storefront, checkoutID, (checkout) => {
                if (checkout.order !== null) {
                  // ORDER EXISTS
                  const orderID = checkout.order.id;
                  const orderURL = checkout.webUrl;
                  firebase_CreateDocument(
                    {
                      UserID: person.id,
                      OrderID: orderID,
                      URL: shopifyURL,
                      webUrl: orderURL,
                    },
                    "Orders",
                    randomString(25)
                  );
                  firebase_DeleteDocument(setLoading, "Carts", thisID);
                } else {
                  setCartItems(checkout.lineItems);
                  setCheckout(checkout);
                }
              });
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
  }, []);

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
            Cart ({cartItems.length})
          </TextView>
          <LinkOne
            onPress={() => {
              navigation.navigate("collections");
            }}
            theme={theme}
          >
            <TextView color={themedTextColor(theme)} size={18} theme={theme}>
              close
            </TextView>
          </LinkOne>
        </SeparatedView>
      </View>
      {/* CART */}
      {cartItems.length === 0 && (
        <View style={[layout.padding]}>
          <TextView color={themedTextColor(theme)} size={18} theme={theme}>
            No items in your cart.
          </TextView>
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[]}>
          {cartItems.map((item, i) => {
            return (
              <View
                key={i}
                style={[
                  layout.padding,
                  {
                    borderBottomColor: secondaryThemedBackgroundColor(theme),
                    borderBottomWidth: 1,
                  },
                  //   { backgroundColor: secondaryThemedBackgroundColor(theme) },
                ]}
              >
                <View style={[layout.horizontal, { gap: 15 }]}>
                  <View
                    style={[
                      {
                        backgroundColor: secondaryThemedBackgroundColor(theme),
                      },
                    ]}
                  >
                    <Image
                      source={
                        item.variant.image !== null
                          ? { uri: item.variant.image.src }
                          : require("../assets/shophq.png")
                      }
                      style={[{ width: 100, height: 100 }]}
                    />
                  </View>
                  <View style={{ width: width * 0.6 }}>
                    <View>
                      <TextView
                        color={themedTextColor(theme)}
                        size={20}
                        theme={theme}
                        styles={[{ width: width * 0.65 }]}
                        bold={true}
                      >
                        {item.title}
                      </TextView>
                      {item.variant.title !== "Default Title" && (
                        <View
                          style={[
                            layout.padding_horizontal,
                            layout.padding_vertical_small,
                          ]}
                        >
                          <TextView
                            color={secondaryThemedTextColor(theme)}
                            size={16}
                            theme={theme}
                          >
                            {item.variant.title}
                          </TextView>
                        </View>
                      )}
                      <View>
                        <SeparatedView>
                          <TextView color={"#117DFA"} size={16} theme={theme}>
                            ${parseFloat(item.variant.price.amount).toFixed(2)} each
                          </TextView>
                          <TextView
                            color={themedTextColor(theme)}
                            size={18}
                            theme={theme}
                          >
                            {item.quantity} x
                          </TextView>
                        </SeparatedView>
                        <Spacer height={5} />
                        <SeparatedView>
                          <View style={[]}>
                            <SideBySide gap={10}>
                              <IconButtonThree
                                name="remove-outline"
                                size={18}
                                padding={8}
                                radius={100}
                                onPress={() => {
                                  onDecrease(item);
                                }}
                                theme={theme}
                              />
                              <IconButtonThree
                                name="add-outline"
                                size={18}
                                padding={8}
                                radius={100}
                                onPress={() => {
                                  onIncrease(item);
                                }}
                                theme={theme}
                              />
                            </SideBySide>
                          </View>
                          <IconButtonThree
                            name="trash"
                            size={18}
                            padding={8}
                            lightColor={"red"}
                            darkColor={"red"}
                            onPress={() => {
                              onRemove(item);
                            }}
                            theme={theme}
                          />
                        </SeparatedView>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* TOTALS */}
      {checkout.id !== undefined && cartItems.length > 0 && (
        <View style={[layout.padding_horizontal]}>
          {/* SUBTOTAL */}
          <SeparatedView>
            <TextView color={themedTextColor(theme)} size={16} theme={theme}>
              Subtotal:
            </TextView>
            <TextView color={themedTextColor(theme)} size={16} theme={theme}>
              ${`${parseFloat(checkout.subtotalPrice.amount).toFixed(2)}`}
            </TextView>
          </SeparatedView>
          {/* TAX */}
          <SeparatedView>
            <TextView color={themedTextColor(theme)} size={16} theme={theme}>
              Tax:
            </TextView>
            <TextView color={themedTextColor(theme)} size={16} theme={theme}>
              ${`${parseFloat(checkout.totalTax.amount).toFixed(2)}`}
            </TextView>
          </SeparatedView>
          {/* TOTAL */}
          <View style={[]}>
            <SeparatedView>
              <TextView color={themedTextColor(theme)} size={18} theme={theme}>
                Total:
              </TextView>
              <TextView
                color={themedTextColor(theme)}
                size={20}
                theme={theme}
                bold={true}
              >
                ${`${parseFloat(checkout.totalPrice.amount).toFixed(2)}`}
              </TextView>
            </SeparatedView>
          </View>
        </View>
      )}
      {showDiscountInput && (
        <View style={[layout.padding]}>
          <SideBySide gap={10}>
            <View style={[{ flex: 1 }]}>
              <TextFieldOne
                placeholder="Enter Discount Code.."
                value={code}
                setter={setCode}
                radius={8}
                autoCap={true}
                isPassword={false}
                theme={theme}
              />
            </View>
            {code !== "" && (
              <IconButtonOne
                name="arrow-forward-circle"
                size={40}
                onPress={() => {
                  onConfirmCode();
                }}
                theme={theme}
              />
            )}
          </SideBySide>
        </View>
      )}
      {checkout.id !== undefined && cartItems.length > 0 && (
        <View style={[]}>
          <Spacer height={10} />
          <SideBySide gap={0}>
            <View style={[]}>
              <ButtonOne
                backgroundColor={"transparent"}
                radius={0}
                padding={0}
                onPress={() => {
                  setShowDiscountInput((prev) => !prev);
                  setCode("");
                }}
              >
                <View
                  style={[
                    layout.padding,
                    { backgroundColor: secondaryThemedBackgroundColor(theme) },
                  ]}
                >
                  <TextView
                    color={themedTextColor(theme)}
                    size={16}
                    theme={theme}
                    center={true}
                    styles={[layout.padding_horizontal]}
                  >
                    {showDiscountInput ? "Cancel" : "Add Discount"}
                  </TextView>
                </View>
              </ButtonOne>
            </View>
            <View style={[{ flex: 1 }]}>
              <ButtonOne
                backgroundColor={themedButtonColor(theme)}
                radius={0}
                padding={0}
                onPress={() => {
                  navigation.navigate("collections");
                  Linking.openURL(checkout.webUrl);
                }}
              >
                <View style={[layout.padding]}>
                  <TextView
                    color={themedButtonTextColor(theme)}
                    size={18}
                    theme={theme}
                    center={true}
                    bold={true}
                  >
                    Check Out
                  </TextView>
                </View>
              </ButtonOne>
            </View>
          </SideBySide>
        </View>
      )}
    </SafeArea>
  );
}
