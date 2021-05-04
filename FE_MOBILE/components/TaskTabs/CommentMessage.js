import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Url from "../../env";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';

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
        marginBottom: 12,
        lineHeight: 24,
        paddingHorizontal: 20,
        marginHorizontal: 5,
    },
    ChatContainer: {
        flex: 1,
        marginVertical: 5,

    },
    resourceContainer: {
        flexDirection: "row",
        alignItems: "center"
    },

});
class CommentMessage extends Component {

    renderContent = (message) => {
        if (message.text) {
            return (
                <Text
                    style={{
                        ...styles.ChatMessage,
                        color: "black",

                    }}
                >
                    {message.text}
                </Text>
            )
        } else {
            if (message.resourceUrl) {
                let temp_resourceUrl = this.props.message.resourceUrl
                let extension = temp_resourceUrl.substring(temp_resourceUrl.length - 3, temp_resourceUrl.length)
                let realName = temp_resourceUrl.substring(14, temp_resourceUrl.length)
                if (["png", "svg"].includes(extension)) {

                    return (<View>
                        <TouchableOpacity onPress={() => this.props.showImage(`${Url()}/api/resources/${this.props.roomId}/${temp_resourceUrl}`)}>
                            <Image style={styles.resourceImg} source={{ uri: `${Url()}/api/resources/${this.props.roomId}/${temp_resourceUrl}` }}></Image>
                        </TouchableOpacity>
                    </View>
                    )
                } else {
                    return (<View >
                        <TouchableOpacity onPress={() => this.Download(`${Url()}/api/resources/${this.props.roomId}/${temp_resourceUrl}`, message.resourceUrl)}>
                            <View style={styles.resourceContainer}>
                                <Image source={require("./../../assets/images/Attachment.png")} /><Text numberOfLines={2} style={{ width: W * 0.5, backgroundColor: "#e5e5ea" }}>{realName}</Text>
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
        return (
            <View style={{ ...styles.ChatContainer, flexDirection: "row" }}>
                <Image
                    style={styles.AvaImg}
                    source={{
                        uri: `${Url()}/api/images/${this.props.message.userId.photoUrl}`,
                    }}
                ></Image>
                <View>
                    <Text>{this.props.message.userId.name}</Text>
                    {this.renderContent(this.props.message)}
                </View>

            </View>
        );
    };

    render() {
        return this.renderM();
    }
}

export default CommentMessage;
