import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const CursoModulosScreen = ({ route }) => {
    const { cursoId } = route.params;
    const [modulos, setModulos] = useState([]);

    useEffect(() => {
        axios.get(`URL_API_BACKEND/modulos?cursoId=${cursoId}`)
            .then(response => {
                setModulos(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <View>
            {modulos.map(modulo => (
                <Text key={modulo.id}>{modulo.nombre}</Text>
            ))}
        </View>
    );
};

export default CursoModulosScreen;
