import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VideoPlayerScreen = ({ route }) => {
    const { videoUrl, cursoId, progresoCursoId } = route.params;
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const [isBuffering, setIsBuffering] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        console.log("URL del video:", videoUrl);

        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Reproductor de Video',
            headerLeft: () => (
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color="#003366" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.toggleDrawer()}>
                    <Ionicons name="md-menu" size={24} color="#003366" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, videoUrl, cursoId]);

    const handleBackPress = () => {
        navigation.navigate('CursoModulos', { cursoId: cursoId, progresoCursoId:progresoCursoId });
    };

    const handlePlaybackStatusUpdate = (playbackStatus) => {
        setStatus(playbackStatus);
        if (!playbackStatus.isLoaded) {
            if (playbackStatus.error) {
                console.log(`Error de reproducción: ${playbackStatus.error}`);
                setIsBuffering(false);
            }
        } else {
            if (playbackStatus.isBuffering) {
                setIsBuffering(true);
            } else {
                setIsBuffering(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={{ uri: videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                shouldPlay
                isMuted={false}  // Asegurarse de que el video no esté silenciado
            />
            {isBuffering && (
                <View style={styles.buffering}>
                    <ActivityIndicator size="large" color="#00ff00" />
                    <Text>Cargando video...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        height: 300,
    },
    buffering: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButton: {
        paddingHorizontal: 10,
    },
});

export default VideoPlayerScreen;
