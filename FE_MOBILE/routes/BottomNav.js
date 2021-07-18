import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
import React from "react";
import { StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileStackNav from "../routes/ProfileStackNav";
import Calendarscreen from "../screens/Calendar";
import StackNav from "../routes/StackNav";
import TaskStackNav from "../routes/TaskStackNav";
import HomeStackNav from "../routes/HomeStackNav";
import NotiStackNav from "../routes/NotiStackNav";
import { createStackNavigator } from "@react-navigation/stack";
import getPermission from "../components/helper/Credentials"
//import API
import WSK from "../websocket";
import Url from "../env";
import axios from "axios";
import getToken from "../Auth";
import ApiFailHandler from '../components/helper/ApiFailHandler'
import { Redirect } from "react-router";
import { fas } from "@fortawesome/free-solid-svg-icons";

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
      currentPermissions: [],
      loggout: false,
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

            dataFromServer.notifications.forEach((e) => {
              if (e.userId._id === this.state.currentUser.id) {
                this.setState({
                  notifications: [e, ...this.state.notifications],
                });
              }
            });
          }
        } else if (dataFromServer.type === "sendNotification") {
          if (
            dataFromServer.notification.userId._id === this.state.currentUser.id
          ) {
            this.setState({
              notifications: [dataFromServer.notification, ...this.state.notifications],
            });
          }
        }
      };

      const [notifications, permissions] = await Promise.all([
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
          .then((res) => res.data.data)
          .catch(err => {
            let errResult = ApiFailHandler(err.response?.data?.error)
            this.setState({
              loggout: errResult.isExpired
            })
          }),
        getPermission(obj.id).then(res => res)
      ]);

      if (notifications !== null) {
        if (this._isMounted) {
          this.setState({
            notifications: notifications.reverse(),
            currentUser: obj,
            currentPermissions: permissions
          });
        }
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // updateNoti = (e, id, url) => {
  //   e.preventDefault();
  //   let data = {
  //     status: true,
  //     _id: id,
  //   };
  //   axios
  //     .put("/api/notifications", data, {
  //       headers: {
  //         Authorization: AUTH(),
  //       },
  //     })
  //     .then((res) => console.log(res.data.data));

  //   this.setState({
  //     notiUrl: url,
  //     onNoti: true,
  //   });
  // };
  updateNoti = (e) => {
    let temp = this.state.notifications;
    temp.forEach(x => {
      if (e._id === x._id) {
        x.status = e.status
      }
    })
    this.setState({
      notifications: temp
    })
  }

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
      .then((res) => res.data.data)
      .catch(err => {
        let errResult = ApiFailHandler(err.response?.data?.error)
        this.setState({
          loggout: errResult.isExpired
        })
      });

    let temp = this.state.notifications;
    temp.map((e) => (e.watch = true));
    this.setState({
      notifications: temp,
    });
  };

  render() {
    if (this.state.loggout) {
      return (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )
    } else {
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
              tabBarIcon: ({ focused, color }) => (
                //<FontAwesomeIcon icon={faHome} size={24} color={color} />
                //<HomeIcon color={color} />
                <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
              ),
              tabBarVisible: ((route) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                let temp_list = [
                  "EventDetail2",
                  "Report",
                  "scriptdetail",
                  "Phòng hội thoại",
                  "scriptview",
                  "history",
                  "CreateTask", "TaskDetail", "EditTask",
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
            name="Event"
            component={StackNav}
            options={({ route }) => ({
              //tabBarLabel: "Sự kiện",
              tabBarIcon: ({ focused, color }) => (
                //<FontAwesomeIcon icon={faHome} size={24} color={color} />
                <Ionicons name={focused ? 'star' : 'star-outline'} size={24} color={color} />
              ),
              tabBarVisible: ((route) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                let temp_list = [
                  "EventDetail2",
                  "Report",
                  "scriptdetail",
                  "Phòng hội thoại",
                  "scriptview",
                  "history"
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
              tabBarIcon: ({ focused, color }) => (
                <Ionicons name={focused ? 'reader' : 'reader-outline'} size={24} color={color} />
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
              tabBarIcon: ({ focused, color }) => (
                <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Notification"
            // component={NotiStackNav}
            children={() => <NotiStackNav updateNoti={(e) => this.updateNoti(e)} data={this.state.notifications} currentPermissions={this.state.currentPermissions} />}
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
              tabBarIcon: ({ focused, color }) => (
                <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={24} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Profile"
            component={ProfileStackNav}
            options={({ route }) => ({
              tabBarIcon: ({ focused, color }) => (
                <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
              ),
              tabBarVisible: ((route) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                let temp_list = ["ProfileDetail", "Login"];
                if (temp_list.includes(routeName)) {
                  return false;
                } else {
                  return true;
                }
              })(route),
            })}

          />
        </Tab.Navigator>
      );
    }
  }
}
