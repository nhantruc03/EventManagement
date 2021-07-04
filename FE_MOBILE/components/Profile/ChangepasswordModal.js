import { Button } from '@ant-design/react-native';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Redirect } from 'react-router';
import ApiFailHandler from '../helper/ApiFailHandler'
import ValidationComponent from 'react-native-form-validator';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import getToken from "../../Auth";
import Url from "../../env";
const H = Dimensions.get("window").height;
const styles = StyleSheet.create({
    formContainer: {
        paddingTop: 16,
    },
    PrimaryBtn: {
        fontFamily: "bold",
        borderColor: "#2A9D8F",
        backgroundColor: "#2A9D8F",
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
        marginHorizontal: 16,
        justifyContent: "center",
        alignContent: "center",
    },
    input: {
        width: "100%",
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: "#DFDFDF",
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    boxSection: {
        flexDirection: "row",
        alignItems: 'center'

    },

    error: {
        color: "red",
        fontFamily: "semibold",
        fontSize: 12,
        top: -10
    }
})

class ChangepasswordModal extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            showPasswordpresent: true,
            showPasswordnew: true,
            showPasswordconfirm: true,
            loggout: false,
            presentpassword: "",
            newpassword: "",
            confirmpassword: "",
            loadingbtn: false,
        };
    }
    onLoading() {
        this.setState({
            loadingbtn: true,
        });
    }
    onFinish = async () => {

        let temp_validate = this.validate({
            presentpassword: { required: true },
            newpassword: { required: true },
            confirmpassword: { equalPassword: this.state.newpassword }
        });

        if (temp_validate) {
            this.onLoading()
            let data = {
                ...this.state.data,
            }
            const login = await AsyncStorage.getItem('login');
            const obj = JSON.parse(login)
            await (
                axios.put(`${Url()}/api/users/updatePass/` + obj.id, data, {
                    headers: {
                        'Authorization': await getToken()
                    }
                })
                    .then(res => {
                        this.props.onClose()
                        alert("Cập nhật mật khẩu thành công");
                    })
                    .catch(err => {
                        console.log(err)
                        let errResult = ApiFailHandler(err.response?.data?.error)
                        this.setState({
                            loggout: errResult.isExpired,

                        })
                        alert("Cập nhật mật khẩu thất bại");
                    }))
            this.setState({
                loadingbtn: false
            })
        }
    }

    onChangePresent = (password) => {
        this.setState({
            data: {
                ...this.state.data,
                currentPass: password
            },
            presentpassword: password,
        });
    };
    onChangeNew = (password) => {
        this.setState({
            data: {
                ...this.state.data,
                newPass: password
            },
            newpassword: password,
        });
    };
    onChangeConfirm = (password) => {
        this.setState({
            data: {
                ...this.state.data,
                newCheckPass: password
            },
            confirmpassword: password,
        });
    };

    setShowPasswordPresent = () => {
        this.setState({
            showPasswordpresent: !this.state.showPasswordpresent
        })
    }

    setShowPasswordNew = () => {
        this.setState({
            showPasswordnew: !this.state.showPasswordnew
        })
    }

    setShowPasswordConfirm = () => {
        this.setState({
            showPasswordconfirm: !this.state.showPasswordconfirm
        })
    }
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
                <View style={{ height: H * 0.55 }}>
                    <View style={styles.formContainer}>
                        <Text style={styles.textBox}>Mật khẩu hiện tại</Text>
                        <View style={styles.boxSection}>
                            <TextInput
                                onChangeText={this.onChangePresent}
                                style={
                                    styles.input
                                }
                                placeholder="Nhập mật khẩu hiện tại"
                                secureTextEntry={this.state.showPasswordpresent}
                                underlineColorAndroid="transparent"
                            />
                            <View style={{ position: 'absolute', right: 16 }}>
                                <TouchableOpacity
                                    onPress={this.setShowPasswordPresent}
                                >
                                    <Ionicons name='eye-off-outline' size={20} color='black' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.isFieldInError('presentpassword') && this.getErrorsInField('presentpassword').map((errorMessage, key) =>
                            <Text style={styles.error} key={key}>
                                {errorMessage}
                            </Text>
                        )}
                    </View>
                    <View>
                        <Text style={styles.textBox}>Mật khẩu mới</Text>
                        <View style={styles.boxSection}>

                            <TextInput
                                onChangeText={this.onChangeNew}
                                style={
                                    styles.input
                                }
                                placeholder="Nhập mật khẩu mới"
                                secureTextEntry={this.state.showPasswordnew}
                                underlineColorAndroid="transparent"
                            />
                            <View style={{ position: 'absolute', right: 16 }}>
                                <TouchableOpacity
                                    style={styles.Icon}
                                    onPress={this.setShowPasswordNew}
                                >
                                    <Ionicons name='eye-off-outline' size={20} color='black' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.isFieldInError('newpassword') && this.getErrorsInField('newpassword').map((errorMessage, key) =>
                            <Text style={styles.error} key={key}>
                                {errorMessage}
                            </Text>
                        )}
                    </View>
                    <View>
                        <Text style={styles.textBox}>Xác nhận mật khẩu mới</Text>
                        <View style={styles.boxSection}>
                            <TextInput
                                onChangeText={this.onChangeConfirm}
                                style={
                                    styles.input
                                }
                                placeholder="Xác nhận mật khẩu"
                                secureTextEntry={this.state.showPasswordconfirm}
                                underlineColorAndroid="transparent"
                            />
                            <View style={{ position: 'absolute', right: 16 }}>
                                <TouchableOpacity
                                    style={styles.Icon}
                                    onPress={this.setShowPasswordConfirm}
                                >
                                    <Ionicons name='eye-off-outline' size={20} color='black' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.isFieldInError('confirmpassword') && this.getErrorsInField('confirmpassword').map((errorMessage, key) =>
                            <Text style={styles.error} key={key}>
                                {errorMessage}
                            </Text>
                        )}
                    </View>
                    {
                        !this.state.loadingbtn ? (
                            <Button
                                type="primary"
                                onPress={this.onFinish}
                                style={styles.PrimaryBtn}
                            >
                                Lưu
                            </Button>
                        ) : (
                            <Button style={styles.LoadingBtn} loading>

                            </Button>
                        )
                    }
                </View >
            );
        }
    }
}

export default ChangepasswordModal;
