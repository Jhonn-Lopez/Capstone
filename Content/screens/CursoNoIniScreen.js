import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // Importa SecureStore

const CursoNoIniScreen = () => {
    const [cursos, setCursos] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCursosNoIniciados = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/api/progreso_curso_no_iniciado/', {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setCursos(response.data);
                } catch (error) {
                    console.error('Error al obtener cursos no iniciados:', error);
                    Alert.alert('Error', 'No se pudo obtener los cursos no iniciados.');
                }
            }
        };

        fetchCursosNoIniciados();
    }, []);

    const iniciarCurso = async (cursoId) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            try {
                const response = await axios.post(`http://localhost:8000/api/progreso_curso/${cursoId}/iniciar_curso/`, {}, 
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
    
                setCursos(cursos.map(curso => 
                    curso.id === cursoId 
                    ? { ...curso, estado: 'activo' } 
                    : curso
                ));
    
                navigation.navigate('CursoModulos', { cursoId });
    
            } catch (error) {
                console.error('Error al iniciar curso:', error);
                Alert.alert('Error', 'No se pudo iniciar el curso.');
            }
        } else {
            Alert.alert('Error', 'Token de autenticación no encontrado.');
        }
    };
    

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerLeft: () => (
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.toggleDrawer()}>
                    <Ionicons
                        name="md-menu"
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
            ),
            title: 'Cursos No Iniciados',
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <FlatList
                data={cursos}
                renderItem={({ item }) => {
                    // Obtén la parte del path de la imagen sin la base URL
                    const imageRelativePath = item.curso.imagen.replace('http://localhost:8000/', '');
    
                    // Construye la URL final incluyendo '/api/' en medio
                    const imageUrl = `http://localhost:8000/api/${imageRelativePath}`;
    
                    // Imprime la URL en la consola para verificar que es correcta
                    console.log('Cargando imagen:', imageUrl);
    
                    return (
                        <View style={styles.cursoItem}>
                            <Text style={styles.cursoTitle}>{item.curso.nombre}</Text>
                            <Text style={styles.cursoDescription}>{item.curso.descripcion}</Text>
                            <View style={styles.cursoImageContainer}>
                            <Image source={{ uri: imageUrl }} style={styles.cursoImage} />
                            </View>                        
                            <TouchableOpacity
                                className="w-full bg-yellow-500 p-3 rounded-2xl mb-3"
                                onPress={() => iniciarCurso(item.id)}>
                                <Text className="text-xl font-bold text-blue-950 text-center">Iniciar Curso</Text>
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
    headerButton: {
        paddingHorizontal: 10,
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
    
    
    iniciarButton: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    // ... más estilos si es necesario ...
});

export default CursoNoIniScreen;
