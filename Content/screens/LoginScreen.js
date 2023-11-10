import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/login/', {
        email: email.trim(), // Asegurarse de que no hay espacios al inicio/final
        password: password.trim(), // Asegurarse de que no hay espacios al inicio/final
        });

        if (response.data.token) {
            // Guardar el token en SecureStore
            await SecureStore.setItemAsync('userToken', response.data.token);
            // Redirigir al usuario a la pantalla de inicio/HomeScreen
            navigation.navigate('Home');
          } else {
            Alert.alert('Error', 'Credenciales incorrectas');
          }
    } catch (error) {
        console.error('Error de red:', error);
        // Si el servidor devuelve un error 401, eso significa que las credenciales son incorrectas
        if (error.response && error.response.status === 401) {
        Alert.alert('Error de autenticación', 'Credenciales incorrectas');
        } else {
        // Otros errores de red o de servidor
        Alert.alert('Error de red', 'No se pudo conectar al servidor');
        }
    }
    };
    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="blue-950" />
            {/* Fondo (colocarle degrade para que se vea mejor el formulario) */}
            <Image className="h-full w-full absolute" source={require('../assets/images/background.png')} />

            {/* Logo
            <View className="flex-row justify-around w-full absolute">
                <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className="h-[225] w-[90]" source={require('../assets/images/logo.png')} />
            </View>
            */}


                {/* Titulo y formulario */}
            <View className="h-full w-full flex justify-around pt-40 pb-10">
                {/* Titulo */}
                <View className="flex items-center">
                    <Text className="text-white font-bold tracking-wider text-5xl">
                        Login
                    </Text>
                </View>

                {/* Formulario */}
                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-white p-5 rounded-2xl w-full">
                        <TextInput placeholder='Email' placeholderTextColor={'gray'} value={email} onChangeText={(text) => setEmail(text)}/>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="bg-white p-5 rounded-2xl w-full mb-3">
                        <TextInput placeholder='Password' placeholderTextColor={'gray'} secureTextEntry value={password} onChangeText={(text) => setPassword(text)}/>
                    </Animated.View>
                    {/* Boton login */}
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="w-full">
                        <TouchableOpacity onPress={handleLogin}
                            className="w-full /*color*/ bg-yellow-500 /*color*/ p-3 rounded-2xl mb-3">
                                <Text className="text-xl font-bold text-blue-950 text-center">
                                    Login
                                </Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                        <Text className="text-white">Don't have an account?  </Text>
                        <TouchableOpacity onPress={()=> navigation.push('SignUp')}>
                            <Text className="text-yellow-500 font-bold">SignUp </Text>
                        </TouchableOpacity>
                    </Animated.View>

                </View>
            </View>
        </View>

    )
}