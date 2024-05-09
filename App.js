import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Test from "./Test";
import { useEffect } from "react";
import { Start } from "./MAIN/Start";
import { Login } from "./MAIN/Login";
import { SignUp } from "./MAIN/SignUp";
import { Browse } from "./MAIN/Browse";
import { BrowseItems } from "./MAIN/BrowseItems";
import { BrowseItem } from "./MAIN/BrowseItem";
import { Collections } from "./MAIN/Collections";
import { Items } from "./MAIN/Items";
import { Item } from "./MAIN/Item";
import { Cart } from "./MAIN/Cart";
import { Orders } from "./MAIN/Orders";
import { Profile } from "./MAIN/Profile";
import { Favorites } from "./MAIN/Favorites";
import { FavoriteItem } from "./MAIN/FavoriteItem";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // function_NotificationsSetup();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="start">
        <Stack.Screen
          name="start"
          component={Start}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="browse"
          component={Browse}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="browse-items"
          component={BrowseItems}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="browse-item"
          component={BrowseItem}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="signup"
          component={SignUp}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="collections"
          component={Collections}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="items"
          component={Items}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="item"
          component={Item}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="cart"
          component={Cart}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="orders"
          component={Orders}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="profile"
          component={Profile}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="favorites"
          component={Favorites}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="favorite-item"
          component={FavoriteItem}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
          }}
        />

        {/*  */}
        <Stack.Screen
          name="test"
          component={Test}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
