import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const CursoActivoScreen = () => {
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        // Llamar a la API para obtener los cursos activos
        // fetchCursos('activo').then(setCursos);
    }, []);

    return (
        <View>
            <Text>Cursos Activos</Text>
            <FlatList
                data={cursos}
                renderItem={({ item }) => <Text>{item.nombre}</Text>}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default CursoActivoScreen;
