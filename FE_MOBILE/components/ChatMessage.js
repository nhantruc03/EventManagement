import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Url from "../env";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';
import ResourceUrl from "../resourceurl"
const W = Dimensions.get("window").width;

const styles = StyleSheet.create({
  AvaImg: {
    width: 48,
    height: 48,
    borderRadius: 40,
  },
  resourceImg: {
    width: 100,
    height: 100,
  },
  ChatMessage: {
    maxWidth: 200,
    lineHeight: 24,
    borderRadius: 25,
    position: "relative",
    textAlign: "center",
  },
  ChatContainer: {
    flex: 1,
    marginVertical: 5,
    alignContent: "center",
  },
  resourceContainer: {
    flexDirection: "row",
    alignItems: "center"
  },

});
class ChatMessage extends Component {

  renderContent = (messageClass, message) => {
    if (message.text) {
      if (messageClass === "sent") {
        return (
          <View style={{
            borderRadius: 24, backgroundColor: "#2A9D8F", paddingHorizontal: 24, paddingVertical: 12, marginHorizontal: 8
          }}>
            <Text
              style={{
                ...styles.ChatMessage,
                color: "white",
                borderRadius: 50,
              }}
            >
              {message.text}
            </Text>
          </View>
        )
      }
      else {
        return (
          <View style={{
            borderRadius: 24, backgroundColor: "#e5e5ea", paddingHorizontal: 24, paddingVertical: 12, marginHorizontal: 8
          }} >
            <Text
              style={{
                ...styles.ChatMessage,
                color: "black",
                backgroundColor: "#e5e5ea",
                borderRadius: 50,
              }}
            >
              {message.text}
            </Text>
          </View>
        )
      }
    } else {
      if (message.resourceUrl) {
        let temp_resourceUrl = this.props.message.resourceUrl
        let extension = temp_resourceUrl.split(".")[1]
        let realName = temp_resourceUrl.split(".")[0]
        if (["png", "svg", "jpeg", "jpg"].includes(extension)) {

          return (<View>
            <TouchableOpacity onPress={() => this.props.showImage(`${ResourceUrl()}${this.props.roomId}/${temp_resourceUrl}`)}>
              <Image style={styles.resourceImg} source={{ uri: `${ResourceUrl()}${this.props.roomId}/${temp_resourceUrl}` }}></Image>
            </TouchableOpacity>
          </View>
          )
        } else {
          return (<View >
            <TouchableOpacity onPress={() => this.Download(`${ResourceUrl()}${this.props.roomId}/${temp_resourceUrl}`, message.resourceUrl)}>
              <View style={styles.resourceContainer}>
                <Image source={require("./../assets/images/Attachment.png")} /><Text numberOfLines={2} style={{ width: W * 0.5, backgroundColor: "#e5e5ea" }}>{realName}</Text>
              </View>
            </TouchableOpacity>
          </View>)
        }
      }
      else {
        return null
      }
    }
  }

  Download = async (uri, name) => {
    await WebBrowser.openBrowserAsync(uri);
  }

  renderM = () => {
    if (this.props.messageClass === "sent") {
      return (
        <View
          style={{
            ...styles.ChatContainer,
            flexDirection: "row-reverse",
            alignSelf: "flex-end",
          }}
        >
          <Image
            style={styles.AvaImg}
            source={{
              uri: `${ResourceUrl()}${this.props.message.userId.photoUrl}`,
            }}
          ></Image>

          {this.renderContent(this.props.messageClass, this.props.message)}
        </View>
      );
    } else {
      return (
        <View style={{ ...styles.ChatContainer, flexDirection: "row" }}>
          <Image
            style={styles.AvaImg}
            source={{
              uri: `${ResourceUrl()}${this.props.message.userId.photoUrl}`,
            }}
          ></Image>
          {this.renderContent(this.props.messageClass, this.props.message)}
        </View>
      );
    }
  };

  render() {
    return this.renderM();
  }
}

export default ChatMessage;
