import axios from "axios";
import moment from "moment";
import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import Url from "../env";
import getToken from "../Auth";
import SearchableDropdown from "react-native-searchable-dropdown";
import { TabView } from "react-native-tab-view";
import { TabBar } from "react-native-tab-view";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import EventCard from "../components/EventCard";
import { Modal, Provider } from "@ant-design/react-native";
import AddActionTypeModal from "../components/AddActionTypeModal";

const W = Dimensions.get("window").width;

const initialLayout = { width: W };
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F7F8",
    flex: 1,
  },
  cardImage: {
    width: 300,
    height: 200,
  },
  avaImage: {
    width: 48,
    height: 48,
    borderRadius: 40,
  },
  toplabel: {
    fontFamily: "bold",
    fontSize: 32,
    paddingTop: 16,
    fontWeight: "500",
    color: "#2A9D8F",
    backgroundColor: "#F6F7F8",
    paddingLeft: 16,
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
});

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
      selectedItems: {},
      visible: false,
    };
    this._isMounted = false;
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  async componentDidMount() {
    this._isMounted = true;
    let temp = moment(new Date()).format("YYYY-MM-DD");
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
        .then((res) => res.data.data),
      axios
        .post(
          `${Url()}/api/events/getAll?eq=${temp}`,
          { isClone: false },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
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
        .then((res) => res.data.data),
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
          SearchData: [...future_event, ...ongoing_event, ...past_event],
        });
      }
    }
  }

  onChangeEvent = async (id) => {
    const [actionTypes, falcuties, actions] = await Promise.all([
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
        .then((res) => res.data.data),
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
        .then((res) => res.data.data),
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
        .then((res) => res.data.data),
    ]);
    if (actionTypes !== null && falcuties !== null && actions !== null) {
      // { key: "1", title: "Thông tin chung" }
      let temp_routes = [];
      actionTypes.forEach((e) => {
        let temp = {
          key: e._id,
          title: e.name,
        };
        temp_routes.push(temp);
      });

      this.setState({
        currentActionTypes: actionTypes,
        currentFaculties: falcuties,
        currentActions: actions,
        temp_data: actions,
        routes: temp_routes,
      });
      let temp = this.state.data.filter((e) => e._id === id);
      this.setState({
        currentEvent: temp[0],
      });
    }
    // load actions
    // set state actions
  };

  renderTask = ({ route }) => {
    let temp_listActions = this.state.currentActions.filter(
      (e) => e.actionTypeId._id === route.key
    );
    console.log(temp_listActions);
    return (
      <View>
        <FlatList
          data={temp_listActions}
          renderItem={({ item }) => this.renderItem(item)}
          keyExtractor={(item) => item._id}
          style={{ marginLeft: 12 }}
        />
      </View>
    );
  };

  renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("EventDetail2", {
            id: item._id,
            name: item.name,
            description: item.description,
            time: item.startTime,
            date: item.startDate,
            location: item.address,
            tag: item.tagId,
            poster: `${Url()}/api/images/${item.posterUrl}`,
          })
        }
      >
        <EventCard>
          <Image
            style={styles.cardImage}
            source={{
              uri: `${Url()}/api/images/${item.coverUrl}`,
            }}
          ></Image>
          <Text style={styles.titleText}>{item.name}</Text>
          <View style={styles.datetime}>
            <Image
              style={styles.Timeicon}
              source={require("../assets/images/timesolid.png")}
            ></Image>
            <Text style={styles.Timecontent}>
              {moment(item.startDate).format("DD/MM/YYYY")} -{" "}
              {moment(item.startTime).format("HH:MM")}
            </Text>
          </View>
          <View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.tagContainer}>
                {item.tagsId.map((value, key) => (
                  <View
                    style={{
                      backgroundColor: value.background,
                      marginRight: 10,
                      paddingHorizontal: 10,
                      borderRadius: 16,
                    }}
                    key={key}
                  >
                    <Text
                      style={{
                        color: value.color,
                        marginVertical: 4,
                        fontFamily: "regular",
                        fontSize: 16,
                      }}
                    >
                      {value.name}
                    </Text>
                  </View>
                ))}
              </View>
              <View>
                {item.availUser.map((value, key) => (
                  <View
                    style={{
                      marginRight: 10,
                      paddingHorizontal: 10,
                      borderRadius: 16,
                    }}
                    key={key}
                  >
                    <Image
                      style={styles.avaImage}
                      source={{
                        uri: `${Url()}/api/images/${value.photoUrl}`,
                      }}
                    ></Image>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </EventCard>
      </TouchableOpacity>
    );
  };
  renderList = () => {
    if (this.state.currentEvent) {
      return (
        <TabView
          renderTabBar={this.renderTabBar}
          navigationState={{
            index: this.state.index,
            routes: this.state.routes,
          }}
          renderScene={this.renderScene}
          onIndexChange={this.setIndex}
          initialLayout={initialLayout}
          style={styles.container}
        />
      );
    } else {
      return <View></View>;
    }
  };

  renderTabBar = (props) => (
    <TabBar
      {...props}
      tabStyle={{ width: "auto" }}
      indicatorStyle={{ backgroundColor: "#2A9D8F" }}
      activeColor="#2A9D8F"
      inactiveColor="#AAB0B6"
      style={{
        backgroundColor: "F6F7F8",
        paddingVertical: 5,
        width: W * 0.8,
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

  renderTabView = () => {
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
              index: this.state.index,
              routes: this.state.routes,
            }}
            renderScene={this.renderTask}
            onIndexChange={this.setIndex}
            initialLayout={initialLayout}
            style={styles.Tabcontainer}
          />
          <TouchableOpacity onPress={() => this.setState({ visible: true })}>
            <Image
              style={{ right: 16, marginTop: 20 }}
              source={require("../assets/images/Add.png")}
            ></Image>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View></View>;
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

  render() {
    return (
      <Provider>
        <View style={styles.container}>
          <Text style={styles.toplabel}>Công việc</Text>
          <SearchableDropdown
            onItemSelect={(item) => {
              this.setState({ selectedItems: item });
              this.onChangeEvent(item._id);
            }}
            selectedItems={this.state.selectedItems}
            containerStyle={{ padding: 5 }}
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
            items={this.state.data}
            resetValue={false}
            textInputProps={{
              placeholder: "placeholder",
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
        </View>
      </Provider>
    );
  }
}

export default Taskscreen;
