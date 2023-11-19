# Generated by Django 4.2.6 on 2023-11-13 22:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('userAPI', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cuestionario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activo', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Curso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('descripcion', models.TextField()),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='cursos/imagenes/')),
                ('video', models.FileField(blank=True, null=True, upload_to='cursos/videos/')),
                ('activo', models.BooleanField(default=False)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cursos', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Pregunta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('texto', models.CharField(max_length=1000)),
                ('cuestionario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='preguntas', to='userAPI.cuestionario')),
            ],
        ),
        migrations.CreateModel(
            name='Respuesta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('texto', models.CharField(max_length=1000)),
                ('correcta', models.BooleanField(default=False)),
                ('pregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='respuestas', to='userAPI.pregunta')),
            ],
        ),
        migrations.CreateModel(
            name='Modulo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=200)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('video', models.FileField(upload_to='modulos/videos/')),
                ('duracion_video', models.DurationField()),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='modulos/imagenes/')),
                ('archivo', models.FileField(blank=True, null=True, upload_to='modulos/archivos/')),
                ('activo', models.BooleanField(default=False)),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modulos', to='userAPI.curso')),
            ],
        ),
        migrations.AddField(
            model_name='cuestionario',
            name='modulo',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='cuestionario', to='userAPI.modulo'),
        ),
    ]