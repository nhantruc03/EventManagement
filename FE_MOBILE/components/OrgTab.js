import React, { Component } from "react";

import { SafeAreaView, View, Text, Image, StyleSheet } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { SearchBar } from "react-native-elements";
import Search from "./helper/search";
import Url from "../env";
import { ActivityIndicator } from "@ant-design/react-native";

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "#F6F7F8",
  },
  AvaImg: {
    width: 48,
    height: 48,
    borderRadius: 40,
  },
  ListContainer: {
    backgroundColor: "#F6F7F8",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    paddingVertical: 8,
  },
  secondColumn: {
    flex: 2,
    flexDirection: "column",
    marginLeft: 8,
  },
  seperator: {
    backgroundColor: "#D3D3D3",
    height: 0.5,
  },
  textName: {
    fontFamily: "semibold",
    fontSize: 16,
    color: "#264653",
  },
  textRole: {
    fontFamily: "regular",
    fontSize: 12,
    color: "#AAB0B6",
  },
  textFaculty: {
    fontFamily: "semibold",
    fontSize: 14,
    color: "#AAB0B6",
  },
});

class OrgTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: null,
      search: null,
      SearchData1: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({
      loading: this.props.loading,
      data: this.props.data,
      SearchData: this.props.data,
    });
  }

  getSearchData1 = (data) => {
    this.setState({
      SearchData: data,
    });
  };

  renderList = () => {
    if (this.state.data.length > 0) {
      return (
        <FlatList
          style={styles.ListContainer}
          data={this.state.SearchData}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.fisrtColumn}>
                <Image
                  style={styles.AvaImg}
                  source={{
                    uri: `${Url()}/api/images/${item.userId.photoUrl}`,
                  }}
                ></Image>
              </View>
              <View style={styles.secondColumn}>
                <Text style={styles.textName}>{item.userId.name}</Text>
                {!item.hasOwnProperty("roleId") ? (
                  <Text>Chưa có</Text>
                ) : (
                  <Text style={styles.textRole}>{item.roleId.name}</Text>
                )}
              </View>
              <View style={styles.thirdColumn}>
                {!item.hasOwnProperty("facultyId") ? (
                  <Text>Chưa có</Text>
                ) : (
                  <Text style={styles.textFaculty}>{item.facultyId.name}</Text>
                )}
              </View>
              <View style={styles.seperator} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
          keyExtractor={(item) => item._id}
        ></FlatList>
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <Search
          targetParent="userId"
          target="name"
          data={this.state.data}
          getSearchData={(e) => this.getSearchData1(e)}
        ></Search>

        {this.state.loading ? (
          <View>
            <ActivityIndicator size="large" animating></ActivityIndicator>
          </View>
        ) : (
          this.renderList()
        )}
      </SafeAreaView>
    );
  }
}

export default OrgTab;
