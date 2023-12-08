import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CuestionarioScreen = ({ route }) => {
  const { cuestionarioId, cursoId } = route.params;
  const [cuestionario, setCuestionario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCuestionario = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/cuestionarios/${cuestionarioId}/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        setCuestionario(response.data);
        navigation.setOptions({
          headerShown: true,
          headerTitle: cuestionario.nombre,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('CursoModulos', { cursoId: cursoId })}>
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
      } catch (error) {
        console.error('Error fetching cuestionario details: ', error);
        Alert.alert('Error', 'No se pudo cargar el cuestionario.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCuestionario();
  }, [cuestionarioId, cursoId]);

  const handleSelectAnswer = (preguntaId, respuestaId) => {
    setSelectedAnswers(prevSelectedAnswers => ({
      ...prevSelectedAnswers,
      [preguntaId]: respuestaId,
    }));
  };

  const handleSubmit = () => {
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
      Alert.alert('¡Bien hecho!', 'Todas las respuestas son correctas.');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {cuestionario.preguntas.map((pregunta) => (
        <View key={pregunta.id_pregunta} style={styles.preguntaContainer}>
          <Text style={styles.pregunta}>{pregunta.texto}</Text>
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
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar respuestas</Text>
      </TouchableOpacity>
    </ScrollView>
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
