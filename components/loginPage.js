import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, DotGothic16_400Regular } from "@expo-google-fonts/dotgothic16";
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // load font
  const [loaded, error] = useFonts({
    DotGothic16_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null; // prevent flicker until fonts load
  }

  const handleLogin = () => {
    if (email === "kaila@kai.kai" && password === "1234") {
      navigation.navigate("Home"); // 👈 go to Home screen
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo}/>
        <Text style={styles.title}>Nerd Stuffs</Text>
        {/* <Text style={styles.subtitle}>Log in to continue</Text> */}

        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
        />

        <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Be Correct With</Text>
        {/* Supposed to be auth but temp lang sa ni */}
        <View style={styles.socials}>
            <TouchableOpacity style={styles.auth}>
                <FontAwesome name="facebook" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.auth}>
                <AntDesign name="google" size={18} color="#fff" />
            </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
            <Text style={styles.footer}>Don’t have an account?</Text>
            <TouchableOpacity>
                <Text style={styles.link}> Sign up</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Spotify dark background
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    height: 80,
    width: 80,
    // paddingBottom: 80,
  },
  title: {
    paddingTop: 25,
    fontSize: 32,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 30,
    color: "#fff",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    backgroundColor: "#0a0a0aff", // darker input bg
    padding: 15,
    borderRadius: 30,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#0a0a0aff",
    fontFamily: "DotGothic16_400Regular",
  },
  forgotContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: 15,
  },
  forgot: {
    fontSize: 13,
    color: "#b3b3b3",
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 15,
    paddingBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#1DB954", // Spotify green
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 25,
  },
  subtitle: {
    fontSize: 10,
    color: "#1DB954",
    marginBottom: 4,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 25,
  },
  socials: {
    flexDirection: 'row',
  },
  auth: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 25,
  },
  footerContainer: {
    flexDirection: 'row',
  },
  link: {
    color: "#1DB954",
    marginTop: 10,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 25,
  },
});