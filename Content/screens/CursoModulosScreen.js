import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const CursoModulosScreen = ({ route, navigation }) => {
    const { cursoId } = route.params;
    const [activeSections, setActiveSections] = useState([]);
    const [cursoData, setCursoData] = useState(null); // Estado para almacenar la información del curso actual
    const [modulos, setModulos] = useState([]); // Estado para almacenar los módulos del curso

    useEffect(() => {
        fetchCursoData(cursoId);
    }, [cursoId]);

    const fetchCursoData = async (id) => {
        const token = await SecureStore.getItemAsync('userToken');
        try {
            const responseCurso = await axios.get(`http://localhost:8000/api/cursos/${id}/`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            setCursoData(responseCurso.data);

            // Suponiendo que la API devuelve los módulos anidados en los datos del curso
            setModulos(responseCurso.data.modulos);
        } catch (error) {
            console.error('Error al obtener los datos del curso:', error);
        }
    };

    const renderHeader = (modulo, _, isActive) => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{modulo.nombre}</Text>
            </View>
        );
    };

    const renderContent = (modulo) => {
        // Aquí puedes decidir mostrar el contenido basado en si el módulo está activo o no
        return (
            <View style={styles.content}>
                <Text style={styles.contentText}>{modulo.descripcion}</Text>
                {/* Aquí también puedes mostrar contenido, preguntas y respuestas si están disponibles */}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>{"<"}</Text> {/* Icono de regresar */}
            </TouchableOpacity>

            {cursoData && cursoData.imagen && (
                <Image source={{ uri: cursoData.imagen }} style={styles.moduleImage} blurRadius={1} />
            )}

            <Accordion
                sections={modulos}
                activeSections={activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={setActiveSections}
                underlayColor="transparent"
                sectionContainerStyle={styles.sectionContainer}
            />

            {/* Agregar más componentes si es necesario */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    backButton: {
        marginTop: 50, // Ajusta de acuerdo al safe area y al estilo de tu aplicación
        marginLeft: 10,
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    moduleImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    header: {
        backgroundColor: '#fff',
        padding: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },
    contentText: {
        fontSize: 14,
    },
    sectionContainer: {
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    // ... más estilos según sea necesario ...
});

export default CursoModulosScreen;
