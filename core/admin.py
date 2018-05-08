from django.contrib import admin

# Register your models here.
from .models import Yeargroup, Question, Student, Subject, Prediction, Occurrence

admin.site.register(Yeargroup)
admin.site.register(Question)
admin.site.register(Student)
admin.site.register(Subject)
admin.site.register(Prediction)
admin.site.register(Occurrence)