import React, { Component } from "react";

import { SafeAreaView, View, Text, Image, StyleSheet } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { SearchBar } from "react-native-elements";
import Search from "./helper/search";
import Url from "../env";

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
    };
  }

  UNSAFE_componentWillReceiveProps(e) {
    // console.log("should update", e);
    this.setState({
      data: e.data,
    });
  }

  componentDidMount() {
    // console.log("data inside", this.props.data);
    this.setState({
      data: this.props.data,
    });
  }
  searchFilterFunction = (text) => {
    this.setState({
      value: text,
    });
    const newData = this.props.data.filter((item) => {
      const itemData = `${item.userId.name.toLowerCase()}`;
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  getSearchData1 = (data) => {
    this.setState({
      SearchData1: data,
    });
  };

  renderList = () => {
    if (this.state.data.length > 0) {
      return (
        <FlatList
          style={styles.ListContainer}
          data={this.state.data}
          renderItem={({ item }) => (
            <View style={styles.itemContainer} key={item._id}>
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
          keyExtractor={(item) => item.id}
        ></FlatList>
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        {/* <Search
          target="name"
          targerParent="userId"
          data={this.state.data}
          getSearchData={(e) => this.getSearchData1(e)}
        ></Search> */}
        <SearchBar
          placeholder="Tìm kiếm..."
          containerStyle={{
            color: "#FFFFF",
            marginBottom: 8,
            borderRadius: 12,
            marginHorizontal: 16,
            marginTop: 16,
            height: 64,
            alignContent: "center",
            paddingHorizontal: 8,
          }}
          platform="android"
          editable={true}
          value={this.state.search}
          onChangeText={(text) => this.searchFilterFunction(text)}
        ></SearchBar>
        {this.renderList()}
      </SafeAreaView>
    );
  }
}

export default OrgTab;
