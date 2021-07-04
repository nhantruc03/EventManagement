import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import EventCard from './EventCard';
import moment from 'moment';
import Url from "../env";
import axios from "axios";
import getToken from "../Auth";
import ApiFailHandler from '../components/helper/ApiFailHandler'
import { Redirect } from 'react-router';
import Loader from 'react-native-modal-loader';
import ResourceUrl from "../resourceurl"

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
      loggout: false,
      needUpdate: undefined,
      loading: true,

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
        )
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios.post(`${Url()}/api/action-resources/getAll`, { actionId: this.props.data._id }, {
        headers: {
          'Authorization': await getToken()
        }
      })
        .then((res) =>
          res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
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
          resources: resources,
          needUpdate: this.props.data.needUpdate,
          loading: false,
        })
        let temp = {
          _id: this.props.data._id,
          total: subActions.length
        }
        this.props.addTotalSubOfAction(temp)
      }
    }
  }

  async UNSAFE_componentWillUpdate(e) {
    if (e.data.needUpdate !== this.state.needUpdate) {
      this.setState({
        needUpdate: e.data.needUpdate,
      })
      if (e.data.needUpdate === true) {
        this.setState({
          loading: true
        })
        const [subActions, resources] = await Promise.all([
          axios.post(`${Url()}/api/sub-actions/getAll`, { actionId: this.props.data._id }, {
            headers: {
              'Authorization': await getToken()
            }
          })
            .then((res) =>
              res.data.data
            )
            .catch(err => {
              let errResult = ApiFailHandler(err.response?.data?.error)
              this.setState({
                loggout: errResult.isExpired
              })
            }),
          axios.post(`${Url()}/api/action-resources/getAll`, { actionId: this.props.data._id }, {
            headers: {
              'Authorization': await getToken()
            }
          })
            .then((res) =>
              res.data.data)
            .catch(err => {
              let errResult = ApiFailHandler(err.response?.data?.error)
              this.setState({
                loggout: errResult.isExpired
              })
            }),
        ]);


        if (subActions !== null) {
          let temp = []
          subActions.forEach(e => {
            if (e.status) {
              temp.push(e)
            }
          })
          this.setState({
            completeSubAction: temp,
            totalSubAction: subActions,
            resources: resources,
            needUpdate: undefined,
            loading: false
          })
          this.props.removeNeedUpdateForObject(this.props.data._id)
          // let temp = {
          //   _id: this.props.data._id,
          //   total: subActions.length
          // }
          // this.props.addTotalSubOfAction(temp)
        }
      }
    }
  }





  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const item = this.props.data
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
        <EventCard>
          <View>
            <Loader loading={this.state.loading} color="white" size="large" />
            <Image style={styles.cardImage} source={{ uri: `${ResourceUrl()}${item.coverUrl}` }} />
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


              </View>

            </View>
          </View>
        </EventCard>
      );
    }
  }
}
