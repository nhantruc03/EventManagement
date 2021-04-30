import { Button } from "@ant-design/react-native";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  AlertIOS,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { ScrollView } from "react-native-gesture-handler";
import Url from "../env";
import getToken from "../Auth";
import axios from "axios";
import Customdatetime from "./helper/datetimepicker";

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
    textAlign: "center",
  },
  LoadingBtn: {
    borderRadius: 8,
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignContent: "center",
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
      showDateTimePicker: false,
      loadingbtn: false,
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
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

  onChangeTime = (time) => {
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

  onLoading() {
    this.setState({
      loadingbtn: true,
    });
  }
  onFinish = async () => {
    this.onLoading();
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
          // console.log(res.data.data[0]);
          this.props.addListScriptDetails(res.data.data[0]);
          this.props.onClose();
          AlertIOS.alert("Tạo chi tiết kịch bản thành công");
          //alert("Tạo chi tiết kịch bản thành công");
        })
        .catch((err) => {
          console.log(err);
          alert("Tạo chi tiết kịch bản thất bại");
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
          alert("Cập nhật chi tiết kịch bản thành công");
        })
        .catch((err) => {
          alert("Cập nhật chi tiết kịch bản thất bại");
        });
    }
  };

  render() {
    if (this.state.data) {
      return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            keyboardDismissMode="interactive"
            style={{ flex: 1, maxHeight: H * 0.7 }}
            bounces={false}
          >
            <View style={{ paddingVertical: 20, paddingHorizontal: 16 }}>
              <Customdatetime
                containerStyle={styles.ScriptNameContainer}
                labelStyle={styles.Label}
                label="Thời gian"
                BoxInput={styles.BoxInput}
                Save={(e) => this.onChangeTime(e)}
                data={this.state.data.time}
                mode="time"
              />
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
          {!this.state.loadingbtn ? (
            <Button
              type="primary"
              onPress={this.onFinish}
              style={styles.PrimaryBtn}
            >
              Lưu
            </Button>
          ) : (
            <Button style={styles.LoadingBtn} loading>
              loading
            </Button>
          )}
          {/* </View> */}
        </KeyboardAvoidingView>
      );
    } else {
      return null;
    }
  }
}

export default ScriptDetailModal;
