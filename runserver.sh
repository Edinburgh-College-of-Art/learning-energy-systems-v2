#!/bin/bash
echo Running server

exec env DJANGO_SETTINGS_MODULE=LES.settings python manage.py runserver 0.0.0.0:8000