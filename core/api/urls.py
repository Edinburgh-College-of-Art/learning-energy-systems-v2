from django.conf.urls import url, include
from rest_framework import routers
from core.api import views
from django.urls import path

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    path('yeargroups/', views.YeargroupViewSet.as_view({'get': 'list'}) ),
    path('yeargroups/<int:pk>', views.YeargroupViewSet.as_view({'get': 'retrieve'}) ),
    path('yeargroups/<int:pk>/questions', views.QuestionViewSet.as_view({'get': 'list'}) ),
    path('yeargroups/<int:pk>/students',  views.StudentViewSet.as_view({'get': 'list'}) ),
    path('yeargroups/<int:pk>/subjects',  views.SubjectViewSet.as_view({'get': 'list'}) ),
    path('yeargroups/<int:ypk>/subjects/<int:pk>',  views.SubjectViewSet.as_view({'get': 'retrieve'}) ),

    path('subjects/<int:pk>/occurrences',  views.OccurrenceViewSet.as_view({'get': 'list'}) ),
 
    path('occurrences/<int:pk>/predictions',  views.PredictionViewSet.as_view({'get': 'list'}) ),
]