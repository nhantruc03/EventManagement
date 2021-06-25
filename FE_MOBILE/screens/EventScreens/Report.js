import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import axios from "axios";
import Url from "../../env";
import getToken from '../../Auth';
import getPermission from '../../components/helper/Credentials';
import ApiFailHandler from '../../components/helper/ApiFailHandler';
import { Redirect } from "react-router";
import checkPermisson from "../../components/helper/checkPermissions";
import * as constants from "../../components/constant/action";
import { StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Indicator from "../../components/helper/Loading";

import { TabView, SceneMap } from "react-native-tab-view";
import { TabBar } from "react-native-tab-view";
import Thongke from '../../components/ReportTab/Thongke';
import Tainguyen from '../../components/ReportTab/Tainguyen';
import { Button } from '@ant-design/react-native';

const styles = StyleSheet.create({
    IconRight: {
        right: 16
    },
    btnUpdate: {
        color: "#fff",
        height: 48,
        backgroundColor: "#2A9D8F",
        borderRadius: 8,
        padding: 12,
        margin: 16,
    },
    textUpdate: {
        color: "white",
        textAlign: "center",
        fontFamily: "bold",
        fontSize: 16,
    },
    Label: {
        fontFamily: "semibold",
        fontSize: 20,
        color: "#2A9D8F"
    },
    cardContainer: {
        backgroundColor: "white",
        padding: 16,
        marginVertical: 8,
        borderRadius: 12,
    },
    subLabel: {
        color: "#AAB0B6",
        fontFamily: "semibold",
        fontSize: 16,
    },
    mainNumber: {
        color: '#264653',
        fontFamily: 'semibold',
        fontSize: 24,
        marginRight: 4
    },
    unitLabel: {
        color: "black",
        fontFamily: 'semibold',
        fontSize: 14
    },
    chartContainer: {
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },
    progressBar: {
        height: 80,
        width: 80,
        marginRight: 8
    },
    chartNum: {
        fontFamily: 'semibold',
        fontSize: 24,
        color: 'black'
    },
    chartText: {
        fontFamily: 'semibold',
        fontSize: 16,
        color: '#AAB0B6'
    },
    Tabcontainer: {
        flex: 2,
        height: 50,
    },
    LoadingBtn: {
        borderRadius: 8,
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignContent: "center",
    },
})

const initialLayout = { width: Dimensions.get("window").width };

export default class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            currentPermissions: [],
            loggout: false,
            loading: false,
            loadingbtn: false,
            refreshing: false,
            index: 0,
            routes: [
                { key: "1", title: "Thống kê" },
                { key: "2", title: "Tài nguyên" },
            ],
        };
        this.renderScene = SceneMap({
            1: this.Route1,
            2: this.Route2,
        });
    }

    Route1 = () =>
        <Thongke
            data={this.state.data}
            eventId={this.props.route.params.id}
            loadingbtn={this.state.loadingbtn}
        />;
    Route2 = () =>
        <Tainguyen
            data={this.state.data}
            eventId={this.props.route.params.id}
        />;




    async componentDidMount() {

        this._isMounted = true;
        const [report, permissons] = await (Promise.all([
            axios.get(`${Url()}/api/event-reports/` + this.props.route.params.id, {
                headers: {
                    'Authorization': await getToken()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    let errResult = ApiFailHandler(err.response?.data?.error)
                    this.setState({
                        loggout: errResult.isExpired
                    })
                }),
            getPermission(this.props.route.params.id).then(res => res),
        ]));




        if (this._isMounted) {
            this.setState({
                data: report,
                currentPermissions: permissons,
                loading: true,
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    createReport = async () => {
        this.setState({
            loadingbtn: true,
            visible: true
        })
        const data = await (
            axios.post(`${Url()}/api/event-reports/`, { eventId: this.props.route.params.id }, {
                headers: {
                    'Authorization': await getToken()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    let errResult = ApiFailHandler(err.response?.data?.error)
                    this.setState({
                        loggout: errResult.isExpired
                    })
                })
        )
        this.setState({
            data,
            loadingbtn: false,
        })
    }

    onRefresh = async () => {
        this.setState({
            refreshing: true,
        });
        const data = await (
            axios.post(`${Url()}/api/event-reports/`, { eventId: this.props.route.params.id }, {
                headers: {
                    'Authorization': await getToken()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    let errResult = ApiFailHandler(err.response?.data?.error)
                    this.setState({
                        loggout: errResult.isExpired
                    })
                })
        )
        this.setState({
            data,
            refreshing: false,
        })
    }

    renderTabBar = (props) => (
        <TabBar
            {...props}
            tabStyle={{ width: 180 }}
            indicatorStyle={{ backgroundColor: "#2A9D8F", height: 4 }}
            activeColor="#2A9D8F"
            inactiveColor="#AAB0B6"
            style={{
                backgroundColor: "F6F7F8",
                paddingVertical: 5,
            }}
            scrollEnabled={true}
        />
    );
    setIndex = (index) => {
        this.setState({
            index,
        });
    };

    renderCreateBtn = () => {
        if (!this.state.loadingbtn) {
            if (checkPermisson(this.state.currentPermissions, constants.QL_SUKIEN_PERMISSION)) {
                return (
                    <TouchableOpacity
                        style={styles.btnUpdate}
                        underlayColor="#fff"
                        onPress={this.createReport}
                    >
                        <Text style={styles.textUpdate}>Tạo báo cáo mới</Text>
                    </TouchableOpacity>
                )
            } else return null
        }
        else return (
            <Button loading style={styles.LoadingBtn}>loading</Button>
        )
    }

    render() {
        if (this.state.loggout) {
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                    }}
                />
            )
        }
        else {
            if (this.state.loading) {
                if (this.state.data) {
                    return (
                        <TabView
                            renderTabBar={this.renderTabBar}
                            navigationState={{
                                index: this.state.index,
                                routes: this.state.routes,
                            }}
                            renderScene={this.renderScene}
                            onIndexChange={this.setIndex}
                            initialLayout={initialLayout}
                            style={styles.Tabcontainer}
                        />

                    );
                }
                else
                    if (this.state.currentPermissions) {
                        return (
                            <View>
                                {this.renderCreateBtn}
                            </View>
                        )
                    }
            }
            else
                return <Indicator />
        }
    }
}
