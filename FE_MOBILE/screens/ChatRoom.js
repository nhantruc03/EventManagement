import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";

import Url from "../env";
import axios from "axios";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Image } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ChatMessage from "../components/ChatMessage";
const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: "column",
  },
  PrimaryBtn: {
    backgroundColor: "#2A9D8F",
    borderRadius: 12,
    borderColor: "#2A9D8F",
    fontFamily: "semibold",
  },
  inputdisable: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "#D4D4D4",
    borderRadius: 8,
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
const client = new WebSocket("ws://192.168.1.8:3001");
class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      messages: [],
      refreshing: false,
      page: 1,
      goToEnd: true,
      disable: false,
    };
    this._isMounted = false;
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  getData = async () => {
    const temp = await axios
      .post(`${Url()}/api/chat-message/getAll?page=1&limit=15`, {
        roomId: this.props.route.params.id,
      })
      .then((res) => res.data.data);
    this.setState({
      messages: temp.reverse(),
    });
  };

  async componentDidMount() {
    this._isMounted = true;
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.IconRight}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("scriptview", {
                id: this.state._id,
                startDate: this.state.startDate,
                startTime: this.state.startTime,
              })
            }
          >
            <Image source={require("../assets/images/preview.png")} />
          </TouchableOpacity>
        </View>
      ),
    });
    if (this._isMounted) {
      client.onopen = () => {
        console.log("Connect to ws");
      };

      client.onmessage = (message) => {
        if (message !== undefined) {
          const dataFromServer = JSON.parse(message.data);
          if (dataFromServer.type === "sendMessage") {
            if (dataFromServer.roomId === this.props.route.params.id) {
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
      roomId: this.props.route.params.id,
    };

    // console.log(message)

    await axios.post(`${Url()}/api/chat-message`, message).then((res) => {
      message._id = res.data.data[0]._id;
    });

    client.send(
      JSON.stringify({
        type: "sendMessage",
        roomId: this.props.route.params.id,
        message,
      })
    );

    this.setState({
      formValue: "",
      goToEnd: true,
    });
  };

  setFormValue = (e) => {
    this.setState({
      formValue: e,
    });
  };

  renderMessage = (object) => {
    const msg = object.item;
    return (
      <ChatMessage
        messageClass={
          msg.userId._id === this.state.currentUser ? "sent" : "received"
        }
        message={msg}
      />
    );
  };

  onRefresh = async () => {
    this.setState({
      refreshing: true,
    });

    await axios
      .post(
        `${Url()}/api/chat-message/getAll?page=${this.state.page + 1}&limit=15`,
        { roomId: this.props.route.params.id }
      )
      .then((res) => {
        const temp = res.data.data;
        this.setState({
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

  ref = React.createRef();
  render() {
    if (!this.state.isLoading) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.Container}>
            <FlatList
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              ref={this.ref}
              style={{ paddingHorizontal: 10 }}
              data={this.state.messages}
              keyExtractor={(item) => item._id}
              renderItem={(item) => this.renderMessage(item)}
              onContentSizeChange={this.goToEnd}
              onLayout={this.goToEnd}
            />
            {/* <TextInput
                        onChangeText={this.setFormValue}
                        style={
                            this.state.disable === true
                                ? styles.input
                                : styles.inputdisable
                        }
                        value={this.state.name}
                        editable={!this.state.disable}
                    >
                    </TextInput> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 16,
              }}
            >
              <TextInput
                onChangeText={this.setFormValue}
                style={{
                  flex: 1,
                  marginHorizontal: 4,
                  marginVertical: 16,
                  borderWidth: 1,
                  borderColor: "#DFDFDF",
                  borderRadius: 8,
                  height: 40,
                  width: W - 16,
                  backgroundColor: "white",
                }}
                value={this.state.formValue}
                editable={!this.state.disable}
              />
              <TouchableOpacity
                style={{}}
                disabled={!this.state.formValue}
                onPress={() => this.sendMessage()}
              >
                <Image source={require("../assets/images/Send.png")} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      );
    } else {
      return null;
    }
  }
}

export default ChatRoom;
