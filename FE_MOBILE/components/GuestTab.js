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
import Search from "./helper/search";
import Unchecked from "../assets/images/Unchecked.png";
import Checked from "../assets/images/Checked.png";
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
    marginLeft: 'auto',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
});

export default class GuestTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
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
    this.setState({
      data: this.props.data,
    });
  }

  render() {
    //let temp_listActions = this.applyFilter(this.props.sectionListData);
    let result = this.state.data.reduce((list, item) => {
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

    return (
      <SafeAreaView>
        <Search></Search>
        <SectionList
          sections={result}
          keyExtractor={(item) => item._id}
          renderSectionHeader={({ section }) => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTextName}>{item.name}</Text>
                <Text style={styles.itemTextPhone}>{item.phone}</Text>
                <Text style={styles.itemTextEmail}>{item.email}</Text>
                <Text>{item.status}</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity onPress={() => this.changeStatus(item)}>
                  {item.status ? (
                    <Image source={Checked}></Image>
                  ) : (
                    <Image source={Unchecked}></Image>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    );
  }
}
