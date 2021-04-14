import React, { Component } from "react";
import { View, Text, SectionList, SafeAreaView, FlatList } from "react-native";

export default class GuestTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      guestTypes: [],
    };
  }
  componentDidMount() {
    this.setState({
      data: this.props.data,
      guestTypes: this.props.guestTypes,
    });
  }

  // applyFilter = (list) => {
  //   let result = list;
  //   console.log(result);
  //   result = result.sort((a, b) => {
  //     return a.guestTypeId.name.toUpperCase() < b.guestTypeId.name.toUpperCase()
  //       ? 1
  //       : -1;
  //   });

  //   console.log(result);
  //   return result;
  // };

  render() {
    //let temp_listActions = this.applyFilter(this.props.sectionListData);
    console.log(this.props.sectionListData);
    const sectionListData = [{ title: "", data: this.state.data }];
    // console.log("data", temp_listActions);
    console.log("listdata", sectionListData);

    var sectionData = [{ data: this.state.data }];
    return (
      <SafeAreaView>
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <View>
              <Text>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
              <Text>{item.phone}</Text>
              <Text>{item.email}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    );
  }
}
