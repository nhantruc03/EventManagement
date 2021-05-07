import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import Url from "../../env";
import moment from "moment";
import getToken from "../../Auth";
import { Button, Modal, Provider, Picker } from '@ant-design/react-native';
import AsyncStorage from "@react-native-community/async-storage";
import ChangePasswordModal from "../../components/Profile/ChangepasswordModal";
import Customdatetime from "../../components/helper/datetimepicker";
import Indicator from '../../components/helper/Loading';
import UploadImage from '../../components/helper/UploadImage';
import SearchableDropDown from 'react-native-searchable-dropdown';

const styles = StyleSheet.create({
    avaContainer: {
        zIndex: 3,
        position: "absolute",
        alignSelf: "center"
    },
    avaImg: {
        marginTop: 24,
        width: 124,
        height: 124,
        borderRadius: 100,

    },
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#ffffff",
    },
    IconRight: {
        right: 16,
    },
    ActiveInputText: {
        borderBottomWidth: 1,
        borderBottomColor: "#EBEBEB"
    },
    infoContainer: {
        marginHorizontal: 16,
        marginTop: 80,
        zIndex: 1,
        backgroundColor: "white",
        borderRadius: 12,
        paddingBottom: 24,
        paddingTop: 90,
        paddingHorizontal: 16,
    },
    editInfoContainer: {
        marginHorizontal: 16,

        zIndex: 1,
        backgroundColor: "white",
        borderRadius: 12,
        paddingBottom: 24,
        paddingTop: 90,
        paddingHorizontal: 16,
    },

    TextLabel: {
        fontFamily: "semibold",
        fontSize: 16,
        color: "#5C5C5C"
    },
    InputContainer: {
        marginBottom: 24,
    },
    TextUpdate: {
        fontFamily: "semibold",
        textDecorationLine: "underline",
        color: "#2A9D8F"
    },
    btnUpdate: {
        color: "#fff",
        height: 48,
        backgroundColor: "#2A9D8F",
        borderRadius: 8,
        justifyContent: "center",
        margin: 16,
    },
    textUpdate: {
        fontFamily: "bold",
        fontSize: 16,
        color: "white",
        textAlign: "center",
    },
})

class ProfileDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            edit: false,
            loadingbtn: false,
            name: "",
            email: "",
            birthday: "",
            visible: false,
            isLoading: true,
            photoUrl: null,
            photoUrl_localPath: null,
            photoList: [],
            curGender: {},
            listGender: [{ id: "nam", name: "Nam" }, { id: "nữ", name: "Nữ" }]
        };

    }


    async componentDidMount() {

        if (this.state.photoList.length > 0) {
            data = {
                ...data,
                photoUrl: this.state.photoList[0].response.url
            }
        }

        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={styles.IconRight}>
                    <TouchableOpacity onPress={() => { this.setState({ edit: !this.state.edit }) }}>
                        {/* {this.renderTopIcon()} */}
                        <Ionicons name='close-outline' size={24} color='white' />
                        {/* {!this.state.edit ? < Ionicons name='close-outline' size={24} color='white' /> : < Ionicons name='create-outline' size={24} color='white' />} */}
                    </TouchableOpacity>
                </View>
            ),
        });
        let temp_gender = {}
        this.state.listGender.forEach(e => {
            if (e.id === this.props.route.params.data.gender) {
                temp_gender = e
            }
        })
        this.setState({
            data: this.props.route.params.data,
            curGender: temp_gender,
            isLoading: false,
        });
    }

    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    onChangePhone = (phone) => {
        this.setState({
            data: {
                ...this.state.data,
                phone: phone,
            },
        });
    };
    onChangeEmail = (email) => {
        this.setState({
            data: {
                ...this.state.data,
                email: email,
            },
        });
    };
    onChangeName = (name) => {
        this.setState({
            data: {
                ...this.state.data,
                name: name,
            },
        });
    };
    onChangeGender = (gender) => {
        this.setState({
            curGender: gender
        });
    };


    onChangeTime = (time) => {
        this.setState({
            data: {
                ...this.state.data,
                birthday: time,
            },
        });
    };
    onLoading() {
        this.setState({
            loadingbtn: true,
        });
    }

    onSubmit = async () => {
        this.onLoading();

        let data = {
            ...this.state.data,
            gender: this.state.curGender.id
        }
        if (this.state.photoUrl !== null) {
            data = {
                ...data,
                photoUrl: this.state.photoUrl,
            };
        }
        let login = await AsyncStorage.getItem("login");
        var obj = JSON.parse(login);
        await
            axios.put(`${Url()}/api/users/` + obj.id, data, {
                headers: {
                    'Authorization': await getToken()
                }
            })
                .then(async res => {
                    if (this.state.photoUrl !== null) {
                        obj.photoUrl = this.state.photoUrl
                    }
                    obj.name = data.name
                    await AsyncStorage.removeItem("login");
                    await AsyncStorage.setItem("login", JSON.stringify(obj));
                    this.setState({
                        loadingbtn: false,
                        edit: !this.state.edit,
                        data: data,
                        photoUrl: null,
                        photoUrl_localPath: null
                    });


                    alert("Cập nhật thông tin thành công");
                    console.log("update success");
                    this.props.navigation.navigate("Profile", {
                        data: data,
                    });
                })
                .catch(err => {
                    alert("Cập nhật thông tin thất bại");
                    console.log("update fails");
                })
    }

    renderBtnLoading = () => {
        if (!this.state.loadingbtn) {
            return (
                <TouchableOpacity
                    style={styles.btnUpdate}
                    underlayColor="#fff"
                    onPress={() => this.onSubmit()}
                >
                    <Text style={styles.TextUpdate}>Cập nhật</Text>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <Button loading>loading</Button>
            )
        }
    }

    render() {
        console.log(this.state.data)
        if (!this.state.isLoading) {
            return (
                <Provider>
                    <View>
                        <View style={styles.avaContainer}>
                            {this.state.edit ? <UploadImage
                                Save={(e, b) => {
                                    this.setState({ photoUrl: e, photoUrl_localPath: b });
                                }}
                                localPath={this.state.photoUrl_localPath}
                            /> : <Image
                                style={styles.avaImg}
                                source={{
                                    uri: `${Url()}/api/images/${this.state.data.photoUrl}`,
                                }}
                            />}

                        </View>
                        <View style={!this.state.edit ? styles.infoContainer : styles.editInfoContainer}>
                            <View style={styles.InputContainer}>
                                <Text style={styles.TextLabel}>Họ và Tên</Text>
                                <TextInput style={this.state.edit ? styles.ActiveInputText : styles.Text}
                                    onChangeText={this.onChangeName}
                                    editable={this.state.edit}>
                                    {this.state.data.name}
                                </TextInput>
                            </View>
                            <View style={styles.InputContainer}>
                                <Text style={styles.TextLabel}>Giới tính</Text>
                                {!this.state.edit ?
                                    <TextInput style={styles.Text}>
                                        {this.state.curGender.id === "nam" ? "Nam" : "Nữ"}
                                    </TextInput>
                                    :
                                    <View style={styles.Box}>
                                        <SearchableDropDown
                                            onItemSelect={(item) => {
                                                this.setState({
                                                    curGender: item,
                                                });
                                            }}
                                            selectedItems={this.state.curGender}
                                            defaultIndex={
                                                this.state.listGender.indexOf(
                                                    this.state.curGender
                                                ) !== -1
                                                    ? this.state.listGender.indexOf(
                                                        this.state.curGender
                                                    )
                                                    : undefined
                                            }
                                            containerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
                                            itemStyle={{
                                                padding: 10,
                                                marginTop: 2,
                                                backgroundColor: "#ddd",
                                                borderColor: "#bbb",
                                                borderWidth: 1,
                                                borderRadius: 5,
                                            }}
                                            itemTextStyle={{ color: "#222" }}
                                            itemsContainerStyle={{ maxHeight: 140 }}
                                            items={this.state.listGender}
                                            resetValue={false}
                                            textInputProps={{
                                                placeholder: "Chọn giới tính",
                                                underlineColorAndroid: "transparent",
                                                style: {
                                                    padding: 12,
                                                    borderWidth: 1,
                                                    borderColor: "#ccc",
                                                    borderRadius: 5,
                                                },
                                            }}
                                            listProps={{
                                                nestedScrollEnabled: true,
                                            }}
                                        />
                                    </View>}
                            </View>
                            <View style={styles.InputContainer}>
                                <Text style={styles.TextLabel}>Ngày sinh</Text>
                                {!this.state.edit ? <TextInput style={styles.Text}
                                >
                                    {moment(this.state.data.birthday).format("DD/MM/YYYY")}
                                </TextInput> :
                                    <Customdatetime
                                        containerStyle={styles.ScriptNameContainer}
                                        BoxInput={styles.BoxInput}
                                        Save={(e) => this.onChangeTime(e)}
                                        data={this.state.data.time}
                                        mode="date"
                                    />}

                            </View>
                            <View style={styles.InputContainer}>
                                <Text style={styles.TextLabel}>Số điện thoại</Text>
                                <TextInput style={this.state.edit ? styles.ActiveInputText : styles.Text}
                                    onChangeText={this.onChangePhone}
                                    editable={this.state.edit}>
                                    {this.state.data.phone}
                                </TextInput>
                            </View>
                            <View style={styles.InputContainer}>
                                <Text style={styles.TextLabel}>Email</Text>
                                <TextInput style={this.state.edit ? styles.ActiveInputText : styles.Text}
                                    onChangeText={this.onChangeEmail}
                                    editable={this.state.edit}>
                                    {this.state.data.email}
                                </TextInput>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ visible: true })}>
                                <Text style={styles.TextUpdate}>Cập nhật mật khẩu</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal
                            title="Đổi mật khẩu"
                            transparent
                            onClose={this.onClose}
                            maskClosable
                            visible={this.state.visible}
                            closable
                        >
                            <ChangePasswordModal />
                        </Modal>
                        {this.state.edit ? this.renderBtnLoading() : null}
                    </View>
                </Provider>
            );
        } else return <Indicator />;
    }

}

export default ProfileDetail;