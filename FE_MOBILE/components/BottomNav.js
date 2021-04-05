import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import Homescreen from "../screens/Home";
import Eventscreen from "../screens/Event";
import Taskscreen from "../screens/Task";
import Profilescreen from "../screens/Profile";

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default class BottomNav extends React.Component {
  render() {
    return (
      <NavigationContainer style={styles.container}>
        <Tab.Navigator
          tabBarOptions={{
            labelStyle: {
              fontSize: 12,
              fontWeight: "bold",
            },
            activeTintColor: "#2A9D8F",
            inactiveTintColor: "#868686",
          }}
        >
          <Tab.Screen
            name="Home"
            component={Homescreen}
            options={{
              tabBarLabel: "Trang chủ",
              tabBarIcon: ({ color }) => (
                <FontAwesomeIcon icon={faHome} size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Event"
            component={Eventscreen}
            options={{
              tabBarLabel: "Sự kiện",
              tabBarIcon: ({ color }) => (
                <FontAwesomeIcon icon={faHome} size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Task"
            component={Taskscreen}
            options={{
              tabBarLabel: "Công việc",
              tabBarIcon: ({ color }) => (
                <FontAwesomeIcon icon={faHome} size={24} color={color} />
              ),
            }}
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
      </NavigationContainer>
    );
  }
}
