import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

import Url from "../env";
import getToken from "../Auth";
import axios from "axios";

import { TextInput } from "react-native-gesture-handler";
import { Button } from "@ant-design/react-native";
const H = Dimensions.get("window").height;
const styles = StyleSheet.create({
    Label: {
        color: "#2A9D8F",
        fontFamily: "bold",
        fontSize: 14,
    },
    input: {
        height: 40,
        marginVertical: 8,
        marginHorizontal: 0,
        borderWidth: 1,
        borderColor: "#DFDFDF",
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 4,
    },
    PrimaryBtn: {
        fontFamily: "bold",
        borderColor: "#2A9D8F",
        backgroundColor: "#2A9D8F",
        borderRadius: 8,
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignContent: "center",
    },
    Box: {
        height: 30,
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#DFDFDF",
        backgroundColor: "#D4D4D4",
        borderRadius: 8,
        justifyContent: "center",
    },
});

class EditActionTypeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.data[0].name,
        };
    }
    onFinish = async (e) => {
        let data = {
            name: this.state.name,
            eventId: this.props.eventId,
        };
        await axios
            .post(`${Url()}/api/action-types`, data, {
                headers: {
                    Authorization: await getToken(),
                },
            })
            .then((res) => {
                console.log(res.data.data);
                // this.setState({
                //   currentActionTypes: [...this.state.currentActionTypes, res.data.data],
                // });
                this.props.editActionTypes(res.data.data);
                this.props.onClose2();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    onChangeName = (name) => {
        this.setState({
            name: name,
        });
    };
    render() {
        console.log(this.props.data[0].name)
        return (
            <View style={{ height: H * 0.25 }}>
                <View
                    style={{
                        flex: 1,
                        paddingVertical: 20,
                        paddingHorizontal: 16,
                    }}
                >
                    <View style={styles.ScriptNameLabelContainer}>
                        <Text style={styles.Label}>Loại công việc</Text>
                        <TextInput
                            onChangeText={this.onChangeName}
                            style={styles.input}
                            value={this.state.name}
                        ></TextInput>
                    </View>
                </View>
                <Button
                    type="primary"
                    onPress={this.onFinish}
                    style={styles.PrimaryBtn}
                >
                    Xác nhận
        </Button>
            </View>
        );
    }
}

export default EditActionTypeModal;
