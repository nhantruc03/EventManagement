import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

import Url from "../env";
import getToken from "../Auth";
import axios from "axios";

import { TextInput } from "react-native-gesture-handler";
import { Button } from "@ant-design/react-native";
import { Redirect } from "react-router";
import ApiFailHandler from './helper/ApiFailHandler'
import ValidationComponent from 'react-native-form-validator';
const H = Dimensions.get("window").height;
const styles = StyleSheet.create({
  Label: {
    color: "#2A9D8F",
    fontFamily: "bold",
    fontSize: 14,
  },
  input: {
    height: 40,
    marginVertical: 8,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 4,
  },

  PrimaryBtn: {
    fontFamily: "bold",
    borderColor: "#2A9D8F",
    backgroundColor: "#2A9D8F",
    borderRadius: 8,
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  LoadingBtn: {
    borderRadius: 8,
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  Box: {
    height: 40,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "#D4D4D4",
    borderRadius: 8,
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontFamily: "semibold",
    fontSize: 12,
    top: -10
  }
});

class AddActionTypeModal extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      loadingbtn: false,
      loggout: false,
      actiontypename: ""
    };
  }
  onLoading() {
    this.setState({
      loadingbtn: true,
    });
  }
  onFinish = async (e) => {
    let temp_validate = this.validate({
      actiontypename: { required: true },
    });
    if (temp_validate) {
      this.onLoading()
      let data = {
        name: this.state.name,
        eventId: this.props.eventId,
      };
      await axios
        .post(`${Url()}/api/action-types`, data, {
          headers: {
            Authorization: await getToken(),
          },
        })
        .then((res) => {
          console.log(res.data.data);
          // this.setState({
          //   currentActionTypes: [...this.state.currentActionTypes, res.data.data],
          // });
          this.props.addActionTypes(res.data.data);
          this.props.onClose();
          alert('Tạo thành công')
        })
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired,
            loadingbtn: false,
          })
          alert(`${errResult.message}`)
        });
    }
  };
  onChangeName = (name) => {
    this.setState({
      name: name,
      actiontypename: name,
    });
  };


  render() {
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
        <View style={{ height: H * 0.3 }}>
          <View
            style={{
              flex: 1,
              paddingVertical: 20,
              paddingHorizontal: 16,
            }}
          >
            <View style={styles.ScriptNameLabelContainer}>
              <Text style={styles.Label}>Loại công việc</Text>
              <TextInput
                onChangeText={this.onChangeName}
                style={styles.input}
              ></TextInput>
              {this.isFieldInError('actiontypename') && this.getErrorsInField('actiontypename').map((errorMessage, key) =>
                <Text style={styles.error} key={key}>
                  {errorMessage}
                </Text>
              )}
            </View>
          </View>
          {!this.state.loadingbtn ? <Button
            type="primary"
            onPress={this.onFinish}
            style={styles.PrimaryBtn}
          >
            Xác nhận
        </Button> : <Button style={styles.LoadingBtn} loading>ß
        </Button>}

        </View>
      );
    }
  }
}

export default AddActionTypeModal;
