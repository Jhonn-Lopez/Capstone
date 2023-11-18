import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const CursoNoIniciadoScreen = () => {
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        // Llamar a la API para obtener los cursos sin iniciar
        // fetchCursos('no_iniciado').then(setCursos);
    }, []);

    return (
        <View>
            <Text>Cursos Sin Iniciar</Text>
            <FlatList
                data={cursos}
                renderItem={({ item }) => <Text>{item.nombre}</Text>}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default CursoNoIniciadoScreen;
