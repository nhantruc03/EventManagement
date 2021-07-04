import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Notiscreen from "../screens/Notification";
import EventDetail2 from "../screens/EventScreens/EventDetails2";
import TaskDetail from "../screens/TaskScreens/TaskDetail";
import scriptview from "../screens/EventScreens/scriptview";
import history from "../screens/EventScreens/history";

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
class NotiStackNav extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Notification"
                    // component={Noticreen}
                    children={({ navigation }) => <Notiscreen navigation={navigation} updateNoti={(e) => this.props.updateNoti(e)} data={this.props.data} currentPermissions={this.props.currentPermissions} />}
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
                        title: "Chi tiết sự kiện",
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
                <Stack.Screen
                    name="scriptview"
                    component={scriptview}
                    options={{
                        title: "Theo dõi kịch bản",
                        headerStyle: {
                            backgroundColor: "#2A9D8F",
                        },
                        headerTitleStyle: {},
                        headerBackTitleVisible: false,
                        headerTintColor: "#fff",
                    }}
                />
                <Stack.Screen
                    name="history"
                    component={history}
                    options={{
                        title: "Lịch sử thay đổi",
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

export default NotiStackNav;
