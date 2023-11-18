import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomDrawerContent from './CustomDrawerContent';
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { AuthProvider } from './AuthContext';
import CursoActivoScreen from "./screens/CursoActivoScreen"
import CursoComplScreen from "./screens/CursoComplScreen"
import CursoNoIniScreen from "./screens/CursoNoIniScreen"



const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="Drawer" component={DrawerNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="CursoActivo" component={CursoActivoScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="CursoCompletado" component={CursoComplScreen} options={{ drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="CursoNoIniciado" component={CursoNoIniScreen} options={{ drawerItemStyle: { height: 0 } }} />
      {/* ... otras pantallas ... */}
    </Drawer.Navigator>
  );
}

export default App;
