import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomNav from "../routes/BottomNav";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/Login";

const Stack = createStackNavigator();

export default class AppMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="SplashScreen"
                        component={SplashScreen}
                        // Hiding header for Splash Screen
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="BottomNav"
                        component={BottomNav}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
