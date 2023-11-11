// CustomDrawerContent.js
import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'; // Asegúrate de importar axios

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
    props.navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Mostrar el nombre del usuario si está disponible */}
      {userName && <DrawerItem label={`Welcome, ${userName}`} />}
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
