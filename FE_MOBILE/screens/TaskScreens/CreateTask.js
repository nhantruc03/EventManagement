import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Customdatetime from "../../components/helper/datetimepicker";
import SearchableDropdown from "react-native-searchable-dropdown";
import Url from "../../env";
import getToken from "../../Auth";
import axios from "axios";
import { ActivityIndicator } from "react-native";
import StepIndicator from "react-native-step-indicator";
import UploadImage from "../../components/helper/UploadImage";
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
    backgroundColor: '#ffffff',
  },
  ScriptNameContainer: {
    width: '50%',
    paddingHorizontal: 5
  }
});
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#7eaec4',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#7eaec4',
  stepStrokeUnFinishedColor: '#dedede',
  separatorFinishedColor: '#7eaec4',
  separatorUnFinishedColor: '#dedede',
  stepIndicatorFinishedColor: '#7eaec4',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#7eaec4',
};
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
      selectedActionTypes: {}
    }
  }

  async componentDidMount() {
    const [tags, priorities, faculties, actionstypes] = await Promise.all([
      axios.post(`${Url()}/api/action-tags/getAll`, {}, {
        headers: {
          'Authorization': await getToken()
        }
      })
        .then((res) =>
          res.data.data
        ),
      axios.post(`${Url()}/api/action-priorities/getAll`, {}, {
        headers: {
          'Authorization': await getToken()
        }
      })
        .then((res) =>
          res.data.data
        ),
      axios.post(`${Url()}/api/faculties/getAll`,
        { eventId: this.props.route.params.event._id },
        {
          headers: {
            'Authorization': await getToken()
          }
        })
        .then((res) =>
          res.data.data
        ),
      axios.post(`${Url()}/api/action-types/getAll`,
        { eventId: this.props.route.params.event._id },
        {
          headers: {
            'Authorization': await getToken()
          }
        })
        .then((res) =>
          res.data.data
        ),
    ])

    if (tags !== undefined && priorities !== undefined) {
      let event = this.props.route.params.event;
      let temp_listUser = event.availUser.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        }
        list.push(temp)
        return list
      }, []);

      let temp_tags = tags.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        }
        list.push(temp)
        return list
      }, []);

      let temp_priorities = priorities.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        }
        list.push(temp)
        return list
      }, []);

      let temp_faculties = faculties.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        }
        list.push(temp)
        return list
      }, []);

      let temp_actiontypes = actionstypes.reduce((list, e) => {
        let temp = {
          id: e._id,
          name: e.name,
        }
        list.push(temp)
        return list
      }, []);

      this.setState({
        event: this.props.route.params.event,
        listUser: temp_listUser,
        listTags: temp_tags,
        listPriorities: temp_priorities,
        isLoading: false,
        listFaculties: temp_faculties,
        listActionTypes: temp_actiontypes
      })
    }
  }
  onChangeTime = (name, time) => {
    // console.log("receive", time);
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

  onFinish = async () => {

    let data = {
      ...this.state.data,
      managerId: this.state.selectedManager.id,
      availUser: this.state.selectedUsers.reduce((list, e) => { list.push(e.id); return list }, []),
      tagsId: this.state.selectedTags.reduce((list, e) => { list.push(e.id); return list }, []),
      priorityId: this.state.selectedPriorities.id,
      facultyId: this.state.selectedFaculties.id,
      actionTypeId: this.state.selectedActionTypes.id,
      eventId: this.state.event._id
    }

    if (this.state.coverUrl !== null) {
      data = {
        ...data,
        coverUrl: this.state.coverUrl
      }
    }

    console.log(data)

    await axios.post(`${Url()}/api/actions/start`, data, {
      headers: {
        'Authorization': await getToken()
      }
    })
      .then(res => {
        alert('Tạo thành công');


        // client.send(JSON.stringify({
        //   type: "sendListNotifications",
        //   notifications: res.data.Notifications
        // }))

        this.props.route.params.updateListActions(res.data.action)
      })
      .catch(err => {
        console.log(err.response)
        // message.error('Tạo thất bại');
        alert("Tạo thất bại")
      })

    // this.props.route.params.updateListActions("test")
  }

  onStepPress = (position) => {
    this.setState({
      currentPage: position
    })
  };

  renderView = () => {
    if (this.state.currentPage === 0) {
      return (
        <View>
          <View styles={styles.ScriptNameContainer}>
            <Text style={styles.Label}>Tên công việc</Text>
            <View style={styles.BoxInput}>
              <TextInput
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
          <View style={{ flexDirection: 'row' }}>
            <Customdatetime
              containerStyle={styles.ScriptNameContainer}
              labelStyle={styles.Label}
              label="Ngày bắt đầu"
              BoxInput={styles.BoxInput}
              Save={(e) => this.onChangeTime("startDate", e)}
              data={this.state.data.startDate}
              mode="date"
            />
            <Customdatetime
              containerStyle={styles.ScriptNameContainer}
              labelStyle={styles.Label}
              label="Ngày kết thúc"
              BoxInput={styles.BoxInput}
              Save={(e) => this.onChangeTime("endDate", e)}
              data={this.state.data.endDate}
              mode="date"
            />
          </View>
          <SearchableDropdown
            onItemSelect={(item) => {
              this.setState({
                selectedFaculties: item
              });
            }}
            selectedItems={this.state.selectedFaculties}
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
              },
            }}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />

          <View style={styles.ScriptNameLabelContainer}>
            <Text style={styles.Label}>Ảnh đại diện</Text>
            <UploadImage Save={(e, b) => { this.setState({ coverUrl: e, coverUrl_localPath: b }) }} localPath={this.state.coverUrl_localPath} />
          </View>
        </View>
      )
    }
    else {
      return (
        <View>
          <View style={styles.ScriptNameLabelContainer}>
            <Text style={styles.Label}>Người quản lý</Text>
            <SearchableDropdown
              onItemSelect={(item) => {
                this.setState({
                  selectedManager: item
                });
              }}
              selectedItems={this.state.selectedManager}
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
                // chip={true}
                onItemSelect={(item) => {
                  this.setState({
                    selectedUsers: [...this.state.selectedUsers, item]
                  });
                }}
                onRemoveItem={(item, index) => {
                  const items = this.state.selectedUsers.filter((sitem) => sitem.id !== item.id);
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
                  },
                }}
                listProps={{
                  nestedScrollEnabled: true,
                }}
              />
            </View>
          </View>
          <View style={styles.ScriptNameLabelContainer}>
            <Text style={styles.Label}>Loại công việc</Text>
            <SearchableDropdown
              onItemSelect={(item) => {
                this.setState({
                  selectedActionTypes: item
                });
              }}
              selectedItems={this.state.selectedActionTypes}
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
                },
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>
          <View style={styles.ScriptNameLabelContainer}>
            <Text style={styles.Label}>Độ ưu tiên</Text>
            <SearchableDropdown
              onItemSelect={(item) => {
                this.setState({
                  selectedPriorities: item
                });
              }}
              selectedItems={this.state.selectedPriorities}
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
                },
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>

          <View style={styles.ScriptNameLabelContainer}>
            <Text style={styles.Label}>Tags</Text>
            <SearchableDropdown
              multi={true}
              // chip={true}
              onItemSelect={(item) => {
                this.setState({
                  selectedTags: [...this.state.selectedTags, item]
                });
              }}
              onRemoveItem={(item, index) => {
                const items = this.state.selectedTags.filter((sitem) => sitem.id !== item.id);
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
                },
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>


          <TouchableOpacity
            style={styles.btnUpdate}
            underlayColor="#fff"
            onPress={this.onFinish}
          >
            <Text style={styles.textUpdate}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    if (!this.state.isLoading) {
      return (

        <View style={{ marginTop: 10 }}>
          <StepIndicator
            stepCount={2}
            customStyles={customStyles}
            currentPosition={this.state.currentPage}
            onPress={this.onStepPress}
            labels={['Thông tin chung', 'Thông tin chi tiết']}
          />

          {this.renderView()}
        </View>
      );
    } else {
      return (
        <View>
          <ActivityIndicator size="large" animating color="#2A9D8F"></ActivityIndicator>
        </View>
      )
    }
  }
}

export default CreateTask;
