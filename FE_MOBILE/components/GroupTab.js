import React, { Component } from "react";

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Search from "./helper/search";

import axios from "axios";
import Url from "../env";
import getToken from "../Auth";

const styles = StyleSheet.create({
  headerContainer: {
    marginVertical: 8,
    marginLeft: 16,
  },
  headerText: {
    fontFamily: "bold",
    fontSize: 16,
    color: "#AAB0B6",
  },
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
    };
  }

  changeStatus = async (e) => {
    await axios
      .put(
        `${Url()}/api/guests/` + e._id,
        { status: !e.status },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then(() => {
        let temp_data = this.state.data;
        temp_data.forEach((element) => {
          if (element._id === e._id) {
            element.status = !e.status;
          }
        });
        this.setState({
          data: temp_data,
          SearchData: temp_data,
        });
        // this.props.updateGuest(temp_data);
        // console.log("temp_data", temp_data);
        alert(`Trạng thái của khách mời ${e.name} cập nhật thành công`);
      })
      .catch(() => {
        alert(`Trạng thái của khách mời ${e.name} cập nhật thất bại`);
      });
  };

  UNSAFE_componentWillReceiveProps(e) {
    // console.log("should update", e);
    this.setState({
      data: e.data,
    });
  }

  componentDidMount() {
    // console.log('list groups', this.props.data)
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
    return (
      <SafeAreaView>
        <Search
          target="name"
          data={this.state.data}
          getSearchData={(e) => this.getSearchData1(e)}
        ></Search>
        <FlatList
          data={this.state.SearchData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => this.renderItem(item)}
        />
      </SafeAreaView>
    );
  }
}
