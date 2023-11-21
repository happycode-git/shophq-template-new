import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Test from "./Test";
import { useEffect } from "react";
import { function_NotificationsSetup } from "./EVERYTHING/BAGEL/Things";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    function_NotificationsSetup();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="test">
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
