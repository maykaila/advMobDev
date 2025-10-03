import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { themePalettes } from "../themeConfig"; // 👈 import centralized theme

export default function Homepage() {
  const navigation = useNavigation();

  // 👇 Redux theme state
  const themeMode = useSelector((state) => state.theme.mode);
  const accentColor = useSelector((state) => state.theme.accentColor);

  // 👇 Get colors from centralized theme
  const colors = themePalettes(accentColor)[themeMode] || themePalettes(accentColor).light;

  const [greeting, setGreeting] = useState("Good Evening");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const dummyPlaylists = [
    { id: "1", name: "Chill Mode", cover: require("../assets/nerdCat.png") },
    { id: "2", name: "Focus Beats", cover: require("../assets/nerdCat.png") },
    { id: "3", name: "Workout Pump", cover: require("../assets/nerdCat.png") },
    { id: "4", name: "Sleep Tight", cover: require("../assets/nerdCat.png") },
  ];

  const renderCard = ({ item }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
      <Image
        source={item.cover}
        style={[styles.cardImg, { borderColor: colors.primary }]}
      />
      <Text style={[styles.cardText, { color: colors.primary }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Ionicons
          name="menu"
          size={26}
          color={colors.primary}
          onPress={() => navigation.openDrawer()}
        />
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          {greeting}
        </Text>
      </View>

      {/* Recently Played */}
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        Recently Played
      </Text>
      <FlatList
        data={dummyPlaylists}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
      />

      {/* Made for You */}
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        Made for You
      </Text>
      <FlatList
        data={dummyPlaylists}
        renderItem={renderCard}
        keyExtractor={(item) => item.id + "m"}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    marginLeft: 12,
    fontFamily: "DotGothic16_400Regular",
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 12,
    marginBottom: 6,
    fontFamily: "DotGothic16_400Regular",
  },
  card: {
    marginRight: 14,
    width: 120,
    maxHeight: 120,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  cardImg: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
  },
  cardText: {
    fontSize: 13,
    textAlign: "center",
    fontFamily: "DotGothic16_400Regular",
  },
});