import React from "react";
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
      screenOptions={{ headerShown: false, drawerStyle: drawerStyles.drawer, drawerLabelStyle: drawerStyles.drawerLabel,}}
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Home" component={HomeWithDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
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
    color: "#35DE4E",
    lineHeight: 25,
  },
  logout: {
    fontSize: 15,
    fontFamily: 'DotGothic16_400Regular',
    color: "#FF5AB8",
    lineHeight: 25,
  },
});