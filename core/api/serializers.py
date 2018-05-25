from django.contrib.auth.models import User
from core.models import Yeargroup, Question, Student, Subject, Occurrence, Prediction
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email']


class OccurrenceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Occurrence
        fields = ['date']


class SubjectSerializer(serializers.HyperlinkedModelSerializer):
    schedule = OccurrenceSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'name', 'duration', 'schedule']


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'body', 'answer']


class YeargroupSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, source='subject_set')

    class Meta:
        model = Yeargroup
        fields = ['id', 'name', 'subjects']
        depth = 1


class StudentSerializer(serializers.ModelSerializer):
    yeargroup = YeargroupSerializer()

    class Meta:
        model = Student
        fields = ['id', 'yeargroup']
        depth = 1


class PredictionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Prediction
        fields = ['light', 'computer', 'heater', 'projector']


class CreatePredictionSerializer(serializers.HyperlinkedModelSerializer):
    occurrence = serializers.PrimaryKeyRelatedField(queryset=Occurrence.objects)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects)

    class Meta:
        model = Prediction
        fields = ['light', 'computer', 'heater', 'projector', 'occurrence', 'user']
