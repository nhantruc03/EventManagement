import { Picker } from "@ant-design/react-native";
import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Tags from "react-native-tags";

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textArea: {
    margin: 12,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 150,
    justifyContent: "flex-start",
  },
  Label: {
    marginLeft: 12,
    color: "#2A9D8F",
    fontFamily: "bold",
    fontSize: 14,
  },
  btnUpdate: {
    color: "#fff",
    height: 48,
    backgroundColor: "#2A9D8F",
    borderRadius: 8,
    justifyContent: "center",
    margin: 16,
  },
  textUpdate: {
    fontFamily: "bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});

class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      event: null,
      listUser_default: [],
      listUser: [],
    };
  }

  componentDidMount() {
    let event = this.props.route.params.event;
    console.log("event2", event);
    let temp_listUser = [];
    event.availUser.forEach((e) => {
      let temp = {
        value: e._id,
        label: e.name,
      };
      temp_listUser.push(temp);
    });
    this.setState({
      event: this.props.event,
      listUser_default: event.availUser,
      listUser: [temp_listUser],
    });
  }

  onChangeForId = (availUser) => {
    this.setState({
      data: {
        ...this.state.data,
        availUser: availUser,
      },
    });
  };
  onChangeName() {}

  render() {
    console.log(this.state.listUser_default);
    return (
      <View style={styles.container}>
        <View styles={styles.ScriptNameContainer}>
          <Text style={styles.Label}>Tên công việc</Text>
          <View style={styles.BoxInput}>
            <TextInput
              //onChangeText={this.onChangeName}
              style={styles.input}
              //value={this.state.name}
              //editable={this.state.disable}
            ></TextInput>
          </View>
          <Text style={styles.Label}>Mô tả công việc</Text>
          <TextInput
            multiline={true}
            numberOfLines={10}
            style={styles.textArea}
          ></TextInput>
        </View>
        <View style={styles.ScriptNameLabelContainer}>
          <Text style={styles.Label}>Phân công cho</Text>
          <View style={styles.Box}>
            <Picker
              onChange={this.onChangeForId}
              value={this.state.availUser}
              data={this.state.listUser}
              cascade={false}
              okText="Đồng ý"
              dismissText="Thoát"
            >
              <Text>
                {!this.state.availUser
                  ? "Chọn"
                  : this.state.listUser_default.filter(
                      (e) => e._id === this.state.availUser[0]
                    )[0].name}
              </Text>
            </Picker>
          </View>
        </View>

        <Text style={styles.Label}>Tags</Text>
        <Tags
          initialText=""
          textInputProps={{
            placeholder: "Any type of animal",
          }}
          onChangeTags={(tags) => console.log(tags)}
          onTagPress={(index, tagLabel, event, deleted) =>
            console.log(
              index,
              tagLabel,
              event,
              deleted ? "deleted" : "not deleted"
            )
          }
          containerStyle={{ justifyContent: "center" }}
          inputStyle={{ backgroundColor: "white" }}
          renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
            <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
              <Text>{tag}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.btnUpdate}
          underlayColor="#fff"
          //onPress={() => this.updateScript()}
        >
          <Text style={styles.textUpdate}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default CreateTask;
