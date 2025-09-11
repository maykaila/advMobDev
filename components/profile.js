// components/profile.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function ProfilePage({navigation}) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Profile Page</Text>
        <TouchableOpacity style={styles.settingView} onPress={() => navigation.openDrawer()} >
            <Image source={require('../assets/logoutButton.png')}/>
        </TouchableOpacity>
        <Text style={styles.text}>
            This is just a placeholder for your profile screen.
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C07",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#35DE4E",
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#35DE4E",
  },
});
