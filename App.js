// App.js
import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, useDrawerProgress } from "@react-navigation/drawer";
import { StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

// Redux
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";

// Theme
import { themePalettes } from "./themeConfig";

// Screens
import LoginPage from "./components/loginPage";
import TaskPage from "./components/homepage";
import ProfilePage from "./components/profile";
import SettingsPage from "./components/settings";
import TaskFolders from "./components/playlist";
import PlaylistDetail from "./components/playlistDets";
import EditProfilePage from "./components/profileEdit";
import CameraPage from "./components/cameraFunction";

const Stack = createNativeStackNavigator(), Drawer = createDrawerNavigator();

//global font override
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [
  Text.defaultProps.style,
  { fontFamily: "DotGothic16_400Regular" },
];

function AnimatedScreen({ children }) {
  const progress = useDrawerProgress() ?? { value: 0 };
  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value ?? 0;
    return {
      transform: [{ scale: 1 - p * 0.08 }],
      borderRadius: p * 18,
      opacity: 1 - p * 0.06,
      overflow: "hidden",
    };
  });
  return <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>;
}

function HomeWithDrawer() {
  //pull theme from redux
  const themeMode = useSelector((state) => state.theme.mode);
  const accentColor = useSelector((state) => state.theme.accentColor);
  const colors = themePalettes(accentColor)[themeMode] || themePalettes(accentColor).light;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEnabled: true,
        gestureEnabled: true,
        drawerType: "front",
        swipeEdgeWidth: 100,
        drawerStyle: { backgroundColor: colors.background, width: "60%" },
        drawerLabelStyle: {
          fontSize: 15,
          fontFamily: "DotGothic16_400Regular",
          lineHeight: 25,
        },
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: colors.background,
        drawerInactiveTintColor: colors.primary,
        sceneContainerStyle: { backgroundColor: colors.background },
      }}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen
        name="Dashboard"
        children={() => (
          <AnimatedScreen>
            <TaskPage />
          </AnimatedScreen>
        )}
      />
      <Drawer.Screen
        name="Playlist"
        children={() => (
          <AnimatedScreen>
            <TaskFolders />
          </AnimatedScreen>
        )}
      />
      <Drawer.Screen
        name="Camera"
        children={() => (
          <AnimatedScreen>
            <CameraPage />
          </AnimatedScreen>
        )}
      />
      <Drawer.Screen
        name="Profile"
        children={() => (
          <AnimatedScreen>
            <ProfilePage />
          </AnimatedScreen>
        )}
      />
      <Drawer.Screen
        name="Settings"
        children={() => (
          <AnimatedScreen>
            <SettingsPage />
          </AnimatedScreen>
        )}
      />
      <Drawer.Screen
        name="Logout"
        children={() => (
          <AnimatedScreen>
            <LoginPage />
          </AnimatedScreen>
        )}
        options={{
          drawerLabelStyle: {
            fontSize: 15,
            fontFamily: "DotGothic16_400Regular",
            color: "#FF5AB8",
            lineHeight: 25,
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Home" component={HomeWithDrawer} />
            <Stack.Screen name="PlaylistDetail" component={PlaylistDetail} />
            <Stack.Screen name="EditProfilePage" component={EditProfilePage} />
            <Stack.Screen name="CameraPage" component={CameraPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}