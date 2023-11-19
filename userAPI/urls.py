# userAPI/urls.py
from .views import CreateUserView
from django.urls import path, include
from .views import CreateUserView, LoginView, get_user_info, change_password
from rest_framework.routers import DefaultRouter
from . import views
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'cursos', views.CursoViewSet)
router.register(r'modulos', views.ModuloViewSet)
router.register(r'cuestionarios', views.CuestionarioViewSet)
router.register(r'preguntas', views.PreguntaViewSet)
router.register(r'respuestas', views.RespuestaViewSet)
router.register(r'progreso_curso', views.ProgresoCursoViewSet)
router.register(r'progreso_curso_no_iniciado', views.ProgresoCursoNoIniciadoViewSet)

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', get_user_info, name='get_user_info'),
    path('change-password/', change_password, name='change_password'),
    path('', include(router.urls)),
] + static('/api' + settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
