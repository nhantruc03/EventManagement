import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import EventCard from './EventCard';
import moment from 'moment';
import Url from "../env";
import axios from "axios";
import getToken from "../Auth";

const styles = StyleSheet.create({
  cardImage: {
    width: 276,
    height: 160,
  },
  avaImage: {
    width: 48,
    height: 48,
    borderRadius: 40,
  },
  toplabel: {
    fontFamily: "bold",
    fontSize: 32,
    fontWeight: "500",
    color: "#2A9D8F",
    paddingLeft: 16,
  },
  Tabcontainer: {
    marginLeft: 16,
  },
  AddBtn: {
    right: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    height: 34,
    fontFamily: "bold",
    backgroundColor: "#2A9D8F",
    borderColor: "#2A9D8F",
  },
  BtnText: {
    fontFamily: "semibold",
    fontSize: 16,
    paddingHorizontal: 16,
  },
  titleText: {
    marginTop: 8,
    marginBottom: 4,
    fontFamily: "bold",
    fontSize: 18,
  },
  datetime: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  Timeicon: {

  },
  Timecontent: {
    marginLeft: 8,
    fontFamily: "semibold",
    fontSize: 14,
    color: "#98A1A5",
  },
  tagContainer: { flex: 1, flexDirection: "row", marginTop: 8 },
})

export default class TaskCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completeSubAction: [],
      totalSubAction: [],
      resources: [],
    };
  }

  async componentDidMount() {
    this._isMounted = true;

    const [subActions, resources] = await Promise.all([
      axios.post(`${Url()}/api/sub-actions/getAll`, { actionId: this.props.data._id }, {
        headers: {
          'Authorization': await getToken()
        }
      })
        .then((res) =>
          res.data.data
        ),
      axios.post(`${Url()}/api/action-resources/getAll`, { actionId: this.props.data._id }, {
        headers: {
          'Authorization': await getToken()
        }
      })
        .then((res) =>
          res.data.data
        ),
    ]);


    if (subActions !== null) {
      if (this._isMounted) {
        subActions.forEach(e => {
          if (e.status) {
            this.setState({
              completeSubAction: [...this.state.completeSubAction, e]
            })
          }
        })
        this.setState({
          totalSubAction: subActions,
          resources: resources
        })

        let temp = {
          _id: this.props.data._id,
          total: subActions.length
        }
        this.props.addTotalSubOfAction(temp)
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const item = this.props.data
    return (
      <EventCard>
        <View >
          <Image style={styles.cardImage} source={{ uri: `${Url()}/api/images/${item.coverUrl}` }} />
          <Text style={styles.titleText}>{item.name}</Text>
          <View style={styles.datetime}>
            <Image style={styles.Timeicon} source={require("../assets/images/timesolid.png")} />
            <Text style={styles.Timecontent}>
              {moment(item.endDate).utcOffset(0).format("DD/MM/YYYY")} -{" "}
              {moment(item.endTime).utcOffset(0).format("HH:mm")}
            </Text>
          </View>
          <View>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginRight: 8 }}>
                <Image source={require("../assets/images/resource.png")} />
                <Text style={styles.Timecontent}>{this.state.resources.length}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <Image source={require("../assets/images/solidchecked.png")} />
                <Text style={styles.Timecontent}>{this.state.completeSubAction.length}/{this.state.totalSubAction.length}</Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <View style={styles.tagContainer}>
                {item.tagsId.map((value, key) => (
                  <View style={{ backgroundColor: value.background, marginRight: 10, paddingHorizontal: 10, borderRadius: 16 }}
                    key={key}>
                    <Text style={{ color: value.color, marginVertical: 4, fontFamily: "regular", fontSize: 16, }}>
                      {value.name}
                    </Text>
                  </View>
                ))}
              </View>

              {/* <View>
                  {item.availUser.map((value, key) => (
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
                </View> */}
            </View>

          </View>
        </View>
      </EventCard>
    );
  }
}
