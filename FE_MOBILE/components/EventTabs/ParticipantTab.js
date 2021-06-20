import React, { Component } from "react";
import { SafeAreaView, View, Text, Image, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Search from "../helper/search";
import Url from "../../env";

import { RefreshControl } from 'react-native';

import getToken from "../../Auth";
import axios from "axios";
import { Redirect } from "react-router";
import ApiFailHandler from '../helper/ApiFailHandler'

const styles = StyleSheet.create({
    Container: {
        backgroundColor: "#F6F7F8",
    },
    AvaImg: {
        width: 48,
        height: 48,
        borderRadius: 40,
    },
    ListContainer: {
        backgroundColor: "#F6F7F8",
    },
    itemContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 8,
        paddingVertical: 16,
    },
    secondColumn: {
        flex: 2,
        flexDirection: "column",
        marginLeft: 8,
    },
    seperator: {
        backgroundColor: "#D3D3D3",
        height: 0.5,
    },
    textName: {
        fontFamily: "semibold",
        fontSize: 16,
        color: "#264653",
    },
    textMssv: {
        fontFamily: "regular",
        fontSize: 12,
        color: "#AAB0B6",
    },
    textPhone: {
        fontFamily: "semibold",
        fontSize: 14,
        color: "#AAB0B6",
    },
});

class ParticipantTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            error: null,
            search: null,
            SearchData: [],
            loading: true,
            refreshing: false,
            loggout: false,
        };
    }

    componentDidMount() {
        this.setState({
            loading: this.props.loading,
            data: this.props.data,
            SearchData: this.props.data,
        });
    }

    onRefresh = async () => {
        this.setState({
            refreshing: true,
        });
        await axios
            .post(
                `${Url()}/api/participants/getAll`,
                { eventId: this.props.eventId },
                {
                    headers: {
                        Authorization: await getToken(),
                    },
                }
            )
            .then((res) => {
                this.setState({
                    refreshing: false,
                    SearchData: res.data.data
                });
            })
            .catch(err => {
                let errResult = ApiFailHandler(err.response?.data?.error)
                this.setState({
                    loggout: errResult.isExpired
                })
            });
    }

    getSearchData1 = (data) => {
        this.setState({
            SearchData: data,
        });
    };

    renderList = () => {

        if (this.state.data.length > 0) {
            return (
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    style={styles.ListContainer}
                    data={this.state.SearchData}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <View style={styles.secondColumn}>
                                <Text style={styles.textName}>{item.name}</Text>
                                <Text style={styles.textMssv}>{item.mssv}</Text>
                            </View>
                            <View style={styles.thirdColumn}>
                                <Text style={styles.textPhone}>{item.phone}</Text>
                            </View>
                            <View style={styles.seperator} />
                        </View>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.seperator} />}
                    keyExtractor={(item) => item._id}
                ></FlatList>
            );
        }
    };

    render() {

        if (this.state.loggout) {
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                    }}
                />
            )
        } else {
            return (
                <SafeAreaView style={styles.Container}>
                    <Search
                        target="name"
                        data={this.state.data}
                        getSearchData={(e) => this.getSearchData1(e)}
                    ></Search>
                    {this.renderList()}
                </SafeAreaView>
            );
        }
    }
}

export default ParticipantTab;
