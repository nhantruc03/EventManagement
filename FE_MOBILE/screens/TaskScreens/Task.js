import axios from "axios";
import moment from "moment";
import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import Url from "../../env";
import getToken from "../../Auth";
import SearchableDropdown from "react-native-searchable-dropdown";
import { TabView } from "react-native-tab-view";
import { TabBar } from "react-native-tab-view";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import EventCard from "../../components/EventCard";
import { Button, Modal, Provider } from "@ant-design/react-native";
import AddActionTypeModal from "../../components/AddActionTypeModal";
import Indicator from "../../components/helper/Loading";
import { StatusBar } from "react-native";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import EmptyState from "../../components/EmptyState";
import getPermission from "../../components/helper/Credentials"
import checkPermisson from "../../components/helper/checkPermissions"
import * as constants from "../../components/constant/action";
import Ionicons from 'react-native-vector-icons/Ionicons';
import OptionsMenu from "react-native-options-menu";
import EditActionTypeModal from "../../components/EditActionTypeModal";
import TaskCol from "../../components/TaskCol"
import { Alert } from "react-native";
import Loader from "react-native-modal-loader";
import { Redirect } from "react-router";
import ApiFailHandler from '../../components/helper/ApiFailHandler'
const W = Dimensions.get("window").width;

const initialLayout = { width: W };
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F7F8",
    flex: 1,
  },
  containerIOS: { flex: 1, marginTop: 16, backgroundColor: "#F6F7F8", },
  containerAndroid: { marginTop: StatusBar.currentHeight, flex: 1, backgroundColor: "#F6F7F8", },
  cardImage: {
    width: 276,
    height: 160,
  },
  avaImage: {
    width: 48,
    height: 48,
    borderRadius: 40,
  },
  toplabel: {
    fontFamily: "bold",
    fontSize: 32,
    fontWeight: "500",
    color: "#2A9D8F",
    paddingLeft: 16,
  },
  Tabcontainer: {
    marginLeft: 16,
  },
  AddBtn: {
    right: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    height: 34,
    fontFamily: "bold",
    backgroundColor: "#2A9D8F",
    borderColor: "#2A9D8F",
  },
  BtnText: {
    fontFamily: "semibold",
    fontSize: 16,
    paddingHorizontal: 16,
  },
  titleText: {
    marginVertical: 16,
    fontFamily: "bold",
    fontSize: 18,
  },
  datetime: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  Timeicon: {
    position: "relative",
  },
  Timecontent: {
    marginLeft: 8,
    fontFamily: "semibold",
    fontSize: 14,
    color: "#98A1A5",
  },
  tagContainer: { flex: 1, flexDirection: "row", marginTop: 8 },
  contentContainer: {

  },
  FilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#C4C4C4",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white"
  },
  EditBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#2A9D8F"
  },
  DeleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 8,
    borderRadius: 8,
    borderColor: '#EB5757',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  FilterBtnText: {
    fontFamily: "semibold",
    fontSize: 16,
    marginRight: 8,
    color: "#2A9D8F",
  },
  EditBtnText: {
    fontFamily: "semibold",
    fontSize: 16,
    marginRight: 8,
    color: "white",
  },
  DeleteBtnText: {
    fontFamily: "semibold",
    fontSize: 16,
    marginRight: 8,
    color: "#EB5757",
  },
});

const myIcon = (<TouchableOpacity>
  <View style={styles.EditBtn}>
    <Text style={styles.EditBtnText}>Tuỳ chỉnh</Text>
    <Ionicons name='ellipsis-vertical-circle' size={24} color='white' />
  </View>
</TouchableOpacity>)

class Taskscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      SearchData: [],
      loading: true,
      index: 0,
      routes: [],
      currentEvent: {},
      currentActionTypes: [],
      currentActions: [],
      selectedItems: {},
      visible: false,
      visible2: false,
      chosen: false,
      currentPermissions: [],
      ActionTypeForEdit: {},
      currentEditActionType: {},
      deleteLoading: false,
      loggout: false,
    };
    this._isMounted = false;
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.route.params?.data !== this.props.route.params?.data) {
      const result = this.props.route.params?.data;

      // this._onSelectCountry(result);

      // await this.onChangeEvent(result);
      this.updateListActions(result);
    }
  }



  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  onClose2 = () => {
    this.setState({
      visible2: false,
    });
  };
  async componentDidMount() {
    this._isMounted = true;
    var login = await AsyncStorage.getItem("login");
    var obj = JSON.parse(login);
    let temp = moment(new Date()).utcOffset(0).format('YYYY-MM-DD')
    const [future_event, ongoing_event, past_event] = await Promise.all([
      axios
        .post(
          `${Url()}/api/events/getAll?gt=${temp}`,
          { isClone: false },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .post(
          `${Url()}/api/events/getAll?eq=${temp}`,
          { isClone: false },
          {
            headers: {
              Authorization: await getToken()
              ,
            },
          }
        )
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .post(
          `${Url()}/api/events/getAll?lt=${temp}`,
          { isClone: false },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
    ]);

    if (
      future_event !== null &&
      ongoing_event !== null &&
      past_event !== null
    ) {
      if (this._isMounted) {
        this.setState({
          loading: false,
          data: [...future_event, ...ongoing_event, ...past_event],
        });
      }
    }
  }

  onChangeEvent = async (id) => {
    this.setState({
      loading: true,
    });
    const [actionTypes, falcuties, actions, permissions] = await Promise.all([
      axios
        .post(
          `${Url()}/api/action-types/getAll`,
          { eventId: id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .post(
          `${Url()}/api/faculties/getAll`,
          { eventId: id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .post(
          `${Url()}/api/actions/getAll`,
          { eventId: id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      getPermission(id).then(res => res)
    ]);
    if (actionTypes !== null && falcuties !== null && actions !== null) {
      let temp_routes = [];
      actionTypes.forEach((e) => {
        let temp = {
          key: e._id,
          title: e.name,
        };
        temp_routes.push(temp);
      });
      let temp = this.state.data.filter((e) => e._id === id);
      this.setState({
        currentActionTypes: actionTypes,
        currentFaculties: falcuties,
        currentActions: actions,
        temp_data: actions,
        routes: temp_routes,
        currentEvent: temp[0],
        loading: false,
        currentPermissions: permissions
      });
    }
  };

  EditActionType = (e) => {
    this.setState({
      visible2: true,
      currentEditActionType: e
    })
  }

  DeleteAlert = (e) => {
    Alert.alert(
      //title
      'Xoá loại công việc',
      //body
      `Bạn có chắc muốn xoá ? `,
      [
        {
          text: 'Cancel', onPress: () => console.log('Cancel')
        },
        {
          text: 'Xoá', onPress: () => this.DeleteActionType(e), style: 'destructive'
        },
      ],
      { cancelable: false },
    );
  }

  onDeleteLoading() {
    this.setState({
      deleteLoading: true,
    });
  }

  DeleteActionType = async (value) => {
    this.onDeleteLoading()
    const result = await axios.delete(`${Url()}/api/action-types/${value}`, {
      headers: {
        Authorization: await getToken(),
      },
    })
      .then((res) => {
        this.setState({ deleteLoading: !this.state.deleteLoading })
        alert("Xóa thành công")
        return res.data.data;

      })
      .catch(err => {
        let errResult = ApiFailHandler(err.response?.data?.error)
        this.setState({
          loggout: errResult.isExpired
        })
        alert("Xoá thất bại")
      })
    if (result) {
      this.setState({
        currentActionTypes: this.state.currentActionTypes.filter(x => x._id !== result._id),
        routes: this.state.routes.filter(x => x.key !== result._id),
        index: 0
      })
    }
  }

  test = () => {
  }

  renderTask = ({ route }) => {
    let temp_listActions = this.state.currentActions.filter(
      (e) => e.actionTypeId._id === route.key
    );

    // apply filter here

    // render
    return (
      <TaskCol
        eventId={this.state.currentEvent._id}
        currentPermissions={this.state.currentPermissions}
        deleteItemInCurrentActions={(e) => this.deleteItemInCurrentActions(e)}
        navigation={this.props.navigation}
        route={route}
        data={temp_listActions}
        EditActionType={(e) => this.EditActionType(e)}
        DeleteAlert={(e) => this.DeleteAlert(e)}
        updateFullListCurrentAction={(e) => this.updateFullListCurrentAction(e)}
      />
    )
  };



  updateFullListCurrentAction = (e) => {
    this.setState({
      currentActions: e
    })
  }

  updateListActions = (e) => {
    this.setState({
      currentActions: [...this.state.currentActions, e],
    });
  };

  deleteItemInCurrentActions = (e) => {
    this.setState({
      currentActions: this.state.currentActions.filter(x => x._id !== e)
    })
  }

  renderTabBar = (props) => (
    <TabBar
      {...props}
      tabStyle={{ width: "auto" }}
      indicatorStyle={{ backgroundColor: "#2A9D8F" }}
      activeColor="#2A9D8F"
      inactiveColor="#AAB0B6"
      style={{
        backgroundColor: "F6F7F8",
        width: W * 0.9,
      }}
      labelStyle={{
        fontFamily: "bold",
        fontSize: 14,
        textTransform: "capitalize",
      }}
      scrollEnabled={true}
    />

  );

  addActionTypes = (e) => {
    this.setState({
      currentActionTypes: [...this.state.currentActionTypes, e],
      routes: [...this.state.routes, { key: e._id, title: e.name }],
    });
  };

  editActionTypes = (e) => {
    let temp_currentActionTypes = this.state.currentActionTypes
    temp_currentActionTypes.forEach(x => {
      if (x._id === e._id) {
        x.name = e.name
      }
    })

    let temp_routes = this.state.routes
    temp_routes.forEach(x => {
      if (x.key === e._id) {
        x.title = e.name
      }
    })
    this.setState({
      currentActionTypes: temp_currentActionTypes,
      routes: temp_routes
    });
  };

  renderTabView = () => {
    if (!this.state.loading) {
      if (this.state.currentEvent && this.state.currentActionTypes.length > 0) {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <TabView
              renderTabBar={this.renderTabBar}
              navigationState={{
                index: 0,
                routes: this.state.routes,
              }}
              renderScene={this.renderTask}
              onIndexChange={this.setIndex}
              initialLayout={initialLayout}
              style={styles.Tabcontainer}
            />
            <TouchableOpacity onPress={() => this.setState({ visible: true })}>
              <Image
                style={{ marginRight: 16, marginTop: 15, }}
                source={require("../../assets/images/Add.png")}
              ></Image>
            </TouchableOpacity>
          </View >
        );
      } else {
        return null;
      }
    }
    else {
      return <Indicator />;
    }
  };
  updateListListActionType = (e) => {
    this.setState({
      data: [...this.state.data, e],
    });
    this.props.updateListListActionType(e);
  };

  setIndex = (index) => {
    this.setState({
      index,
    });
  };

  renderEmptyState = () => {
    if (!this.state.loading) {
      if (!this.state.chosen) {
        return (
          <EmptyState />
        )
      }
    } else return null
  }

  renderCreateBtn() {
    if (this.state.chosen) {
      if (checkPermisson(this.state.currentPermissions, constants.QL_CONGVIEC_PERMISSION)) {
        return (
          <Button
            type="primary"
            size="small"
            style={styles.AddBtn}
            activeStyle={{ color: "white" }}
            onPress={() =>
              this.props.navigation.navigate("CreateTask", {
                event: this.state.currentEvent,
                navigation: this.props.navigation,
                updateListActions: (e) => this.updateListActions(e)
              })
            }
          >
            <Text style={styles.BtnText}>Tạo mới +</Text>
          </Button>
        )
      } else return null
    } else return null
  }

  render() {
    if (this.state.loggout) {
      return (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )
    }
    else return (
      <Provider>
        <Loader loading={this.state.deleteLoading} color="white" size="large" />
        <View
          style={
            Platform.OS == "ios" ? styles.containerIOS : styles.containerAndroid
          }
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.toplabel}>Công việc</Text>
            {this.renderCreateBtn()}
          </View>
          {this.renderEmptyState()}
          <SearchableDropdown
            onItemSelect={(item) => {
              this.setState({ selectedItems: item, chosen: true });
              this.onChangeEvent(item._id);
            }}
            selectedItems={this.state.selectedItems}
            containerStyle={{ paddingHorizontal: 16, paddingVertical: 12, }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: "#ddd",
              borderColor: "#bbb",
              borderWidth: 1,
              borderRadius: 5,
              zIndex: 2,
            }}
            itemTextStyle={{ color: "#222" }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={this.state.data}
            resetValue={false}
            textInputProps={{
              placeholder: "Chọn sự kiện",
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
              nestedScrollEnabled: false,
            }}
          />


          {this.renderTabView()}
          <Modal
            title="Loại công việc mới"
            transparent
            onClose={this.onClose}
            maskClosable
            visible={this.state.visible}
            closable
          >
            <AddActionTypeModal
              onClose={this.onClose}
              eventId={this.state.currentEvent._id}
              addActionTypes={(e) => this.addActionTypes(e)}
            />
          </Modal>
          <Modal
            title="Chỉnh sửa loại công việc"
            transparent
            onClose={this.onClose2}
            maskClosable
            visible={this.state.visible2}
            closable
          >
            <EditActionTypeModal
              data={this.state.currentEditActionType}
              onClose2={this.onClose2}
              eventId={this.state.currentEvent._id}
              editActionTypes={(e) => this.editActionTypes(e)}
            />
          </Modal>
        </View>
      </Provider>
    );
  }
}

export default Taskscreen;
