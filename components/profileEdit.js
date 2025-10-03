// components/EditProfilePage.js
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { themePalettes } from "../themeConfig";

const GENRES = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];

const ProfilePreview = React.memo(({ username, email, genre, image, colors }) => {
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(username || email || genre || image ? 1 : 0, { duration: 500 });
  }, [username, email, genre, image]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: fadeIn.value }));
  const previewImg = image ? { uri: image } : genre ? { uri: `https://via.placeholder.com/100?text=${genre}` } : require("../assets/profilePlaceholder.jpg");

  return (
    <Animated.View style={[styles.previewCard, animatedStyle, { borderColor: colors.primary }]}>
      <Image source={previewImg} style={[styles.previewAvatar, { borderColor: colors.primary }]} />
      <Text style={[styles.previewText, { color: colors.primary }]}>{username || "Username"}</Text>
      <Text style={[styles.previewText, { color: colors.primary }]}>{email || "Email"}</Text>
      <Text style={[styles.previewText, { color: colors.primary }]}>{genre || "Genre"}</Text>
    </Animated.View>
  );
});

export default function EditProfilePage() {
  const navigation = useNavigation();

  const themeMode = useSelector((s) => s.theme.mode);
  const accentColor = useSelector((s) => s.theme.accentColor);
  const colors = themePalettes(accentColor)[themeMode];

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const shakeUser = useSharedValue(0);
  const shakeEmail = useSharedValue(0);
  const shakeGenre = useSharedValue(0);

  const shakeAnimation = (field) => {
    if (field === "username") shakeUser.value = withSpring(10, {}, () => (shakeUser.value = 0));
    if (field === "email") shakeEmail.value = withSpring(10, {}, () => (shakeEmail.value = 0));
    if (field === "genre") shakeGenre.value = withSpring(10, {}, () => (shakeGenre.value = 0));
  };

  const animatedShake = (shared) => useAnimatedStyle(() => ({ transform: [{ translateX: shared.value ? Math.sin(shared.value) * 5 : 0 }] }));

  const validate = useCallback(() => {
    const newErrors = {};
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      newErrors.username = "Username must be 3-20 characters, alphanumeric/underscores only.";
      shakeAnimation("username");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
      shakeAnimation("email");
    }
    if (!GENRES.includes(genre)) {
      newErrors.genre = "Please select a valid genre.";
      shakeAnimation("genre");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, email, genre]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return alert("Permission to access camera roll is required!");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  useEffect(() => {
    const loadCache = async () => {
      const cached = await AsyncStorage.getItem("profileForm");
      if (cached) {
        const data = JSON.parse(cached);
        setUsername(data.username || "");
        setEmail(data.email || "");
        setGenre(data.genre || "");
        setImage(data.image || null);
      }
    };
    loadCache();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("profileForm", JSON.stringify({ username, email, genre, image }));
  }, [username, email, genre, image]);

  const handleSubmit = async () => {
    if (validate()) {
      await AsyncStorage.setItem("profileForm", JSON.stringify({ username, email, genre, image }));
      alert("Profile saved successfully!");
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.settingView, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.background }]}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.background }]}>Edit Profile</Text>
      </View>

      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={image ? { uri: image } : require("../assets/profilePlaceholder.jpg")} style={[styles.previewAvatar, { borderColor: colors.primary }]} />
        </TouchableOpacity>
        <Text style={{ color: colors.primary, marginTop: 10, fontFamily: "DotGothic16_400Regular" }}>Tap to change profile picture</Text>
      </View>

      <Animated.View style={[styles.inputWrapper, animatedShake(shakeUser)]}>
        <TextInput style={[styles.input, { borderColor: colors.primary, color: colors.primary }]} placeholder="Username" placeholderTextColor={colors.primary + "88"} value={username} onChangeText={setUsername} />
        {errors.username && <Text style={[styles.error, { color: "red" }]}>{errors.username}</Text>}
      </Animated.View>

      <Animated.View style={[styles.inputWrapper, animatedShake(shakeEmail)]}>
        <TextInput style={[styles.input, { borderColor: colors.primary, color: colors.primary }]} placeholder="Email" placeholderTextColor={colors.primary + "88"} value={email} onChangeText={setEmail} />
        {errors.email && <Text style={[styles.error, { color: "red" }]}>{errors.email}</Text>}
      </Animated.View>

      <Animated.View style={[styles.inputWrapper, animatedShake(shakeGenre)]}>
        <TextInput style={[styles.input, { borderColor: colors.primary, color: colors.primary }]} placeholder="Favorite Genre (Pop, Rock, Jazz, Classical, Hip-Hop)" placeholderTextColor={colors.primary + "88"} value={genre} onChangeText={setGenre} />
        {errors.genre && <Text style={[styles.error, { color: "red" }]}>{errors.genre}</Text>}
      </Animated.View>

      <TouchableOpacity style={[styles.submitButton, { borderColor: colors.primary }]} onPress={handleSubmit}>
        <Text style={[styles.submitText, { color: colors.primary }]}>Save Profile</Text>
      </TouchableOpacity>

      <ProfilePreview username={username} email={email} genre={genre} image={image} colors={colors} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: { fontSize: 20, fontFamily: "DotGothic16_400Regular", lineHeight: 30, marginBottom: 10 },
  title: { fontSize: 20, fontFamily: "DotGothic16_400Regular", lineHeight: 30, marginLeft: 10 },
  settingView: { marginTop: 50, paddingTop: 5, paddingHorizontal: 10, flexDirection: "row", alignItems: "flex-start" },
  inputWrapper: { marginVertical: 10 },
  input: { borderWidth: 1, borderRadius: 5, padding: 10, fontFamily: "DotGothic16_400Regular" },
  error: { marginTop: 5, fontSize: 12, fontFamily: "DotGothic16_400Regular" },
  submitButton: { borderWidth: 1, borderRadius: 5, paddingVertical: 12, alignItems: "center", marginVertical: 20 },
  submitText: { fontSize: 15, fontFamily: "DotGothic16_400Regular" },
  previewCard: { borderWidth: 1, borderRadius: 5, padding: 20, alignItems: "center", marginTop: 20 },
  previewAvatar: { width: 100, height: 100, borderRadius: 5, borderWidth: 2, marginBottom: 15 },
  previewText: { fontSize: 15, fontFamily: "DotGothic16_400Regular", marginBottom: 5 },
});