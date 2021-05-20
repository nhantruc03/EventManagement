import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import OptionsMenu from "react-native-options-menu";
import CheckboxGroup from 'react-native-checkbox-group'
import Ionicons from 'react-native-vector-icons/Ionicons';
import TaskCard from "./TaskCard"
import { Overlay } from 'react-native-elements';
import Search from "../components/helper/search";
import Url from "../env";
import axios from "axios";
import getToken from "../Auth";
import { RefreshControl } from 'react-native';
import ApiFailHandler from '../components/helper/ApiFailHandler'
import { Redirect } from 'react-router';

const styles = StyleSheet.create({
    FilterBtn: {
        alignItems: "center",
        width: "100%",
        backgroundColor: "#C4C4C4",
        padding: 8,
        borderRadius: 8,
        backgroundColor: "white"
    },
    EditBtn: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#2A9D8F"
    },
    FilterBtnText: {
        fontFamily: "semibold",
        fontSize: 16,
        marginRight: 8,
        color: "#2A9D8F",
    },
    EditBtnText: {
        fontFamily: "semibold",
        fontSize: 16,
        marginRight: 8,
        color: "white",
    },
    CheckboxContainer: {
        height: "30%",
        alignContent: 'center',
        alignItems: 'center',

    }
})
const myIcon = (<TouchableOpacity>
    <View style={styles.EditBtn}>
        {/* <Text style={styles.EditBtnText}>Tuỳ chỉnh</Text> */}
        <Ionicons name='ellipsis-vertical-circle' size={24} color='white' />
    </View>
</TouchableOpacity>)

class TaskCol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: [],
            totalSubOfAction: [],
            visible: false,
            SearchData: [],
            refreshing: false,
            loggout: false,
            listCheckbox: [
                {
                    label: "Tên", // label for checkbox item
                    value: "Tên", // selected value for item, if selected, what value should be sent?
                    selected: false
                },
                {
                    label: "Số lượng công việc",
                    value: "Số lượng công việc",
                    selected: false
                },
                {
                    label: "Độ ưu tiên",
                    value: "Độ ưu tiên",
                    selected: false
                },
                {
                    label: "Ban",
                    value: "Ban",
                    selected: false
                },
            ]

        };
    }

    componentDidMount() {
        this.setState({
            SearchData: this.props.data,
        })
    }
    // UNSAFE_componentWillReceiveProps(e) {
    //     console.log('data', e)
    //     this.setState({
    //         SearchData: e.data
    //     })
    // }
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            const result = this.props.data;
            this.setState({
                SearchData: result
            })
        }

    }

    getSearchData = (data) => {
        this.setState({
            SearchData: data
        });
    };
    applyFilter = (list) => {
        let result = list.slice()
        if (this.state.filter.includes('Tên')) {
            result = result.sort((a, b) => {
                let nameA = a.name.substring(0, 1).toLowerCase();
                let nameB = b.name.substring(0, 1).toLowerCase();
                return nameA < nameB ? 1 : -1
            })
        }

        if (this.state.filter.includes('Số lượng công việc')) {
            result = result.sort((a, b) => {
                let tempA = this.state.totalSubOfAction.filter(e => e._id === a._id)[0]
                let tempB = this.state.totalSubOfAction.filter(e => e._id === b._id)[0]

                return tempA.total < tempB.total ? 1 : -1
            })
        }

        if (this.state.filter.includes('Độ ưu tiên')) {
            result = result.sort((a, b) => {
                let tempA = this.getPriority(a.priorityId.name)
                let tempB = this.getPriority(b.priorityId.name)
                return tempA < tempB ? 1 : -1
            })
        }

        if (this.state.filter.includes('Ban')) {
            result = result.sort((a, b) => {

                return a.facultyId.name < b.facultyId.name ? 1 : -1
            })
        }
        return result
    }

    addTotalSubOfAction = (e) => {
        this.setState({
            totalSubOfAction: [...this.state.totalSubOfAction, e]
        })
    }

    getPriority = (e) => {
        if (e === "Cao") {
            return 3
        }
        else if (e === "Vừa") {
            return 2
        }
        else {
            return 1
        }
    }

    renderItem = (item) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    this.props.navigation.navigate("TaskDetail", {
                        currentPermissions: this.props.currentPermissions,
                        data: item,
                        deleteItemInCurrentActions: (e) => this.props.deleteItemInCurrentActions(e)
                    })
                }
            >
                <TaskCard data={item} addTotalSubOfAction={this.addTotalSubOfAction} />
            </TouchableOpacity>
        );
    };

    openFilter = () => {
        this.setState({
            visible: !this.state.visible
        })
    }
    onChange = (checkedValues) => {
        this.setState({
            filter: checkedValues,

        })

        let temp = this.state.listCheckbox
        temp.forEach(e => {
            if (this.state.filter.includes(e.value)) {

                e.selected = true
            }
            else e.selected = false
        })
        this.setState({
            listCheckbox: temp
        })
    }
    test = () => {
    }

    onRefresh = async () => {
        this.setState({
            refreshing: true,
        });
        await axios
            .post(
                `${Url()}/api/actions/getAll`,
                { eventId: this.props.eventId },
                {
                    headers: {
                        Authorization: await getToken(),
                    },
                }
            )
            .then((res) => {
                this.props.updateFullListCurrentAction(res.data.data);
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

    render() {
        let data_appliedFilter = this.applyFilter(this.state.SearchData)
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
                <View>
                    <View style={{ flexDirection: "row", width: '100%', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'black', width: '72%' }}>
                            <Search style={{ width: '100%' }} data={this.props.data} target={"name"} getSearchData={(e) => this.getSearchData(e)} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '28%' }}>
                            <TouchableOpacity onPress={this.openFilter}>
                                <View style={{ marginRight: 8 }}>
                                    <View style={styles.FilterBtn}>
                                        {/* <Text style={styles.FilterBtnText}>Bộ lọc</Text> */}
                                        <Ionicons name='filter' size={24} color="#2A9D8F" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View>
                                <OptionsMenu
                                    customButton={myIcon}
                                    destructiveIndex={1}
                                    options={["Chỉnh sửa loại công việc", "Xoá loại công việc", "Huỷ bỏ"]}
                                    actions={[() => this.props.EditActionType(this.props.route), () => this.props.DeleteAlert(this.props.route.key), this.test]}
                                />
                            </View>
                        </View>
                    </View >
                    <Overlay isVisible={this.state.visible} onBackdropPress={this.openFilter}>
                        <View style={styles.CheckboxContainer}>
                            <View style={{ marginTop: 16 }}></View>
                            <CheckboxGroup
                                style={{ backgroundColor: 'black' }}
                                callback={(selected) => { this.onChange(selected) }}
                                iconColor={"#2A9D8F"}
                                iconSize={30}
                                checkedIcon="ios-checkbox-outline"
                                uncheckedIcon="ios-square-outline"
                                checkboxes={this.state.listCheckbox}
                                labelStyle={{
                                    fontFamily: "semibold",
                                    fontSize: 16,
                                    color: '#2A9D8F'
                                }}
                                rowStyle={{
                                    flexDirection: 'row',
                                    alignItems: 'center',

                                }}
                                rowDirection={"column"}
                            />
                        </View>
                    </Overlay>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }
                        data={data_appliedFilter}
                        renderItem={({ item }) => this.renderItem(item)}
                        keyExtractor={(item) => item._id}
                    />
                </View>
            );
        }
    }
}

export default TaskCol;
