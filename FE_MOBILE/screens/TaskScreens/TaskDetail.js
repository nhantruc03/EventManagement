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
import { ActivityIndicator } from "react-native";

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
      subActions: null,
      currentSubAction: null,
      index: 0,
      loading: false,
      routes: [
        { key: "1", title: "Thông tin chung" },
        { key: "2", title: "Danh sách cần làm" },
        // { key: "3", title: "Hội thoại" },
      ],
    };
    this.renderScene = SceneMap({
      1: this.Route1,
      2: this.Route2,
    });
  }
  Route1 = () => <TaskDetailTab data={this.props.route.params.data} />;

  Route2 = () =>
    this.state.subActions && !this.state.loading ? (
      <SubTasksTab
        updateListSubTask={(e) => this.updateListSubTask(e)}
        data={this.state.subActions}
        actionId={this.props.route.params.data._id}
      />
    ) : (
      <View style={styles.Loading}>
        <ActivityIndicator
          size="large"
          animating
          color="#2A9D8F"
        ></ActivityIndicator>
      </View>
    );

  updateListSubTask = (e) => {
    this.setState({
      subActions: [...this.state.subActions, e],
    });
  };

  async componentDidMount() {
    this._isMounted = true;

    const subActions = await axios
      .post(
        `${Url()}/api/sub-actions/getAll`,
        { actionId: this.props.route.params.data._id },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => res.data.data);
    this.setState({
      subActions: subActions,
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
}

export default TaskDetail;
