import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const CursoCompletadoScreen = () => {
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        // Llamar a la API para obtener los cursos completados
        // fetchCursos('completado').then(setCursos);
    }, []);

    return (
        <View>
            <Text>Cursos Completados</Text>
            <FlatList
                data={cursos}
                renderItem={({ item }) => <Text>{item.nombre}</Text>}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default CursoCompletadoScreen;
