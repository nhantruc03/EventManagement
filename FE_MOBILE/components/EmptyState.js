import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, Text, StyleSheet, Animated } from 'react-native';

const styles = StyleSheet.create({
    Container: {
        justifyContent: "center",
        position: "absolute",
        left: 0,
        top: 50,
        right: 0,
        bottom: 0,
        alignItems: "center",
    },
    Text: {
        fontFamily: "bold",
        fontSize: 24,
        color: "#AAB0B6"
    }
})

class EmptyState extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.Container}>

                <Text style={styles.Text}>Vui lòng chọn sự kiện</Text>
                <View><Image source={require("./../assets/images/box.png")}></Image></View>

            </View>
        );
    }
}

export default EmptyState;
