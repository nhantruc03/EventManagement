import React, { Component } from 'react';
import { RefreshControl } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from 'react-native-modal-loader';
import { ProgressCircle } from 'react-native-svg-charts'
import axios from "axios";
import Url from "../../env";
import getToken from '../../Auth';
import ApiFailHandler from '../helper/ApiFailHandler';

const styles = StyleSheet.create({

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
})

export default class Thongke extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            refreshing: false,
            loggout: false,
        };
    }
    componentDidMount() {
        this.setState({
            data: this.props.data
        })
    }

    onRefresh = async () => {
        this.setState({
            refreshing: true,
        });
        const data = await (
            axios.post(`${Url()}/api/event-reports/`, { eventId: this.props.eventId }, {
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
    render() {
        if (this.state.data) {
            return (
                <ScrollView

                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }>
                    <Loader loading={this.props.loadingbtn} color="white" size="large" />
                    <View style={{ padding: 16 }}>
                        <Text style={styles.Label}>Thống kê sự kiện</Text>
                        <View>
                            <View style={styles.cardContainer}>
                                <Text style={styles.subLabel}>Ban tổ chức</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Text style={styles.mainNumber}>{this.state.data.eventAssigns}</Text>
                                    <Text style={styles.unitLabel} >thành viên</Text>
                                </View>
                            </View>
                            <View style={styles.cardContainer}>
                                <Text style={styles.subLabel}>Khách mời</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Text style={styles.mainNumber}>{this.state.data.guests}</Text>
                                    <Text style={styles.unitLabel} >người</Text>
                                </View>
                            </View>
                            <View style={styles.cardContainer}>
                                <Text style={styles.subLabel}>Người thamm gia</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Text style={styles.mainNumber}>{this.state.data.participants}</Text>
                                    <Text style={styles.unitLabel} >người</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 16 }}>
                        <Text style={styles.Label}>Thống kê công việc</Text>
                        <View style={styles.cardContainer}>
                            <View style={styles.chartContainer}>
                                <ProgressCircle
                                    style={styles.progressBar}
                                    progress={100}
                                    progressColor={'#2A9D8F'} />
                                <View>
                                    <Text style={styles.chartNum}>{this.state.data.actions}</Text>
                                    <Text style={styles.chartText}>Công việc</Text>
                                </View>
                            </View>
                            <View style={styles.chartContainer}>
                                <ProgressCircle
                                    style={styles.progressBar}
                                    progress={(this.state.data.completeAction * 100) / this.state.data.actions}
                                    progressColor={'#0C86B8'}
                                    backgroundColor={'#EAF6F4'} />
                                <View>
                                    <Text style={styles.chartNum}>{this.state.data.completeAction}</Text>
                                    <Text style={styles.chartText}>Công việc đã hoàn thành</Text>
                                </View>
                            </View>
                            <View style={styles.chartContainer}>
                                <ProgressCircle
                                    style={styles.progressBar}
                                    progress={(this.state.data.uncompleteAction * 100) / this.state.data.actions}
                                    progressColor={'#BB4D2A'}
                                    backgroundColor={'#EAF6F4'} />
                                <View>
                                    <Text style={styles.chartNum}>{this.state.data.uncompleteAction}</Text>
                                    <Text style={styles.chartText}>Công việc chưa hoàn thành</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

            );
        } else return null
    }
}
