import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Asegúrate de que axios está instalado

const CursoNoIniScreen = () => {
    const [cursos, setCursos] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        axios.get('URL_API_BACKEND/cursos_no_iniciados') // Actualiza con la URL de tu API
            .then(response => {
                // Suponiendo que la respuesta es un array de cursos
                setCursos(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    const iniciarCurso = (cursoId) => {
        axios.post(`URL_API_BACKEND/iniciar_curso/${cursoId}`) // Actualiza con la URL de tu API
            .then(() => {
                navigation.navigate('CursoModulos', { cursoId });
            })
            .catch(error => console.log(error));
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
        <View>
            <Text>Cursos No Iniciados</Text>
            <FlatList
                data={cursos}
                renderItem={({ item }) => (
                    <View style={styles.cursoItem}>
                        <Text style={styles.cursoTitle}>{item.nombre}</Text>
                        <Text>{item.descripcion}</Text>
                        <Image source={{ uri: item.imagen }} style={styles.cursoImage} />
                        <TouchableOpacity
                            style={styles.iniciarButton}
                            onPress={() => iniciarCurso(item.id)}>
                            <Text>Iniciar Curso</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    // ... más estilos si es necesario ...
});

export default CursoNoIniScreen;
