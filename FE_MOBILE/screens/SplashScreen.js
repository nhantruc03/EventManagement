import React from "react";
import { StyleSheet, Image, View } from "react-native";
import ImageSplash from "../assets/images/Splash.png";

export default SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={ImageSplash} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
