from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Curso, ProgresoCurso, CustomUser, Modulo, ProgresoModulo

# Tu señal existente...
@receiver(post_save, sender=Curso)
def create_progreso_curso_for_new_curso(sender, instance, created, **kwargs):
    if created:
        usuarios = CustomUser.objects.all()
        for usuario in usuarios:
            ProgresoCurso.objects.create(usuario=usuario, curso=instance, estado='no_iniciado')

@receiver(post_save, sender=Modulo)
def crear_progreso_modulo_para_nuevo_modulo(sender, instance, created, **kwargs):
    if created:
        # Crear un registro de ProgresoModulo para cada usuario
        usuarios = CustomUser.objects.all()
        for usuario in usuarios:
            ProgresoModulo.objects.create(
                usuario=usuario,
                modulo=instance,
                estado='no_iniciado'
            )
@receiver(post_save, sender=ProgresoCurso)
def iniciar_progreso_modulo(sender, instance, created, **kwargs):
    if created:
        primer_modulo = Modulo.objects.filter(curso=instance.curso).order_by('orden').first()
        if primer_modulo:
            ProgresoModulo.objects.create(
                usuario=instance.usuario,
                modulo=primer_modulo,
                estado='en_progreso'
            )
