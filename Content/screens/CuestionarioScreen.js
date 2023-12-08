// CuestionarioScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const CuestionarioScreen = ({ route }) => {
    const { cuestionarioId } = route.params;
    const [cuestionario, setCuestionario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    const [selectedAnswers, setSelectedAnswers] = useState({});

    const handleSelectAnswer = (preguntaId, respuestaId) => {
        setSelectedAnswers(prevSelectedAnswers => ({
            ...prevSelectedAnswers,
            [preguntaId]: respuestaId,
        }));
    };

    useEffect(() => {
        const fetchCuestionario = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/cuestionarios/${cuestionarioId}/`, {
                    headers: { 'Authorization': `Token ${token}` },
                });
                setCuestionario(response.data);
                navigation.setOptions({ title: response.data.nombre });
            } catch (error) {
                console.error('Error fetching cuestionario details: ', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (cuestionarioId) {
            fetchCuestionario();
        }
    }, [cuestionarioId, navigation]);

    const handleSubmit = () => {
        Alert.alert('Envío de respuestas', 'Aquí iría la lógica de envío de respuestas.');
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
        <ScrollView style={styles.container}>
            {cuestionario.preguntas.map((pregunta, index) => (
                <View key={pregunta.id} style={styles.preguntaContainer}>
                    <Text style={styles.pregunta}>{index + 1}. {pregunta.texto}</Text>
                    {pregunta.respuestas.map((respuesta) => (
                        <TouchableOpacity
                            key={respuesta.id_respuesta} // Asegúrate de que esta clave sea única para cada respuesta
                            style={styles.respuesta}
                            onPress={() => handleSelectAnswer(pregunta.id, respuesta.id_respuesta)}
                        >
                            <View style={styles.radioCircle}>
                                {selectedAnswers[pregunta.id] === respuesta.id_respuesta && <View style={styles.selectedRb} />}
                            </View>
                            <Text style={styles.respuestaText}>{respuesta.texto}</Text>
                        </TouchableOpacity>
                    ))}
                    {index < cuestionario.preguntas.length - 1 && <View style={styles.separator} />}
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
    separator: {
        height: 1,
        backgroundColor: '#dedede',
        marginVertical: 10,
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
});

export default CuestionarioScreen;
