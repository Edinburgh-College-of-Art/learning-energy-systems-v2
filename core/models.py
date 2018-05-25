from django.db import models
from django.contrib.auth.models import User


class Yeargroup(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  name = models.CharField(max_length=70)
  def __repr__ (self):
    return '<Yeargroup %s %s>' % (self.id, self.name,)


class Question(models.Model):
  yeargroup = models.ForeignKey(Yeargroup, on_delete=models.CASCADE)
  body = models.CharField(max_length=300)
  answer = models.CharField(max_length=300)


class Student(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  yeargroup = models.ForeignKey(Yeargroup, on_delete=models.CASCADE)
  def __repr__ (self):
    return '<Student %s %s>' % (self.id, self.user,)

class Subject(models.Model):
  yeargroup = models.ForeignKey(Yeargroup, on_delete=models.CASCADE)
  name = models.CharField(max_length=70)
  duration = models.IntegerField(default=45)
  def __repr__ (self):
    return '<Subject %s %s>' % (self.id, self.name,)


class Occurrence(models.Model):
  subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
  date = models.DateField()


class Prediction(models.Model):
  user    = models.ForeignKey(User, on_delete=models.CASCADE)
  occurrence = models.ForeignKey(Occurrence, on_delete=models.CASCADE)
  light     = models.CharField(max_length=24)
  computer  = models.CharField(max_length=24)
  heater    = models.CharField(max_length=24)
  projector = models.CharField(max_length=24)

  def __repr__ (self):
    return '<Prediction %s %s>' % (self.id, self.user,)