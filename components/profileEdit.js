// components/EditProfilePage.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";

const GENRES = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];

// Memoized profile preview
const ProfilePreview = React.memo(({ username, email, genre, image }) => {
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    if (username || email || genre || image) {
      fadeIn.value = withTiming(1, { duration: 500 });
    } else {
      fadeIn.value = withTiming(0, { duration: 300 });
    }
  }, [username, email, genre, image]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const previewImg = image
    ? { uri: image }
    : genre
    ? { uri: `https://via.placeholder.com/100?text=${genre}` }
    : require("../assets/profilePlaceholder.jpg");

  return (
    <Animated.View style={[styles.previewCard, animatedStyle]}>
      <Image source={previewImg} style={styles.previewAvatar} />
      <Text style={styles.previewText}>{username || "Username"}</Text>
      <Text style={styles.previewText}>{email || "Email"}</Text>
      <Text style={styles.previewText}>{genre || "Genre"}</Text>
    </Animated.View>
  );
});

export default function EditProfilePage() {
  const navigation = useNavigation();

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Shake animations
  const shakeUser = useSharedValue(0);
  const shakeEmail = useSharedValue(0);
  const shakeGenre = useSharedValue(0);

  const shakeAnimation = (field) => {
    if (field === "username") shakeUser.value = withSpring(10, {}, () => (shakeUser.value = 0));
    if (field === "email") shakeEmail.value = withSpring(10, {}, () => (shakeEmail.value = 0));
    if (field === "genre") shakeGenre.value = withSpring(10, {}, () => (shakeGenre.value = 0));
  };

  const animatedShake = (shared) =>
    useAnimatedStyle(() => ({
      transform: [{ translateX: shared.value ? Math.sin(shared.value) * 5 : 0 }],
    }));

  // Validation
  const validate = useCallback(() => {
    const newErrors = {};
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      newErrors.username =
        "Username must be 3-20 characters, alphanumeric/underscores only.";
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

  // Pick image
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Load cached data
  useEffect(() => {
    const loadCache = async () => {
      try {
        const cached = await AsyncStorage.getItem("profileForm");
        if (cached) {
          const data = JSON.parse(cached);
          setUsername(data.username || "");
          setEmail(data.email || "");
          setGenre(data.genre || "");
          setImage(data.image || null);
        }
      } catch (e) {
        console.log("Cache load error", e);
      }
    };
    loadCache();
  }, []);

  // Cache inputs
  useEffect(() => {
    const saveCache = async () => {
      try {
        await AsyncStorage.setItem(
          "profileForm",
          JSON.stringify({ username, email, genre, image })
        );
      } catch (e) {
        console.log("Cache save error", e);
      }
    };
    saveCache();
  }, [username, email, genre, image]);

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const data = { username, email, genre, image };
        await AsyncStorage.setItem("profileForm", JSON.stringify(data));

        alert("Profile saved successfully!");
        navigation.goBack();
      } catch (e) {
        console.log("Save error", e);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.settingView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      {/* Profile Image Picker */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              image
                ? { uri: image }
                : require("../assets/profilePlaceholder.jpg")
            }
            style={styles.previewAvatar}
          />
        </TouchableOpacity>
        <Text style={{ color: "#35DE4E", marginTop: 10, fontFamily: "DotGothic16_400Regular" }}>
          Tap to change profile picture
        </Text>
      </View>

      {/* Form */}
      <Animated.View style={[styles.inputWrapper, animatedShake(shakeUser)]}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
        />
        {errors.username && <Text style={styles.error}>{errors.username}</Text>}
      </Animated.View>

      <Animated.View style={[styles.inputWrapper, animatedShake(shakeEmail)]}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      </Animated.View>

      <Animated.View style={[styles.inputWrapper, animatedShake(shakeGenre)]}>
        <TextInput
          style={styles.input}
          placeholder="Favorite Genre (Pop, Rock, Jazz, Classical, Hip-Hop)"
          placeholderTextColor="#666"
          value={genre}
          onChangeText={setGenre}
        />
        {errors.genre && <Text style={styles.error}>{errors.genre}</Text>}
      </Animated.View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Save Profile</Text>
      </TouchableOpacity>

      {/* Profile Preview */}
      <ProfilePreview username={username} email={email} genre={genre} image={image} />
    </ScrollView>
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
  inputWrapper: { marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#35DE4E",
    borderRadius: 5,
    padding: 10,
    color: "#35DE4E",
    fontFamily: "DotGothic16_400Regular",
  },
  error: {
    color: "red",
    marginTop: 5,
    fontSize: 12,
    fontFamily: "DotGothic16_400Regular",
  },
  submitButton: {
    borderWidth: 1,
    borderColor: "#35DE4E",
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  submitText: {
    color: "#35DE4E",
    fontSize: 15,
    fontFamily: "DotGothic16_400Regular",
  },
  previewCard: {
    borderWidth: 1,
    borderColor: "#35DE4E",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  previewAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#35DE4E",
    marginBottom: 15,
  },
  previewText: {
    color: "#35DE4E",
    fontSize: 15,
    fontFamily: "DotGothic16_400Regular",
    marginBottom: 5,
  },
});
