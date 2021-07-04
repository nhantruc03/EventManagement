import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import OrgTab from "../../components/EventTabs/OrgTab";
import axios from "axios";
import Url from "../../env";
import getToken from "../../Auth";
import GuestTab from "../../components/EventTabs/GuestTab";
import Eventdetails from "./EventDetails";
import ScriptTab from "../../components/EventTabs/ScriptTab";
import { TabView, SceneMap } from "react-native-tab-view";
import { TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import GroupTab from "../../components/EventTabs/GroupTab";
import { ActivityIndicator } from "@ant-design/react-native";
import Indicator from "../../components/helper/Loading";
import getPermission from "../../components/helper/Credentials"
import ApiFailHandler from '../../components/helper/ApiFailHandler'
import { Redirect } from "react-router";
import ParticipantTab from "../../components/EventTabs/ParticipantTab";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Tabcontainer: {
    flex: 2,
    height: 50,
  },
  Loading: {
    justifyContent: "center",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  IconRight: {
    right: 16,
  },
});

const initialLayout = { width: Dimensions.get("window").width };

export default class EventDetail2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      data: null,
      status: "",
      listOrganizer: null,
      listGuest: null,
      listguesttype: null,
      listscripts: null,
      listgroups: null,
      listParticipants: null,
      loading: true,
      index: 0,
      loggout: false,
      routes: [
        { key: "1", title: "Thông tin chung" },
        { key: "2", title: "Ban tổ chức" },
        { key: "3", title: "Kịch bản" },
        { key: "4", title: "Hội thoại" },
        { key: "5", title: "Khách mời" },
        { key: "6", title: "Người tham gia" },
      ],
      loadingBigBO: this.props.route.params.loadBySelf ? true : false,
      currentPermissions: []
    };
    this._isMounted = false;
    this.renderScene = SceneMap({
      1: this.Route1,
      2: this.Route2,
      3: this.Route3,
      4: this.Route4,
      5: this.Route5,
      6: this.Route6,
    });
  }
  Route1 = () => <Eventdetails data={this.props.route.params.loadBySelf ? this.state.event : this.props.route.params.data} />;

  Route2 = () =>
    this.state.listOrganizer && !this.state.loading ? (
      <OrgTab data={this.state.listOrganizer} eventId={this.props.route.params.data._id} />
    ) : (
      <View style={styles.Loading}>
        <Indicator />
      </View>
    );

  Route3 = () =>
    this.state.listscripts && !this.state.loading ? (
      <ScriptTab
        currentPermissions={this.state.currentPermissions}
        navigation={this.props.navigation}
        data={this.state.listscripts}
        updateListScript={(e) => this.updateListScript(e)}
        event={this.state.event}
        eventId={this.props.route.params.data._id}
      />
    ) : (
      <View style={styles.Loading}>
        <Indicator />
      </View>
    );

  Route4 = () =>
    this.state.listgroups && !this.state.loading ? (
      <GroupTab
        navigation={this.props.navigation}
        data={this.state.listgroups}
        eventId={this.props.route.params.data._id}
      />
    ) : (
      <View style={styles.Loading}>
        <Indicator />
      </View>
    );

  Route5 = () =>
    this.state.listGuest && !this.state.loading ? (
      <GuestTab
        currentPermissions={this.state.currentPermissions}
        data={this.state.listGuest}
        eventId={this.props.route.params.data._id} />
    ) : (
      <View style={styles.Loading}>
        <Indicator />
      </View>
    );
  Route6 = () =>
    this.state.listParticipants && !this.state.loading ? (
      <ParticipantTab
        data={this.state.listParticipants}
        eventId={this.props.route.params.data._id} />
    ) : (
      <View style={styles.Loading}>
        <Indicator />
      </View>
    );

  updateListScript = (e) => {
    this.setState({
      listscripts: [...this.state.listscripts, e],
    });
  };

  async componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.IconRight}>
          <TouchableOpacity onPress={() =>
            this.props.navigation.navigate("Report", {
              id: this.props.route.params.data._id
            })}>
            < Ionicons name='documents-outline' size={24} color='white' />
          </TouchableOpacity>
        </View>
      ),
    });
    this._isMounted = true;
    const [
      listgroups,
      guestTypes,
      listEventAssign,
      scripts,
      event,
      permissons,
      participants,
    ] = await Promise.all([
      axios
        .post(
          `${Url()}/api/groups/getAll`,
          { eventId: this.props.route.params.data._id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        })
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .post(
          `${Url()}/api/guest-types/getAll`,
          { eventId: this.props.route.params.data._id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        })
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),

      axios
        .post(
          `${Url()}/api/event-assign/getAll`,
          { eventId: this.props.route.params.data._id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        })
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .post(
          `${Url()}/api/scripts/getAll`,
          { eventId: this.props.route.params.data._id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        })
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .get(`${Url()}/api/events/` + this.props.route.params.data._id, {
          headers: {
            Authorization: await getToken(),
          },
        })
        .then((res) => {
          return res.data.data;
        })
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      getPermission(this.props.route.params.data._id).then(res => res),
      axios.post(`${Url()}/api/participants/getAll`, { eventId: this.props.route.params.data._id }, {
        headers: {
          'Authorization': await getToken(),
        }
      })
        .then((res) =>
          res.data.data
        )
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
    ]);

    let guests = [];
    if (guestTypes !== null) {
      let listguesttype = [];
      guestTypes.forEach((e) => {
        listguesttype.push(e._id);
      });

      const temp = await axios
        .post(
          `${Url()}/api/guests/getAll`,
          { listguesttype: listguesttype },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        })
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        });
      guests = temp;
    }

    if (this._isMounted) {
      this.setState({
        listgroups: listgroups,
        listOrganizer: listEventAssign,
        listguesttype: guestTypes,
        listGuest: guests,
        event: event,
        loading: false,
        listscripts: scripts,
        loadingBigBO: false,
        currentPermissions: permissons,
        listParticipants: participants,
      });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  renderTabBar = (props) => (
    <TabBar
      {...props}
      tabStyle={{ width: "auto" }}
      indicatorStyle={{ backgroundColor: "#2A9D8F", height: 4 }}
      activeColor="#2A9D8F"
      inactiveColor="#AAB0B6"
      style={{
        backgroundColor: "#F6F7F8",
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

    if (this.state.loggout) {
      return (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )
    } else {
      if (!this.state.loadingBigBO) {
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
            style={styles.Tabcontainer}
          />
        );
      } else {
        return (
          <View style={styles.Loading}>
            <ActivityIndicator
              size="large"
              animating
              color="#2A9D8F"
            ></ActivityIndicator>
          </View>
        );
      }
    }
  }
}
