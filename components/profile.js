// components/profile.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfilePage() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Track if screen is focused

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    genre: "",
    image: null,
  });

  // Reload profile whenever screen is focused
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const cached = await AsyncStorage.getItem("profileForm");
        if (cached) {
          setProfile(JSON.parse(cached));
        } else {
          setProfile({ username: "", email: "", genre: "", image: null });
        }
      } catch (e) {
        console.log("Error loading profile", e);
      }
    };
    if (isFocused) loadProfile();
  }, [isFocused]);

  // Avatar logic
  const avatarSource = profile.image
    ? { uri: profile.image }
    : profile.genre
    ? { uri: `https://via.placeholder.com/200?text=${profile.genre}` }
    : require("../assets/profilePlaceholder.jpg");

  return (
    <View style={styles.container}>
      <View style={styles.settingView}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.avatarWrapper}>
        <Image source={avatarSource} style={styles.avatar} />
      </View>

      <Text style={styles.username}>{profile.username || "No Username"}</Text>
      <Text style={styles.email}>{profile.email || "No Email"}</Text>
      {profile.genre ? <Text style={styles.genre}>{profile.genre}</Text> : null}

      <View style={styles.statsBox}>
        <Text style={styles.statsTitle}>Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Tasks Finished</Text>
          <Text style={styles.statValue}>5%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Tasks Forgotten</Text>
          <Text style={styles.statValue}>10%</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EditProfilePage")}
        >
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0C07", padding: 20 },
  backButton: {
    color: "#0B0C07",
    fontSize: 20,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 30,
    marginBottom: 10,
  },
  title: {
    color: "#0B0C07",
    fontSize: 20,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 30,
    marginLeft: 10,
  },
  settingView: {
    marginTop: 50,
    paddingTop: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#35DE4E",
  },
  avatarWrapper: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
    padding: 10,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#35DE4E",
  },
  username: {
    fontSize: 25,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 30,
    color: "#35DE4E",
    textAlign: "center",
    marginBottom: 10,
  },
  email: {
    fontSize: 15,
    fontFamily: "DotGothic16_400Regular",
    color: "#35DE4E",
    textAlign: "center",
    marginBottom: 5,
  },
  genre: {
    fontSize: 15,
    fontFamily: "DotGothic16_400Regular",
    color: "#35DE4E",
    textAlign: "center",
    marginBottom: 20,
  },
  statsBox: {
    borderWidth: 1,
    borderColor: "#35DE4E",
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 3,
    color: "#0B0C07",
    backgroundColor: "#35DE4E",
    marginBottom: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 30,
    color: "#35DE4E",
  },
  statValue: {
    fontSize: 13,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 30,
    color: "#35DE4E",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: "#35DE4E",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  actionText: {
    color: "#35DE4E",
    fontSize: 13,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 20,
  },
});
