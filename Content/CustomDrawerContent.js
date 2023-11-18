import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Alert, StyleSheet, SafeAreaView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';


const CustomDrawerContent = (props) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      /* console.log("Token from SecureStore: ", token); Para imprimir token */ 
      if (token) {
        try {
          // Asegúrate de que la URL es correcta y que tu servidor está configurado para manejar esta solicitud
          const response = await axios.get('http://localhost:8000/api/user/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          // Asegúrate de que la respuesta del servidor incluya el campo 'first_name'
          if (response.data.first_name) {
            setUserName(response.data.first_name);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Aquí deberías manejar el error, tal vez borrando el token si es inválido
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    // Aquí también deberías borrar cualquier otro dato de usuario almacenado
  
    // Muestra una alerta indicando que el logout fue exitoso
    Alert.alert('Se ha desconectado correctamente', '', [
      {
        text: 'OK',
        onPress: () => props.navigation.navigate('Login')
      }
    ]);
  }
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} style={{ marginTop: 0 }}>
        {/* Saludo en la parte superior del drawer */}
        {userName && (
          <Text style={styles.userGreeting}>{`Welcome, ${userName}`}</Text>
        )}

        {/* Lista de elementos del drawer */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Sección del logout en la parte inferior */}
      <DrawerItem label="Logout" onPress={handleLogout} style={styles.logoutItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  userGreeting: {
    padding: 16,
    fontSize: 16,
    // Asegúrate de que no haya margen superior para el saludo.
    marginTop: 0,
  },
  logoutItem: {
    
    // Coloca el botón "Logout" justo debajo del scrollview
    
    bottom: 30,
    width: '100%',
  },
  // ... más estilos si es necesario ...
});

export default CustomDrawerContent;