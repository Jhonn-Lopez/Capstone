import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


const HomeScreen = ({ navigation }) => {
  return (
    <View className="flex items-center mx-4 space-y-4 pt-5">
      <TouchableOpacity onPress={() => navigation.navigate('CursoActivo')}
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3">
        <Text className="text-xl font-bold text-blue-950 text-center">
          Cursos Activos
        </Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => navigation.navigate('CursoNoIniciado')}
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3">
        <Text className="text-xl font-bold text-blue-950 text-center">
          Cursos Sin Iniciar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CursoCompletado')}
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3">
        <Text className="text-xl font-bold text-blue-950 text-center">
          Cursos Completados
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
