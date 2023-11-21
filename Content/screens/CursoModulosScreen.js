import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Collapsible from 'react-native-collapsible';

const CursoModulosScreen = ({ route }) => {
    const { cursoId } = route.params;
    const [modulos, setModulos] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchModulos = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            console.log("Token obtenido:", token); // Log para verificar el token recuperado

            if (token) {
                try {
                    const response = await axios.get(`http://localhost:8000/api/cursos/${cursoId}/modulos`, {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    console.log("Datos recibidos:", response.data); // Log para verificar los datos recibidos
                    setModulos(response.data.map((modulo, index) => ({
                        ...modulo,
                        isCollapsed: index !== 0,
                    })));
                } catch (error) {
                    console.error('Error al obtener módulos:', error);
                    Alert.alert('Error', 'No se pudieron obtener los módulos del curso.');
                }
            } else {
                console.log("Token no encontrado o inválido."); // Log en caso de que el token no exista o sea inválido
            }
        };

        fetchModulos();
    }, [cursoId]);

    const toggleCollapse = index => {
        setModulos(modulos.map((modulo, i) => ({
            ...modulo,
            isCollapsed: i !== index ? true : !modulo.isCollapsed // Cambia la visibilidad del módulo seleccionado
        })));
        setActiveIndex(index); // Actualiza el índice activo
    };


    
    return (
        <View style={styles.container}>
            <SectionList
                sections={[ // Puedes tener varias secciones si tu curso está dividido en categorías
                    { title: 'Módulos del Curso', data: modulos },
                ]}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item, index }) => (
                    <View>
                        <TouchableOpacity onPress={() => toggleCollapse(index)}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>{item.nombre}</Text>
                            </View>
                        </TouchableOpacity>
                        <Collapsible collapsed={item.isCollapsed}>
                            <View style={styles.content}>
                                <Text>{item.descripcion}</Text>
                                {/* Aquí iría el resto del contenido del módulo */}
                            </View>
                        </Collapsible>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    sectionHeader: {
        fontWeight: '800',
        fontSize: 18,
        color: '#f4f4f4',
        backgroundColor: '#6b52ae',
        padding: 10,
    },
    header: {
        backgroundColor: '#f8f8f8',
        padding: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },
    // ... más estilos si es necesario ...
});

export default CursoModulosScreen;
