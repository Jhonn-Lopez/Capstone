# Generated by Django 4.2.6 on 2023-11-19 02:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userAPI', '0006_remove_curso_video'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='curso',
            name='activo',
        ),
    ]
