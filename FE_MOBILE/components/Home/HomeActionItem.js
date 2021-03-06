import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import getToken from '../../Auth';
import Url from '../../env';
import axios from 'axios';
import { Image } from 'react-native';

import { Redirect } from 'react-router';
import ApiFailHandler from '../helper/ApiFailHandler'
const styles = StyleSheet.create({

})

export default class HomeActionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSubAction: [],
            completeSubAction: [],
            resources: [],
            isLoading: true,
            loggout: false,
        };
    }

    async componentDidMount() {
        this._isMounted = true;

        // const login = localStorage.getItem('login');
        // const obj = JSON.parse(login);
        this.setState({
            isLoading: true
        })
        const [subActions, resources] = await Promise.all([
            axios.post(`${Url()}/api/sub-actions/getAll`, { actionId: this.props.data._id }, {
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
            axios.post(`${Url()}/api/action-resources/getAll`, { actionId: this.props.data._id }, {
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
        ]);

        if (this._isMounted) {
            subActions.forEach(e => {
                if (e.status) {
                    this.setState({
                        completeSubAction: [...this.state.completeSubAction, e]
                    })
                }
            })

            this.props.DoneLoading()
            this.setState({
                totalSubAction: subActions,
                resources: resources,
                isLoading: false
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
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
        } else {
            return (
                this.props.visible ?
                    <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "white", padding: 12, marginVertical: 8, borderRadius: 12, alignItems: "center" }}>
                        <Text numberOfLines={1} style={(this.state.completeSubAction.length === this.state.totalSubAction.length && this.state.isLoading === false) ? { textDecorationLine: 'line-through' } : null}>{this.props.data.name.length < 35 ? this.props.data.name : `${this.props.data.name.substring(0, 31)}...`}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Image source={require("../../assets/images/resource.png")} />
                                <Text>{this.state.resources.length}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Image source={require("../../assets/images/solidchecked.png")} />
                                <Text>{this.state.completeSubAction.length}/{this.state.totalSubAction.length}</Text>
                            </View>
                            <Image source={this.state.completeSubAction.length === this.state.totalSubAction.length ? require("../../assets/images/Checked.png") : require("../../assets/images/Unchecked.png")} />
                        </View>
                    </View >
                    : null
            );
        }
    }
}
