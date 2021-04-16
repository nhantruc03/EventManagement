// App.js
import { useFonts } from "expo-font";
import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";

// Import Screens
import RegisterScreen from "./screens/Register";
import BottomNav from "./routes/BottomNav";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/Login";

const Stack = createStackNavigator();

export default App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [loaded] = useFonts({
    antoutline: require("./assets/fonts/antoutline.ttf"),
    regular: require("./assets/fonts/Nunito-Regular.ttf"),
    bold: require("./assets/fonts/Nunito-Bold.ttf"),
    semibold: require("./assets/fonts/Nunito-SemiBold.ttf"),
    light: require("./assets/fonts/Nunito-Light.ttf"),
  });
  if (!loaded) {
    return null;
  }

  // useEffect(() => {
  //   Font.loadAsync({
  //     regular: require("./assets/fonts/Nunito-Regular.ttf"),
  //     "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
  //     "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
  //     "Nunito-Light": require("./assets/fonts/Nunito-Light.ttf"),
  //   });
  //   setFontsLoaded(false);
  // });
  // if (Loading == true) return <SplashScreen />;
  // else {
  //   if (isLoggined == false) return <Auth />;
  //   else return <BottomNav />;
  // }
  // else
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNav}
          // Hiding header for Navigation Drawer as we will use our custom header
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F8",
    alignItems: "center",
    justifyContent: "center",
  },
});
