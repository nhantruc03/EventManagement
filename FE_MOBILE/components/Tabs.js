import React, { Component, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const listTab = [
  {
    status: "Tất cả",
  },
  {
    status: "Đang diễn ra",
  },
  {
    status: "Sắp tới",
  },
  {
    status: "Đã xong",
  },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F7F8",
  },
  listTab: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#F6F7F8",
  },
  btnTab: {
    padding: 15,
    backgroundColor: "#F6F7F8",
  },
  btnTabActive: {
    borderBottomColor: "#2A9D8F",
    borderBottomWidth: 3,
  },
  textTab: {
    color: "#AAB0B6",
  },
  textTabActive: {
    color: "#2A9D8F",
  },
});

const TabView = () => {
  const [status, setStatus] = useState("Tất cả");
  const setStatusFilter = (status) => {
    setStatus(status);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listTab}>
        {listTab.map((e, key) => (
          <TouchableOpacity
            key={key}
            style={[styles.btnTab, status === e.status && styles.btnTabActive]}
            onPress={() => setStatusFilter(e.status)}
          >
            <Text
              style={
                (styles.textTab, status === e.status && styles.textTabActive)
              }
            >
              {e.status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default TabView;

// import React, { Component } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { Tabs } from "@ant-design/react-native";

// export default class TabView extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     const tabs = [
//       { title: "First Tab" },
//       { title: "Second Tab" },
//       { title: "Third Tab" },
//     ];
//     const style = {
//       alignItems: "center",
//       justifyContent: "center",
//       height: 150,
//       backgroundColor: "#fff",
//     };
//     return (
//       <View>
//         <Tabs
//           tabs={tabs}
//           renderTabBar={(tabProps) => (
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-evenly",
//               }}
//             >
//               {tabProps.tabs.map((tab, i) => (
//                 // change the style to fit your needs
//                 <TouchableOpacity
//                   activeOpacity={2.0}
//                   key={tab.key || i}
//                   style={{
//                     // width: '30%',
//                     padding: 6,
//                   }}
//                   onPress={() => {
//                     const { goToTab, onTabClick } = tabProps;
//                     // tslint:disable-next-line:no-unused-expression
//                     onTabClick && onTabClick(tabs[i], i);
//                     // tslint:disable-next-line:no-unused-expression
//                     goToTab && goToTab(i);
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: tabProps.activeTab === i ? "green" : undefined,
//                     }}
//                   >
//                     {tab.title}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         >
//           <View style={style}>
//             <Text>Content of First Tab</Text>
//           </View>
//           <View style={style}>
//             <Text>Content of Second Tab</Text>
//           </View>
//           <View style={style}>
//             <Text>Content of Third Tab</Text>
//           </View>
//         </Tabs>
//       </View>
//     );
//   }
// }
