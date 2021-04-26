import React, { Component } from "react";
import Url from "../../env";
import getToken from "../../Auth";
import axios from "axios";
import { StyleSheet } from "react-native";
import { View, Platform, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native";
import { ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singleFile: null,
      image: null,
      coverUrl: null,
      isLoading: false,
    };
  }

  async componentDidMount() {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }

      if (this.props.localPath) {
        this.setState({
          image: this.props.localPath,
        });
      }
    }
  }

  pickImage = async () => {
    this.setState({
      isLoading: true,
    });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (result) {
      let type = result.uri.slice(result.uri.length - 10, result.uri.length);
      /////
      let final_type = type.split(".")[1];
      if (final_type === "jpg") {
        final_type = "jpeg";
      }
      let base = `data:image/${final_type};base64,` + result.base64;
      /////

      const data = new FormData();
      data.append("file", base);
      data.append("mobile", true);

      // Please change file upload URL
      await axios
        .post(`${Url()}/api/uploads`, data, {
          headers: {
            Authorization: await getToken(),
          },
        })
        .then((res) => {
          this.setState({
            isLoading: false,
          });
          this.props.Save(res.data.url, result.uri);
        });

      if (!result.cancelled) {
        // setImage(result.uri);
        this.setState({
          image: result.uri,
        });
      }
    }
  };

  render() {
    return (
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.btnUpdate}
          underlayColor="#fff"
          onPress={this.pickImage}
        >
          <Text style={styles.textUpdate}>Chọn ảnh</Text>
        </TouchableOpacity>
        {this.state.isLoading ? (
          <ActivityIndicator
            size="large"
            animating
            color="#2A9D8F"
          ></ActivityIndicator>
        ) : null}
        {this.state.image && (
          <Image
            source={{ uri: this.state.image }}
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  btnUpdate: {
    color: "#fff",
    height: 48,
    backgroundColor: "#2A9D8F",
    borderRadius: 8,
    justifyContent: "center",
    margin: 16,
    padding: 10,
  },
  textUpdate: {
    fontFamily: "bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  textStyle: {
    backgroundColor: "#fff",
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: "center",
  },
});

export default UploadImage;
