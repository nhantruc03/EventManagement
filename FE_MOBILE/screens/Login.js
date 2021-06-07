import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import getToken from "../Auth";
import Icon from "../assets/images/Show.png";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import Url from "../env";
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import { Redirect } from 'react-router';
import auth from '../router/auth'
import ValidationComponent from 'react-native-form-validator';
import { KeyboardAvoidingView } from 'react-native';
import Loader from 'react-native-modal-loader';

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;


export default class Login extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showPassword: true,
      focusInputType: "",
      loggined: false,
      Loading: false,
    };
  }

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    let data = {
      push_notification_token: token
    }
    let login = await AsyncStorage.getItem("login");
    var obj = JSON.parse(login);
    await
      axios.put(`${Url()}/api/users/updatePushToken/` + obj.id, data, {
        headers: {
          'Authorization': await getToken()
        }
      })
        .then(async res => {
          obj.push_notification_token = data.push_notification_token
          await AsyncStorage.removeItem("login");
          await AsyncStorage.setItem("login", JSON.stringify(obj));
          console.log("update success");
        })
        .catch(err => {
          console.log(err.response.data)
          console.log("update fails");
        })
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  // async componentDidMount() {

  // }

  onLoading() {
    this.setState({
      Loading: true,
    });
  }
  handleSubmitPress = async () => {
    let temp_validate = this.validate({
      username: { minlength: 3, required: true },
      password: { minlength: 3, required: true },
    });

    if (temp_validate) {
      this.setState({
        Loading: true
      })
      var data = new FormData();

      data.append("username", this.state.username);
      data.append("password", this.state.password);
      let result = await axios
        .post(`${Url()}/api/users/login`, data)
        .then(async (res) => {
          if (res.data.success === true) {
            await auth.login(res.data.data);
            if (await auth.isAuthenticatedAdmin() === true) {
              var login = await AsyncStorage.getItem('login');
              if (login !== null) {
                this.setState({
                  loggined: true,
                  Loading: false,
                })
              }
            }
            else {
              alert("Đăng nhập thất bại! Vui lòng đăng nhập lại");
            }
          } else {
            alert("Đăng nhập thất bại! Vui lòng đăng nhập lại");
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Đăng nhập thất bại! Vui lòng đăng nhập lại");
        });
    }


  };

  setUsernameFocusInputType = () => {
    this.setState({
      focusInputType: "username"
    })
  }
  setPasswordFocusInputType = () => {
    this.setState({
      focusInputType: "password"
    })
  }
  onChangeUsername = (e) => {
    this.setState({
      username: e
    })
  }
  onChangePassword = (e) => {
    this.setState({
      password: e
    })
  }


  render() {
    if (this.state.loggined) {
      return (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      )
    }
    else return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >

          <View style={styles.formcontainer}>
            <Loader loading={this.state.Loading} color="white" size="large" />
            <Text style={styles.h1}>XIN CHÀO</Text>
            <Text style={styles.h2}>Đăng nhập để tiếp tục</Text>
            <View
              style={{ marginBottom: (H * 21) / 667, marginTop: (H * 40) / 667 }}
            >
              <Text style={styles.textBox}>Tên đăng nhập</Text>
              <View style={styles.boxSection}>
                <TextInput
                  ref="username"
                  onFocus={this.setUsernameFocusInputType}
                  style={
                    this.state.focusInputType === "username" ? styles.inputActive : styles.input
                  }
                  placeholder="Nhập tên đăng nhập của bạn"
                  onChangeText={this.onChangeUsername}
                  value={this.state.username}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                />
              </View>
              {this.isFieldInError('username') && this.getErrorsInField('username').map((errorMessage, key) =>
                <Text style={styles.error} key={key}>
                  {errorMessage}
                </Text>
              )}
            </View>

            <View>
              <Text style={styles.textBox}>Mật khẩu</Text>
              <View style={styles.boxSection}>
                <TouchableOpacity
                  style={styles.Icon}
                  onPress={() => this.setState({ showPassword: !this.state.showPassword })}
                >
                  <Image source={Icon} />
                </TouchableOpacity>

                <TextInput
                  ref="password"
                  onFocus={this.setPasswordFocusInputType}
                  style={
                    this.state.focusInputType == "password" ? styles.inputActive : styles.input
                  }
                  placeholder="Nhập mật khẩu của bạn"
                  onChangeText={this.onChangePassword}
                  value={this.state.password}
                  secureTextEntry={this.state.showPassword}
                  underlineColorAndroid="transparent"
                />
              </View>
              {this.isFieldInError('password') && this.getErrorsInField('password').map((errorMessage, key) =>
                <Text style={styles.error} key={key}>
                  {errorMessage}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => {
                this.props.history.push('/forgotpassword')
              }}>
                <Text style={styles.forgot}>Quên mật khẩu ?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.containerBoxSubmit}>
              <TouchableOpacity

                onPress={this.handleSubmitPress}
                title="Đăng nhập"
                style={styles.btnSubmit}
                underlayColor="#fff"
              >
                <Text style={styles.textSubmit}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}




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
    alignItems: 'center',
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
  forgot: {
    fontFamily: "semibolditalic",
    fontSize: 14,
    color: '#2495D1',
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
  error: {
    color: "red",
    fontFamily: "semibold",
    fontSize: 12,
  }
});
