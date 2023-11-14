# userAPI/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Curso, Modulo, Cuestionario, Pregunta, Respuesta

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
    class Meta:
        model = Respuesta
        fields = ['id', 'texto', 'correcta']

class PreguntaSerializer(serializers.ModelSerializer):
    respuestas = RespuestaSerializer(many=True, read_only=True)

    class Meta:
        model = Pregunta
        fields = ['id', 'texto', 'respuestas']

class CuestionarioSerializer(serializers.ModelSerializer):
    preguntas = PreguntaSerializer(many=True, read_only=True)

    class Meta:
        model = Cuestionario
        fields = ['id', 'modulo', 'activo', 'preguntas']

class ModuloSerializer(serializers.ModelSerializer):
    cuestionario = CuestionarioSerializer(read_only=True)

    class Meta:
        model = Modulo
        fields = ['id', 'curso', 'titulo', 'descripcion', 'video', 'duracion_video', 'imagen', 'archivo', 'activo', 'cuestionario']

class CursoSerializer(serializers.ModelSerializer):
    modulos = ModuloSerializer(many=True, read_only=True)

    class Meta:
        model = Curso
        fields = ['id', 'nombre', 'descripcion', 'imagen', 'video', 'activo', 'modulos']