# Generated by Django 4.1.7 on 2023-04-08 04:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hydra_learning_management_system', '0002_remove_assignments_ddl_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='birthday',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='users',
            name='firstname',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='users',
            name='gender',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='users',
            name='lastname',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='users',
            name='perferredlanguage',
            field=models.TextField(default=''),
        ),
    ]
