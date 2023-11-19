# userAPI/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Curso, ProgresoCurso, CustomUser

@receiver(post_save, sender=Curso)
def create_progreso_curso_for_new_curso(sender, instance, created, **kwargs):
    if created:
        usuarios = CustomUser.objects.all()
        for usuario in usuarios:
            ProgresoCurso.objects.create(usuario=usuario, curso=instance, estado='no_iniciado')
