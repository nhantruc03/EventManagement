import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import Url from "../env";
import getToken from "../Auth";
import axios from "axios";
import {
    Steps,
    Modal,
    Provider,
    Button,
    PickerView,
    Picker,
    FlatList,
} from "@ant-design/react-native";
import moment from "moment";
import {
    TextInput,
    TouchableOpacity,
} from "react-native-gesture-handler";
import { Image } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

const styles = StyleSheet.create({
    AvaImg: {
        width: 48,
        height: 48,
        borderRadius: 40,
    },
    ChatMessage: {
        maxWidth: 200,
        marginBottom: 12,
        lineHeight: 24,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        position: 'relative',
        textAlign: 'center', 
        marginHorizontal: 5
        
    },
    ChatContainer: {
        flex: 1,
        marginVertical: 5,
        alignContent: 'center'
    }
});
class ChatMessage extends Component {
    renderMessage = () => {
        if (this.props.message.text) {
            return (
                <p className="chat-message">{this.props.message.text}</p>
            )
        } else {
            if (this.props.message.resourceUrl) {
                let temp_resourceUrl = this.props.message.resourceUrl
                let extension = temp_resourceUrl.substring(temp_resourceUrl.length - 3, temp_resourceUrl.length)
                let realName = temp_resourceUrl.substring(14, temp_resourceUrl.length)
                if (["png", "svg"].includes(extension)) {
                    return (
                        // <p className="chat-message">{this.props.message.text}</p>
                        <Image style={{ marginBottom: '12px' }} alt="resource" src={`/api/resources/${this.props.roomId}/${temp_resourceUrl}`} />
                    )
                } else if (extension === 'mp4') {
                    return (
                        <video style={{ marginBottom: '12px' }} alt='resource' src={`/api/resources/${this.props.roomId}/${temp_resourceUrl}`} />
                    )
                } else {
                    return (
                        <div style={{ marginTop: 'unset', maxWidth: '150px', marginBottom: '12px' }} className="flex-container-row resource-card">
                            {this.renderIcon(extension)}
                            <Tooltip title={realName} placement="top" >
                                <a className="cut-text" target="_blank" rel="noreferrer" href={`/api/resources/${this.props.roomId}/${temp_resourceUrl}`} style={{ marginLeft: '10px' }} >{realName}</a>
                            </Tooltip>
                        </div>
                    )
                }
            }
        }
    }

    renderM = () => {
        if (this.props.messageClass === 'sent') {
            return (
                <View style={{ ...styles.ChatContainer, flexDirection: 'row-reverse', alignSelf: 'flex-end', }}>
                    <Image
                        style={styles.AvaImg}
                        source={{
                            uri: `${Url()}/api/images/${this.props.message.userId.photoUrl}`,
                        }}
                    ></Image>
                    <Text style={{ ...styles.ChatMessage, color: 'white', backgroundColor: '#2A9D8F' }}>{this.props.message.text}</Text>
                </View>
            )
        } else {
            return (
                <View style={{ ...styles.ChatContainer, flexDirection: 'row' }}>
                    <Image
                        style={styles.AvaImg}
                        source={{
                            uri: `${Url()}/api/images/${this.props.message.userId.photoUrl}`,
                        }}
                    ></Image>
                    <Text style={{ ...styles.ChatMessage, color: 'black', backgroundColor: '#e5e5ea' }}>{this.props.message.text}</Text>
                </View>
            )
        }
    }

    render() {
        return (
            this.renderM()
        );
    }
}

export default ChatMessage;
