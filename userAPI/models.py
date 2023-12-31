from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _  # Actualizado aquí
from django.contrib.auth import get_user_model
from datetime import timedelta
from django.core.files.storage import default_storage as storage
import subprocess
import shlex

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

User = get_user_model()

class Curso(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='cursos/imagenes/')
    activo = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre

class ProgresoCurso(models.Model):
    ESTADOS = (
        ('no_iniciado', 'No Iniciado'),
        ('activo', 'Activo'),
        ('completado', 'Completado'),
    )

    usuario = models.ForeignKey(User, related_name='progreso_cursos', on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, related_name='progreso_cursos', on_delete=models.CASCADE)  # Cambia el related_name
    estado = models.CharField(max_length=12, choices=ESTADOS, default='no_iniciado')
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    ultima_actividad = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('usuario', 'curso')

class Modulo(models.Model):
    curso = models.ForeignKey(Curso, related_name='modulos', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=False)
    orden = models.PositiveIntegerField(default=0)  # Campo nuevo para el orden

    class Meta:
        ordering = ['curso', 'orden']  # Ordena por curso y luego por orden
        unique_together = ('curso', 'orden')  # Evita que haya dos módulos con el mismo orden en un curso

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.id:  # Si es un módulo nuevo
            # Asigna el siguiente número de orden
            ultimo_modulo = Modulo.objects.filter(curso=self.curso).order_by('orden').last()
            self.orden = (ultimo_modulo.orden + 1) if ultimo_modulo else 1
        super(Modulo, self).save(*args, **kwargs)

class ProgresoUsuario(models.Model):
    ESTADOS = (
        ('no_iniciado', 'No Iniciado'),
        ('activo', 'Activo'),
        ('completado', 'Completado'),
    )
    usuario = models.ForeignKey(User, related_name='progreso_usuarios', on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, related_name='progreso_usuarios', on_delete=models.CASCADE)  # Cambia el related_name
    modulo = models.ForeignKey(Modulo, on_delete=models.CASCADE)
    estado = models.CharField(max_length=12, choices=ESTADOS, default='no_iniciado')

    class Meta:
        unique_together = ('usuario', 'curso', 'modulo')
class Contenido(models.Model):
    modulo = models.ForeignKey(Modulo, related_name='contenidos', on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    video = models.URLField(max_length=200, blank=True, null=True)  # Campo actualizado para URL
    duracion_video = models.DurationField(blank=True, null=True)  # Guarda la duración del video (ingresada manualmente)
    imagen = models.ImageField(upload_to='contenidos/imagenes/', blank=True, null=True)
    activo = models.BooleanField(default=True)

    # El método save se modifica para eliminar la lógica de duración del video
    def save(self, *args, **kwargs):
        super(Contenido, self).save(*args, **kwargs)

    def __str__(self):
        return self.titulo

class Cuestionario(models.Model):
    modulo = models.OneToOneField(Modulo, related_name='cuestionario', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=1000)
    activo = models.BooleanField(default=False)

class Pregunta(models.Model):
    cuestionario = models.ForeignKey(Cuestionario, related_name='preguntas', on_delete=models.CASCADE)
    texto = models.CharField(max_length=1000)

    def __str__(self):
        return self.texto

class Respuesta(models.Model):
    pregunta = models.ForeignKey(Pregunta, related_name='respuestas', on_delete=models.CASCADE)
    texto = models.CharField(max_length=1000)
    correcta = models.BooleanField(default=False)

    def __str__(self):
        return self.texto