from django.contrib.auth.models import User, Group
from core.models import Yeargroup, Question, Student, Subject, Occurrence, Prediction
from rest_framework import viewsets
from core.api.serializers import (
    UserSerializer,
    YeargroupSerializer,
    QuestionSerializer,
    StudentSerializer,
    SubjectSerializer,
    PredictionSerializer,
    OccurrenceSerializer,
)
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


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
