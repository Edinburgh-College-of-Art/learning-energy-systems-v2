from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from core.models import *
from core.api.serializers import *
from rest_framework import viewsets, status
from rest_framework.response import Response


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class YeargroupViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Yeargroup.objects.filter(user=request.user)
        serializer = YeargroupSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Yeargroup.objects.filter(user=request.user)
        yg = get_object_or_404(queryset, pk=pk)
        serializer = YeargroupSerializer(yg)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ViewSet):
    def list(self, request, pk=None):
        queryset = Question.objects.filter(yeargroup__user=request.user).filter(yeargroup__id=pk)
        serializer = QuestionSerializer(queryset, many=True)
        return Response(serializer.data)


class StudentViewSet(viewsets.ViewSet):
    def list(self, request, pk=None):
        queryset = Student.objects.filter(yeargroup__user=request.user).filter(yeargroup__id=pk)
        serializer = StudentSerializer(queryset, many=True)
        return Response(serializer.data)


class SubjectViewSet(viewsets.ViewSet):
    def list(self, request, pk=None):
        queryset = Subject.objects.filter(yeargroup__user=request.user).filter(yeargroup__id=pk)
        serializer = SubjectSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, ypk=None, pk=None):
        queryset = Subject.objects.filter(yeargroup__user=request.user).filter(yeargroup__id=ypk)
        s = get_object_or_404(queryset, pk=pk)
        serializer = SubjectSerializer(s)
        return Response(serializer.data)


class OccurrenceViewSet(viewsets.ViewSet):
    def list(self, request, pk=None):
        queryset = Occurrence.objects.filter(subject__yeargroup__user=request.user).filter(subject__id=pk)
        serializer = OccurrenceSerializer(queryset, many=True)
        return Response(serializer.data)


class PredictionViewSet(viewsets.ViewSet):
    def list(self, request, pk=None):
        queryset = Prediction.objects.filter(occurrence__id=pk)
        serializer = PredictionSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, pk=None):
        request.data['occurrence'] = pk
        request.data['student'] = 1
        create_serializer = CreatePredictionSerializer(data=request.data, context={'request': request})
        if create_serializer.is_valid():
            create_serializer.save()
            return Response(create_serializer.data, status=status.HTTP_201_CREATED)
        return Response(create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)