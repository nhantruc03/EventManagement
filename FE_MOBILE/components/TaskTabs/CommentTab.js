import React, { Component } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Dimensions,
} from "react-native";
import Url from "../../env";
import WSK from "../../websocket";
import axios from "axios";
import getToken from "../../Auth";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import CommentMessage from "../../components/TaskTabs/CommentMessage";
import { ActivityIndicator, Modal, Provider } from "@ant-design/react-native";
import UploadImage from "../../components/helper/UploadImageForChat";
import Separator from "../helper/separator";
import separator from "../helper/separator";

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;
const styles = StyleSheet.create({
    Loading: {
        justifyContent: "center",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    Container: {
        flex: 1,
    },
    input: {
        marginHorizontal: 16,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: "#DFDFDF",
        borderRadius: 8,
        height: 40,
        width: W - 80,
        backgroundColor: "white",
        paddingRight: 12,
    },
});
const client = new WebSocket(`${WSK()}`);
class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            messages: [],
            refreshing: false,
            page: 1,
            goToEnd: true,
            disable: false,
            show: false,
            CurrentShowImage: null

        };
        this._isMounted = false;
    }

    onClose = () => {
        this.setState({
            show: false,
        });
    };

    getData = async () => {
        const temp = await axios
            .post(
                `${Url()}/api/chat-message/getAll?page=1&limit=15`,
                {
                    roomId: this.props.actionId,
                },
                {
                    headers: {
                        Authorization: await getToken(),
                    },
                }
            )
            .then((res) => res.data.data);
        this.setState({
            messages: temp.reverse(),
        });
    };

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            client.onopen = () => {
                console.log("Connect to ws");
            };
            client.onmessage = (message) => {
                if (message !== undefined) {
                    const dataFromServer = JSON.parse(message.data);
                    if (dataFromServer.type === "sendMessage") {
                        if (dataFromServer.roomId === this.props.actionId) {
                            this.setState({
                                messages: [...this.state.messages, dataFromServer.message],
                                goToEnd: true,
                            });
                        }
                    }
                }
            };
            const login = await AsyncStorage.getItem("login");
            const obj = JSON.parse(login);
            this.setState({
                currentUser: obj.id,
            });
            await this.getData();

            this.setState({
                isLoading: false,
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    sendMessage = async () => {
        const login = await AsyncStorage.getItem("login");
        const obj = JSON.parse(login);

        var message = {
            text: this.state.formValue,
            userId: { _id: obj.id, name: obj.name, photoUrl: obj.photoUrl },
            roomId: this.props.actionId,
        };
        await axios
            .post(`${Url()}/api/chat-message`, message, {
                headers: {
                    Authorization: await getToken(),
                },
            })
            .then((res) => {
                message._id = res.data.data[0]._id;
            });

        client.send(
            JSON.stringify({
                type: "sendMessage",
                roomId: this.props.actionId,
                message,
            })
        );

        this.setState({
            formValue: "",
            goToEnd: true,
        });
    };

    sendResources = async (e) => {
        const login = await AsyncStorage.getItem("login");
        const obj = JSON.parse(login);

        var message = {
            resourceUrl: e,
            userId: { _id: obj.id, name: obj.name, photoUrl: obj.photoUrl },
            roomId: this.props.actionId,
        }

        await axios
            .post(`${Url()}/api/chat-message`, message, {
                headers: {
                    Authorization: await getToken(),
                },
            })
            .then((res) => {
                message._id = res.data.data[0]._id;
            });

        client.send(
            JSON.stringify({
                type: "sendMessage",
                roomId: this.props.actionId,
                message,
            })
        );

        this.setState({
            formValue: "",
            goToEnd: true,
        });
    };

    renderMessage = (object) => {
        const msg = object.item;
        return (
            <View>
                <CommentMessage
                    showImage={(e) => this.setCurrentImage(e)}
                    roomId={this.props.actionId}
                    message={msg}
                />
                <Separator />
            </View>
        );
    };

    onRefresh = async () => {
        this.setState({
            refreshing: true,
        });

        await axios
            .post(
                `${Url()}/api/chat-message/getAll?page=${this.state.page + 1}&limit=15`,
                { roomId: this.props.actionId },
                {
                    headers: {
                        Authorization: await getToken(),
                    },
                }
            )
            .then((res) => {
                const temp = res.data.data;
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    page: this.state.page + 1,
                    messages: [...temp.reverse(), ...this.state.messages],
                    goToEnd: false,
                });
            });
    };

    goToEnd = () => {
        if (this.state.goToEnd) {
            this.ref.current.scrollToEnd({ animated: true });
        }
    };

    setCurrentImage = (e) => {
        this.setState({
            show: true,
            CurrentShowImage: e
        })
    }

    ref = React.createRef();
    render() {
        if (!this.state.isLoading) {
            return (
                <Provider>
                    <View style={styles.Container}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "position" : null}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                        >
                            <FlatList
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                                ref={this.ref}
                                style={{ paddingHorizontal: 10, height: 480, }}
                                data={this.state.messages}
                                keyExtractor={(item) => item._id}
                                renderItem={(item) => this.renderMessage(item)}
                                onContentSizeChange={this.goToEnd}
                                onLayout={this.goToEnd}
                            />
                            <View
                                style={{

                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 20,
                                }}
                            >
                                <TextInput
                                    onChangeText={this.setFormValue}
                                    style={styles.input}
                                    value={this.state.formValue}
                                    editable={!this.state.disable}
                                />
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                        style={{ right: 16 }}
                                        disabled={!this.state.formValue}
                                        onPress={() => this.sendMessage()}
                                    >
                                        <Image source={require("../../assets/images/voice.png")} />
                                    </TouchableOpacity>

                                    <UploadImage roomId={this.props.actionId} Save={(e) => this.sendResources(e)} />

                                    {/* <TouchableOpacity
                  style={{ right: 16 }}
                  disabled={!this.state.formValue}
                  onPress={() => this.sendMessage()}
                >
                  <Image source={require("../../assets/images/Send.png")} />
                </TouchableOpacity> */}
                                </View>
                            </View>
                            <Modal
                                closable
                                maskClosable
                                transparent
                                visible={this.state.show}
                                animationType="slide-up"
                                onClose={this.onClose}
                                style={{
                                    width: W,
                                    height: "100%",
                                    backgroundColor: 'black',
                                    justifyContent: "center",
                                    alignContent: "center"
                                }}

                            >
                                <View>
                                    {this.state.CurrentShowImage ?
                                        <Image style={{ alignSelf: "center", width: "100%", height: undefined, aspectRatio: 1 }} source={{ uri: this.state.CurrentShowImage }}></Image>
                                        : null}
                                </View>
                            </Modal>
                        </KeyboardAvoidingView>
                    </View>
                </Provider>
            );
        } else {
            return (
                <View style={styles.Loading}>
                    <ActivityIndicator
                        size="large"
                        animating
                        color="#2A9D8F"
                    ></ActivityIndicator>
                </View>
            );
        }
    }
}

export default Comment;
