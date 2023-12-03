import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    ActivityIndicator,
    Button,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Accordion from 'react-native-collapsible/Accordion';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const CursoModulosScreen = ({ route }) => {
    const { cursoId } = route.params;
    const [cursoData, setCursoData] = useState({});
    const [activeSections, setActiveSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const videoUrl = 'https://download-video.akamaized.net/v3-1/playback/ce631519-e592-4a35-87f2-4a092c75193a/bb1a482a?__token__=st=1701641659~exp=1701656059~acl=%2Fv3-1%2Fplayback%2Fce631519-e592-4a35-87f2-4a092c75193a%2Fbb1a482a%2A~hmac=8307ed3865a7ee7f90a6b958e943ae8a0124a578af39ddae422bfb4b65d0eba9&r=dXMtZWFzdDE%3D';

    useEffect(() => {
        const fetchCursoDetails = async () => {
            setIsLoading(true);
            const token = await SecureStore.getItemAsync('userToken');
            try {
                const response = await axios.get(`http://localhost:8000/api/cursos/${cursoId}/`, {
                    headers: { 'Authorization': `Token ${token}` },
                });

                const imageUrl = `http://localhost:8000/api/${response.data.imagen.replace('http://localhost:8000/', '')}`;

                const cursoDataWithCorrectedImageUrl = {
                    ...response.data,
                    imagen: imageUrl
                };
                setCursoData(cursoDataWithCorrectedImageUrl);
            } catch (error) {
                console.error('Error fetching course details: ', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCursoDetails();
    }, [cursoId]);

    useEffect(() => {
        if (cursoData && cursoData.nombre) {
            navigation.setOptions({
                headerShown: true,
                headerTitle: cursoData.nombre, // Establece el nombre del curso como título
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
            });
        }
    }, [navigation, cursoData]);

    const formatDuration = (duration) => {
        // Aquí debes convertir la duración de tus videos a un formato legible
        return duration; // Este es solo un placeholder
    };

    const handlePressVideo = (contenido) => {
        if (contenido.video) {
            // Aquí se realiza el reemplazo en la URL del video
            const videoUrl = `http://localhost:8000/api/${contenido.video.replace('http://localhost:8000/', '')}`;
            navigation.navigate('VideoPlayerScreen', { videoUrl });
        } else {
            console.warn('No hay video para este contenido');
        }
    };

    const renderHeader = (section, _, isActive) => (
        <View style={isActive ? styles.headerActive : styles.header}>
            <Text style={styles.headerText}>{section.nombre}</Text>
        </View>
    );

    const renderContent = section => (
        <View style={styles.content}>
            {section.descripcion && <Text style={styles.contentText}>{section.descripcion}</Text>}
            {Array.isArray(section.contenidos) && section.contenidos.map(contenido => (
                <View key={contenido.id} style={styles.contentItem}>
                    <TouchableOpacity onPress={() => handlePressVideo(contenido)}>
                        <Text style={styles.contentItemTitle}>{contenido.titulo}</Text>
                    </TouchableOpacity>
                    {contenido.duracion_video && (
                        <Text style={styles.contentDuration}>Duración: {formatDuration(contenido.duracion_video)}</Text>
                    )}
                </View>
            ))}
            {section.cuestionario && <Text style={styles.cuestionarioTitle}>{section.cuestionario.nombre}</Text>}
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text>Cargando información del curso...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.cursoItem}>
                <Text style={styles.cursoDescription}>{cursoData.descripcion}</Text>
                <View style={styles.frameContainer}>
                    <View style={styles.cursoImageContainer}>
                        {cursoData.imagen ? (
                            <Image source={{ uri: cursoData.imagen }} style={styles.cursoImage} />
                        ) : (
                            <Text>No hay imagen disponible</Text>
                        )}
                    </View>
                </View>
                <View style={styles.separator} />
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Detalles del Curso</Text>
                {/* Ejemplo de Botón para navegar a VideoPlayerScreen */}
                <Button
                    title="Ver Video"
                    onPress={() => navigation.navigate('VideoPlayerScreen', { videoUrl })}
                />
            </View>

            <Accordion
                sections={cursoData.modulos || []}
                activeSections={activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={setActiveSections}
            />
        </ScrollView>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
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
        width: '80%', // Menor que el 100% para que no tome el ancho completo
        height: 150, // Altura fija para el contenedor de la imagen
        justifyContent: 'center', // Centra la imagen verticalmente
        alignItems: 'center', // Centra la imagen horizontalmente
        marginVertical: 10, // Espaciado vertical para separar el contenedor de imagen de otros elementos
        alignSelf: 'center', // Asegura que el contenedor de la imagen también esté centrado en su contenedor padre
    },
    cursoImage: {
        width: '100%', // Ancho relativo al contenedor
        height: '100%', // Altura relativa al contenedor
        resizeMode: 'contain', // Cambiado de 'stretch' a 'contain'
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
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
        marginVertical: 10,
    },
    header: {
        backgroundColor: '#e9e9e9', // Ajusta el color de fondo según tu diseño
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#dedede',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerActive: {
        backgroundColor: '#d9d9d9',
        padding: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        backgroundColor: '#ffffff', // Cambia esto según tu diseño
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
    },
    contentText: {
        fontSize: 16,
    },
    contentItem: {
        paddingTop: 10,
    },
    contentItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentDuration: {
        fontSize: 14,
        color: '#666',
    },
    cuestionarioTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 10,
    },
    contentImage: {
        width: '100%', // Ancho completo
        height: 200, // Altura fija o dinámica
        resizeMode: 'contain',
    },
    // ...otros estilos que necesites
});

export default CursoModulosScreen;
