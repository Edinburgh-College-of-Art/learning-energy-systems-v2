from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from core.models import *
from core.api.serializers import *
from rest_framework import viewsets, status
from rest_framework.response import Response
import datetime

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
    def retrieve(self, request, pk=None):
        queryset = Student.objects.all()
        s = get_object_or_404(queryset, pk=request.user.student.pk)
        serializer = StudentSerializer(s, context={'request': request})
        return Response(serializer.data)

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

    def search(self, request, ypk=None, year=None, month=None, day=None):
        date = datetime.date(int(year), int(month), int(day))
        queryset = Subject.objects.filter(yeargroup__id=ypk).filter(occurrence__date=date)
        serializer = SubjectSerializer(queryset, many=True)
        return Response(serializer.data)


class OccurrenceViewSet(viewsets.ViewSet):
    def list(self, request, pk=None):
        queryset = Occurrence.objects.filter(subject__yeargroup__user=request.user).filter(subject__id=pk)
        serializer = OccurrenceSerializer(queryset, many=True)
        return Response(serializer.data)

    def search(self, request, ypk=None, year=None, month=None, day=None):
        queryset = Occurrence.objects.filter(subject__yeargroup__id=ypk)
        date = datetime.date(int(year), int(month), int(day))
        queryset = queryset.filter(date=date)
        serializer = OccurrenceSerializer(queryset, many=True)
        return Response(serializer.data)


class PredictionViewSet(viewsets.ViewSet):
    def retrieve(self, request, opk=None):
        p = Prediction.objects.filter(user=self.request.user, occurrence__id=opk).first()
        serializer = PredictionOccurrenceSerializer(p)
        return Response(serializer.data)

    def update(self, request, opk=None):
        p = Prediction.objects.filter(user=self.request.user, occurrence__id=opk).first()
        serializer = PredictionOccurrenceSerializer(p)
        return Response(serializer.data)

    def list(self, request, opk=None):
        queryset = Prediction.objects.filter(occurrence__id=opk)
        serializer = PredictionSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, opk=None):
        request.data['occurrence'] = opk

        if not request.user.is_authenticated:
            content = {'error': 'unauthorised'}
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

        request.data['user'] = request.user.pk
        create_serializer = CreatePredictionSerializer(data=request.data, context={'request': request})
        if create_serializer.is_valid():
            create_serializer.save()
            return Response(create_serializer.data, status=status.HTTP_201_CREATED)
        return Response(create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)