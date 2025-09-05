import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginPage from "./components/loginPage.js";
import TaskPage from "./components/homepage.js";
import ProfilePage from "./components/profile.js";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeWithDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Dashboard" // 👈 correct place!
    >
      <Drawer.Screen name="Dashboard" component={TaskPage} />
      <Drawer.Screen name="Profile" component={ProfilePage} /> 
      <Drawer.Screen name="Logout" component={LoginPage} />
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