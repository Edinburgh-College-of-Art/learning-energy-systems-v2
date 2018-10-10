from django.views.generic import TemplateView, CreateView, DeleteView
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.urls import reverse_lazy, reverse
from core.models import Yeargroup, Question, Student, Subject, Occurrence, Prediction
from rest_framework.authtoken.models import Token


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


class ProfileView(LoginRequiredMixin, TemplateView):
    template_name = "registration/profile.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['yeargroups'] = Yeargroup.objects.filter(user=self.request.user)
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('/login/')
        return super(ProfileView, self).dispatch(request, *args, **kwargs)


class YeargroupsView(LoginRequiredMixin, CreateView):
    template_name = 'yeargroups/create.html'
    model = Yeargroup
    fields = ['name']

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(YeargroupsView, self).form_valid(form)

    def get_success_url(self):
        return reverse('profile')

    def get_queryset(self):
        return self.request.user.yeargroups


class DeleteYeargroupView(LoginRequiredMixin, DeleteView):
    template_name = 'yeargroups/delete.html'
    model = Yeargroup
    success_url = reverse_lazy('profile')


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
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            logout(request)
        return super(ClientLoginView, self).dispatch(request, *args, **kwargs)


class ClientPredictionView(TemplateView):
    template_name = 'client/prediction.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['foo'] = 'bar'
        return context