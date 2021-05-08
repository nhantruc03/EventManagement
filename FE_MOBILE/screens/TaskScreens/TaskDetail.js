import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import Url from "../../env";
import getToken from "../../Auth";
import { TabView, SceneMap } from "react-native-tab-view";
import { TabBar } from "react-native-tab-view";
import TaskDetailTab from "../../components/TaskTabs/TaskDetailTab";
import SubTasksTab from "../../components/TaskTabs/SubTasksTab";
import CommentTab from "../../components/TaskTabs/CommentTab";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import Indicator from "../../components/helper/Loading";

const initialLayout = { width: Dimensions.get("window").width };
const styles = StyleSheet.create({
  Tabcontainer: {
    flex: 2,
    height: 50,
  },
  container: { flex: 1, backgroundColor: "#F6F7F8" },
  formContainer: { padding: 16, zIndex: 3 },
  Text: {
    marginLeft: 8,
    fontFamily: "semibold",
    fontSize: 16,
    color: "#2A9D8F",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  itemContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  itemTextNameDone: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 16,
    textDecorationLine: "line-through",
  },
  itemTextNameUnDone: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 16,
  },
});

class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loadingBigObject: true,
      subActions: null,
      currentSubAction: null,
      index: 0,
      loading: false,
      routes: [
        { key: "1", title: "Thông tin chung" },
        { key: "2", title: "Danh sách cần làm" },
        { key: "3", title: "Bình luận" },
      ],
    };
    this.renderScene = SceneMap({
      1: this.Route1,
      2: this.Route2,
      3: this.Route3,
    });
  }
  Route1 = () => <TaskDetailTab data={this.state.data} />;

  Route2 = () =>
    this.state.subActions && !this.state.loading ? (
      <SubTasksTab
        updateListSubTask={(e) => this.updateListSubTask(e)}
        data={this.state.subActions}
        actionId={this.state.data._id}
      />
    ) : (
      <Indicator />
    );
  Route3 = () => <CommentTab actionId={this.state.data._id} />;

  updateListSubTask = (e) => {
    this.setState({
      subActions: [...this.state.subActions, e],
    });
  };


  updateData = (e) => {
    this.setState({
      data: e
    })
  }

  async componentDidMount() {
    this._isMounted = true;
    let temp_data = {}
    if (this.props.route.params.loadBySelf) {
      const data_loadBySelf = await axios
        .get(
          `${Url()}/api/actions/${this.props.route.params.actionId}`,
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data);
      temp_data = data_loadBySelf
    } else {
      temp_data = this.props.route.params.data
    }
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.IconRight}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("EditTask", {
                data: temp_data,
                updateData: (e) => this.updateData(e)
              })
            }
          >
            <Image source={require("../../assets/images/preview.png")} />
          </TouchableOpacity>
        </View>
      ),
    });
    const subActions = await axios
      .post(
        `${Url()}/api/sub-actions/getAll`,
        { actionId: temp_data._id },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => res.data.data);
    this.setState({
      subActions: subActions,
      data: temp_data,
      loadingBigObject: false
    });
  }

  renderTabBar = (props) => (
    <TabBar
      {...props}
      tabStyle={{ width: "auto" }}
      indicatorStyle={{ backgroundColor: "#2A9D8F", height: 4 }}
      activeColor="#2A9D8F"
      inactiveColor="#AAB0B6"
      style={{
        backgroundColor: "F6F7F8",
        paddingVertical: 5,
      }}
      scrollEnabled={true}
    />
  );
  setIndex = (index) => {
    this.setState({
      index,
    });
  };
  render() {
    if (!this.state.loadingBigObject) {
      return (
        <View style={styles.container}>
          <TabView
            renderTabBar={this.renderTabBar}
            navigationState={{
              index: this.state.index,
              routes: this.state.routes,
            }}
            renderScene={this.renderScene}
            onIndexChange={this.setIndex}
            initialLayout={initialLayout}
            style={styles.Tabcontainer}
          />
        </View>
      );
    }
    else {
      return (
        <Indicator />
      )
    }
  }
}

export default TaskDetail;
