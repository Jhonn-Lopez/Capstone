import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';;

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
                color="#003366"
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
                color="#003366"
              />
            </TouchableOpacity>
          ),
          title: 'Cursos Activos', // Cambia el título según corresponda
        });
      }, [navigation]);

    const continuarCurso = (cursoId) => {
        console.log('Curso ID:', cursoId);
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
                            <View style={styles.frameContainer}>
                                <View style={styles.cursoImageContainer}>
                                    <Image source={{ uri: imageUrl }} style={styles.cursoImage} />
                                </View>
                            </View>
                            <TouchableOpacity
                                className="w-full bg-yellow-500 p-3 rounded-2xl mb-3"
                                onPress={() => continuarCurso(item.curso.id_curso)}>
                                <Text className="text-xl font-bold text-blue-950 text-center">Keep Going</Text>
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
        textAlign: 'justify',
        paddingBottom: 10
    },
    frameContainer: {
        borderWidth: 2, // Grosor del marco
        borderColor: '#003366', // Color del marco
        padding: 2, // Espacio entre el marco y la imagen
        shadowColor: '#000', // Color de la sombra
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Elevación en Android
        marginBottom: 15, // Espacio debajo del marco
    },
    cursoImageContainer: {
        width: '100%', // Menor que el 100% para que no tome el ancho completo
        height: 180, // Altura fija para el contenedor de la imagen
        justifyContent: 'center', // Centra la imagen verticalmente
        alignItems: 'center', // Centra la imagen horizontalmente
       // marginVertical: 10, // Espaciado vertical para separar el contenedor de imagen de otros elementos
        alignSelf: 'center', // Asegura que el contenedor de la imagen también esté centrado en su contenedor padre
    },
    cursoImage: {
        width: '100%', // Ancho relativo al contenedor
        height: '100%', // Altura relativa al contenedor
        resizeMode: 'stretch', // Cambiado de 'stretch' a 'contain'
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
