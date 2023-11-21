import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const CursoComplScreen = () => {
    const [cursosCompletados, setCursosCompletados] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCursosCompletados = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/api/progreso_curso_completado/', {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setCursosCompletados(response.data);
                } catch (error) {
                    console.error('Error al obtener cursos completados:', error);
                    Alert.alert('Error', 'No se pudo obtener los cursos completados.');
                }
            }
        };

        fetchCursosCompletados();
    }, []);

    const verCurso = (cursoId) => {
        // Aquí deberás implementar la lógica para ver el curso completado.
        // Por ejemplo, podría ser navegar a una pantalla de resumen o mostrar un certificado.
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={cursosCompletados}
                renderItem={({ item }) => {
                    const imageUrl = `http://localhost:8000/api/${item.curso.imagen.replace('http://localhost:8000/', '')}`;
                    return (
                        <View style={styles.cursoItem}>
                            <Text style={styles.cursoTitle}>{item.curso.nombre}</Text>
                            <Image source={{ uri: imageUrl }} style={styles.cursoImage} />
                            <TouchableOpacity
                                style={styles.verButton}
                                onPress={() => verCurso(item.curso.id)}>
                                <Text style={styles.verButtonText}>Ver Curso</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    cursoItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    cursoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cursoImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginVertical: 10,
    },
    verButton: {
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    verButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CursoComplScreen;
