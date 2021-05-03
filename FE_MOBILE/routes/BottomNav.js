import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import Profilescreen from "../screens/Profile";
import Calendarscreen from "../screens/Calendar";
import Notificationscreen from "../screens/Notification";
import StackNav from "../routes/StackNav";
import TaskStackNav from "../routes/TaskStackNav";
import HomeStackNav from "../routes/HomeStackNav";
import NotiStackNav from "../routes/NotiStackNav";
import { createStackNavigator } from "@react-navigation/stack";
import WSK from "../websocket";
import Url from "../env";
import axios from "axios";
import getToken from "../Auth";
const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  // Icon: {
  //   zIndex: 9,
  //   right: 16,
  // },
});

const client = new WebSocket(`${WSK()}`);
export default class BottomNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      notifications: [],
      info_pass: false,
      onNoti: false,
      notiUrl: "",
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      var login = await AsyncStorage.getItem("login");
      var obj = JSON.parse(login);

      client.onopen = () => {
        console.log("Connect to ws");
      };

      client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        if (dataFromServer.type === "sendListNotifications") {
          if (dataFromServer.notifications.length > 0) {
            // console.log(dataFromServer.message)
            dataFromServer.notifications.forEach((e) => {
              if (e.userId === this.state.currentUser.id) {
                this.setState({
                  notifications: [...this.state.notifications, e],
                });
              }
            });
          }
        } else if (dataFromServer.type === "sendNotification") {
          if (
            dataFromServer.notification.userId === this.state.currentUser.id
          ) {
            this.setState({
              notifications: [
                ...this.state.notifications,
                dataFromServer.notification,
              ],
            });
          }
        }
      };

      const [notifications] = await Promise.all([
        axios
          .post(
            `${Url()}/api/notifications/getAll`,
            { userId: obj.id },
            {
              headers: {
                Authorization: await getToken(),
              },
            }
          )
          .then((res) => res.data.data),
      ]);

      if (notifications !== null) {
        if (this._isMounted) {
          this.setState({
            notifications: notifications,
            currentUser: obj,
          });
        }
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateNoti = (e, id, url) => {
    e.preventDefault();
    let data = {
      status: true,
      _id: id,
    };
    axios
      .put("/api/notifications", data, {
        headers: {
          Authorization: { AUTH }.AUTH,
        },
      })
      .then((res) => console.log(res.data.data));

    this.setState({
      notiUrl: url,
      onNoti: true,
    });
  };

  OnTabPress = async () => {
    axios
      .put(
        `${Url()}/api/notifications`,
        { userId: this.state.currentUser.id, watch: true },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => res.data.data);

    let temp = this.state.notifications;
    temp.map((e) => (e.watch = true));
    this.setState({
      notifications: temp,
    });
  };

  render() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          showLabel: false,
          labelStyle: {
            fontSize: 12,
            fontFamily: "bold",
          },
          activeTintColor: "#2A9D8F",
          activeBackgroundColor: "",
          inactiveTintColor: "#868686",
          indicatorStyle: { height: 3 },
          sceneContainerStyle: {
            borderTopColor: "#2A9D8F",
            borderTopWidth: 2,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNav}
          options={({ route }) => ({
            //tabBarLabel: "Trang chủ",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={color} />
              //<Home1 width={120} height={40} color={color} />
            ),
          })}
        />
        <Tab.Screen
          name="Event"
          component={StackNav}
          options={({ route }) => ({
            //tabBarLabel: "Sự kiện",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={color} />
            ),
            tabBarVisible: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";

              let temp_list = [
                "EventDetail2",
                "scriptdetail",
                "Phòng hội thoại",
                "scriptview",
              ];
              if (temp_list.includes(routeName)) {
                return false;
              } else {
                return true;
              }
            })(route),
          })}
        />
        <Tab.Screen
          name="Task"
          component={TaskStackNav}
          options={({ route }) => ({
            //tabBarLabel: "Công việc",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={color} />
            ),
            tabBarVisible: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";

              let temp_list = ["CreateTask", "TaskDetail", "EditTask"];
              if (temp_list.includes(routeName)) {
                return false;
              } else {
                return true;
              }
            })(route),
          })}
        />
        <Tab.Screen
          name="Calendar"
          component={Calendarscreen}
          options={{
            //tabBarLabel: "Lịch",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          // component={NotiStackNav}
          children={() => <NotiStackNav data={this.state.notifications} />}
          listeners={{
            tabPress: (e) => {
              // Prevent default action
              this.OnTabPress();
            },
          }}
          options={{
            tabBarBadge:
              this.state.notifications.filter((e) => e.watch === false).length >
                0
                ? this.state.notifications.filter((e) => e.watch === false)
                  .length
                : undefined,
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profilescreen}
          options={{
            //tabBarLabel: "Hồ sơ",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
