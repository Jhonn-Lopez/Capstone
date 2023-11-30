import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const verificarCursosCompletados = useCallback(async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8000/api/progreso_curso_completado/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        // Verifica si hay cursos completados
        if (response.data && response.data.length > 0) {
          navigation.navigate('CursoCompletado');
        } else {
          Alert.alert("No hay cursos completados", "Puedes revisar si tiene cursos activos pendientes!");
        }
      } catch (error) {
        console.error('Error al verificar cursos completados:', error);
        Alert.alert('Error', 'No se pudo verificar los cursos completados.');
      }
    }
  }, [navigation]);

  const verificarCursosActivos = useCallback(async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8000/api/progreso_curso_activo/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        if (response.data && response.data.length > 0) {
          navigation.navigate('CursoActivo');
        } else {
          Alert.alert("No hay cursos activos", "Puedes revisar tus cursos sin iniciar o completados!");
        }
      } catch (error) {
        console.error('Error al verificar cursos activos:', error);
        Alert.alert('Error', 'No se pudo verificar los cursos activos.');
      }
    }
  }, [navigation]);

  const verificarCursosSinIniciar = useCallback(async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8000/api/progreso_curso_no_iniciado/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        if (response.data && response.data.length > 0) {
          navigation.navigate('CursoNoIniciado');
        } else {
          Alert.alert("No hay nuevos cursos disponibles", "Espera nuevo contenido!");
        }
      } catch (error) {
        console.error('Error al verificar cursos sin iniciar:', error);
        Alert.alert('Error', 'No se pudo verificar los cursos sin iniciar.');
      }
    }
  }, [navigation]);

  return (
    <View className="flex items-center mx-4 space-y-4 pt-5">
      <TouchableOpacity onPress={verificarCursosActivos}
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3">
        <Text className="text-xl font-bold text-blue-950 text-center">
          Cursos Activos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={verificarCursosSinIniciar}
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3">
        <Text className="text-xl font-bold text-blue-950 text-center">
          Cursos Sin Iniciar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={verificarCursosCompletados}
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3">
        <Text className="text-xl font-bold text-blue-950 text-center">
          Cursos Completados
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
