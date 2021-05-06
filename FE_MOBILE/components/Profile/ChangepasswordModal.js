import { Button } from '@ant-design/react-native';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    textBox: {},
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: "#DFDFDF",
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    boxSection: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    Icon: {

        zIndex: 3,
        right: 16,
    }
})

class ChangepasswordModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: true,
        };
    }
    onFinish = async () => {

        let data = {
            ...this.state.data,
        }
        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);

        await trackPromise(
            Axios.put('/api/users/updatePass/' + obj.id, data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    alert("Cập nhật mật khẩu thành công");
                    // Message('Sửa thành công', true, this.props);
                })
                .catch(err => {
                    alert("Cập nhật mật khẩu thất bại");
                    // Message('Sửa thất bại', false);
                }))
    }

    setShowPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    render() {
        return (
            <View>
                <View>
                    <Text style={styles.textBox}>Mật khẩu hiện tại</Text>
                    <View style={styles.boxSection}>
                        <TouchableOpacity
                            style={styles.Icon}
                            onPress={this.setShowPassword}
                        >
                            <Ionicons name='eye-off-outline' size={20} color='black' />
                        </TouchableOpacity>
                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Nhập mật khẩu của bạn"
                            secureTextEntry={this.state.showPassword}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                </View>
                <View>
                    <Text style={styles.textBox}>Mật khẩu mới</Text>
                    <View style={styles.boxSection}>
                        <TouchableOpacity
                            style={styles.Icon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons name='eye-off-outline' size={20} color='black' />
                        </TouchableOpacity>
                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Nhập mật khẩu của bạn"


                            secureTextEntry="true"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                </View>
                <View>
                    <Text style={styles.textBox}>Xác nhận mật khẩu mới</Text>
                    <View style={styles.boxSection}>
                        <TouchableOpacity
                            style={styles.Icon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons name='eye-off-outline' size={20} color='black' />
                        </TouchableOpacity>
                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Nhập mật khẩu của bạn"


                            secureTextEntry="true"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                </View>
                {!this.state.loadingbtn ? (
                    <Button
                        type="primary"
                        onPress={this.onFinish}
                        style={styles.PrimaryBtn}
                    >
                        Lưu
                    </Button>
                ) : (
                    <Button style={styles.LoadingBtn} loading>
                        loading
                    </Button>
                )}
            </View>
        );
    }
}

export default ChangepasswordModal;
