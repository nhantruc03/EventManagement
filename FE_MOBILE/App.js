// App.js
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";

// Import Screens
import RegisterScreen from "./screens/Register";
import BottomNav from "./components/BottomNav";
import SplashScreen from "./screens/SplashScreen";

import LoginScreen from "./screens/Login";

const Stack = createStackNavigator();

// const Auth = () => {
//   // Stack Navigator for Login and Sign up Screen
//   return (
//     <Stack.Navigator initialRouteName="LoginScreen">
//       <Stack.Screen
//         name="LoginScreen"
//         component={LoginScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="RegisterScreen"
//         component={RegisterScreen}
//         options={{
//           title: "Register", //Set Header Title
//           headerStyle: {
//             backgroundColor: "#307ecc", //Set Header color
//           },
//           headerTintColor: "#fff", //Set Header text color
//           headerTitleStyle: {
//             fontWeight: "bold", //Set Header text style
//           },
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

export default App = () => {
  const [Loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Font.loadAsync({
    //   regular: require("./assets/fonts/Nunito-Regular.ttf"),
    //   "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    //   "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    //   "Nunito-Light": require("./assets/fonts/Nunito-Light.ttf"),
    // });
    // setFontsLoaded(false);
    setTimeout(function () {
      setLoading(false);
    }, 1000);
  }, [Loading]);

  if (Loading == true) return <SplashScreen />;
  else return <LoginScreen />;
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator>
  //       {/* SplashScreen which will come once for 5 Seconds */}
  //       {/* <Stack.Screen
  //         name="SplashScreen"
  //         component={SplashScreen}
  //         // Hiding header for Splash Screen
  //         options={{ headerShown: false }}
  //       /> */}
  //       {/* Auth Navigator which includer Login Signup will come once */} */}
  //       <Stack.Screen
  //         name="LoginScreen"
  //         component={LoginScreen}
  //         options={{ headerShown: false }}
  //       />
  //       {/* Navigation Drawer as a landing page */}
  //       <Stack.Screen
  //         name="BottomNavigation"
  //         component={BottomNav}
  //         // Hiding header for Navigation Drawer as we will use our custom header
  //         options={{ headerShown: false }}
  //       />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
