import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import { Button, View, Text, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import Url from "../../env";
import moment from "moment";
import getToken from "../../Auth";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Indicator from '../../components/helper/Loading';
const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  UserContainer: {
    alignItems: "center",
    marginTop: 40
  },
  avaImg: {
    width: 80,
    height: 80,
    borderRadius: 50
  },
  NameText: {
    fontFamily: "bold",
    fontSize: 32,
    color: "black",
    marginTop: 12,
  },
  EmailText: {
    fontSize: "bold",
    fontSize: 16,
    color: "#AAB0B6",
  },
  statusContainer: {
    marginTop: 16,
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 8,

  },
  statusContent: {
    width: "100%",
    alignItems: "center",
    borderRadius: 12,
    borderColor: "#DFDFDF",
    borderWidth: 2,
    backgroundColor: "white",
    paddingVertical: 8
  },
  taskContent: {
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 12,
    borderColor: "#DFDFDF",
    borderWidth: 2,
    backgroundColor: "white",
  },
  numberContent: {
    fontFamily: "bold",
    fontSize: 32,
    color: "#2A9D8F"
  },
  textContent: {
    fontFamily: "semibold",
    fontSize: 14,
    color: "#AAB0B6",
    maxWidth: "70%",
    textAlign: "center"
  },
  separator: {
    marginVertical: 8,
    marginHorizontal: 100,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  BtnContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  BtnContent: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  TextUserInfo: {
    marginLeft: 8,
    fontFamily: "semibold",
    fontSize: 16,
    color: "black"
  },
  TextLogout: {
    marginLeft: 8,
    fontFamily: "semibold",
    fontSize: 16,
    color: "#EB5757"
  },
  statusItemContainer: {
    width: "50%",
    paddingHorizontal: 8
  },
  taskItemContainer: {
    padding: 16
  }
})

class Profilescreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: "",
      isLoading: true,
      data_ongoing: [],
      data_future: [],
      listTasks: [],
    };
    this._isMounted = false;
  }
  async Logout() {
    await AsyncStorage.removeItem("login");
    this.props.navigation.navigate("Login");
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.route.params?.data !== this.props.route.params?.data) {
      const result = this.props.route.params?.data;
      this.setState({
        data: result
      })
    }
  }

  async componentDidMount() {
    this._isMounted = true;
    let login = await AsyncStorage.getItem("login");
    var obj = JSON.parse(login);
    let temp = moment(new Date()).format("YYYY-MM-DD");
    const [future_event, ongoing_event, listactions, user] = await Promise.all([
      axios
        .post(
          `${Url()}/api/events/getAll?gt=${temp}`,
          { isClone: false, availUser: obj.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
      axios
        .post(
          `${Url()}/api/events/getAll?eq=${temp}`,
          { isClone: false, availUser: obj.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
      axios
        .post(
          `${Url()}/api/actions/getAll`,
          { availUser: obj.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
      axios.get(`${Url()}/api/users/` + obj.id, {
        headers: {
          'Authorization': await getToken()
        }
      })
        .then((res) =>
          res.data.data
        )
    ]);


    let ListNotCompletedTask = []
    if (listactions !== undefined) {
      await Promise.all(
        listactions.map(async e => {
          let ListSubActions = await axios.post(`${Url()}/api/sub-actions/getAll`, { actionId: e._id }, {
            headers: {
              'Authorization': await getToken()
            }
          })
            .then((res) =>
              res.data.data
            )
          let temp = ListSubActions.filter(x => x.status === false)
          if (temp.length > 0) {
            ListNotCompletedTask.push(e)
          }

        })
      )
    }

    if (this._isMounted) {
      this.setState({
        data: user,
        data_ongoing: ongoing_event,
        data_future: future_event,
        listTasks: ListNotCompletedTask,
        isLoading: false,
      })
    }
  }
  render() {
    if (!this.state.isLoading) {
      return (
        <View style={styles.Container}>
          <View style={styles.UserContainer}>
            <TouchableOpacity>
              <Image
                style={styles.avaImg}
                source={{
                  uri: `${Url()}/api/images/${this.state.data.photoUrl}`,
                }}
              />
            </TouchableOpacity>
            <Text style={styles.NameText}>{this.state.data.name}</Text>
            <Text style={styles.EmailText}>{this.state.data.email}</Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusItemContainer}>
              <View style={styles.statusContent}>
                <Text style={styles.numberContent}>{this.state.data_ongoing.length}</Text>
                <Text style={styles.textContent}>Sự kiện đang diễn ra</Text>
              </View>
            </View>
            <View style={styles.statusItemContainer}>
              <View style={styles.statusContent}>
                <Text style={styles.numberContent}>{this.state.data_future.length}</Text>
                <Text style={styles.textContent}>Sự kiện sắp diễn ra</Text>
              </View>
            </View>
          </View>

          <View style={styles.taskItemContainer}>
            <View style={styles.taskContent}>
              <Text style={styles.numberContent}>{this.state.listTasks.length}</Text>
              <Text style={styles.textContent}>Công việc chưa hoàn thành</Text>
            </View>
          </View>

          <View style={styles.separator}></View>
          <View style={styles.BtnContainer}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate("ProfileDetail", {
                data: this.state.data
              })
            }}>
              <View style={styles.BtnContent}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name='information-circle-outline' size={24} color='black' />
                  <Text style={styles.TextUserInfo}>Thông tin người dùng</Text>
                </View>

              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.BtnContainer}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate("Login")
            }}>
              <View style={styles.BtnContent}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name='exit-outline' size={24} color='#EB5757' />
                  <Text style={styles.TextLogout}>Đăng xuất</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View >
      );
    } else return <Indicator />;
  }
}

export default Profilescreen;
