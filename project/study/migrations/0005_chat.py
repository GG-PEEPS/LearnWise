# Generated by Django 5.0.2 on 2024-03-24 13:31

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('study', '0004_remove_document_link'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('from_type', models.CharField(choices=[('USER', 'User'), ('SYSTEM', 'System')], max_length=10)),
                ('message', models.TextField()),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='study.subject')),
            ],
        ),
    ]