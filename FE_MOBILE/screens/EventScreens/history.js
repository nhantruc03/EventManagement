import React, { Component } from "react";
import { SectionList } from "react-native";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    ScrollView,
} from "react-native";
import moment from "moment";
import CollapseItem from "../../components/ScriptHistory/CollapseItem";
import { RefreshControl } from "react-native";
import axios from "axios";
import Url from "../../env";

import getToken from "../../Auth";

const styles = StyleSheet.create({
    Container: {
        marginTop: 16,
    },
    headerContainer: {
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
    },
    itemContainer: {
        marginHorizontal: 16,
    },
});

class history extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
            refreshing: false,
            data: [],
        };
    }

    componentDidMount() {
        this.setState({
            data: this.props.route.params.data
        })
    }

    renderList = () => {
        let data = this.state.data;
        let list_data = data.reduce((list, item) => {
            let temp_list = list.filter(
                (e) =>
                    e.title === moment(item.createdAt).utcOffset(0).format("DD/MM/YYYY")
            ); //điều kiện gom nhóm
            let temp_O =
                temp_list.length > 0
                    ? temp_list[0]
                    : {
                        title: moment(item.createdAt).utcOffset(0).format("DD/MM/YYYY"),
                        data: [],
                    }; // check cần tạo mới hay đã có trong result

            if (list.indexOf(temp_O) !== -1) {
                list[list.indexOf(temp_O)].data.push(item);
            } else {
                temp_O.data.push(item);
                list.push(temp_O);
            }
            return list;
        }, []);
        return list_data.map((e, key) => {
            return <CollapseItem key={key} title={e.title} data={e.data} />;
        });
    };

    onRefresh = async () => {
        this.setState({
            refreshing: true,
        });
        await axios
            .post(
                `${Url()}/api/script-histories/getAll`,
                { scriptId: this.props.route.params.id },
                {
                    headers: {
                        Authorization: await getToken(),
                    },
                }
            )
            .then((res) => {
                console.log("data", res.data.data);
                this.props.route.params.updateFullListHistory(res.data.data);
                this.setState({
                    refreshing: false,
                    data: res.data.data
                });
            });
    };

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
                nestedScrollEnabled={true}
                style={styles.Container}
            >
                {this.renderList()}
            </ScrollView>
        );
    }
}

export default history;
