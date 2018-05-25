from django.urls import path
from core.views import *

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('detail', DetailView.as_view(), name='detail'),
    path('yeargroups', YeargroupsView.as_view(), name='yeargroups'),
    path('client/day', ClientDayView.as_view(), name='client-day'),
    path('client/week', ClientWeekView.as_view(), name='client-week'),
    path('client/login', ClientLoginView.as_view(), name='client-login'),
    path('client/prediction', ClientPredictionView.as_view(), name='client-prediction'),
]