import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, useDrawerProgress } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import LoginPage from "./components/loginPage";
import TaskPage from "./components/homepage";
import ProfilePage from "./components/profile";
import SettingsPage from "./components/settings";
import TaskFolders from "./components/playlist";
import PlaylistDetail from "./components/playlistDets";
import EditProfilePage from "./components/profileEdit";


const Stack = createNativeStackNavigator(), Drawer = createDrawerNavigator();

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
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEnabled: true,
        gestureEnabled: true,
        drawerType: "front",
        swipeEdgeWidth: 100,
        drawerStyle: drawerStyles.drawer,
        drawerLabelStyle: drawerStyles.drawerLabel,
        drawerActiveBackgroundColor: drawerColors.activeTint,
        drawerActiveTintColor: drawerColors.activeText,
        drawerInactiveTintColor: drawerColors.inactiveText,
        sceneContainerStyle: { backgroundColor: "#0B0C07" }, // dark bg to match theme
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
        options={{ animation: "slide_from_right", animationDuration: 300 }}
      />
      <Drawer.Screen
        name="Profile"
        children={() => (
          <AnimatedScreen>
            <ProfilePage />
          </AnimatedScreen>
        )}
        options={{ animation: "slide_from_right", animationDuration: 300 }}
      />
      <Drawer.Screen
        name="Settings"
        children={() => (
          <AnimatedScreen>
            <SettingsPage />
          </AnimatedScreen>
        )}
        options={{ animation: "slide_from_right", animationDuration: 300 }}
      />
      <Drawer.Screen
        name="Logout"
        children={() => (
          <AnimatedScreen>
            <LoginPage />
          </AnimatedScreen>
        )}
        options={{ drawerLabelStyle: drawerStyles.logout }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        onStateChange={(state) => {
          try {
            localStorage.setItem("lastRoute", state.routes[state.index].name);
          } catch {}
        }}
        initialState={(() => {
          try {
            const lastRoute = localStorage.getItem("lastRoute");
            if (lastRoute) return { routes: [{ name: lastRoute }] };
          } catch {}
          return { routes: [{ name: "Login" }] };
        })()}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{ animation: "fade", animationDuration: 200 }}
          />
          <Stack.Screen name="Home" component={HomeWithDrawer} />
          <Stack.Screen name="PlaylistDetail" component={PlaylistDetail} />
          <Stack.Screen name="EditProfilePage" component={EditProfilePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const drawerStyles = StyleSheet.create({
  drawer: {
    backgroundColor: "#0B0C07",
    width: "60%",
  },
  drawerLabel: {
    fontSize: 15,
    fontFamily: "DotGothic16_400Regular",
    lineHeight: 25,
  },
  logout: {
    fontSize: 15,
    fontFamily: "DotGothic16_400Regular",
    color: "#FF5AB8",
    lineHeight: 25,
  },
});

const drawerColors = {
  activeTint: "#35DE4E",
  activeText: "#0B0C07",
  inactiveText: "#35DE4E",
};
