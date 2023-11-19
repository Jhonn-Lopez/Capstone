# Generated by Django 4.2.6 on 2023-11-14 00:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('userAPI', '0003_remove_curso_usuario_alter_curso_activo_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='modulo',
            name='activo',
        ),
        migrations.RemoveField(
            model_name='modulo',
            name='archivo',
        ),
        migrations.RemoveField(
            model_name='modulo',
            name='duracion_video',
        ),
        migrations.RemoveField(
            model_name='modulo',
            name='imagen',
        ),
        migrations.RemoveField(
            model_name='modulo',
            name='video',
        ),
        migrations.RemoveField(
            model_name='progresocurso',
            name='completado',
        ),
        migrations.AddField(
            model_name='progresocurso',
            name='estado',
            field=models.CharField(choices=[('no_iniciado', 'No Iniciado'), ('activo', 'Activo'), ('completado', 'Completado')], default='no_iniciado', max_length=12),
        ),
        migrations.CreateModel(
            name='Contenido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=200)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('video', models.FileField(blank=True, null=True, upload_to='contenidos/videos/')),
                ('duracion_video', models.DurationField(blank=True, null=True)),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='contenidos/imagenes/')),
                ('archivo', models.FileField(blank=True, null=True, upload_to='contenidos/archivos/')),
                ('activo', models.BooleanField(default=True)),
                ('modulo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contenidos', to='userAPI.modulo')),
            ],
        ),
    ]