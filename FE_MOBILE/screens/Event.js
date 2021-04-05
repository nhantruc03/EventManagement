// Aboutscreen.js
import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { color, event } from "react-native-reanimated";

import TabView from "../components/Tabs";
import EventCard from "../components/EventCard";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F7F8",
    flex: 1,
  },
  toplabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 32,
    paddingTop: 20,
    fontWeight: "500",
    color: "#2A9D8F",
    backgroundColor: "#F6F7F8",
  },
  carditems: {
    padding: 20,
  },
});

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch("http://172.16.2.80:3001/api/events/getAll")
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          setEvents(response.results);
        })
        .catch((error) => {
          console.log(error);
          alert("Sorry, something went wrong.");
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return { events, loading };
};

const Eventscreen = ({ navigation }) => {
  const { events, loading } = useEvents();
  return (
    <View style={styles.container}>
      <Text style={styles.toplabel}>Sự kiện</Text>
      <SearchBar placeholder="Type Here..." />
      <TabView />
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ReviewDetails", item)}
          >
            <EventCard>
              <Text style={styles.titleText}>{item.title}</Text>
            </EventCard>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
export default Eventscreen;

// const [reviews, setReviews] = useState([
//   {
//     title: "Zelda, Breath of Fresh Air",
//     rating: 5,
//     body: "lorem ipsum",
//     key: "1",
//   },
//   {
//     title: "Gotta Catch Them All (again)",
//     rating: 4,
//     body: "lorem ipsum",
//     key: "2",
//   },
//   {
//     title: 'Not So "Final" Fantasy',
//     rating: 3,
//     body: "lorem ipsum",
//     key: "3",
//   },
// ]);
