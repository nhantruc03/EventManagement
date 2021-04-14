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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Tabcontainer: {},
});

export default class EventDetail2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      data: null,
      status: "",
      listOrganizer: [],
      listGuest: [],
      listguesttype: [],
    };
  }
  async componentDidMount() {
    this._isMounted = true;
    const [guestTypes, listEventAssign] = await trackPromise(
      Promise.all([
        axios
          .post(
            `${Url()}/api/guest-types/getAll`,
            { eventId: this.props.route.params.ID },
            {
              headers: {
                Authorization: await getToken(),
              },
            }
          )
          .then((res) => res.data.data),
        axios
          .post(
            `${Url()}/api/event-assign/getAll`,
            { eventId: this.props.route.params.ID },
            {
              headers: {
                Authorization: await getToken(),
              },
            }
          )
          .then((res) => res.data.data),
      ])
    );
    let guests = null;
    if (guestTypes !== null) {
      let listguesttype = [];
      guestTypes.forEach((e) => {
        listguesttype.push(e._id);
      });

      const [temp] = await trackPromise(
        Promise.all([
          axios
            .post(
              `${Url()}/api/guests/getAll`,
              { listguesttype: listguesttype },
              {
                headers: {
                  Authorization: await getToken(),
                },
              }
            )
            .then((res) => res.data.data),
        ])
      );
      guests = temp;
    }
    if (this._isMounted) {
      if (listEventAssign !== undefined) {
        console.log("Organizer", listEventAssign);
        // console.log("name", listEventAssign[0].userId.name);
        this.setState({
          listOrganizer: listEventAssign,
        });
      }
      if (guestTypes !== null) {
        console.log("guestypes", guestTypes);
        this.setState({
          listguesttype: guestTypes,
        });

        if (guests !== null) {
          console.log("guest", guests);
          this.setState({
            listGuest: guests,
          });
        }
      }
    }
  }
  render() {
    const tabs = [
      { title: "Ban tổ chức" },
      { title: "Kịch bản" },
      { title: "Hội thoại" },
      { title: "Khách mời" },
    ];

    return (
      <View style={styles.container}>
        <Tabs
          style={styles.Tabcontainer}
          tabs={tabs}
          tabBarActiveTextColor="#2A9D8F"
          tabBarInactiveTextColor="#AAB0B6"
          tabBarTextStyle={{
            fontFamily: "semibold",
            marginVertical: 8,
          }}
          tabBarUnderlineStyle={{ backgroundColor: "#2A9D8F" }}
        >
          <View style={styles}>
            <OrgTab data={this.state.listOrganizer}></OrgTab>
          </View>
          <View style={styles}></View>
          <View style={styles}>
            <Text>Content of Third Tab</Text>
          </View>
          <View style={styles}>
            <GuestTab
              data={this.state.listGuest}
              guestTypes={this.state.listguesttype}
            ></GuestTab>
          </View>
        </Tabs>
      </View>
    );
  }
}
