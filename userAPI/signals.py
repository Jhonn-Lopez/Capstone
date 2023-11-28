# userAPI/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Curso, ProgresoCurso, CustomUser, ProgresoUsuario, Modulo

@receiver(post_save, sender=Curso)
def create_progreso_curso_for_new_curso(sender, instance, created, **kwargs):
    if created:
        usuarios = CustomUser.objects.all()
        for usuario in usuarios:
            ProgresoCurso.objects.create(usuario=usuario, curso=instance, estado='no_iniciado')

@receiver(post_save, sender=Modulo)
def create_or_update_progreso_usuario(sender, instance, created, **kwargs):
    # Si se crea un nuevo módulo y está activo, o si un módulo existente cambia a activo
    if (created and instance.activo) or (not created and instance.activo):
        usuarios = CustomUser.objects.all()
        for usuario in usuarios:
            # Crear o actualizar ProgresoUsuario
            ProgresoUsuario.objects.update_or_create(
                usuario=usuario,
                curso=instance.curso,
                modulo=instance,
                defaults={'estado': 'no_iniciado'}
            )

@receiver(post_save, sender=CustomUser)
def create_progreso_for_new_user(sender, instance, created, **kwargs):
    if created:
        # Para cada curso, crear un ProgresoCurso
        for curso in Curso.objects.all():
            ProgresoCurso.objects.create(usuario=instance, curso=curso, estado='no_iniciado')

            # Para cada módulo en el curso, crear un ProgresoUsuario
            for modulo in Modulo.objects.filter(curso=curso):
                ProgresoUsuario.objects.create(
                    usuario=instance,
                    curso=curso,
                    modulo=modulo,
                    estado='no_iniciado'
                )