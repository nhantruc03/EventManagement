import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        borderRadius: 6,
        elevation: 3,
        backgroundColor: "#fff",
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#333",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: "space-between",

    },
    content: {
        padding: 12
    },
    nameText: {
        fontFamily: "semibold",
        fontSize: 16,
        color: "#313131",
    },
    timeText: {
        fontFamily: "semibold",
        fontSize: 16,
        color: "#9B9B9B",
    },
    borderRight: {

        borderRightColor: "#E76F51",
        borderRightWidth: 4,
        borderRadius: 5,
        height: 50,
        alignSelf: "center"
    }
})

export default class SubActionItems extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.nameText}>{this.props.data.name}</Text>
                    <Text style={styles.timeText}>{moment(this.props.endTime).format("HH:MM")}</Text>
                </View>
                <View style={styles.borderRight} />
            </View>
        );
    }
}
