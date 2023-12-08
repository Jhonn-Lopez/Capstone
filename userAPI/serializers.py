from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Curso, Modulo, Cuestionario, Pregunta, Respuesta, ProgresoCurso, Contenido

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class RespuestaSerializer(serializers.ModelSerializer):
    id_respuesta = serializers.IntegerField(source='id')  # Cambia el nombre del campo 'id' a 'id_respuesta'

    class Meta:
        model = Respuesta
        fields = ['id_respuesta', 'texto', 'correcta']

class PreguntaSerializer(serializers.ModelSerializer):
    respuestas = RespuestaSerializer(many=True, read_only=True)
    id_pregunta = serializers.IntegerField(source='id')  # Agrega esta línea

    class Meta:
        model = Pregunta
        fields = ['id_pregunta', 'texto', 'respuestas']  # Asegúrate de incluir 'id_pregunta' aquí


class CuestionarioSerializer(serializers.ModelSerializer):
    # Asumiendo que tienes un serializer para las preguntas del cuestionario
    preguntas = PreguntaSerializer(many=True, read_only=True)
    id_cuestionario = serializers.IntegerField(source='id')

    class Meta:
        model = Cuestionario
        fields = ['id_cuestionario', 'nombre', 'preguntas']

class ContenidoSerializer(serializers.ModelSerializer):
    id_contenido = serializers.IntegerField(source='id')
    class Meta:
        model = Contenido
        fields = ['id_contenido', 'titulo', 'video', 'duracion_video', 'imagen', 'archivo']
class ModuloSerializer(serializers.ModelSerializer):
    cuestionario = CuestionarioSerializer(read_only=True)
    contenidos = ContenidoSerializer(many=True, read_only=True) 
    id_modulo = serializers.IntegerField(source='id')  # Cambia el nombre del campo 'id' a 'id_modulo'

    class Meta:
        model = Modulo
        fields = ['id_modulo', 'curso', 'nombre', 'descripcion', 'activo', 'contenidos', 'cuestionario']

class CursoSerializer(serializers.ModelSerializer):
    modulos = ModuloSerializer(many=True, read_only=True)
    id_curso = serializers.IntegerField(source='id')  # Cambia el nombre del campo 'id' a 'id_curso'

    class Meta:
        model = Curso
        fields = ['id_curso', 'nombre', 'descripcion', 'imagen', 'activo', 'modulos']

class ProgresoCursoSerializer(serializers.ModelSerializer):
    curso = CursoSerializer(read_only=True)
    id_progresoCurso = serializers.IntegerField(source='id')  # Cambia el nombre del campo 'id' a 'id_progresoCurso'

    class Meta:
        model = ProgresoCurso
        fields = ('id_progresoCurso', 'usuario', 'curso', 'estado', 'fecha_inicio', 'ultima_actividad')




