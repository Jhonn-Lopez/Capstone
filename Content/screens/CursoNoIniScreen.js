import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // Asegúrate de importar SecureStore

const CursoNoIniScreen = () => {
    const [cursos, setCursos] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCursosNoIniciados = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) {
                    const response = await axios.get('http://192.168.100.41:8000/api/progreso_curso_no_iniciado/', {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setCursos(response.data);
                } else {
                    Alert.alert('Error', 'No se encontró el token de autenticación.');
                }
            } catch (error) {
                console.error('Error al obtener cursos no iniciados:', error);
                Alert.alert('Error', 'No se pudo obtener los cursos no iniciados.');
            }
        };

        fetchCursosNoIniciados();
    }, []);

    const iniciarCurso = (cursoId) => {
        // Reemplazar 'URL_API_BACKEND' con la URL real de tu backend
        axios.post(`http://localhost:8000/api/iniciar_curso/${cursoId}`, {}, {
            headers: {
                'Authorization': `Token ${token}` // Asegúrate de obtener el token como se hace en fetchCursosNoIniciados
            }
        })
        .then(() => {
            navigation.navigate('CursoModulos', { cursoId });
        })
        .catch(error => {
            console.error('Error al iniciar curso:', error);
            Alert.alert('Error', 'No se pudo iniciar el curso.');
        });
    };

    // Aquí puedes manejar la lógica del header si es necesario
    // ...

    return (
        <View style={styles.container}>
            <FlatList
                data={cursos}
                renderItem={({ item }) => (
                    <View style={styles.cursoItem}>
                        <Text style={styles.cursoTitle}>{item.curso.nombre}</Text>
                        <Text>{item.curso.descripcion}</Text>
                        <Image source={{ uri: item.curso.imagen }} style={styles.cursoImage} />
                        <TouchableOpacity
                            style={styles.iniciarButton}
                            onPress={() => iniciarCurso(item.id)}>
                            <Text style={styles.iniciarButtonText}>Iniciar Curso</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    headerButton: {
        paddingHorizontal: 10,
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
    iniciarButton: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    iniciarButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    // ... más estilos si es necesario ...
});

export default CursoNoIniScreen;
