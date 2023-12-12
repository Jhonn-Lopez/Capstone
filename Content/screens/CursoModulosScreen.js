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
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const CursoModulosScreen = ({ route }) => {
    const { cursoId, progresoCursoId } = route.params;
    console.log("CursoModulosScreen recibió cursoId:", cursoId);
    console.log("CursoModulosScreen recibió progresoCursoId:", progresoCursoId);
    const [cursoData, setCursoData] = useState({});
    const [progresoModulos, setProgresoModulos] = useState({});
    const [activeSections, setActiveSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const videoUrl = 'https://res.cloudinary.com/dnnpkmi7n/video/upload/v1701990105/Modulo_1_-_Valores_de_Agilidad_y_Scrum_qpcjzt.mp4';

    // Función para obtener los detalles del curso
    const fetchCursoDetails = async () => {
        console.log("Inicio de fetchCursoDetails con cursoId:", cursoId); // Para depuración
        setIsLoading(true);
        const token = await SecureStore.getItemAsync('userToken');
        try {
            const responseCurso = await axios.get(`http://localhost:8000/api/cursos/${cursoId}/`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            // console.log("Respuesta de detalles del curso:", responseCurso.data); // Para depuración
            
            let cursoActualizado = {
                ...responseCurso.data,
                imagen: responseCurso.data.imagen ? `http://localhost:8000/api/${responseCurso.data.imagen.replace('http://localhost:8000/', '')}` : null
            };
            setCursoData(cursoActualizado);

            const responseProgresoUsuario = await axios.get(`http://localhost:8000/api/progreso_modulos_usuario/${cursoId}/`, {
                headers: { 'Authorization': `Token ${token}` },
            });

            let progresoModulos = {};
            responseProgresoUsuario.data.forEach(item => {
                progresoModulos[item.modulo] = item.estado;
            });

            setProgresoModulos(progresoModulos);
        } catch (error) {
            console.error('Error fetching course details: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect para inicializar la pantalla
    useEffect(() => {
        fetchCursoDetails();
    }, [cursoId]);

    // useFocusEffect para actualizar los datos cada vez que la pantalla se enfoca
    useFocusEffect(
        React.useCallback(() => {
            fetchCursoDetails();
            return () => {
                // Limpieza si es necesaria
            };
        }, [cursoId])
    );

    useEffect(() => {
        if (cursoData && cursoData.nombre) {
            navigation.setOptions({
                headerShown: true,
                headerTitle: cursoData.nombre,
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

    const isModuleLocked = (moduloId) => {
        const estadoModulo = progresoModulos[moduloId];
        return !estadoModulo || estadoModulo === 'no_iniciado';
    };

    const formatDuration = (duration) => {
        return duration; // Placeholder
    };

    const handlePressVideo = (contenido) => {
        if (contenido.video) {
            // Utiliza directamente la URL del campo 'video'
            const videoUrl = contenido.video;
            navigation.navigate('VideoPlayerScreen', { videoUrl, cursoId });
        } else {
            console.warn('No hay video para este contenido');
        }
    };

    const handlePressCuestionario = (idCuestionario, idModulo) => {
        if (idCuestionario) {
            navigation.navigate('CuestionarioScreen', { cuestionarioId: idCuestionario, cursoId: cursoId, moduloId: idModulo, progresoCursoId: progresoCursoId});
        } else {
            console.error('Cuestionario ID es undefined.');
        }
    };

    const renderHeader = (section, _, isActive) => {
        const locked = isModuleLocked(section.id_modulo);
        return (
            <View style={isActive ? styles.headerActive : styles.header}>
                <Text style={styles.headerText}>{`Module ${section.id_modulo}: ${section.nombre}`}</Text>
                {locked && <FontAwesome name="lock" size={24} color="black" />}
            </View>
        );
    };

    const updateActiveSections = (sections) => {
        const filteredSections = sections.filter((sectionIndex) => {
            const section = cursoData.modulos[sectionIndex];
            return section.activo;
        });
        setActiveSections(filteredSections);
    };

    const renderContent = section => {
        const locked = isModuleLocked(section.id_modulo);
        if (locked) return null;

        return (
            <View style={styles.content}>
                {section.descripcion && <Text style={styles.contentText}>{section.descripcion}</Text>}
                {Array.isArray(section.contenidos) && section.contenidos.map((contenido, index) => (
                    <View key={contenido.id ? contenido.id.toString() : index.toString()} style={styles.contentItem}>
                        <TouchableOpacity onPress={() => handlePressVideo(contenido)}>
                            <Text style={styles.contentItemTitle}>{contenido.titulo}</Text>
                        </TouchableOpacity>
                        {contenido.duracion_video && (
                            <Text style={styles.contentDuration}>Duración: {formatDuration(contenido.duracion_video)}</Text>
                        )}
                    </View>
                ))}
                {section.cuestionario && (
                    <TouchableOpacity onPress={() => handlePressCuestionario(section.cuestionario.id_cuestionario, section.id_modulo)}>
                        <Text style={styles.cuestionarioTitle}>{section.cuestionario.nombre}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

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

            <Accordion
                sections={cursoData.modulos || []}
                activeSections={activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={updateActiveSections}
            />
        </ScrollView>
    );
};

// Estilos
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

