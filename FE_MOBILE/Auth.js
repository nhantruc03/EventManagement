import AsyncStorage from "@react-native-community/async-storage";

export default async function getToken() {
  try {
    var login = await AsyncStorage.getItem("login");
    var obj = JSON.parse(login);
    AUTH = obj.token;
    // console.log("AUTH", AUTH);
    return AUTH;
  } catch (e) {
    console.log(e);
  }
}
