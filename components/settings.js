import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, setAccentColor } from "../redux/themeSlice";
import Slider from "@react-native-community/slider";
import { themePalettes } from "../themeConfig";

export default function SettingsPage() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const accentColor = useSelector((state) => state.theme.accentColor);

  const [customColor, setCustomColor] = useState(accentColor);

  const colors = themePalettes(accentColor)[themeMode] || themePalettes(accentColor).light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Menu Icon */}
      <View style={styles.headerRow}>
        <Ionicons
          name="menu"
          size={26}
          color={colors.primary}
          onPress={() => navigation.openDrawer()}
        />
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Settings</Text>
      </View>

      {/* Theme Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Choose Theme</Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.card, borderColor: themeMode === "light" ? colors.primary : "transparent" }
          ]}
          onPress={() => dispatch(setTheme("light"))}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Light</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.card, borderColor: themeMode === "dark" ? colors.primary : "transparent" }
          ]}
          onPress={() => dispatch(setTheme("dark"))}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Dark</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.card, borderColor: themeMode === "custom" ? colors.primary : "transparent" }
          ]}
          onPress={() => dispatch(setTheme("custom"))}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Custom</Text>
        </TouchableOpacity>
      </View>

      {/* Accent Picker (only if custom) */}
      {themeMode === "custom" && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Custom Accent</Text>

          {/* RGB Sliders */}
          {["R", "G", "B"].map((channel, idx) => (
            <View key={channel} style={{ marginVertical: 8 }}>
              <Text style={{ color: colors.text, marginBottom: 4 }}>{channel}</Text>
              <Slider
                minimumValue={0}
                maximumValue={255}
                step={1}
                value={parseInt(customColor.slice(1 + idx * 2, 3 + idx * 2), 16)}
                minimumTrackTintColor={channel === "R" ? "#ff0000" : channel === "G" ? "#00ff00" : "#0000ff"}
                maximumTrackTintColor="#888"
                onValueChange={(val) => {
                  const r = channel === "R" ? val : parseInt(customColor.slice(1, 3), 16);
                  const g = channel === "G" ? val : parseInt(customColor.slice(3, 5), 16);
                  const b = channel === "B" ? val : parseInt(customColor.slice(5, 7), 16);
                  setCustomColor(`#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`);
                }}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: customColor, borderColor: colors.primary }]}
            onPress={() => dispatch(setAccentColor(customColor))}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Apply Accent</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: {
    fontSize: 22,
    fontFamily: "DotGothic16_400Regular",
    marginLeft: 12,
  },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "DotGothic16_400Regular",
  },
  button: {
    padding: 14,
    borderRadius: 6,
    marginVertical: 6,
    alignItems: "center",
    borderWidth: 2,
  },
  buttonText: {
    fontFamily: "DotGothic16_400Regular",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginVertical: 10,
    fontFamily: "DotGothic16_400Regular",
  },
});
