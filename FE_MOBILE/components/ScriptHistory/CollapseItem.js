import React, { Component } from "react";
import { View, Text, StyleSheet, LayoutAnimation, Image, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Timeline from "react-native-timeline-flatlist";
import Ionicons from "react-native-vector-icons/Ionicons";
import Url from "../../env";
import moment from "moment";
import HTML from "react-native-render-html";
const styles = StyleSheet.create({
    Container: {
        marginTop: 16,
    },
    headerContainer: {
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
    },
    itemContainer: {
        marginHorizontal: 16,
    },
    label: {
        fontFamily: "semibold",
        fontSize: 12,
    },
    compareContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    oldTag: {
        backgroundColor: "#FFE5E5",
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderRadius: 8,
        color: "#AAB0B6",
        textDecorationLine: "line-through",
        marginRight: 4,
        alignSelf: 'flex-start',
        marginBottom: 5
    },
    newTag: {
        backgroundColor: "#EAFFDD",
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderRadius: 8,
        color: "#264653",
        alignSelf: 'flex-start',
        marginBottom: 5
    },
});

const W = Dimensions.get("window").width;
export default class CollapseItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: true,
        };
    }

    renderChangeScriptName = (e) => {
        return (
            <View>
                <Text style={styles.label}>Tên kịch bản:</Text>
                <View style={styles.compareContainer}>
                    <Text style={styles.oldTag}>{e.oldNameScript}</Text>
                    <Text style={styles.newTag}>{e.newNameScript}</Text>
                </View>
            </View>
        );
    };

    renderChangeScriptForId = (e) => {
        return (
            <View>
                <Text>Người được phân công:</Text>
                <View style={styles.compareContainer}>
                    <Text style={styles.oldTag}>{e.oldForIdScript.name}</Text>
                    <Text style={styles.newTag}>{e.newForIdScript.name}</Text>
                </View>
            </View>
        );
    };

    renderChangeScriptDetailName = (e) => {
        return (
            <View>
                <Text>Tiêu đề:</Text>
                <View style={styles.compareContainer}>
                    <Text style={styles.oldTag}>{e.oldNameScriptDetail}</Text>
                    <Text style={styles.newTag}>{e.newNameScriptDetail}</Text>
                </View>
            </View>
        );
    };

    renderChangeScriptDetailTime = (e) => {
        return (
            <View style={{ flexDirection: "row" }}>
                <Text>Mốc thời gian:</Text>
                <View style={styles.compareContainer}>
                    <Text style={styles.oldTag}>
                        {moment(e.oldTimeScriptDetail).utcOffset(0).format("HH:mm")}
                    </Text>
                    <Text style={styles.newTag}>
                        {moment(e.newTimeScriptDetail).utcOffset(0).format("HH:mm")}
                    </Text>
                </View>
            </View>
        );
    };

    renderChangeScriptDetailDescription = (e, style) => {
        return (
            <View>
                <Text>Nội dung cũ:</Text>
                <HTML
                    source={{ html: e.oldDescriptionScriptDetail }}
                    style={styles.content}
                />
            </View>
        );
    };

    renderDetail = (rowData, sectionID, rowID) => {
        let description = "";
        if (rowData.isChangeNameScript || rowData.isChangeForIdScript) {
            description = "Chỉnh sửa kịch bản";
            return (
                <View style={{ maxWidth: W }}>
                    <Text style={styles.title}>{description}</Text>

                    {rowData.isChangeNameScript
                        ? this.renderChangeScriptName(rowData)
                        : null}
                    {rowData.isChangeForIdScript
                        ? this.renderChangeScriptForId(rowData)
                        : null}
                </View>
            );
        } else if (
            rowData.isChangeNameScriptDetail ||
            rowData.isChangeTimeScriptDetail ||
            rowData.isChangeDescriptionScriptDetail
        ) {
            description = "Chỉnh sửa chi tiết kịch bản";
            return (
                <View>
                    <Text style={styles.title}>{description}</Text>
                    <Text>{rowData.updateScriptDetailName}</Text>
                    {rowData.isChangeNameScriptDetail
                        ? this.renderChangeScriptDetailName(rowData)
                        : null}
                    {rowData.isChangeTimeScriptDetail
                        ? this.renderChangeScriptDetailTime(rowData)
                        : null}
                    {rowData.isChangeDescriptionScriptDetail
                        ? this.renderChangeScriptDetailDescription(rowData)
                        : null}
                </View>
            );
        } else if (rowData.isCreateDetail) {
            description = "Tạo mới";
            return (
                <View style={styles.title}>
                    <Text>{description}</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        <Text>Chi tiết kịch bản:</Text>
                        <Text style={styles.newTag}>{rowData.nameCreateDetail}</Text>
                    </View>
                </View>
            );
        } else if (rowData.isDeleteDetail) {
            description = "Xóa";
            return (
                <View style={styles.title}>
                    <Text>{description}</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        <Text>Chi tiết kịch bản:</Text>
                        <Text style={styles.oldTag}>{rowData.nameDeleteDetail}</Text>
                    </View>
                </View>
            );
        }
    };

    renderTime = (rowData, sectionID, rowID) => {
        return <Text>{moment(rowData.createdAt).format("HH:mm")}</Text>;
    };

    renderData = () => {
        let data = [];
        this.props.data.forEach((e) => {
            if (
                e.isChangeNameScript ||
                e.isChangeForIdScript ||
                e.isChangeNameScriptDetail ||
                e.isChangeTimeScriptDetail ||
                e.isChangeDescriptionScriptDetail ||
                e.isCreateDetail ||
                e.isDeleteDetail
            ) {
                let temp = {
                    ...e,
                    icon: (
                        <Image
                            style={{ width: 32, height: 32, borderRadius: 50 }}
                            source={{ uri: `${Url()}/api/images/${e.userId.photoUrl}` }}
                        />
                    ),
                    time: moment(e.createdAt).format("HH:mm"),
                };
                data.push(temp);
            }
        });

        return (
            <Timeline
                style={{ marginLeft: 20, width: W, paddingHorizontal: 8 }}
                timeContainerStyle={{ minWidth: 52, marginTop: 3 }}
                timeStyle={{
                    textAlign: "center",
                    backgroundColor: "#ff9797",
                    color: "white",
                    padding: 5,
                    borderRadius: 13,
                }}
                circleSize={32}
                innerCircle={"icon"}
                data={data}
                renderDetail={this.renderDetail}
            />
        );
    };

    render() {
        return (
            <View>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            LayoutAnimation.configureNext(
                                LayoutAnimation.Presets.easeInEaseOut
                            );
                            this.setState({ expand: !this.state.expand });
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={styles.headerText}>{this.props.title}</Text>
                            <View>
                                {this.state.expand ? (
                                    <Ionicons
                                        name="chevron-forward-outline"
                                        size={24}
                                        color="black"
                                    />
                                ) : (
                                    <Ionicons
                                        name="chevron-down-outline"
                                        size={24}
                                        color="black"
                                    />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>{!this.state.expand ? this.renderData() : null}</View>
            </View>
        );
    }
}
