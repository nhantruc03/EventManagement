import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Customdatetime from "../../components/helper/datetimepicker";
import SearchableDropdown from "react-native-searchable-dropdown";
import { Button } from "@ant-design/react-native";
import Url from "../../env";
import getToken from "../../Auth";
import axios from "axios";
import StepIndicator from "react-native-step-indicator";
import UploadImage from "../../components/helper/UploadImage";
import { KeyboardAvoidingView } from "react-native";
import WSK from "../../websocket";
import { findNodeHandle } from "react-native";
import Indicator from "../../components/helper/Loading";
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
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  ScriptNameContainer: {
    width: "50%",
    paddingHorizontal: 5,
  },
  BoxInput: {
    marginHorizontal: 10
  },
});
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#7eaec4",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#7eaec4",
  stepStrokeUnFinishedColor: "#dedede",
  separatorFinishedColor: "#7eaec4",
  separatorUnFinishedColor: "#dedede",
  stepIndicatorFinishedColor: "#7eaec4",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: "transparent",
  stepIndicatorLabelFinishedColor: "transparent",
  stepIndicatorLabelUnFinishedColor: "transparent",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#7eaec4",
};

const client = new WebSocket(`${WSK()}`);
class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        startDate: new Date(),
        endDate: new Date(),
      },
      event: null,
      listUser_default: [],
      listUser: [],
      selectedManager: {},
      selectedUsers: [],
      selectedTags: [],
      selectedUsers: [],
      selectedPriorities: {},
      listTags: null,
      listPriorities: null,
      isLoading: true,
      currentPage: 0,
      coverUrl: null,
      coverUrl_localPath: null,
      listFaculties: [],
      listActionTypes: [],
      selectedFaculties: {},
      selectedActionTypes: {},
      enableScrollViewScroll: true,
      loadingbtn: false,
    };
  }

  async componentDidMount() {
    const [tags, priorities, faculties, actionstypes] = await Promise.all([
      axios
        .post(
          `${Url()}/api/action-tags/getAll`,
          {},
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
      axios
        .post(
          `${Url()}/api/action-priorities/getAll`,
          {},
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
      axios
        .post(
          `${Url()}/api/faculties/getAll`,
          { eventId: this.props.route.params.event._id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
      axios
        .post(
          `${Url()}/api/action-types/getAll`,
          { eventId: this.props.route.params.event._id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
    ]);

    if (tags !== undefined && priorities !== undefined) {
      let event = this.props.route.params.event;
      let temp_listUser = event.availUser.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        };
        list.push(temp);
        return list;
      }, []);

      let temp_tags = tags.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        };
        list.push(temp);
        return list;
      }, []);

      let temp_priorities = priorities.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        };
        list.push(temp);
        return list;
      }, []);

      let temp_faculties = faculties.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        };
        list.push(temp);
        return list;
      }, []);

      let temp_actiontypes = actionstypes.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        };
        list.push(temp);
        return list;
      }, []);

      this.setState({
        event: this.props.route.params.event,
        listUser: temp_listUser,
        listTags: temp_tags,
        listPriorities: temp_priorities,
        isLoading: false,
        listFaculties: temp_faculties,
        listActionTypes: temp_actiontypes,
      });
    }
  }
  onChangeTime = (name, time) => {
    let temp = this.state.data;
    temp[name] = time;
    this.setState({
      data: temp,
    });
  };
  onChangeName = (name) => {
    this.setState({
      data: {
        ...this.state.data,
        name: name,
      },
    });
  };
  onChangeDescrip = (description) => {
    this.setState({
      data: {
        ...this.state.data,
        description: description,
      },
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
      managerId: this.state.selectedManager.id,
      availUser: this.state.selectedUsers.reduce((list, e) => {
        list.push(e.id);
        return list;
      }, []),
      tagsId: this.state.selectedTags.reduce((list, e) => {
        list.push(e.id);
        return list;
      }, []),
      priorityId: this.state.selectedPriorities.id,
      facultyId: this.state.selectedFaculties.id,
      actionTypeId: this.state.selectedActionTypes.id,
      eventId: this.state.event._id,
    };

    if (this.state.coverUrl !== null) {
      data = {
        ...data,
        coverUrl: this.state.coverUrl,
      };
    }
    await axios
      .post(`${Url()}/api/actions/start`, data, {
        headers: {
          Authorization: await getToken(),
        },
      })
      .then((res) => {
        alert("Tạo thành công");

        client.send(
          JSON.stringify({
            type: "sendListNotifications",
            notifications: res.data.Notifications,
          })
        );

        // this.props.route.params.updateListActions(res.data.action);
        this.props.navigation.navigate("Task", {
          data: res.data.action,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        alert("Tạo thất bại");
      });
  };

  onStepPress = (position) => {
    this.setState({
      currentPage: position,
    });
  };

  onEnableScroll = (value) => {
    this.setState({
      enableScrollViewScroll: value,
    });
  };
  scrollToView = async (e) => {
    if (e) {
      if (Platform.OS === "ios") {
        e.measure((fx, fy, width, height, px, py) => {
          let offset = height + py;

          this.scroller.scrollTo({ x: 0, y: offset });
        });
      } else {
        e.measureLayout(await findNodeHandle(this.scroller), (x, y) => {
          this.scroller.scrollTo({ x: 0, y: y });
        });
      }
    }
  };
  // scroller = React.createRef()
  renderView = () => {
    if (this.state.currentPage === 0) {
      return (
        <View>
          <View styles={styles.ScriptNameContainer}>
            <Text style={styles.Label}>Tên công việc</Text>
            <View>
              <TextInput
                onFocus={() => {
                  this.scroller.scrollTo({ y: 60 });
                }}
                onChangeText={this.onChangeName}
                style={styles.input}
                value={this.state.data.name}
              ></TextInput>
            </View>
            <Text style={styles.Label}>Mô tả công việc</Text>
            <TextInput
              multiline={true}
              numberOfLines={1}
              style={styles.textArea}
              onChangeText={this.onChangeDescrip}
              value={this.state.data.description}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Customdatetime
              containerStyle={styles.ScriptNameContainer}
              labelStyle={styles.Label}
              label="Ngày kết thúc"
              BoxInput={styles.BoxInput}
              Save={(e) => this.onChangeTime("endDate", e)}
              data={this.state.data.endDate}
              mode="date"
            />
            <Customdatetime
              containerStyle={styles.ScriptNameContainer}
              labelStyle={styles.Label}
              label="Giờ kết thúc"
              BoxInput={styles.BoxInput}
              Save={(e) => this.onChangeTime("endTime", e)}
              data={this.state.data.endTime}
              mode="time"
            />
          </View>

          <View
            onFocus={() => this.scrollToView(this.faculty_view)}
            ref={(e) => {
              this.faculty_view = e;
            }}
          >
            <SearchableDropdown
              onItemSelect={(item) => {
                this.setState({
                  selectedFaculties: item,
                });
              }}
              selectedItems={this.state.selectedFaculties}
              defaultIndex={
                this.state.listFaculties.indexOf(
                  this.state.selectedFaculties
                ) !== -1
                  ? this.state.listFaculties.indexOf(
                    this.state.selectedFaculties
                  )
                  : undefined
              }
              containerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: "#ddd",
                borderColor: "#bbb",
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: "#222" }}
              itemsContainerStyle={{ maxHeight: 140 }}
              items={this.state.listFaculties}
              resetValue={false}
              textInputProps={{
                placeholder: "Chọn ban",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  backgroundColor: "white"
                },
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>

          <View style={styles.ScriptNameLabelContainer}>
            <Text style={styles.Label}>Ảnh đại diện</Text>
            {/* <Button title="akjshdkajshdk" onPress={this.scrollToTop}></Button> */}
            <UploadImage
              Save={(e, b) => {
                this.setState({ coverUrl: e, coverUrl_localPath: b });
                this.scroller.scrollToEnd({ animated: true });
              }}
              localPath={this.state.coverUrl_localPath}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View style={styles.ScriptNameLabelContainer}>
            <Text style={styles.Label}>Người quản lý</Text>
            <SearchableDropdown
              onItemSelect={(item) => {
                this.setState({
                  selectedManager: item,
                });
              }}
              selectedItems={this.state.selectedManager}
              defaultIndex={
                this.state.listUser.indexOf(this.state.selectedManager) !== -1
                  ? this.state.listUser.indexOf(this.state.selectedManager)
                  : undefined
              }
              containerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: "#ddd",
                borderColor: "#bbb",
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: "#222" }}
              itemsContainerStyle={{ maxHeight: 140 }}
              items={this.state.listUser}
              resetValue={false}
              textInputProps={{
                placeholder: "Chọn người quản lý",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  backgroundColor: "white"
                },
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>
          <View style={styles.ScriptNameLabelContainer}>
            <Text style={styles.Label}>Phân công cho</Text>
            <View style={styles.Box}>
              <SearchableDropdown
                multi={true}
                chip={true}
                onItemSelect={(item) => {
                  this.setState({
                    selectedUsers: [...this.state.selectedUsers, item],
                  });
                }}
                onRemoveItem={(item, index) => {
                  const items = this.state.selectedUsers.filter(
                    (sitem) => sitem.id !== item.id
                  );
                  this.setState({ selectedUsers: items });
                }}
                selectedItems={this.state.selectedUsers}
                containerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
                itemStyle={{
                  padding: 10,
                  marginTop: 2,
                  backgroundColor: "#ddd",
                  borderColor: "#bbb",
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                itemTextStyle={{ color: "#222" }}
                itemsContainerStyle={{ maxHeight: 140 }}
                items={this.state.listUser}
                resetValue={false}
                textInputProps={{
                  placeholder: "Chọn người phân công",
                  underlineColorAndroid: "transparent",
                  style: {
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                    backgroundColor: "white"
                  },
                }}
                listProps={{
                  nestedScrollEnabled: true,
                }}
              />
            </View>
          </View>
          <View
            style={styles.ScriptNameLabelContainer}
            onFocus={() => this.scrollToView(this.actiontype_view)}
            ref={(e) => {
              this.actiontype_view = e;
            }}
          >
            <Text style={styles.Label}>Loại công việc</Text>
            <SearchableDropdown
              onItemSelect={(item) => {
                this.setState({
                  selectedActionTypes: item,
                });
              }}
              selectedItems={this.state.selectedActionTypes}
              defaultIndex={
                this.state.listActionTypes.indexOf(
                  this.state.selectedActionTypes
                ) !== -1
                  ? this.state.listActionTypes.indexOf(
                    this.state.selectedActionTypes
                  )
                  : undefined
              }
              containerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: "#ddd",
                borderColor: "#bbb",
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: "#222" }}
              itemsContainerStyle={{ maxHeight: 140 }}
              items={this.state.listActionTypes}
              resetValue={false}
              textInputProps={{
                placeholder: "Chọn Loại công việc",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  backgroundColor: "white"
                },
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>
          <View
            style={styles.ScriptNameLabelContainer}
            onFocus={() => this.scrollToView(this.priority_view)}
            ref={(e) => {
              this.priority_view = e;
            }}
          >
            <Text style={styles.Label}>Độ ưu tiên</Text>
            <SearchableDropdown
              onItemSelect={(item) => {
                this.setState({
                  selectedPriorities: item,
                });
              }}
              selectedItems={this.state.selectedPriorities}
              defaultIndex={
                this.state.listPriorities.indexOf(
                  this.state.selectedPriorities
                ) !== -1
                  ? this.state.listPriorities.indexOf(
                    this.state.selectedPriorities
                  )
                  : undefined
              }
              containerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: "#ddd",
                borderColor: "#bbb",
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: "#222" }}
              itemsContainerStyle={{ maxHeight: 140 }}
              items={this.state.listPriorities}
              resetValue={false}
              textInputProps={{
                placeholder: "Chọn độ ưu tiên",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  backgroundColor: "white"
                },
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>

          <View
            style={styles.ScriptNameLabelContainer}
            onFocus={() => this.scrollToView(this.tags_view)}
            ref={(e) => {
              this.tags_view = e;
            }}
          >
            <Text style={styles.Label}>Tags</Text>
            <SearchableDropdown
              multi={true}
              chip={true}
              onItemSelect={(item) => {
                this.setState({
                  selectedTags: [...this.state.selectedTags, item],
                });
              }}
              onRemoveItem={(item, index) => {
                const items = this.state.selectedTags.filter(
                  (sitem) => sitem.id !== item.id
                );
                this.setState({ selectedTags: items });
              }}
              selectedItems={this.state.selectedTags}
              containerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: "#ddd",
                borderColor: "#bbb",
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: "#222" }}
              itemsContainerStyle={{ maxHeight: 140 }}
              items={this.state.listTags}
              resetValue={false}
              textInputProps={{
                placeholder: "Chọn Tags",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  backgroundColor: "white"
                },
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>
          {!this.state.loadingbtn ? (
            <TouchableOpacity
              style={styles.btnUpdate}
              underlayColor="#fff"
              onPress={this.onFinish}
            >
              <Text style={styles.textUpdate}>Xác nhận</Text>
            </TouchableOpacity>
          ) : (
            <Button loading>Loading</Button>
          )}
        </View>
      );
    }
  };

  render() {
    if (!this.state.isLoading) {
      return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : ""}>
          <ScrollView
            ref={(scroller) => {
              this.scroller = scroller;
            }}
            nestedScrollEnabled={true}
            style={{ marginTop: 10 }}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="always"
          >
            <View style={{ marginTop: 10 }}>
              <StepIndicator
                stepCount={2}
                customStyles={customStyles}
                currentPosition={this.state.currentPage}
                onPress={this.onStepPress}
                labels={["Thông tin chung", "Thông tin chi tiết"]}
              />

              {this.renderView()}
              {/* <Swiper
                style={{ flexGrow: 1 }}
                loop={false}
                index={this.state.currentPage}
                autoplay={false}
                showsButtons
                onIndexChanged={(page) => {
                  this.setState({
                    currentPage: page
                  })
                }}
              >
              </Swiper> */}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    } else {
      return (

        <Indicator />

      );
    }
  }
}

export default CreateTask;
