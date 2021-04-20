import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import Icon from "../assets/images/Show.png";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import Url from "../env";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;

export default LoginScreen = ({ navigation }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isFalse, setIsFalse] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [focusInputType, setFocusInputType] = useState();

  const handleSubmitPress = async () => {
    var data = new FormData();

    data.append("username", username);
    data.append("password", password);
    let result = await axios
      .post(`${Url()}/api/users/login`, data)
      .then((res) => {
        if (res.data.success === true) {
          return res.data.data;
        }
      })
      .catch((error) => {
        console.error(error);
        //alert("Đăng nhập thất bại! Vui lòng đăng nhập lại");
      });

    if (result !== undefined) {
      console.log("result2", result);
      await AsyncStorage.setItem("login", JSON.stringify(result));
      navigation.replace("BottomNavigation");
    } else alert("Đăng nhập thất bại! Vui lòng đăng nhập lại");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formcontainer}>
        <Text style={styles.h1}>XIN CHÀO</Text>
        <Text style={styles.h2}>Đăng nhập để tiếp tục</Text>

        <View
          style={{ marginBottom: (H * 21) / 667, marginTop: (H * 48) / 667 }}
        >
          <Text style={styles.textBox}>Tên đăng nhập</Text>
          <View style={styles.boxSection}>
            <TextInput
              onFocus={() => setFocusInputType("username")}
              onBlur={() => setFocusInputType("")}
              style={
                focusInputType == "username" ? styles.inputActive : styles.input
              }
              placeholder="Nhập tên đăng nhập của bạn"
              onChangeText={(value) => setUserName(value)}
              value={username}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View>
          <Text style={styles.textBox}>Mật khẩu</Text>
          <View style={styles.boxSection}>
            <TouchableOpacity
              style={styles.Icon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image source={Icon} />
            </TouchableOpacity>

            <TextInput
              onFocus={() => setFocusInputType("password")}
              onBlur={() => setFocusInputType("")}
              style={
                focusInputType == "password" ? styles.inputActive : styles.input
              }
              placeholder="Nhập mật khẩu của bạn"
              onChangeText={(value) => setPassword(value)}
              value={password}
              secureTextEntry={showPassword}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <View style={styles.containerBoxSubmit}>
          <TouchableOpacity
            onPress={handleSubmitPress}
            title="Đăng nhập"
            style={styles.btnSubmit}
            underlayColor="#fff"
          >
            <Text style={styles.textSubmit}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#AAB0B6" }} />
          <View>
            <Text style={{ width: 60, textAlign: "center" }}>Hoặc</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "#AAB0B6" }} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formcontainer: {
    zIndex: 2,
    backgroundColor: "#fff",
    padding: 16,
  },
  h1: {
    marginTop: (H * 12) / 100,
    fontSize: 24,
    color: "#2A9D8F",
  },
  h2: {
    marginTop: H * 0.02,
    fontSize: 20,
    color: "#AAB0B6",
  },
  containerBox: {
    marginTop: H * 0.09,
  },
  textBox: {
    fontSize: 14,
    lineHeight: 14,
    color: "#264653",
  },
  boxSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  Icon: {
    position: "absolute",
    zIndex: 9,
    right: 16,
  },
  input: {
    flex: 1,
    marginTop: (H * 4) / 667,
    width: W,
    paddingLeft: (H * 16) / 667,
    paddingRight: 48,
    backgroundColor: "#FFFFFF",
    height: (H * 48) / 667,
    color: "#424242",
    borderStyle: "solid",
    borderRadius: 8,
    borderColor: "#DFDFDF",
    borderWidth: 1,
  },
  inputActive: {
    flex: 1,
    marginTop: (H * 4) / 667,
    width: W,
    padding: (H * 16) / 667,
    backgroundColor: "#FFFFFF",
    height: (H * 48) / 667,
    color: "#424242",
    borderStyle: "solid",
    borderRadius: 8,
    borderColor: "#2A9D8F",
    borderWidth: 1,
    shadowColor: "#2A9D8F",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
  },
  btnSubmit: {
    color: "#fff",
    height: (H * 48) / 667,
    backgroundColor: "#2A9D8F",
    borderRadius: 8,
    padding: (H * 10) / 667,
  },
  textSubmit: {
    fontFamily: "bold",
    fontSize: 18,
    color: "#fff",
    alignItems: "center",
    textAlign: "center",
  },
  containerBoxSubmit: {
    marginTop: (H * 16) / 667,
    marginBottom: (H * 32) / 667,
  },
});
