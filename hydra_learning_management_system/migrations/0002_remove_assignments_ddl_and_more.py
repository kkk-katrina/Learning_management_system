# Generated by Django 4.1.7 on 2023-04-07 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hydra_learning_management_system', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assignments',
            name='ddl',
        ),
        migrations.AddField(
            model_name='assignments',
            name='assignmentdescription',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='assignments',
            name='title',
            field=models.TextField(default=''),
        ),
    ]
