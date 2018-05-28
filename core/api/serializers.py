from django.contrib.auth.models import User
from core.models import Yeargroup, Question, Student, Subject, Occurrence, Prediction
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class BasicSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'duration']


class OccurrenceSerializer(serializers.ModelSerializer):
    subject = BasicSubjectSerializer()
    class Meta:
        model  = Occurrence
        fields = ['id', 'date', 'subject']


class SubjectSerializer(serializers.HyperlinkedModelSerializer):
    schedule = OccurrenceSerializer(many=True, read_only=True)
    class Meta:
        model = Subject
        fields = ['id', 'name', 'duration', 'schedule']
        depth = 1


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
    user = UserSerializer()
    class Meta:
        model = Student
        fields = ['id', 'yeargroup', 'user']
        depth = 1


class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ['id', 'light', 'computer', 'heater', 'projector', 'user']


class PredictionOccurrenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ['id', 'light', 'computer', 'heater', 'projector', 'occurrence']
        depth = 2


class OccurrencePredictionSerializer(serializers.ModelSerializer):
    subject = BasicSubjectSerializer()
    predictions = PredictionSerializer(many=True, source='prediction_set')

    class Meta:
        model  = Occurrence
        fields = ['id', 'date', 'subject', 'predictions']
        depth = 2


class CreatePredictionSerializer(serializers.HyperlinkedModelSerializer):
    occurrence = serializers.PrimaryKeyRelatedField(queryset=Occurrence.objects, required=False)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects, required=False)

    class Meta:
        model = Prediction
        fields = ['light', 'computer', 'heater', 'projector', 'occurrence', 'user']