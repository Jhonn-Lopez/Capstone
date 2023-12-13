import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CuestionarioScreen = ({ route }) => {
  const { cuestionarioId, cursoId, moduloId, progresoCursoId, totalModulos } = route.params;
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
      }
    };

    fetchCuestionario();
  }, [cuestionarioId, progresoCursoId, navigation, moduloId]);

  useEffect(() => {
    if (cuestionario) {
      navigation.setOptions({
        headerShown: true,
        headerTitle: cuestionario.nombre || 'Cargando...',
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
  }, [cuestionario, navigation]);


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
      const mensaje = `Check the following questions: ${preguntasIncorrectas.join(', ')}`;
      Alert.alert('Oops, you have incorrect answers', mensaje);
    } else {
      console.log("Awesome, All answers are correct, congratulations!!!");
      console.log("Current module ID:", moduloId);
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const siguienteModuloId = moduloId + 1;
        const esUltimoModulo = siguienteModuloId > totalModulos;

        if (esUltimoModulo) {
          console.log("Last Module. Completing course...");
          await axios.post(`http://localhost:8000/api/cursos-progreso/${progresoCursoId}/completar_curso/`, {}, {
            headers: { 'Authorization': `Token ${token}` },
          });
          console.log('Course Finished!');
          Alert.alert('Congratulations!', "You've finished all modules!", [
            { text: 'Go Back', onPress: () => handleBackPress() },
            { text: 'Home', onPress: () => navigation.navigate('Home') }
          ]);
          navigation.navigate('CursoModulos', { cursoId: cursoId, progresoCursoId: progresoCursoId });
        } else {
          // Intenta activar el siguiente módulo
          await axios.post(`http://localhost:8000/api/modulos/${siguienteModuloId}/activar`, {}, {
            headers: { 'Authorization': `Token ${token}` },
          });
          console.log("Next module unlocked:", siguienteModuloId);
          Alert.alert('Well done!', 'All of your answers are correct.');
          navigation.navigate('CursoModulos', { cursoId: cursoId, progresoCursoId: progresoCursoId });
        }
      } catch (error) {
        console.error('ERROR: Cannot activate next course: ', error);
        Alert.alert('ERROR', 'Cannot activate next course or mark as completed.');
      }
    }
  };


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading Quiz...</Text>
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
      <TouchableOpacity
        className="w-full bg-yellow-500 p-3 rounded-2xl mb-3" onPress={handleSubmit}>
        <Text className="text-xl font-bold text-blue-950 text-center">Send Quiz</Text>
      </TouchableOpacity>
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