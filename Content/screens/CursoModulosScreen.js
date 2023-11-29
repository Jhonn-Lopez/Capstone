import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Accordion from 'react-native-collapsible/Accordion';

const CursoModulosScreen = ({ route }) => {
  const { cursoId } = route.params;
  const [cursoData, setCursoData] = useState({});
  const [activeSections, setActiveSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCursoDetails = async () => {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      try {
        const response = await axios.get(`http://localhost:8000/api/cursos/${cursoId}/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        setCursoData(response.data);
      } catch (error) {
        console.error('Error fetching course details: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCursoDetails();
  }, [cursoId]);

  const formatDuration = (duration) => {
    // Aquí debes convertir la duración de tus videos a un formato legible
    return duration; // Este es solo un placeholder
  };

  const renderHeader = (section, _, isActive) => (
    <View style={isActive ? styles.headerActive : styles.header}>
      <Text style={styles.headerText}>{section.nombre}</Text>
    </View>
  );

  const renderContent = section => (
    <View style={styles.content}>
      {section.descripcion ? <Text style={styles.contentText}>{section.descripcion}</Text> : null}
      {section.contenidos && section.contenidos.map((contenido) => (
        <View key={contenido.id} style={styles.contentItem}>
          <Text style={styles.contentItemTitle}>{contenido.titulo}</Text>
          {contenido.duracion_video && (
            <Text style={styles.contentDuration}>Duración: {formatDuration(contenido.duracion_video)}</Text>
          )}
        </View>
      ))}
      {section.cuestionario && (
        <Text style={styles.cuestionarioTitle}>{section.cuestionario.nombre}</Text>
      )}
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
      <Image source={{ uri: cursoData.imagen }} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{cursoData.nombre}</Text>
      <Text style={styles.courseDescription}>{cursoData.descripcion}</Text>
      <View style={styles.separator} />

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
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Cambia esto según tu diseño
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
  courseImage: {
    width: '100%',
    height: 200, // Ajusta esto según tu diseño
    resizeMode: 'cover',
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  courseDescription: {
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
    paddingBottom: 20,
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
  // ...otros estilos que necesites
});

export default CursoModulosScreen;
