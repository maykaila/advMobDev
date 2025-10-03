// components/profile.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { themePalettes } from "../themeConfig";

export default function ProfilePage() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const themeMode = useSelector((s) => s.theme.mode);
  const accentColor = useSelector((s) => s.theme.accentColor);
  const colors = themePalettes(accentColor)[themeMode];

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    genre: "",
    image: null,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const cached = await AsyncStorage.getItem("profileForm");
        if (cached) setProfile(JSON.parse(cached));
        else setProfile({ username: "", email: "", genre: "", image: null });
      } catch (e) {
        console.log("Error loading profile", e);
      }
    };
    if (isFocused) loadProfile();
  }, [isFocused]);

  const avatarSource = profile.image
    ? { uri: profile.image }
    : profile.genre
    ? { uri: `https://via.placeholder.com/200?text=${profile.genre}` }
    : require("../assets/profilePlaceholder.jpg");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.settingView, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={[styles.backButton, { color: colors.background }]}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.background }]}>Profile</Text>
      </View>

      <View style={styles.avatarWrapper}>
        <Image source={avatarSource} style={[styles.avatar, { borderColor: colors.primary }]} />
      </View>

      <Text style={[styles.username, { color: colors.primary }]}>{profile.username || "No Username"}</Text>
      <Text style={[styles.email, { color: colors.primary }]}>{profile.email || "No Email"}</Text>
      {profile.genre && <Text style={[styles.genre, { color: colors.primary }]}>{profile.genre}</Text>}

      {/* <View style={[styles.statsBox, { borderColor: colors.primary }]}>
        <Text style={[styles.statsTitle, { backgroundColor: colors.primary, color: colors.background }]}>Stats</Text>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.primary }]}>Tasks Finished</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>5%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.primary }]}>Tasks Forgotten</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>10%</Text>
        </View>
      </View> */}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.primary }]} onPress={() => navigation.navigate("EditProfilePage")}>
          <Text style={[styles.actionText, { color: colors.primary }]}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.primary }]}>
          <Text style={[styles.actionText, { color: colors.primary }]}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: { fontSize: 20, fontFamily: "DotGothic16_400Regular", lineHeight: 30, marginBottom: 10 },
  title: { fontSize: 20, fontFamily: "DotGothic16_400Regular", lineHeight: 30, marginLeft: 10 },
  settingView: { marginTop: 50, paddingTop: 5, paddingHorizontal: 10, flexDirection: "row", alignItems: "flex-start" },
  avatarWrapper: { alignItems: "center", marginTop: 30, marginBottom: 15, padding: 10 },
  avatar: { width: 200, height: 200, borderRadius: 5, borderWidth: 2 },
  username: { fontSize: 25, fontFamily: "DotGothic16_400Regular", lineHeight: 30, textAlign: "center", marginBottom: 10 },
  email: { fontSize: 15, fontFamily: "DotGothic16_400Regular", textAlign: "center", marginBottom: 5 },
  genre: { fontSize: 15, fontFamily: "DotGothic16_400Regular", textAlign: "center", marginBottom: 20 },
  // statsBox: { borderWidth: 1, borderRadius: 5, padding: 15, marginBottom: 20 },
  // statsTitle: { fontSize: 20, fontFamily: "DotGothic16_400Regular", lineHeight: 30, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 10 },
  // statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 },
  // statLabel: { fontSize: 13, fontFamily: "DotGothic16_400Regular" },
  // statValue: { fontSize: 13, fontFamily: "DotGothic16_400Regular" },
  actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 15 },
  actionButton: { borderWidth: 1, borderRadius: 5, paddingVertical: 10, paddingHorizontal: 15 },
  actionText: { fontSize: 13, fontFamily: "DotGothic16_400Regular" },
});