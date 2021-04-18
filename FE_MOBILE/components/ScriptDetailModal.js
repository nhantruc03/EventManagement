import { Button } from "@ant-design/react-native";
import moment from "moment";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  actions,
  getContentCSS,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { ScrollView } from "react-native-gesture-handler";
import Url from "../env";
import getToken from "../Auth";
import axios from "axios";

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;
const styles = StyleSheet.create({
  Label: {
    color: "#2A9D8F",
    fontFamily: "bold",
    fontSize: 14,
  },
  input: {
    height: 48,
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
});

class ScriptDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      richText: React.createRef(),
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    console.log(this.props.data.time);
    this.setState({
      data: this.props.data,
    });
  }

  onChangeName = (name) => {
    this.setState({
      data: {
        ...this.state.data,
        name: name,
      },
    });
  };

  onChangeTime = (event, time) => {
    this.setState({
      data: {
        ...this.state.data,
        time: time,
      },
    });
  };
  Onchange = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        description: e,
      },
    });
  };

  getRef = (e) => {
    this.setState({
      richText: e,
    });
  };

  onFinish = async () => {
    let data = {
      ...this.state.data,
      _id: this.props.data._id,
      time: this.state.data.time,
      scriptId: this.props.scriptId,
    };

    if (this.props.add) {
      await axios
        .post(`${Url()}/api/script-details`, data, {
          headers: {
            Authorization: await getToken(),
          },
        })
        .then((res) => {
          console.log(res.data.data[0]);
          this.props.addListScriptDetails(res.data.data[0]);
          this.props.onClose();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .put(`${Url()}/api/script-details/` + this.props.data._id, data, {
          headers: {
            Authorization: await getToken(),
          },
        })
        .then((res) => {
          this.props.updateListScriptDetails(res.data.data);
          this.props.onClose();
        });
    }
    console.log("finish data", data);
  };

  ref = React.createRef();
  render() {
    if (this.state.data) {
      // console.log(this.richText);
      return (
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{ maxHeight: H * 0.7 }}>
            <ScrollView keyboardDismissMode="interactive">
              <View style={{ paddingVertical: 20, paddingHorizontal: 16 }}>
                <View styles={styles.ScriptNameContainer}>
                  <Text style={styles.Label}>Thời gian</Text>
                  <View style={styles.BoxInput}>
                    <DateTimePicker
                      value={this.state.data.time}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={this.onChangeTime}
                      timeZoneOffsetInMinutes={0}
                    />
                  </View>
                </View>
                <View styles={styles.ScriptNameContainer}>
                  <Text style={styles.Label}>Tiêu đề</Text>
                  <View style={styles.BoxInput}>
                    <TextInput
                      onChangeText={this.onChangeName}
                      style={styles.input}
                      value={this.state.data.name}
                    ></TextInput>
                  </View>
                </View>
                <Text style={styles.Label}>Nội dung</Text>

                <View style={styles.TextEditorContainer}>
                  <RichToolbar
                    style={{
                      borderRadius: 8,
                      borderBottomLeftRadius: 0,
                      borderBottomEndRadius: 0,
                    }}
                    editor={this.ref}
                    actions={[
                      actions.setBold,
                      actions.setItalic,
                      actions.insertBulletsList,
                      actions.insertOrderedList,
                      actions.insertImage,
                    ]}
                  />

                  <RichEditor
                    // editorStyle={{ maxHeight: 100 }}
                    // ref={(e) => this.getRef(e)}
                    style={{
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#DFDFDF",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}
                    ref={this.ref}
                    onChange={this.Onchange}
                    initialContentHTML={this.state.data.description}
                  />
                </View>
              </View>
            </ScrollView>
            <Button
              type="primary"
              onPress={this.onFinish}
              style={styles.PrimaryBtn}
            >
              Lưu
            </Button>
          </View>
        </KeyboardAvoidingView>
      );
    } else {
      return null;
    }
  }
}

export default ScriptDetailModal;
