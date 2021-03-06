# Generated by Django 2.0.4 on 2018-05-21 11:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Occurrence',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Prediction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('light', models.CharField(max_length=24)),
                ('computer', models.CharField(max_length=24)),
                ('heater', models.CharField(max_length=24)),
                ('projector', models.CharField(max_length=24)),
                ('occurrence', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Occurrence')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.CharField(max_length=300)),
                ('answer', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=70)),
                ('duration', models.IntegerField(default=45)),
            ],
        ),
        migrations.CreateModel(
            name='Yeargroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=70)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='subject',
            name='yeargroup',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Yeargroup'),
        ),
        migrations.AddField(
            model_name='student',
            name='yeargroup',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Yeargroup'),
        ),
        migrations.AddField(
            model_name='question',
            name='yeargroup',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Yeargroup'),
        ),
        migrations.AddField(
            model_name='occurrence',
            name='subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Subject'),
        ),
    ]
