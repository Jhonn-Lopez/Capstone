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
    imagen = models.ImageField(upload_to='cursos/imagenes/', blank=True, null=True)
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
    curso = models.ForeignKey(Curso, related_name='progreso_usuarios', on_delete=models.CASCADE)
    estado = models.CharField(max_length=12, choices=ESTADOS, default='no_iniciado')
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    ultima_actividad = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('usuario', 'curso')

    def __str__(self):
        return f"{self.usuario.email}'s progress on {self.curso.nombre}"

class Modulo(models.Model):
    curso = models.ForeignKey(Curso, related_name='modulos', on_delete=models.CASCADE)  
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=False)
    # Otros campos que necesites para el módulo

    def __str__(self):
        return self.nombre

class Contenido(models.Model):
    modulo = models.ForeignKey(Modulo, related_name='contenidos', on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    video = models.FileField(upload_to='contenidos/videos/', blank=True, null=True)
    duracion_video = models.DurationField(blank=True, null=True)  # Guarda la duración del video
    imagen = models.ImageField(upload_to='contenidos/imagenes/', blank=True, null=True)
    archivo = models.FileField(upload_to='contenidos/archivos/', blank=True, null=True)
    activo = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # Guardar el objeto para asegurarse de que el archivo esté en el sistema de archivos
        super(Contenido, self).save(*args, **kwargs)
        if self.video and not self.duracion_video:
            try:
                file_path = self.video.path
                if storage.exists(file_path):  # Verificar que el archivo exista
                    # Comando actualizado para manejar nombres de archivo con espacios
                    cmd = f"ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -i \"{file_path}\""
                    args = shlex.split(cmd)
                    result = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                    duration = float(result.stdout)
                    self.duracion_video = timedelta(seconds=round(duration))
                    # Guardar solo el campo duracion_video
                    super(Contenido, self).save(update_fields=['duracion_video'])
            except Exception as e:
                print(f"No se pudo determinar la duración del video: {e}")

    def __str__(self):
        return self.titulo

class Cuestionario(models.Model):
    modulo = models.OneToOneField(Modulo, related_name='cuestionario', on_delete=models.CASCADE)
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