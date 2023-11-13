# userAPI/views.py

from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from .serializers import UserSerializer
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password

User = get_user_model()

# Asumiendo que tienes un Serializer para User
# y deseas permitir la creación y visualización de la lista de usuarios
class ListCreateUsers(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# Esta vista permite la creación de nuevos usuarios
class CreateUserView(generics.CreateAPIView):
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
        'password':user.password,
        
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
