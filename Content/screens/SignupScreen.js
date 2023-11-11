import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const isEmailValid = (email) => {
        // Expresión regular para validar una dirección de correo electrónico
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailPattern.test(email);
    };

    const isPasswordValid = (password) => {
        // Validar que la contraseña tenga al menos 8 caracteres
        return password.length >= 8;
    };

    const isNameValid = (name) => {
        // Expresión regular para validar solo letras y espacios
        const namePattern = /^[A-Za-z\s]+$/;
        return namePattern.test(name);
    };

    const handleSignup = () => {
        // Validación de contraseña y repetición de contraseña
        if (password !== repeatPassword) {
            Alert.alert('Contraseñas no coinciden', 'Las contraseñas deben ser iguales.');
            return;
        }

        if (!isEmailValid(email)) {
            Alert.alert('Correo electrónico no válido', 'Ingresa una dirección de correo electrónico válida.');
            return;
        }

        if (!isPasswordValid(password)) {
            Alert.alert('Contraseña no válida', 'La contraseña debe tener al menos 9 dígitos y un carácter especial.');
            return;
        }

        if (!isNameValid(name) || !isNameValid(lastName)) {
            Alert.alert('Nombre no válido', 'El nombre y el apellido solo deben contener letras y espacios.');
            return;
        }
        // Construye el objeto de datos para enviar al servidor
        const userData = {
            first_name: name,
            last_name: lastName,
            email: email,
            password: password,
        };

        // Realiza la solicitud POST al servidor
        axios
            .post('http://localhost:8000/api/register/', userData)
            .then((response) => {
                // Procesa la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
                Alert.alert('Registro exitoso', '¡Bienvenido! Ahora puedes iniciar sesión.')
                navigation.navigate('Login');
            })
            .catch((error) => {
                // Maneja los errores, por ejemplo, muestra un mensaje de error
                Alert.alert('Error de registro', 'Hubo un problema al registrarse. Verifique sus datos.');
            });
    };

    const navigation = useNavigation();

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
            <View className="h-full w-full flex justify-around pt-48">
                {/* Titulo */}
                <View className="flex items-center">
                    <Text className="text-white font-bold tracking-wider text-5xl">
                        Sign Up
                    </Text>
                </View>

                {/* Formulario */}
                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-white p-5 rounded-2xl w-full">
                        <TextInput placeholder='Name' placeholderTextColor={'gray'} value={name} onChangeText={(text) => setName(text)} />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="bg-white p-5 rounded-2xl w-full">
                        <TextInput placeholder='Last Name' placeholderTextColor={'gray'} value={lastName} onChangeText={(text) => setLastName(text)} />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="bg-white p-5 rounded-2xl w-full">
                        <TextInput placeholder='Email' placeholderTextColor={'gray'} value={email} onChangeText={(text) => setEmail(text)} />
                    </Animated.View>


                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className="bg-white p-5 rounded-2xl w-full ">
                        <TextInput placeholder='Password (at least 8 digits)' placeholderTextColor={'gray'} secureTextEntry value={password} onChangeText={(text) => setPassword(text)} />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(1000).duration(1000).springify()} className="bg-white p-5 rounded-2xl w-full mb-3">
                        <TextInput placeholder='Repeat Password' placeholderTextColor={'gray'} secureTextEntry value={repeatPassword} onChangeText={(text) => setRepeatPassword(text)} />
                    </Animated.View>
                    {/* Boton SignUp */}
                    <Animated.View entering={FadeInDown.delay(1200).duration(1200).springify()} className="w-full">
                        <TouchableOpacity onPress={handleSignup}
                            className="w-full /*color*/ bg-yellow-500 /*color*/ p-3 rounded-2xl mb-3">
                            <Text className="text-xl font-bold text-blue-950 text-center">
                                SignUp
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(1200).duration(1200).springify()} className="flex-row justify-center">
                        <Text className="text-white">Already have an account?  </Text>
                        <TouchableOpacity onPress={() => navigation.push('Login')}>
                            <Text className="text-yellow-500 font-bold">Back to Login </Text>
                        </TouchableOpacity>
                    </Animated.View>

                </View>
            </View>
        </View>

    )
}