from django.urls import path
from core.views import DashboardView, DetailView

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('detail', DetailView.as_view(), name='detail'),
]