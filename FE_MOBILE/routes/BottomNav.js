import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import Homescreen from "../screens/Home";
import Profilescreen from "../screens/Profile";
import StackNav from "../routes/StackNav";
import TaskStackNav from "../routes/TaskStackNav";
import HomeStackNav from "../routes/HomeStackNav";
import { createStackNavigator } from "@react-navigation/stack";

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

export default class BottomNav extends React.Component {
  render() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: 12,

            fontFamily: "bold",
          },
          activeTintColor: "#2A9D8F",
          inactiveTintColor: "#868686",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNav}
          options={({ route }) => ({
            tabBarLabel: "Trang chủ",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={color} />
            ),
          })}
        />
        <Tab.Screen
          name="Event"
          component={StackNav}
          options={({ route }) => ({
            tabBarLabel: "Sự kiện",
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
            tabBarLabel: "Công việc",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={color} />
            ),
            tabBarVisible: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";

              let temp_list = ["CreateTask", "TaskDetail"];
              if (temp_list.includes(routeName)) {
                return false;
              } else {
                return true;
              }
            })(route),
          })}
        />
        <Tab.Screen
          name="Profile"
          component={Profilescreen}
          options={{
            tabBarLabel: "Hồ sơ",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
