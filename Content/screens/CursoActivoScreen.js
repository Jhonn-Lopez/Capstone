import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const CursoActivoScreen = () => {
    const [cursosActivos, setCursosActivos] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCursosActivos = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/api/progreso_curso_activo/', {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setCursosActivos(response.data);
                } catch (error) {
                    console.error('Error al obtener cursos activos:', error);
                    Alert.alert('Error', 'No se pudo obtener los cursos activos.');
                }
            }
        };

        fetchCursosActivos();
    }, []);

    const continuarCurso = (cursoId) => {
        navigation.navigate('CursoModulos', { cursoId });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={cursosActivos}
                renderItem={({ item }) => {
                    const imageUrl = `http://localhost:8000/api/${item.curso.imagen.replace('http://localhost:8000/', '')}`;
                    return (
                        <View style={styles.cursoItem}>
                            <Text style={styles.cursoTitle}>{item.curso.nombre}</Text>
                            <Text style={styles.cursoDescription}>{item.curso.descripcion}</Text>
                            <View style={styles.cursoImageContainer}>
                            <Image source={{ uri: imageUrl }} style={styles.cursoImage} />
                            </View>
                            <TouchableOpacity
                                className="w-full bg-yellow-500 p-3 rounded-2xl mb-3"
                                onPress={() => continuarCurso(item.curso.id_progresoCurso)}>
                                <Text className="text-xl font-bold text-blue-950 text-center">Continuar Curso</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
                keyExtractor={item => (item.id ? item.id.toString() : 'default_key')}
                />
        </View>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        padding: 10,
    },
    cursoItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cursoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 10 
    },
    cursoDescription: {
        fontSize: 12,
        textAlign: 'justify'
    },
    cursoImageContainer: {
        width: '100%', // Asume el ancho completo del contenedor
        height: 180, // Altura fija para el contenedor de la imagen
        justifyContent: 'center', // Centra la imagen verticalmente
        alignItems: 'center', // Centra la imagen horizontalmente
        marginVertical: 10, // Espaciado vertical para separar el contenedor de imagen de otros elementos
    },
    cursoImage: {
        width: '100%', // Ancho fijo para todas las imágenes
        height: '100%', // Altura fija para todas las imágenes
        resizeMode: 'stretch', // La imagen cubrirá el espacio asignado, posiblemente recortándose
        marginVertical: 10, // Espaciado vertical para separar la imagen de otros elementos
    },
    continuarButton: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    continuarButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CursoActivoScreen;
