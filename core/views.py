from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from core.models import Yeargroup, Question, Student, Subject, Occurrence, Prediction


class DashboardView(TemplateView):

    template_name = "dashboard.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['foo'] = 'bar' #Article.objects.all()[:5]
        return context


class DetailView(TemplateView):

    template_name = "detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['foo'] = 'bar' #Article.objects.all()[:5]
        return context