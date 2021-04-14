import React, { Component } from "react";
import { View } from "react-native";
import { SearchBar } from "react-native-elements";
class ss extends Component {
  onChange = (e) => {
    var ketqua = [];
    if (this.props.data != null) {
      this.props.data.forEach((item) => {
        if (this.props.multi === true) {
          this.props.target.every((x) => {
            if (
              item[x]
                .toString()
                .toLowerCase()
                .indexOf(e.target.value.toLowerCase()) !== -1
            ) {
              ketqua.push(item);
              return false;
            }
            return true;
          });
        } else {
          if (this.props.targetParent == null) {
            if (
              item[this.props.target]
                .toString()
                .toLowerCase()
                .indexOf(e.target.value) !== -1
            ) {
              ketqua.push(item);
            }
          } else {
            if (
              item[this.props.targetParent][this.props.target]
                .toString()
                .toLowerCase()
                .indexOf(e.target.value) !== -1
            ) {
              ketqua.push(item);
            }
          }
        }
      });
    }
    if (e.target.value === "") {
      ketqua = this.props.data;
    }
    console.log(ketqua);
    this.props.getSearchData(ketqua);
  };
  render() {
    return (
      <View>
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
          onChange={(e) => this.onChange(e)}
        ></SearchBar>
      </View>
    );
  }
}

export default ss;
