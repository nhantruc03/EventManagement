import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Homescreen from "../screens/Home";
import EventDetail2 from "../screens/EventScreens/EventDetails2";
import TaskDetail from "../screens/TaskScreens/TaskDetail";


// import Modal from "@ant-design/react-native";

const Stack = createStackNavigator();
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
class TaskStackNav extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={Homescreen}
                    options={{
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: "#2A9D8F",
                        },
                    }}
                />
                <Stack.Screen
                    name="EventDetail2"
                    component={EventDetail2}
                    options={{
                        title: "Tạo công việc",
                        headerStyle: {
                            backgroundColor: "#2A9D8F",
                        },
                        headerTitleStyle: {},
                        headerBackTitleVisible: false,
                        headerTintColor: "#fff",
                    }}
                />
                <Stack.Screen
                    name="TaskDetail"
                    component={TaskDetail}
                    options={{
                        title: "Chi tiết công việc",
                        headerStyle: {
                            backgroundColor: "#2A9D8F",
                        },
                        headerTitleStyle: {},
                        headerBackTitleVisible: false,
                        headerTintColor: "#fff",
                    }}
                />
            </Stack.Navigator>
        );
    }
}

export default TaskStackNav;
