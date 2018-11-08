from django.contrib import admin
from django.urls import path, include
from core.views import *

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('dashboard/', DashboardView.as_view()),
    path('', include('django.contrib.auth.urls')),
    path('accounts/profile/', ProfileView.as_view(), name='profile'),
    path('detail', PredictionDetailView.as_view(), name='detail'),
    path('yeargroups/new', YeargroupsView.as_view(), name='create_yeargroup'),
    path('yeargroups/<int:pk>/delete', DeleteYeargroupView.as_view(), name='delete_yeargroup'),
    path('yeargroups/<int:pk>', YeargroupDetailView.as_view(), name='yeargroup'),
    path('yeargroups/<yeargroup>/subjects/new', SubjectsView.as_view(), name='create_subject'),
    path('yeargroups/<yeargroup>/subjects/<int:pk>/delete', DeleteSubjectView.as_view(), name='delete_subject'),
    path('yeargroups/<yeargroup>/subjects/<int:pk>/edit', UpdateSubjectView.as_view(), name='update_subject'),
    path('client/day', ClientDayView.as_view(), name='client-day'),
    path('client/week', ClientWeekView.as_view(), name='client-week'),
    path('diary', ClientWeekView.as_view()),
    path('client/login', ClientLoginView.as_view(), name='client-login'),
    path('client/prediction', ClientPredictionView.as_view(), name='client-prediction'),
]