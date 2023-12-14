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
          Alert.alert("No completed courses", "Please check for uncompleted courses!");
        }
      } catch (error) {
        console.error('RROR: cannot verify completed courses:', error);
        Alert.alert('ERROR', 'Unable to verify completed courses.');
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
          Alert.alert("No active courses", "Please check for unstarted or finished courses!");
        }
      } catch (error) {
        console.error('ERROR: cannot verify active courses:', error);
        Alert.alert('ERROR', 'Unable to verify active courses.');
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
          Alert.alert("No new courses available", "Please wait for new content!");
        }
      } catch (error) {
        console.error('ERROR: cannot verify unstarted courses:', error);
        Alert.alert('ERROR', 'Unable to verify unstarted courses.');
      }
    }
  }, [navigation]);

  return (
    <View className="flex items-center mx-4 space-y-4 pt-5">
      <TouchableOpacity onPress={verificarCursosActivos}
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3">
        <Text className="text-xl font-bold text-blue-950 text-center">
          Active Courses
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={verificarCursosSinIniciar}
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3">
        <Text className="text-xl font-bold text-blue-950 text-center">
          Available Courses
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={verificarCursosCompletados}
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3">
        <Text className="text-xl font-bold text-blue-950 text-center">
          Completed Courses
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
