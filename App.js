import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import LoginPage from "./components/loginPage.js";
import TaskPage from "./components/homepage.js";
import ProfilePage from "./components/profile.js";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeWithDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, swipeEnabled: true,  gestureEnabled: true, drawerType: "front", swipeEdgeWidth: 100, drawerStyle: drawerStyles.drawer, drawerLabelStyle: drawerStyles.drawerLabel, drawerActiveBackgroundColor: drawerColors.activeTint, drawerActiveTintColor: drawerColors.activeText, drawerInactiveTintColor: drawerColors.inactiveText,}}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen name="Dashboard" component={TaskPage} />
      <Drawer.Screen name="Profile" component={ProfilePage} /> 
      <Drawer.Screen name="Logout" component={LoginPage} options={{drawerLabelStyle: drawerStyles.logout}}/>
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Home" component={HomeWithDrawer} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const drawerStyles = StyleSheet.create({
  drawer: {
    backgroundColor: "#0B0C07",
    width: '60%',
  },
  drawerLabel: {
    fontSize: 15,
    fontFamily: 'DotGothic16_400Regular',
    // color: "#35DE4E",
    lineHeight: 25,
  },
  logout: {
    fontSize: 15,
    fontFamily: 'DotGothic16_400Regular',
    color: "#FF5AB8",
    lineHeight: 25,
  },
});

const drawerColors = {
  activeTint: "#35DE4E",
  activeText: "#0B0C07",
  inactiveText: "#35DE4E",
};