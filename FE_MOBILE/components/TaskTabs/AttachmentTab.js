import React, { Component } from 'react';
import { RefreshControl } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import axios from "axios";
import Url from "../../env";
import getToken from '../../Auth';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiFailHandler from '../helper/ApiFailHandler';
import ResourceUrl from "../../resourceurl"
const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    formLabel: {
        color: "#264653",
        fontFamily: "semibold",
        fontSize: 20,
    },
    listContainer: {
        marginTop: 8,
        padding: 16,
        backgroundColor: "white"
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: 'center'
    },
    FileNameText: {
        fontFamily: "semibold",
        fontSize: 20,
        color: '#264653'
    },
    NameText: {
        fontFamily: 'semibold',
        fontSize: 12,
        color: '#AAB0B6'
    },
    TimeText: {
        fontFamily: 'semibold',
        fontSize: 12,
        color: '#AAB0B6'
    }
})

export default class AttachmentTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            refreshing: false
        };
    }
    componentDidMount() {
        this.setState({
            data: this.props.data
        })
    }

    renderItem = (e) => {
        console.log("data", e)
        return (
            <View style={styles.listContainer}>
                <View style={styles.itemContainer}>
                    <View style={{ padding: 12, backgroundColor: "#2A9D8F", borderRadius: 4, marginRight: 16, alignContent: 'center' }}>
                        < Ionicons name='document' size={24} color='white' />
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.Download(`${ResourceUrl()}${e.item.actionId}/${e.item.url}`, e.item.url)}>
                            <Text numberOfLines={2} style={styles.FileNameText}>{e.item.url}</Text>
                        </TouchableOpacity>
                        <Text style={styles.TimeText}>{moment(e.item.createAt).format("DD/MM/YYYY")}-{""}{moment(e.item.createAt).format("HH:mm")}</Text>
                    </View>
                </View>
            </View>
        )
    }
    Download = async (uri, name) => {
        await WebBrowser.openBrowserAsync(uri);
    }

    onRefresh = async () => {
        this.setState({
            refreshing: true
        })
        await axios
            .post(`${Url()}/api/action-resources/getAll`,
                { actionId: this.props.actionId },
                {
                    headers: {
                        'Authorization': await getToken(),
                    }
                })
            .then((res) =>
                this.setState({
                    refreshing: false,
                    data: res.data.data
                })
            )
            .catch(err => {
                let errResult = ApiFailHandler(err.response?.data?.error)
                this.setState({
                    loggout: errResult.isExpired
                })
            });
    }

    render() {
        if (this.state.data) {
            let listdata = this.state.data
            return (
                <View style={styles.container}>
                    <View><Text style={styles.formLabel}>Danh sách tệp đính kèm</Text></View>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }
                        data={listdata}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item._id}
                    >
                    </FlatList>
                </View>
            );
        }
        else return null
    }
}
