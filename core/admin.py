from django.contrib import admin

# Register your models here.
from .models import Yeargroup, Question, Student, Subject, Prediction, Occurrence

class PredictionAdmin(admin.ModelAdmin):
  list_display = ['id', 'user', 'occurrence']

admin.site.register(Yeargroup)
admin.site.register(Question)
admin.site.register(Student)
admin.site.register(Subject)
admin.site.register(Occurrence)
admin.site.register(Prediction, PredictionAdmin)