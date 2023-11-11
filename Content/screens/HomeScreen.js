import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener `@expo/vector-icons` instalado si estás utilizando Expo

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="home-container">
      
      {/* Tu contenido va aquí */}
      <Text className="home-title">Home Screen</Text>
      {/* Resto de tu contenido */}
    </View>
  );
};

export default HomeScreen;
