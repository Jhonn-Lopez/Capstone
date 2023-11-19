import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener @expo/vector-icons instalado

const CursoActivoScreen = () => {
    const [cursos, setCursos] = useState([]);
    const navigation = useNavigation(); // Obtener el objeto de navegación

    useEffect(() => {
        // Llamar a la API para obtener los cursos activos
        // fetchCursos('activo').then(setCursos);
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
                        color="black" // El color que prefieras
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
                        color="black" // El color que prefieras
                    />
                </TouchableOpacity>
            ),
            title: 'Cursos Activos',
            // Personaliza tus estilos de título aquí si es necesario
        });
    }, [navigation]);

    return (
        <View>
            {/* ... Resto del contenido de tu pantalla ... */}
            <Text>Cursos Activos</Text>
            <FlatList
                data={cursos}
                renderItem={({ item }) => <Text>{item.nombre}</Text>}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

// Estilos para los botones del header
const styles = StyleSheet.create({
    headerButton: {
        paddingHorizontal: 10, // Ajusta el padding según tus necesidades
    },
    // ... más estilos si es necesario ...
});

export default CursoActivoScreen;
