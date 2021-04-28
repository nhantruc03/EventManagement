import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Separator from "../components/helper/separator";
import axios from 'axios';
import Url from '../env';
import getToken from '../Auth';
const styles = StyleSheet.create({
    toplabel: {
        fontFamily: "bold",
        fontSize: 32,
        paddingTop: 16,
        fontWeight: "500",
        color: "#2A9D8F",
        backgroundColor: "#F6F7F8",
        paddingLeft: 16,
    },
    itemContainer: {
        backgroundColor: "white",
    }
})

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    updateNoti = async (id) => {
        let data = {
            status: true,
            _id: id
        }
        axios.put(`${Url()}/api/notifications`, data, {
            headers: {
                'Authorization': await getToken()
            }
        })
    }

    renderNotificationContent = (e) => {
        const item = e.item;
        if (item.eventId) {
            return (
                <TouchableOpacity onPress={() => {
                    this.updateNoti(item._id)
                    this.props.navigation.navigate("EventDetail2", {
                        data: { _id: item.eventId },
                        loadBySelf: true
                    })
                }}>
                    <Text>{item.name}</Text>
                    <Text>{item.description}</Text>
                </TouchableOpacity>
            )
        }
        else if (item.actionId) {
            return (
                <View style={styles.itemContainer}>
                    <TouchableOpacity onPress={() => {
                        this.updateNoti(item._id)
                        this.props.navigation.navigate("TaskDetail", {
                            actionId: item.actionId,
                            loadBySelf: true
                        })
                    }}>

                        <Text>{item.name}</Text>
                        <Text>{item.description}</Text>

                    </TouchableOpacity >
                </View>

            )
        }
    }

    render() {
        return (
            <View>
                <Text style={styles.toplabel}>Thông báo</Text>
                <FlatList
                    data={this.props.data.reverse()}
                    renderItem={this.renderNotificationContent}
                    keyExtractor={item => item._id}
                />
            </View>
        );
    }
}
