// settings.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>This is a placeholder screen.</Text>
    </View>
  );
}

export default function SettingsPage() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: "#0B0C07" }, headerTintColor: "#35DE4E" }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: "Settings" }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0B0C07" },
  title: { fontSize: 22, fontWeight: "bold", color: "#35DE4E", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#fff" }
});
