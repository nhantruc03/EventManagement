import React, { Component } from "react";
import { Image } from "react-native";
import {
  View,
  Text,
  SectionList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Search from "../helper/search";
import Unchecked from "../../assets/images/square_unchecked.png";
import Checked from "../../assets/images/square_checked.png";
import axios from "axios";
import Url from "../../env";
import getToken from "../../Auth";
import checkPermisson from "../helper/checkPermissions";
import * as constants from "../constant/action";
import Loader from "react-native-modal-loader";
import { RefreshControl } from "react-native";
import { Redirect } from "react-router";
import ApiFailHandler from '../helper/ApiFailHandler'


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
  itemTextPhone: {
    color: "#AAB0B6",
    fontFamily: "regular",
    fontSize: 12,
  },
  itemTextEmail: {
    color: "#AAB0B6",
    fontFamily: "regular",
    fontSize: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    marginBottom: 20,
  },
});

export default class GuestTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      SearchData: [],
      updateLoading: false,
      refreshing: false,
      loggout: false,
    };
  }

  onLoading() {
    this.setState({
      updateLoading: true,
    });
  }

  changeStatus = async (e) => {
    this.onLoading()
    await axios
      .put(
        `${Url()}/api/guests/` + e._id,
        { status: !e.status, guestTypeId: e.guestTypeId._id },
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
        this.setState({
          updateLoading: !this.state.updateLoading
        })
        alert(`Trạng thái của khách mời ${e.name} cập nhật thành công`);
      })
      .catch(err => {
        let errResult = ApiFailHandler(err.response?.data?.error)
        this.setState({
          loggout: errResult.isExpired,
          updateLoading: !this.state.updateLoading
        })
        alert(`Trạng thái của khách mời ${e.name} cập nhật thất bại`);
      });
  };

  onRefresh = async () => {
    this.setState({
      refreshing: true,
    });
    await axios
      .post(
        `${Url()}/api/guest-types/getAll`,
        { eventId: this.eventId },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => {
        this.setState({
          refreshing: false,
          data: res.data.data
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
      refreshing: false,
    });
  };




  renderItem = (e) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTextName}>{e.item.name}</Text>
          <Text style={styles.itemTextPhone}>{e.item.phone}</Text>
          <Text style={styles.itemTextEmail}>{e.item.email}</Text>
        </View>
        <View style={styles.checkboxContainer}>
          {checkPermisson(this.props.currentPermissions, constants.QL_KHACHMOI_PERMISSION) ?
            <TouchableOpacity onPress={() => this.changeStatus(e.item)}>
              {e.item.status ? (
                <Image source={Checked}></Image>
              ) : (
                <Image source={Unchecked}></Image>
              )}
            </TouchableOpacity> : null}
        </View>
      </View>
    )
  }
  render() {
    //let temp_listActions = this.applyFilter(this.props.sectionListData);
    let result = this.state.SearchData.reduce((list, item) => {
      let temp_list = list.filter((e) => e._id === item.guestTypeId._id); //điều kiện gom nhóm
      let temp_O =
        temp_list.length > 0
          ? temp_list[0]
          : {
            title: item.guestTypeId.name,
            _id: item.guestTypeId._id,
            data: [],
          }; // check cần tạo mới hay đã có trong result
      if (list.indexOf(temp_O) !== -1) {
        list[list.indexOf(temp_O)].data.push(item);
      } else {
        temp_O.data.push(item);
        list.push(temp_O);
      }
      return list;
    }, []);
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
          <Loader loading={this.state.updateLoading} color="#2A9D8F" />
          <Search
            target={["name", "phone"]}
            multi={true}
            data={this.state.data}
            getSearchData={(e) => this.getSearchData1(e)}
          ></Search>
          <SectionList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            sections={result}
            keyExtractor={(item) => item._id}
            renderSectionHeader={({ section }) => (
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{section.title}</Text>
              </View>
            )}
            renderItem={this.renderItem}
          />
        </SafeAreaView>
      );
    }
  }
}
