import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
} from "react-native";
import { Tabs } from "@ant-design/react-native";
import OrgTab from "../components/OrgTab";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import Url from "../env";
import getToken from "../Auth";
import GuestTab from "../components/GuestTab";
import LoadingIndicator from "../components/helper/Loading";
import { normalizeUnits } from "moment";
import Eventdetails from "../screens/EventDetails";
import ScriptTab from "../components/ScriptTab";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Tabcontainer: {
    flex: 2,
  },
});

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
      loading: true,
    };
    this._isMounted = false;
  }

  renderContent = (tab, index) => {
    const content = this.renderView(index);
    return <View>{content}</View>;
  };

  // test = () => {
  //   return (
  //     // <EventDetail2></EventDetail2>
  //     <Stack.Navigator>
  //       <Stack.Screen
  //         name="ScriptTab"
  //         component={ScriptTab}
  //         initialParams={this.state.listscripts}
  //         options={{
  //           headerShown: false,
  //           headerStyle: {
  //             backgroundColor: "#2A9D8F",
  //           },
  //         }}
  //       />
  //     </Stack.Navigator>
  //   );
  // };

  renderView = (i) => {
    if (i === 0) {
      return <Eventdetails data={this.props.route.params} />;
    } else if (i === 1) {
      return this.state.listOrganizer ? (
        <OrgTab data={this.state.listOrganizer} />
      ) : null;
    } else if (i === 2) {
      return this.state.listscripts ? (
        <ScriptTab
          navigation={this.props.navigation}
          data={this.state.listscripts}
        />
      ) : null;
    } else if (i === 4) {
      return this.state.listGuest ? (
        <GuestTab data={this.state.listGuest} />
      ) : null;
    }
  };

  async componentDidMount() {
    this._isMounted = true;
    // console.log(this.props.route.params.id);
    const [guestTypes, listEventAssign, scripts] = await Promise.all([
      axios
        .post(
          `${Url()}/api/guest-types/getAll`,
          { eventId: this.props.route.params.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        }),
      axios
        .post(
          `${Url()}/api/event-assign/getAll`,
          { eventId: this.props.route.params.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        }),
      axios
        .post(
          `${Url()}/api/scripts/getAll`,
          { eventId: this.props.route.params.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
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
        });
      guests = temp;
    }

    if (this._isMounted) {
      this.setState({
        listOrganizer: listEventAssign,
        listguesttype: guestTypes,
        listGuest: guests,
        loading: false,
        event: this.props.route.params,
        listscripts: scripts,
      });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const tabs = [
      { title: "Thông tin chung" },
      { title: "Ban tổ chức" },
      { title: "Kịch bản" },
      { title: "Hội thoại" },
      { title: "Khách mời" },
    ];
    if (this.props.route.params) {
      return (
        <View style={{ flex: 1 }}>
          {/* <LoadingIndicator /> */}
          <View style={{ flex: 2 }}>
            <Tabs
              initialPage={0}
              tabs={tabs}
              tabBarActiveTextColor="#2A9D8F"
              tabBarInactiveTextColor="#AAB0B6"
              tabBarTextStyle={{
                fontFamily: "semibold",
                marginVertical: 8,
              }}
              tabBarUnderlineStyle={{ backgroundColor: "#2A9D8F" }}
            >
              {/* {this.state.event ?  : null} */}
              {this.renderContent}
            </Tabs>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}
