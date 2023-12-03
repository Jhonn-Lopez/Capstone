import React from 'react';
import { View } from 'react-native';
import { Video } from 'expo-av';

const VideoPlayerScreen = ({ route }) => {
    const { videoUrl } = route.params;

    console.log("URL del video:", videoUrl); // Debería ser la URL completa y correcta

    return (
        <View style={{ flex: 1 }}>
            <Video
                source={{ uri: videoUrl }}
                style={{ width: '100%', height: '100%' }}
                useNativeControls
                resizeMode="contain"
            />
        </View>
    );
};

export default VideoPlayerScreen;
