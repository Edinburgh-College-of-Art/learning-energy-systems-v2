from django.contrib.auth.models import User
from core.models import Yeargroup, Question, Student, Subject, Occurrence, Prediction
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class YeargroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Yeargroup
        fields = ['id', 'name']


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'body', 'answer']


class StudentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ['name']


class OccurrenceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Occurrence
        fields = ['date']


class SubjectSerializer(serializers.HyperlinkedModelSerializer):
    schedule = OccurrenceSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'name', 'duration', 'schedule']


class PredictionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Prediction
        fields = ['light', 'computer', 'heater', 'projector']


class CreatePredictionSerializer(serializers.HyperlinkedModelSerializer):
    occurrence = serializers.PrimaryKeyRelatedField(queryset=Occurrence.objects)
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects)

    class Meta:
        model = Prediction
        fields = ['light', 'computer', 'heater', 'projector', 'occurrence', 'student']
