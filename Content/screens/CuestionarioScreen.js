import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CuestionarioScreen = ({ route }) => {
  const { cuestionarioId, cursoId, moduloId, progresoCursoId } = route.params;
  const [cuestionario, setCuestionario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    console.log("ProgresoCursoId recibido en CuestionarioScreen:", progresoCursoId);
    const fetchCuestionario = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/cuestionarios/${cuestionarioId}/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        setCuestionario(response.data);
        // console.log("Cuestionario obtenido:", response.data);
      } catch (error) {
        console.error('Error fetching cuestionario details: ', error);
        Alert.alert('Error', 'No se pudo cargar el cuestionario.');
      } finally {
        setIsLoading(false);
        navigation.setOptions({
          headerShown: true,
          headerTitle: cuestionario ? cuestionario.nombre : 'Cargando...',
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color="#003366" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="md-menu" size={24} color="#003366" />
            </TouchableOpacity>
          ),
        });
      }
    };

    fetchCuestionario();
  }, [cuestionarioId, cursoId, moduloId]);

  const handleBackPress = () => {
    console.log("Reenviando progresoCursoId desde CuestionarioScreen:", progresoCursoId);
    navigation.navigate('CursoModulos', { cursoId: cursoId, progresoCursoId: progresoCursoId });
  };

  const handleSelectAnswer = (preguntaId, respuestaId) => {
    setSelectedAnswers(prevSelectedAnswers => ({
      ...prevSelectedAnswers,
      [preguntaId]: respuestaId,
    }));
  };

  const handleSubmit = async () => {
    const preguntasIncorrectas = [];
    cuestionario.preguntas.forEach((pregunta) => {
      const respuestaSeleccionadaId = selectedAnswers[pregunta.id_pregunta];
      const respuestaCorrecta = pregunta.respuestas.find((respuesta) => respuesta.correcta);
      if (!respuestaCorrecta || respuestaCorrecta.id_respuesta !== respuestaSeleccionadaId) {
        preguntasIncorrectas.push(pregunta.id_pregunta);
      }
    });
    if (preguntasIncorrectas.length > 0) {
      const mensaje = `Revisa las respuestas de las siguientes preguntas: ${preguntasIncorrectas.join(', ')}`;
      Alert.alert('Respuestas incorrectas', mensaje);
    } else {
      console.log("Todas las respuestas son correctas.");
      console.log("ID del módulo actual:", moduloId);
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const siguienteModuloId = moduloId + 1;
        // Intenta activar el siguiente módulo
        await axios.post(`http://localhost:8000/api/modulos/${siguienteModuloId}/activar`, {}, {
          headers: { 'Authorization': `Token ${token}` },
        });
        console.log("Siguiente módulo activado:", siguienteModuloId);
        Alert.alert('¡Bien hecho!', 'Todas las respuestas son correctas.');
        navigation.navigate('CursoModulos', { cursoId: cursoId });
      } catch (error) {
        console.error('Error al activar el siguiente módulo: ', error);
        Alert.alert('Error', 'No se pudo activar el siguiente módulo.');
      }
    }
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Cargando cuestionario...</Text>
      </View>
    );
  }
  if (!cuestionario) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se encontró el cuestionario.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} >
      {
        cuestionario.preguntas.map((pregunta) => (
          <View key={pregunta.id_pregunta} style={styles.preguntaContainer}>
            <Text style={styles.pregunta}>{`${pregunta.id_pregunta}) ${pregunta.texto}`}</Text>
            {pregunta.respuestas.map((respuesta) => (
              <TouchableOpacity
                key={respuesta.id_respuesta}
                style={styles.respuesta}
                onPress={() => handleSelectAnswer(pregunta.id_pregunta, respuesta.id_respuesta)}
              >
                <View style={styles.radioCircle}>
                  {selectedAnswers[pregunta.id_pregunta] === respuesta.id_respuesta && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.respuestaText}>{respuesta.texto}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))
      }
      < TouchableOpacity style={styles.submitButton} onPress={handleSubmit} >
        <Text style={styles.submitButtonText}>Enviar respuestas</Text>
      </TouchableOpacity >
    </ScrollView >
  );
};


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  preguntaContainer: {
    marginBottom: 20,
  },
  pregunta: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
  respuesta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  respuestaText: {
    marginLeft: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e5875',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1e5875',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButton: {
    paddingHorizontal: 10,
  },
});
export default CuestionarioScreen;