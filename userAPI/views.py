from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets
from .serializers import UserSerializer
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password
from .models import Curso, Modulo, Cuestionario, Pregunta, Respuesta, ProgresoCurso, CustomUser, ProgresoUsuario
from .serializers import UserSerializer, CursoSerializer, ModuloSerializer, CuestionarioSerializer, PreguntaSerializer, RespuestaSerializer, ProgresoCursoSerializer
from django.db.models import Min

User = get_user_model()

# Asumiendo que tienes un Serializer para User
# y deseas permitir la creación y visualización de la lista de usuarios
class ListCreateUsers(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# Esta vista permite la creación de nuevos usuarios

    model = User
    permission_classes = [
        permissions.AllowAny  # Permitir que cualquier usuario pueda registrarse
    ]
    serializer_class = UserSerializer

# Esta vista maneja el inicio de sesión y la generación de tokens
class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, username=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# Decorador que requiere que el método HTTP sea GET y que el usuario esté autenticado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        
        # ... otros campos que desees incluir
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    
    if not check_password(old_password, user.password):
        return Response({"message": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

class ProgresoCursoViewSet(viewsets.ModelViewSet):
    queryset = ProgresoCurso.objects.all()
    serializer_class = ProgresoCursoSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def iniciar_curso(self, request, pk=None):
        progreso = self.get_object()
        progreso.estado = 'activo'
        progreso.save()
        return Response({'status': 'curso activado'})

class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Retorna los cursos asociados al usuario autenticado a través del modelo ProgresoCurso
        return Curso.objects.filter(progreso_cursos__usuario=self.request.user)

class ModuloViewSet(viewsets.ModelViewSet):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtra los módulos según el curso y la autenticación del usuario
        return self.queryset.filter(curso__usuario=self.request.user)

class CuestionarioViewSet(viewsets.ModelViewSet):
    queryset = Cuestionario.objects.all()
    serializer_class = CuestionarioSerializer
    permission_classes = [permissions.IsAuthenticated]

class PreguntaViewSet(viewsets.ModelViewSet):
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer
    permission_classes = [permissions.IsAuthenticated]

class RespuestaViewSet(viewsets.ModelViewSet):
    queryset = Respuesta.objects.all()
    serializer_class = RespuestaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class CreateUserView(generics.CreateAPIView):
    queryset = ProgresoCurso.objects.filter(estado='no_iniciado')
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer    

class ProgresoCursoNoIniciadoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProgresoCurso.objects.filter(estado='no_iniciado')
    serializer_class = ProgresoCursoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Asegúrate de que esta lógica es correcta y de que devuelve lo que esperas
        return self.queryset.filter(usuario=self.request.user)  
    
    @action(detail=True, methods=['post'])
    def iniciar_curso(self, request, pk=None):
        try:
            progreso_curso = ProgresoCurso.objects.get(id=pk, usuario=request.user)
            progreso_curso.estado = 'activo'
            progreso_curso.save()

            # Obtener el primer módulo del curso basado en el orden
            primer_modulo = Modulo.objects.filter(curso=progreso_curso.curso).order_by('orden').first()
            
            if primer_modulo:
                # Cambiar el estado del ProgresoUsuario para el primer módulo a 'activo'
                ProgresoUsuario.objects.filter(usuario=request.user, curso=progreso_curso.curso, modulo=primer_modulo).update(estado='activo')

            serializer = ProgresoCursoSerializer(progreso_curso)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ProgresoCurso.DoesNotExist:
            return Response({'message': 'ProgresoCurso no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

class ProgresoCursoCompletadoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProgresoCurso.objects.filter(estado='completado')
    serializer_class = ProgresoCursoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Asegúrate de que esta lógica es correcta y de que devuelve lo que esperas
        return self.queryset.filter(usuario=self.request.user)    

class ProgresoCursoActivoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProgresoCurso.objects.filter(estado='activo')
    serializer_class = ProgresoCursoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Asegúrate de que esta lógica es correcta y de que devuelve lo que esperas
        return self.queryset.filter(usuario=self.request.user)  

class CursoModulosViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ModuloSerializer
    queryset = Modulo.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Este método sobrescrito asegura que solo se devuelvan los módulos
        para el curso especificado en la URL.
        """
        curso_id = self.kwargs.get('curso_pk')
        return self.queryset.filter(curso_id=curso_id)

class ModuloViewSet(viewsets.ModelViewSet):
    serializer_class = ModuloSerializer

    def get_queryset(self):
        # Filtra los módulos por el ID del curso proporcionado en la URL
        curso_id = self.kwargs.get('curso_pk')
        return Modulo.objects.filter(curso_id=curso_id)

class CursoProgresoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CursoSerializer
    queryset = Curso.objects.all()  # Definir un queryset genérico a nivel de clase
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retorna los cursos asociados al progreso del curso del usuario autenticado
        user = self.request.user
        return Curso.objects.filter(progreso_cursos__usuario=user)
