# userAPI/urls.py
from django.urls import path, include
from .views import (
    CreateUserView, LoginView, get_user_info, change_password, 
    CursoViewSet, CursoModulosViewSet, ModuloViewSet, CuestionarioViewSet, 
    PreguntaViewSet, RespuestaViewSet, ProgresoCursoViewSet, 
    ProgresoCursoNoIniciadoViewSet, ProgresoCursoActivoViewSet, 
    ProgresoCursoCompletadoViewSet, CursoProgresoViewSet,
    ProgresoModulosUsuario
)
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'cursos', CursoViewSet)
router.register(r'cuestionarios', CuestionarioViewSet)
router.register(r'preguntas', PreguntaViewSet)
router.register(r'respuestas', RespuestaViewSet)
router.register(r'progreso_curso', ProgresoCursoViewSet)
router.register(r'progreso_curso_no_iniciado', ProgresoCursoNoIniciadoViewSet)
router.register(r'progreso_curso_activo', ProgresoCursoActivoViewSet)
router.register(r'progreso_curso_completado', ProgresoCursoCompletadoViewSet)
router.register(r'cursos-progreso', CursoProgresoViewSet)

# Crear un router anidado para los módulos
modulos_router = routers.NestedSimpleRouter(router, r'cursos', lookup='curso')
modulos_router.register(r'modulos', CursoModulosViewSet, basename='curso-modulos')

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', get_user_info, name='get_user_info'),
    path('change-password/', change_password, name='change_password'),
    path('', include(router.urls)),
    path('', include(modulos_router.urls)),
    path('progreso_modulos_usuario/<int:curso_id>/', ProgresoModulosUsuario.as_view(), name='progreso_modulos_usuario')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
