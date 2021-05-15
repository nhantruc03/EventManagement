import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import OptionsMenu from "react-native-options-menu";
import EventCard from './EventCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TaskCard from "./TaskCard"
const styles = StyleSheet.create({
    contentContainer: {

    },
    FilterBtn: {
        flexDirection: "row",
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
    DeleteBtn: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 8,
        borderRadius: 8,
        borderColor: '#EB5757',
        borderWidth: 1,
        backgroundColor: 'white'
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
    DeleteBtnText: {
        fontFamily: "semibold",
        fontSize: 16,
        marginRight: 8,
        color: "#EB5757",
    },
})
const myIcon = (<TouchableOpacity>
    <View style={styles.EditBtn}>
        <Text style={styles.EditBtnText}>Tuỳ chỉnh</Text>
        <Ionicons name='ellipsis-vertical-circle' size={24} color='white' />
    </View>
</TouchableOpacity>)

class TaskCol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: [],
            totalSubOfAction: [],
        };
    }

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

    test = () => {
    }

    render() {
        let data_appliedFilter = this.applyFilter(this.props.data)
        return (
            <View style={styles.contentContainer}>
                <View style={{ marginVertical: 12, flexDirection: "row", justifyContent: 'flex-end' }}>
                    <TouchableOpacity>
                        <View style={{ marginRight: 8 }}>
                            <View style={styles.FilterBtn}>
                                <Text style={styles.FilterBtnText}>Bộ lọc</Text>
                                <Ionicons name='filter' size={24} color="#2A9D8F" />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <OptionsMenu
                            customButton={myIcon}
                            destructiveIndex={1}
                            options={["Chỉnh sửa loại công việc", "Xoá loại công việc", "Huỷ bỏ"]}
                            actions={[() => this.props.EditActionType(this.props.route), () => this.props.DeleteActionType(this.props.route.key), this.test]}
                        />
                    </View>
                </View >
                <FlatList
                    data={data_appliedFilter}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item) => item._id}
                />
            </View >
        );
    }
}

export default TaskCol;
