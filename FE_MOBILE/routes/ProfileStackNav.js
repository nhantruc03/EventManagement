import React, { Component } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Profilescreen from "../screens/ProfileScreens/Profile";
import Loginscreen from "../screens/Login";
import ProfileDetail from "../screens/ProfileScreens/ProfileDetail";




const Stack = createStackNavigator();

class ProfileStackNav extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Profile"
                    component={Profilescreen}
                    options={{
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: "#2A9D8F",
                        },
                    }}
                />
                <Stack.Screen
                    name="ProfileDetail"
                    component={ProfileDetail}
                    options={{
                        title: "Thông tin",
                        headerStyle: {
                            backgroundColor: "#2A9D8F",
                        },
                        headerTitleStyle: {},
                        headerBackTitleVisible: false,
                        headerTintColor: "#fff",
                    }}
                />
                <Stack.Screen
                    name="Login"
                    component={Loginscreen}
                    options={{ headerShown: false }}
                />

            </Stack.Navigator>
        );
    }
}

export default ProfileStackNav;
