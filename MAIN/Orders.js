import { useEffect, useState } from "react";
import {
  ButtonOne,
  ButtonTwo,
  Grid,
  IconButtonOne,
  LinkOne,
  SafeArea,
  SeparatedView,
  Spacer,
  TextFieldOne,
  TextView,
  appName,
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocuments,
  format,
  formatDateTime,
  formatLongDate,
  getInDevice,
  layout,
  randomString,
  removeDuplicatesByProperty,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  setInDevice,
  shopifyURL,
  shopify_GetCheckOut,
  shopify_GetOrder,
  shopify_GetOrders,
  sortObjectArray,
  themedBackgroundColor,
  themedTextColor,
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  View,
} from "react-native";

export function Orders({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  //
  const [lastDoc, setLastDoc] = useState(null);
  const [tempOrders, setTempOrders] = useState([]);
  //
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");

  function onGetOrder() {
    getInDevice("keys", (keys) => {
      const key = keys[0].AdminAPI;
      shopify_GetOrders(key, (orders) => {
        const order = orders.find((ting) => ting.confirmation_number === code);
        if (order !== undefined) {
          setTempOrders((prev) =>
            removeDuplicatesByProperty([...prev, order], "id")
          );
          setCode("");
          setShowForm(false);
        } else {
          Alert.alert(
            "No Orders",
            "We're sorry. We did not find any matching orders."
          );
        }
      });
    });
  }

  useEffect(() => {
    // setInDevice("theme", "light")
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
        // setLoading(true);
      setMe(person);
      firebase_GetAllDocuments(
        setFakeLoading,
        "Carts",
        (carts) => {
          const thisCart = carts.find((ting) => ting.URL === shopifyURL);
          if (thisCart !== undefined) {
            getInDevice("keys", (keys) => {
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
      firebase_GetAllDocuments(
        setLoading,
        "Orders",
        (orders) => {
          console.log(orders);
          const filtered = [
            ...orders.filter((ting) => ting.URL === shopifyURL),
          ];
          if (filtered.length > 0) {
            // HAS ORDERS
            getInDevice("keys", (keys) => {
              const adminKey = keys[0].AdminAPI;
              for (var i in filtered) {
                const order = filtered[i];
                const temp1 = order.OrderID.split("/");
                const temp2 = temp1.pop();
                const orderID = temp2.split("?")[0];
                shopify_GetOrder(
                  adminKey,
                  (thisOrder) => {
                    setTempOrders((prev) => [
                      ...prev,
                      { ...thisOrder, webUrl: order.webUrl },
                    ]);
                  },
                  orderID
                );
              }
            });
          }
        },
        100,
        "UserID",
        "==",
        person.id,
        true,
        lastDoc,
        setLastDoc
      );
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
            <TextView
              color={themedTextColor(theme)}
              size={20}
              theme={theme}
              styles={[format.all_caps]}
            >
              Orders
            </TextView>
            {/*  */}
            <View style={[layout.horizontal, { gap: 15 }]}>
              <LinkOne
                onPress={() => {
                  setShowForm(true);
                }}
                theme={theme}
              >
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                >
                  pull order
                </TextView>
              </LinkOne>
              <IconButtonOne
                name="reload-outline"
                size={26}
                onPress={() => {
                  
                  firebase_GetAllDocuments(
                    setLoading,
                    "Orders",
                    (orders) => {
                      console.log(orders);
                      const filtered = [
                        ...orders.filter((ting) => ting.URL === shopifyURL),
                      ];
                      if (filtered.length > 0) {
                        // HAS ORDERS
                        getInDevice("keys", (keys) => {
                          const adminKey = keys[0].AdminAPI;
                          for (var i in filtered) {
                            const order = filtered[i];
                            const temp1 = order.OrderID.split("/");
                            const temp2 = temp1.pop();
                            const orderID = temp2.split("?")[0];
                            console.log(orderID);
                            shopify_GetOrder(
                              adminKey,
                              (thisOrder) => {
                                setTempOrders((prev) => removeDuplicatesByProperty([...prev, thisOrder], "id"));
                              },
                              orderID
                            );
                          }
                        });
                      }
                    },
                    100,
                    "UserID",
                    "==",
                    me.id,
                    true,
                    null,
                    setLastDoc
                  );
                }}
                theme={theme}
              />
            </View>
          </SeparatedView>
        </View>
        {tempOrders.length === 0 && (
          <View style={[layout.padding]}>
            <TextView color={themedTextColor(theme)} size={18} theme={theme}>
              No orders posted yet.
            </TextView>
          </View>
        )}

        {/* BODY */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {sortObjectArray(tempOrders, "desc", "created_at").map(
              (order, i) => {
                return (
                  <View
                    key={i}
                    style={[
                      layout.margin,
                      format.radius,
                      {
                        borderColor: secondaryThemedBackgroundColor(theme),
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        layout.padding,
                        format.radius,
                        {
                          backgroundColor:
                            secondaryThemedBackgroundColor(theme),
                        },
                      ]}
                    >
                      <TextView
                        color={themedTextColor(theme)}
                        size={20}
                        theme={theme}
                        bold={true}
                      >
                        #{order.order_number}
                      </TextView>
                    </View>
                    <View style={[layout.padding_small]}>
                      {/* CONFIRMATION */}
                      <View
                        style={[
                          layout.padding_small,
                          //   {
                          //     borderBottomColor:
                          //       secondaryThemedBackgroundColor(theme),
                          //     borderBottomWidth: 1,
                          //   },
                        ]}
                      >
                        <SeparatedView>
                          <TextView
                            color={themedTextColor(theme)}
                            size={16}
                            theme={theme}
                          >
                            Confirmation #
                          </TextView>
                          <TextView
                            color={themedTextColor(theme)}
                            size={16}
                            theme={theme}
                          >
                            {order.confirmation_number}
                          </TextView>
                        </SeparatedView>
                      </View>
                      {/* CREATED */}
                      <View
                        style={[
                          layout.padding_small,
                          //   {
                          //     borderBottomColor:
                          //       secondaryThemedBackgroundColor(theme),
                          //     borderBottomWidth: 1,
                          //   },
                        ]}
                      >
                        <SeparatedView>
                          <TextView
                            color={themedTextColor(theme)}
                            size={16}
                            theme={theme}
                          >
                            Date Ordered
                          </TextView>
                          <TextView
                            color={themedTextColor(theme)}
                            size={16}
                            theme={theme}
                          >
                            {formatDateTime(new Date(order.created_at))}
                          </TextView>
                        </SeparatedView>
                      </View>
                      {/* STATUS */}
                      <View
                        style={[
                          layout.padding_small,
                          //   {
                          //     borderBottomColor:
                          //       secondaryThemedBackgroundColor(theme),
                          //     borderBottomWidth: 1,
                          //   },
                        ]}
                      >
                        <SeparatedView>
                          <TextView
                            color={themedTextColor(theme)}
                            size={16}
                            theme={theme}
                          >
                            Status
                          </TextView>
                          <TextView
                            color={"#28D782"}
                            size={16}
                            theme={theme}
                            styles={[format.all_caps]}
                          >
                            {order.financial_status}
                          </TextView>
                        </SeparatedView>
                      </View>
                      {/* STATUS */}
                      <View style={[layout.padding_small]}>
                        <SeparatedView>
                          <TextView
                            color={themedTextColor(theme)}
                            size={16}
                            theme={theme}
                          >
                            Total
                          </TextView>
                          <TextView
                            color={themedTextColor(theme)}
                            size={16}
                            theme={theme}
                            styles={[format.all_caps]}
                          >
                            ${order.total_line_items_price}
                          </TextView>
                        </SeparatedView>
                      </View>
                      {/* TRACKING NUMBER */}
                      {order.fulfillments.length > 0 && (
                        <View
                          style={[
                            layout.padding_small,
                            // {
                            //   borderBottomColor:
                            //     secondaryThemedBackgroundColor(theme),
                            //   borderBottomWidth: 1,
                            // },
                          ]}
                        >
                          <SeparatedView>
                            <TextView
                              color={themedTextColor(theme)}
                              size={16}
                              theme={theme}
                            >
                              Tracking
                            </TextView>
                            <LinkOne
                              onPress={() => {
                                Linking.openURL(
                                  order.fulfillments[0].tracking_url
                                );
                              }}
                              theme={theme}
                            >
                              <TextView
                                color={themedTextColor(theme)}
                                size={16}
                                theme={theme}
                                styles={[format.all_caps]}
                              >
                                {order.fulfillments[0].tracking_number}
                              </TextView>
                            </LinkOne>
                          </SeparatedView>
                        </View>
                      )}
                      {/* LINK */}
                      {order.webUrl !== undefined && (
                        <View
                          style={[
                            layout.padding,
                            // {
                            //   borderBottomColor:
                            //     secondaryThemedBackgroundColor(theme),
                            //   borderBottomWidth: 1,
                            // },
                          ]}
                        >
                          <LinkOne
                            onPress={() => {
                              Linking.openURL(order.webUrl);
                            }}
                            theme={theme}
                            styles={[layout.center]}
                          >
                            <TextView
                              color={themedTextColor(theme)}
                              size={16}
                              theme={theme}
                            >
                              more details
                            </TextView>
                          </LinkOne>
                        </View>
                      )}
                    </View>
                  </View>
                );
              }
            )}
          </View>

          {/*  */}
          <Spacer height={60} />
        </ScrollView>

        {/* MODALS */}
        <Modal visible={showForm} animationType="slide">
          <SafeArea theme={theme}>
            <View style={[layout.padding, { flex: 1 }]}>
              {/* TOP */}
              <SeparatedView>
                <View style={[]}></View>
                <LinkOne
                  onPress={() => {
                    setShowForm(false);
                  }}
                  theme={theme}
                >
                  <TextView
                    color={themedTextColor(theme)}
                    size={18}
                    theme={theme}
                  >
                    close
                  </TextView>
                </LinkOne>
              </SeparatedView>

              {/* BODY */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[{ flex: 1 }]}>
                  <View style={[layout.center]}>
                    <Image
                      source={require("../assets/loading.png")}
                      style={[{ width: 100, height: 100 }]}
                    />
                  </View>
                  <TextView
                    color={themedTextColor(theme)}
                    size={18}
                    theme={theme}
                  >
                    Retrieve previous orders associated with this vendor using
                    the provided confirmation code and integrate them into this
                    application.
                  </TextView>
                  <Spacer height={10} />
                  <TextFieldOne
                    placeholder="Confirmation Code"
                    value={code}
                    setter={setCode}
                    radius={8}
                    autoCap={true}
                    isPassword={false}
                    theme={theme}
                  />
                </View>
              </ScrollView>
              {code !== "" && (
                <View style={[]}>
                  <ButtonTwo
                    borderColor={themedTextColor(theme)}
                    borderWidth={1}
                    radius={100}
                    padding={10}
                    onPress={() => {
                      onGetOrder();
                    }}
                  >
                    <TextView
                      color={themedTextColor(theme)}
                      size={18}
                      theme={theme}
                      center={true}
                    >
                      Request Order
                    </TextView>
                  </ButtonTwo>
                </View>
              )}
            </View>
          </SafeArea>
        </Modal>

        {/* MENU */}
        <View
          style={[
            layout.absolute,
            {
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: themedBackgroundColor(theme),
              paddingBottom: 10,
            },
          ]}
        >
          <Grid columns={3} gap={10} styles={[{}]}>
            <View style={[layout.padding]}>
              <LinkOne
                onPress={() => {
                  navigation.navigate("collections");
                }}
                theme={theme}
                styles={[layout.center]}
              >
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                >
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
              <LinkOne
                onPress={() => {
                  navigation.navigate("orders");
                }}
                theme={theme}
                styles={[layout.center]}
              >
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                >
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
              <LinkOne
                onPress={() => {
                  navigation.navigate("cart");
                }}
                theme={theme}
                styles={[layout.center]}
              >
                <TextView
                  color={themedTextColor(theme)}
                  size={18}
                  theme={theme}
                >
                  cart
                </TextView>
              </LinkOne>
            </View>
          </Grid>
        </View>
      </SafeArea>
    </KeyboardAvoidingView>
  );
}
