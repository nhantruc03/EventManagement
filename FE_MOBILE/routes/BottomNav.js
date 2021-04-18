import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import Homescreen from "../screens/Home";
import Eventscreen from "../screens/Event";
import Taskscreen from "../screens/Task";
import Profilescreen from "../screens/Profile";
import EventDetail2 from "../screens/EventDetails2";
import scriptdetail from "../screens/scriptdetail";
import StackNav from "../routes/StackNav";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import { View } from "react-native";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

// function TabEvent() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Events"
//         component={Eventscreen}
//         options={{
//           headerShown: false,
//           headerStyle: {
//             backgroundColor: "#2A9D8F",
//           },
//         }}
//       />
//       <Stack.Screen
//         name="EventDetail2"
//         component={EventDetail2}
//         options={{
//           headerStyle: {
//             backgroundColor: "#2A9D8F",
//           },
//           headerTitleStyle: {},
//           headerBackTitleVisible: false,
//           headerTintColor: "#fff",
//         }}
//       />
//       <Stack.Screen
//         name="scriptdetail"
//         component={scriptdetail}
//         options={{
//           headerStyle: {
//             backgroundColor: "#2A9D8F",
//           },
//           headerTitleStyle: {},
//           headerBackTitleVisible: false,
//           headerTintColor: "#fff",
//           headerRight: () => (
//             <View>
//               <TouchableOpacity
//                 onPress={() => {
//                   this.setState({ visible: true });
//                 }}
//                 style={styles.Icon}
//               >
//                 <Image source={require("../assets/images/edit.png")} />
//               </TouchableOpacity>
//             </View>
//           ),
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

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
          component={Homescreen}
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

              let temp_list = ["EventDetail2", "scriptdetail", "Phòng hội thoại"]
              if (temp_list.includes(routeName)) {
                return false
              } else {
                return true
              }
            })(route),
          })}
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
    );
  }
}
