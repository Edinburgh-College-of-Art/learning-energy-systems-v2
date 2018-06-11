from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from core.models import *
from core.api.serializers import *
from rest_framework import viewsets, status, authentication
from rest_framework.response import Response
from rest_framework.views import APIView
import datetime
import logging

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

    def search_day(self, request, ypk=None, year=None, month=None, day=None):
        queryset = Occurrence.objects.filter(subject__yeargroup__id=ypk)
        date = datetime.date(int(year), int(month), int(day))
        queryset = queryset.filter(date=date)
        serializer = OccurrenceSerializer(queryset, many=True)
        return Response(serializer.data)

    def search_week(self, request, ypk=None, year=None, week=None):
        queryset = Occurrence.objects.filter(subject__yeargroup__id=ypk)
        queryset = queryset.filter(date__year=int(year)).filter(date__week=int(week))
        serializer = OccurrencePredictionSerializer(queryset, many=True)
        return Response(serializer.data)


class PredictionViewSet(viewsets.ViewSet):
    def retrieve(self, request, opk=None):
        p = Prediction.objects.filter(user=self.request.user, occurrence__id=opk).first()
        serializer = PredictionOccurrenceSerializer(p)
        return Response(serializer.data)

    def update(self, request, opk=None):
        p = Prediction.objects.filter(user=request.user, occurrence__id=opk).first()
        if p == None:
            serializer = CreatePredictionSerializer(data=request.data, context={'request': request})
        else:
            serializer = CreatePredictionSerializer(p, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user_id=request.user.id, occurrence_id=opk)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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



class PredictionFiltering():
    def get_prediction_queryset(self, request, yeargroup_id=None):
        if yeargroup_id == None:
            yeargroup_id = request.GET.get('yeargroup_id', default=None)

        subject_id = request.GET.get('subject_id', default=None)
        user_id = request.GET.get('user_id', default=None)
        year = int(request.GET.get('year', default=0))
        month = int(request.GET.get('month', default=0))
        week = int(request.GET.get('week', default=0))
        day = int(request.GET.get('day', default=0))

        queryset = Prediction.objects

        if yeargroup_id == None and request.user.is_authenticated:
            queryset = queryset.filter(occurrence__subject__yeargroup__user=request.user)
        elif yeargroup_id != None:
            queryset = queryset.filter(occurrence__subject__yeargroup_id=yeargroup_id)

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if subject_id:
            queryset = queryset.filter(occurrence__subject_id=subject_id)
        if year:
            queryset = queryset.filter(occurrence__date__year=year)
        if month:
            queryset = queryset.filter(occurrence__date__month=month)
        if week:
            queryset = queryset.filter(occurrence__date__week=week)
        if day:
            queryset = queryset.filter(occurrence__date__day=day)

        return queryset


class UsageView(APIView, PredictionFiltering):
    def get(self, request, ypk=None):
        queryset = self.get_prediction_queryset(request, ypk)

        return Response({
                'average_duration': Prediction.average_duration(queryset),
                'total_durations': Prediction.total_durations(queryset),
                'average_use': Prediction.average_use(queryset),
                'average_pct': Prediction.average_pct(queryset),
                'total_duration': Prediction.total_duration(queryset),
                'energy_use': Prediction.energy_use(queryset),
                'total_energy_use': Prediction.total_energy_use(queryset),
                'prediction_count': queryset.count()
            })


class WeekdayUsageView(APIView, PredictionFiltering):

    def build_usage_for(day_queryset):
        return {
            'average_duration': Prediction.average_duration(day_queryset),
            'total_durations': Prediction.total_durations(day_queryset),
            'average_use': Prediction.average_use(day_queryset),
            'average_pct': Prediction.average_pct(day_queryset),
            'total_duration': Prediction.total_duration(day_queryset),
            'energy_use': Prediction.energy_use(day_queryset),
            'total_energy_use': Prediction.total_energy_use(day_queryset),
            'prediction_count': day_queryset.count()
        }

    def get(self, request):
        queryset = self.get_prediction_queryset(request)
        mon = WeekdayUsageView.build_usage_for(queryset.filter(occurrence__date__week_day=2))
        tue = WeekdayUsageView.build_usage_for(queryset.filter(occurrence__date__week_day=3))
        wed = WeekdayUsageView.build_usage_for(queryset.filter(occurrence__date__week_day=4))
        thu = WeekdayUsageView.build_usage_for(queryset.filter(occurrence__date__week_day=5))
        fri = WeekdayUsageView.build_usage_for(queryset.filter(occurrence__date__week_day=6))

        return Response({
            'monday': mon, 'tuesday': tue,
            'wednesday': wed, 'thursday': thu, 'friday': fri
        })


class PredictionSummaryView(APIView, PredictionFiltering):
    def get(self, request):
        queryset = self.get_prediction_queryset(request)
        user_summaries = []
        users = list(queryset.values("user_id").distinct())
        for entry in users:
            user_queryset = queryset.filter(user_id=entry['user_id'])
            summary = {
                'average_duration': Prediction.average_duration(user_queryset),
                'average_use': Prediction.average_use(user_queryset),
                'average_pct': Prediction.average_pct(user_queryset),
                'total_duration': Prediction.total_duration(user_queryset),
                'total_energy_use': Prediction.total_energy_use(user_queryset),
                'prediction_count': user_queryset.count()
            }
            user_summaries.append(summary)
        return Response(user_summaries)