import moment from "moment";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Url from "../../env";
import getToken from "../../Auth";
import { CheckBox } from "react-native-elements";
import Separator from "../../components/helper/separator";
import axios from "axios";
import Checked from "../../assets/images/square_checked.png";
import UnChecked from "../../assets/images/square_unchecked.png";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F8" },
  formContainer: { padding: 16, zIndex: 3 },
  mainLabel: {
    fontFamily: "bold",
    fontSize: 24,
    color: "#2A9D8F",
  },
  avaImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  coverImg: {
    width: 400,
    height: 200,
  },
  description: {
    fontFamily: "regular",
    fontSize: 14,
    marginTop: 8,
  },
  DatetimeContainer: {
    zIndex: 2,
    flexDirection: "row",
  },
  TimeContainer: {
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  Timeicon: {
    position: "relative",
  },
  TimeContent: {
    marginLeft: 8,
    fontFamily: "semibold",
    color: "#2A9D8F",
    fontSize: 20,
  },
  DateContatiner: {
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 48,
  },
  Dateicon: {
    position: "relative",
  },
  DateContent: {
    fontFamily: "semibold",
    color: "#2A9D8F",
    fontSize: 20,
    marginLeft: 8,
  },
  formLabel: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 16,
  },
  tagContainer: { flex: 1, flexDirection: "row", marginTop: 8 },
  section3: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Text: {
    marginLeft: 8,
    fontFamily: "semibold",
    fontSize: 16,
    color: "#2A9D8F",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  itemContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  itemTextNameDone: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 16,
    textDecorationLine: "line-through",
  },
  itemTextNameUnDone: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 16,
  },
});

class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facultyName: "",
      subActions: [],
      currentSubAction: null,
      checked: false,
    };
  }
  async componentDidMount() {
    let faculty = this.props.route.params.faculty;
    this._isMounted = true;

    const subActions = await axios
      .post(
        `${Url()}/api/sub-actions/getAll`,
        { scriptId: this.props.route.params._id },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => res.data.data);
    this.setState({
      facultyName: faculty.name,
      subActions: subActions,
      checked: true,
    });
    console.log(subActions);
  }

  changeStatus = async (e) => {
    await axios
      .put(
        `${Url()}/api/sub-actions/` + e._id,
        { status: !e.status },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then(() => {
        let temp_data = this.state.subActions;
        temp_data.forEach((element) => {
          if (element._id === e._id) {
            element.status = !e.status;
          }
        });
        this.setState({
          subActions: temp_data,
        });
        // this.props.updateGuest(temp_data);
        console.log("temp_data", temp_data);
        alert(`Trạng thái của khách mời ${e.name} cập nhật thành công`);
      })
      .catch(() => {
        alert(`Trạng thái của khách mời ${e.name} cập nhật thất bại`);
      });
  };

  renderItem = (item) => {
    return (
      <View>
        <View style={styles.itemContainer}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => this.changeStatus(item)}>
              {item.status ? (
                <Image source={Checked}></Image>
              ) : (
                <Image source={UnChecked}></Image>
              )}
            </TouchableOpacity>
            <Text
              style={
                item.status
                  ? styles.itemTextNameDone
                  : styles.itemTextNameUnDone
              }
            >
              {item.name}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    //console.log("faculty", this.state.facultyName);
    return (
      <ScrollView style={styles.container}>
        <Image
          style={styles.coverImg}
          source={{
            uri: this.props.route.params.coverUrl,
          }}
        ></Image>
        <View style={styles.formContainer}>
          <Text style={styles.mainLabel}>{this.props.route.params.name}</Text>
          <View style={styles.tagContainer}>
            {this.props.route.params.tags.map((value, key) => (
              <View
                style={{
                  backgroundColor: value.background,
                  marginRight: 10,
                  paddingHorizontal: 10,
                  borderRadius: 16,
                }}
                key={key}
              >
                <Text
                  style={{
                    color: value.color,
                    marginVertical: 4,
                    fontFamily: "regular",
                    fontSize: 16,
                  }}
                >
                  {value.name}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.description}>
            {this.props.route.params.description}
          </Text>
          <Separator />
          <Text style={styles.formLabel}>Deadline</Text>
          <View style={styles.DatetimeContainer}>
            <View style={styles.TimeContainer}>
              <Image
                style={styles.Timeicon}
                source={require("../../assets/images/timesolid.png")}
              ></Image>
              <Text style={styles.TimeContent}>
                {moment(this.props.route.params.time).format("HH:MM")}
              </Text>
            </View>
            <View style={styles.DateContatiner}>
              <Image
                style={styles.Dateicon}
                source={require("../../assets/images/datesolid.png")}
              ></Image>
              <Text style={styles.DateContent}>
                {moment(this.props.route.params.date).format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>
          <Separator />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.formLabel}>Người phân công</Text>
            <Text style={styles.formLabel}>Ban</Text>
          </View>
          <View style={styles.section3}>
            <View style={styles.managerContainer}>
              {this.props.route.params.user.map((value, key) => (
                <View
                  style={{
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  key={key}
                >
                  <Image
                    style={styles.avaImage}
                    source={{
                      uri: `${Url()}/api/images/${value.photoUrl}`,
                    }}
                  ></Image>
                  {this.props.route.params.managerId === value.id ? (
                    <Text style={styles.Text}>{value.name}</Text>
                  ) : null}
                </View>
              ))}
            </View>
            <View>
              <Text style={styles.Text}>{this.state.facultyName}</Text>
            </View>
          </View>
          <Separator />
          <View style={styles.AssignedUserContainer}>
            <Text style={styles.formLabel}>Phân công cho</Text>
            {this.props.route.params.user.map((value, key) => (
              <View
                style={{
                  marginRight: 10,
                  paddingHorizontal: 10,
                  borderRadius: 16,
                }}
                key={key}
              >
                <Image
                  style={styles.avaImage}
                  source={{
                    uri: `${Url()}/api/images/${value.photoUrl}`,
                  }}
                ></Image>
              </View>
            ))}
          </View>
          <Separator />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.formLabel}>Todo List</Text>
            <TouchableOpacity>
              <Text
                style={(styles.formLabel, { textDecorationLine: "underline" })}
              >
                Add Items +
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.subActions}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => this.renderItem(item)}
          />
        </View>
      </ScrollView>
    );
  }
}

export default TaskDetail;
