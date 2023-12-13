// screens/SettingsScreen.js

import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const { logout, isLoading, error } = useContext(AuthContext);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    // Aquí deberías obtener la información del usuario desde tu API
    // Por el momento, solo estamos estableciendo algunos valores de ejemplo
    const fetchUserInfo = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/api/user/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          setUserInfo({
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            email: response.data.email,
          });
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#003366"
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.toggleDrawer()}>
          <Ionicons
            name="md-menu"
            size={24}
            color="#003366"
          />
        </TouchableOpacity>
      ),
      title: 'Settings', // Cambia el título según corresponda
    });
  }, [navigation]);

  const handleChangePassword = async () => {
    // Primero verifica la longitud de las contraseñas nuevas
    if (newPassword.length < 8 || confirmNewPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
  
    // Luego verifica si las contraseñas nuevas coinciden
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    // Mostrar un mensaje de confirmación antes de proceder
    Alert.alert(
      "Please confirm Password Change",
      "By changing Password this session will end. Do you wish to continue?",
      [
        // Botón para cancelar sin hacer nada
        {
          text: "Cancel",
          style: "cancel"
        },
        // Botón para continuar con el cambio de contraseña
        {
          text: "Continue",
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync('userToken');
              const response = await axios.post('http://localhost:8000/api/change-password/', {
                old_password: currentPassword,
                new_password: newPassword
              }, {
                headers: {
                  'Authorization': `Token ${token}`
                }
              });

              // Si la respuesta es exitosa, mostrar alerta y cerrar sesión
              if (response.status === 200) {
                Alert.alert("Success", "Your password has been changed.", [
                  {
                    text: "OK", onPress: async () => {
                      await logout();
                      navigation.navigate('Login');
                    }
                  }
                ]);
              }
            } catch (error) {
              // Si hay un error, mostrar una alerta de error
              Alert.alert("Error", "There was an error while changing password.");
              console.error(error);
            }
          }
        }
      ],
      { cancelable: false } // Esto evita que el alerta se cierre al tocar fuera de él
    );
  };


  return (
    <View className="container">
      {isLoading && <Text className="loading-indicator">Cargando...</Text>}
      {error && <Text className="error-message">{error.message}</Text>}
      <View className="flex items-center mx-4 space-y-4">
        <View className="pl-3 pt-5 w-full">
          <Text className="font-bold text-lg text-gray-500">Name: {userInfo.firstName}</Text>
        </View>
        <View className="pl-3 w-full">
          <Text className="font-bold text-lg text-gray-500">Last Name: {userInfo.lastName}</Text>
        </View>
        <View className="pl-3 w-full">
          <Text className="font-bold text-lg text-gray-500">Email: {userInfo.email}</Text>
        </View>

        <View className="bg-white p-5 rounded-2xl w-full">
          <TextInput value={currentPassword} onChangeText={setCurrentPassword} placeholder="Current Password" secureTextEntry />
        </View>

        <View className="bg-white p-5 rounded-2xl w-full">
          <TextInput value={newPassword} onChangeText={setNewPassword} placeholder="New Password" secureTextEntry />
        </View>

        <View className="bg-white p-5 rounded-2xl w-full">
          <TextInput value={confirmNewPassword} onChangeText={setConfirmNewPassword} placeholder="Confirm New Password" secureTextEntry />
        </View>

        <TouchableOpacity onPress={handleChangePassword}
          className="w-full /*color*/ bg-yellow-500 /*color*/ p-3 rounded-2xl mb-3 change-password-button" >
          <Text className="text-xl font-bold text-blue-950 text-center change-password-button-text">
            Change Password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 10,
  },
});


export default SettingsScreen;
