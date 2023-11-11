// CustomDrawerContent.js
import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import * as SecureStore from 'expo-secure-store';

const CustomDrawerContent = (props) => {
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {
    // Obtén el nombre de usuario usando el token almacenado
    const fetchUser = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      // Suponiendo que tienes un endpoint que devuelve información del usuario basada en el token
      const response = await axios.get('API_ENDPOINT/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserName(response.data.first_name);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    props.navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label={`Welcome, ${userName}`} onPress={() => {}} />
      <DrawerItem label="Logout" onPress={handleLogout} />
      {/* Más opciones del Drawer aquí */}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
