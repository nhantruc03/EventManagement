import React, { Component } from "react";

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Search from "../helper/search";
import axios from "axios";
import Url from "../../env";
import getToken from "../../Auth";
import { RefreshControl } from "react-native";
import { Redirect } from "react-router";
import ApiFailHandler from '../helper/ApiFailHandler'

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  itemTextName: {
    color: "#264653",
    fontFamily: "semibold",
    fontSize: 18,
    marginBottom: 4,
  },
});

export default class GroupTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      SearchData: [],
      refreshing: false,
      loggout: false,
    };
  }



  UNSAFE_componentWillReceiveProps(e) {
    this.setState({
      data: e.data,
    });
  }
  onRefresh = async () => {
    this.setState({
      refreshing: true,
    });
    await axios
      .post(
        `${Url()}/api/guest-types/getAll`,
        { eventId: this.props.eventId },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => {
        this.setState({
          refreshing: false,
          SearchData: res.data.data
        });
      })
      .catch(err => {
        let errResult = ApiFailHandler(err.response?.data?.error)
        this.setState({
          loggout: errResult.isExpired
        })
      });
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
      SearchData: this.props.data,
    });
  }
  getSearchData1 = (data) => {
    this.setState({
      SearchData: data,
    });
  };

  renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("Phòng hội thoại", {
            id: item._id,
            name: item.name,
          })
        }
      >
        <View style={styles.itemContainer}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTextName}>{item.name}</Text>
          </View>
          <View style={styles.checkboxContainer}></View>
        </View>
      </TouchableOpacity>
    );
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
      return (
        <SafeAreaView>
          <Search
            target="name"
            data={this.state.data}
            getSearchData={(e) => this.getSearchData1(e)}
          ></Search>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            data={this.state.SearchData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => this.renderItem(item)}
          />
        </SafeAreaView>
      );
    }
  }
}
