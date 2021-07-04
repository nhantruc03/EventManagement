import React from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 20,
  },
});

const EventCard = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.cardContent}>{props.children}</View>
    </View>
  );
};

export default EventCard;
