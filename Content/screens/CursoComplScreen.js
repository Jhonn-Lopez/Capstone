import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CursoComplScreen = () => {
    const [cursos, setCursos] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        // Llamar a la API para obtener los cursos completados
        // fetchCursos('completado').then(setCursos);
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
            title: 'Cursos Completados',
            // Personaliza tus estilos de título aquí si es necesario
        });
    }, [navigation]);

    return (
        <View>
            {/* ... Resto del contenido de tu pantalla ... */}
            <Text>Cursos Completados</Text>
            <FlatList
                data={cursos}
                renderItem={({ item }) => <Text>{item.nombre}</Text>}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        paddingHorizontal: 10,
    },
    // ... más estilos si es necesario ...
});

export default CursoComplScreen;
