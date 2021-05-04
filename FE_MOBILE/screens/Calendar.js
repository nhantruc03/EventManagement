import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import Url from "../env";
import getToken from "../Auth";
import moment from "moment";
import SubActionItems from "../components/Calendar/SubActionItems";
import { FlatList } from "react-native-gesture-handler";
import { StatusBar } from "react-native";

LocaleConfig.locales["vn"] = {
  monthNames: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "vn";

const styles = StyleSheet.create({
  containerIOS: { flex: 1, marginTop: 16 },
  containerAndroid: { marginTop: StatusBar.currentHeight, flex: 1 },
  toplabel: {
    fontFamily: "bold",
    fontSize: 32,
    fontWeight: "500",
    color: "#2A9D8F",
    backgroundColor: "#F6F7F8",
    paddingLeft: 16,
  },
  mainlabel: {
    fontFamily: "bold",
    fontSize: 16,
    color: "#9A9A9A",
    padding: 16,
  },
});

export default class Calendarscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSubActions: [],
      currentSubActions: [],
      isLoading: false,
      currentDate: moment(new Date()).format("YYYY-MM-DD"),
    };
  }
  async componentDidMount() {
    this._isMounted = true;
    const login = await AsyncStorage.getItem("login");
    const obj = JSON.parse(login);

    const [subActions] = await Promise.all([
      axios
        .post(
          `${Url()}/api/sub-actions/getAllWithUserId`,
          { availUser: obj.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
    ]);

    if (subActions !== null) {
      if (this._isMounted) {
        this.setState({
          listSubActions: subActions,
        });

        this.onSelect(moment(new Date()));
      }
    }
  }
  getListData = (value) => {
    let listData = [];
    //console.log("date", value)
    this.state.listSubActions.forEach((element) => {
      if (!element.status) {
        if (moment(element.endDate).utcOffset(0).format("YYYY-MM-DD") === value) {
          listData.push(element);
        }
      }
    });
    //console.log("data", listData)
    return listData;
  };

  getMarkedDate = () => {
    let listDate = {};
    this.state.listSubActions.forEach((element) => {
      if (!element.status) {
        if (
          moment(element.endDate).utcOffset(0).format("YYYY-MM-DD") ===
          this.state.currentDate
        ) {
          listDate[moment(element.endDate).utcOffset(0).format("YYYY-MM-DD")] = {
            marked: true,
            selected: true,
          };
        } else {
          listDate[moment(element.endDate).utcOffset(0).format("YYYY-MM-DD")] = {
            marked: true,
          };
        }
      }
    });
    return listDate;
  };

  onSelect = (value) => {
    this.setState({
      currentDate: value,
    });
    let data = this.getListData(value);
    this.setState({
      currentSubActions: data,
    });
  };
  renderCurrentSubAction = (e) => {
    return <View style={{ padding: 4 }}><SubActionItems data={e.item} /></View>;
  };

  render() {
    return (
      <View
        style={
          Platform.OS == "ios" ? styles.containerIOS : styles.containerAndroid
        }
      >
        <Text style={styles.toplabel}>Lịch</Text>
        <Calendar
          markedDates={this.getMarkedDate()}
          onDayPress={(day) => {
            this.onSelect(day.dateString);
          }}
          // current={'2021-04-27'}
          theme={{
            selectedcolor: "#2A9D8F",
            dayTextColor: "black",
            todayTextColor: "#2A9D8F",
            dotColor: "#2A9D8F",
            selectedDayBackgroundColor: "#2A9D8F",
            selectedDayTextColor: "white",
            indicatorColor: "blue",
            textDayFontFamily: "regular",
            textMonthFontFamily: "bold",
            monthTextColor: "#2A9D8F",
            selectedDotColor: "#ffffff",
            textDayHeaderFontFamily: "bold",
            arrowColor: "#2A9D8F",
          }}
          enableSwipeMonths={true}
        />
        <Text style={styles.mainlabel}>Lời nhắc</Text>
        <FlatList
          style={{ height: 300 }}
          data={this.state.currentSubActions}
          renderItem={this.renderCurrentSubAction}
          keyExtractor={(item) => item._id}
          nestedScrollEnabled={true}
        />
      </View>
    );
  }
}
