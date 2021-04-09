import React, { Component } from "react";
import { Button, View, Text } from "react-native";

class Profilescreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>You have (undefined) friends.</Text>

        <Button
          title="Add some friends"
          onPress={() => this.props.navigation.navigate("EventDetails")}
        />
      </View>
    );
  }
}

// const Profilescreen = ({ navigation }) => {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>Event Screen</Text>
//     </View>
//   );
// };
export default Profilescreen;
