# Generated by Django 4.2.6 on 2023-11-19 01:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userAPI', '0005_rename_titulo_modulo_nombre'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='curso',
            name='video',
        ),
    ]