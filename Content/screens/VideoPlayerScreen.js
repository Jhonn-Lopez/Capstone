import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VideoPlayerScreen = ({ route }) => {
    const { videoUrl } = route.params;
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        const loadVideo = async () => {
            try {
                await videoRef.current.loadAsync({ uri: videoUrl }, {}, true);
            } catch (e) {
                console.error("Error al cargar el video:", e);
            }
        };

        loadVideo();
    }, [videoUrl]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Reproductor de Video',
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
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <Video
                ref={videoRef}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
                useNativeControls
                isLooping
                shouldPlay
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        paddingHorizontal: 10,
    },
    // ...otros estilos que necesites
});

export default VideoPlayerScreen;
