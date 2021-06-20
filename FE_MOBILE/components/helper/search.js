import React, { Component } from "react";
import { View, Platform } from "react-native";
import { SearchBar } from "react-native-elements";
class ss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    }
  }


  onChange = (e) => {
    console.log(e);
    this.setState({
      value: e,
    })
    var ketqua = []
    if (this.props.data != null) {
      this.props.data.forEach((item) => {
        if (this.props.multi === true) {
          this.props.target.every(x => {
            if (item[x]) {
              if (item[x].toString().toLowerCase().indexOf(e.toLowerCase()) !== -1) {
                ketqua.push(item);
                return false;
              }
            }
            return true;
          })
        } else {
          if (this.props.targetParent == null) {
            if (item[this.props.target]) {
              if (item[this.props.target].toString().toLowerCase().indexOf(e.toLowerCase()) !== -1) {
                ketqua.push(item);

              }
            }
          }
          else {
            if (item[this.props.targetParent][this.props.target]) {
              if (item[this.props.targetParent][this.props.target].toString().toLowerCase().indexOf(e.toLowerCase()) !== -1) {
                ketqua.push(item);
              }
            }
          }
        }

      })
    }
    if (e === "") {
      ketqua = this.props.data
    }
    this.props.getSearchData(ketqua)

  };
  render() {
    return (
      <View>
        <SearchBar
          placeholder="Tìm kiếm..."
          round
          containerStyle={{
            backgroundColor: '#F6F7F8',
            // marginBottom: 8,
            // borderRadius: 12,
            // //marginHorizontal: 16,
            // marginTop: 16,
            // height: 48,
            // alignItems: "center",
            ...this.props.style
          }}
          inputContainerStyle={{
            backgroundColor: 'white',
          }}
          value={this.state.value}
          onClear={() => this.onChange("")}
          onCancel={() => this.onChange("")}
          platform={Platform.OS}
          onChangeText={(e) => this.onChange(e)}
        />
      </View>
    );
  }
}

export default ss;
