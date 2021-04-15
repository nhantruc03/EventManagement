import React from "react";
import { Text, View } from "react-native";
import { usePromiseTracker } from "react-promise-tracker";
const LoadingIndicator = ({ params }) => {
  const { promiseInProgress } = usePromiseTracker();
  console.log("promise", promiseInProgress);
  return !promiseInProgress ? (
    <View>
      <Text>Is Loading ....</Text>
    </View>
  ) : null;
};

export default LoadingIndicator;
