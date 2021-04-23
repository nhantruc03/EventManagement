import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";

import Url from "../../env";
import axios from "axios";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ChatMessage from "../../components/ChatMessage";
import { ActivityIndicator } from "@ant-design/react-native";
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
    width: W - 60,
    backgroundColor: "white",
    paddingRight: 12,
  },
});
const client = new WebSocket("ws://192.168.1.6:3001");
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
            <Image source={require("../../assets/images/preview.png")} />
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

  ref = React.createRef();
  render() {
    if (!this.state.isLoading) {
      return (
        <View style={styles.Container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "position" : null}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <FlatList
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              ref={this.ref}
              style={{ paddingHorizontal: 10, height: 530 }}
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
              }}
            >
              <TextInput
                onChangeText={this.setFormValue}
                style={styles.input}
                value={this.state.formValue}
                editable={!this.state.disable}
              />
              <TouchableOpacity
                style={{ right: 16 }}
                disabled={!this.state.formValue}
                onPress={() => this.sendMessage()}
              >
                <Image source={require("../../assets/images/Send.png")} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
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

export default ChatRoom;
