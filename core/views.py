from django.views.generic import TemplateView, CreateView, DeleteView
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
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
        context['foo'] = 'bar'
        return context


class ProfileView(TemplateView):
    template_name = "registration/profile.html"
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['foo'] = 'bar'
        return context


class YeargroupsView(CreateView):
    template_name = 'yeargroups/index.html'
    model = Yeargroup
    fields = ['name']

    def form_valid(self, form):
        form.instance.user = self.request.user.id
        return super(YeargroupsView, self).form_valid(form)

    # ToDo some kind of user check
    #if not self.request.user.is_authenticated:
    #    return redirect('/dashboard/')

    def get_queryset(self):
        return Yeargroup.objects# self.request.user.yeargroups


class ClientDayView(TemplateView):
    template_name = 'client/day.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['foo'] = 'bar'
        return context


class ClientWeekView(TemplateView):
    template_name = 'client/week.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['foo'] = 'bar'
        return context


class ClientLoginView(TemplateView):
    template_name = 'client/login.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['foo'] = 'bar'
        return context


class ClientPredictionView(TemplateView):
    template_name = 'client/prediction.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['foo'] = 'bar'
        return context