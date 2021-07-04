import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import ValidationComponent from 'react-native-form-validator';
const H = Dimensions.get("window").height;
const W = Dimensions.get("window").width;
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import Url from "../env";
import moment from "moment";
import getToken from "../Auth";
import Loader from 'react-native-modal-loader';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    formcontainer: {
        zIndex: 2,
        backgroundColor: "#fff",
        padding: 16,
    },
    h1: {
        fontFamily: "bold",
        marginTop: (H * 8) / 100,
        fontSize: 24,
        color: "#2A9D8F",
    },
    h2: {
        marginTop: H * 0.02,
        fontSize: 16,
        color: "#AAB0B6",
        fontFamily: 'regular'
    },
    containerBox: {
        marginTop: H * 0.09,
    },
    textBox: {
        fontSize: 14,
        lineHeight: 14,
        color: "#264653",
    },
    boxSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    Icon: {
        alignItems: 'center',
        position: "absolute",
        zIndex: 9,
        right: 16,
    },
    input: {
        flex: 1,
        marginTop: (H * 4) / 667,
        width: W,
        paddingLeft: (H * 16) / 667,
        paddingRight: 48,
        backgroundColor: "#FFFFFF",
        height: (H * 48) / 667,
        color: "#424242",
        borderStyle: "solid",
        borderRadius: 8,
        borderColor: "#DFDFDF",
        borderWidth: 1,
    },
    inputActive: {
        flex: 1,
        marginTop: (H * 4) / 667,
        width: W,
        padding: (H * 16) / 667,
        backgroundColor: "#FFFFFF",
        height: (H * 48) / 667,
        color: "#424242",
        borderStyle: "solid",
        borderRadius: 8,
        borderColor: "#2A9D8F",
        borderWidth: 1,
        shadowColor: "#2A9D8F",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 4,
    },
    forgot: {
        fontFamily: "semibolditalic",
        fontSize: 14,
        color: '#2495D1',
    },
    btnSubmit: {
        color: "#fff",
        height: (H * 48) / 667,
        backgroundColor: "#2A9D8F",
        borderRadius: 8,
        padding: (H * 12) / 667,
    },
    textSubmit: {
        fontFamily: "bold",
        fontSize: 18,
        color: "#fff",
        alignItems: "center",
        textAlign: "center",
    },
    containerBoxSubmit: {
        marginTop: (H * 16) / 667,
        marginBottom: (H * 32) / 667,
    },

    textBack: {
        fontFamily: "semibold",
        fontSize: 18,
        color: "black",
        textAlign: "center",
    },
    error: {
        color: "red",
        fontFamily: "semibold",
        fontSize: 12,
    }
})



export default class ForgotPassword extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            profileemail: "",
            profilephone: "",
            focusInputType: "",
        };
    }
    onLoading() {
        this.setState({
            Loading: true,
        });
    }

    onSubmit = async (e) => {
        let temp_validate = this.validate({
            profileemail: { required: true, email: true },
            profilephone: { required: true, number: true },
        });

        if (temp_validate) {
            this.setState({
                Loading: true
            })
            var data = new FormData();

            data.append("email", this.state.profileemail);
            data.append("phone", this.state.profilephone);

            await (axios.post(`${Url()}/api/users/forgot-password`, data)
                .then(res => {
                    if (res.data.success === true) {
                        alert("Tạo mật khẩu mới thành công")
                        this.setState({
                            Loading: false
                        })
                        this.props.history.push('/login')
                    } else {
                        alert("Tạo mật khẩu mới thất bại")
                    }
                })
                .catch(err => {
                    alert("Tạo mật khẩu mới thất bại")
                }))
        }
    }

    setEmailFocusInputType = () => {
        this.setState({
            focusInputType: "email"
        })
    }
    setPhoneFocusInputType = () => {
        this.setState({
            focusInputType: "phone"
        })
    }
    onChangeEmail = (e) => {
        this.setState({
            profileemail: e
        })
    }
    onChangePhone = (e) => {
        this.setState({
            profilephone: e
        })
    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View style={styles.formcontainer}>
                        <Loader loading={this.state.Loading} color="white" size="large" />
                        <View style={{ marginTop: 8 }}>
                            <TouchableOpacity onPress={() => {
                                this.props.history.goBack()
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name='arrow-back-outline' size={24} color='black' />
                                    <Text style={styles.textBack}>Quay lại</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.h1}>Quên mật khẩu</Text>
                        <Text style={styles.h2}>Vui lòng nhập email, số điện thoại và chúng tôi sẽ gửi mật khẩu mới về email của bạn</Text>
                        <View
                            style={{ marginBottom: (H * 21) / 667, marginTop: (H * 24) / 667 }}
                        >
                            <Text style={styles.textBox}>Email</Text>
                            <View style={styles.boxSection}>
                                <TextInput
                                    ref="email"
                                    onFocus={this.setEmailFocusInputType}
                                    style={
                                        this.state.focusInputType === "email" ? styles.inputActive : styles.input
                                    }
                                    placeholder="Nhập email của bạn"
                                    onChangeText={this.onChangeEmail}
                                    value={this.state.profileemail}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                />
                            </View>
                            {this.isFieldInError('profileemail') && this.getErrorsInField('profileemail').map((errorMessage, key) =>
                                <Text style={styles.error} key={key}>
                                    {errorMessage}
                                </Text>
                            )}
                        </View>

                        <View>
                            <Text style={styles.textBox}>Số điện thoại</Text>
                            <View style={styles.boxSection}>

                                <TextInput
                                    ref="phone"
                                    onFocus={this.setPhoneFocusInputType}
                                    style={
                                        this.state.focusInputType == "phone" ? styles.inputActive : styles.input
                                    }
                                    placeholder="Nhập số điện thoại của bạn"
                                    onChangeText={this.onChangePhone}
                                    value={this.state.profilephone}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            {this.isFieldInError('profilephone') && this.getErrorsInField('profilephone').map((errorMessage, key) =>
                                <Text style={styles.error} key={key}>
                                    {errorMessage}
                                </Text>
                            )}
                        </View>
                        <View style={styles.containerBoxSubmit}>
                            <TouchableOpacity
                                onPress={this.onSubmit}
                                title="Đăng nhập"
                                style={styles.btnSubmit}
                                underlayColor="#fff"
                            >
                                <Text style={styles.textSubmit}>Tạo mật khẩu mới</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}
