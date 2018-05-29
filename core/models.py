from django.db import models
from django.contrib.auth.models import User


class Yeargroup(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  name = models.CharField(max_length=70)
  def __repr__ (self):
    return '<Yeargroup %s %s>' % (self.id, self.name,)
  def __str__ (self):
    return '(id:%s) %s' % (self.id, self.name,)

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
  def __str__ (self):
    return '%s: %s (%s mins)' % (self.yeargroup.name, self.name, self.duration)

class Occurrence(models.Model):
  subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
  date = models.DateField()
  def __str__ (self):
    return '%s (%s)' % (self.subject.name, self.date,)

class Prediction(models.Model):
  user    = models.ForeignKey(User, on_delete=models.CASCADE)
  occurrence = models.ForeignKey(Occurrence, on_delete=models.CASCADE)
  light     = models.CharField(max_length=24)
  computer  = models.CharField(max_length=24)
  heater    = models.CharField(max_length=24)
  projector = models.CharField(max_length=24)

  def device_use(self, device):
    prediction = getattr(self, device)
    possible = len(prediction)
    count = prediction.count("1")
    return count / possible * 100

  def device_duration(self, device):
    prediction = getattr(self, device)
    return prediction.count("1") * 5

  def mean(numbers):
    return float(sum(numbers)) / max(len(numbers), 1)

  def average_use(queryset):
    mean = Prediction.mean
    l = list(map(lambda x: x.device_use('light'), queryset))
    c = list(map(lambda x: x.device_use('computer'), queryset))
    p = list(map(lambda x: x.device_use('projector'), queryset))
    h = list(map(lambda x: x.device_use('heater'), queryset))
    return { 'light': mean(l), 'computer': mean(c),
      'projector': mean(p), 'heater': mean(h) }

  def average_pct(queryset):
    averages = Prediction.average_use(queryset)
    total = sum([averages['light'], averages['heater'], averages['computer'], averages['computer']])
    return total / 4

  def average_duration(queryset):
    mean = Prediction.mean
    l = list(map(lambda x: x.device_duration('light'), queryset))
    c = list(map(lambda x: x.device_duration('computer'), queryset))
    p = list(map(lambda x: x.device_duration('projector'), queryset))
    h = list(map(lambda x: x.device_duration('heater'), queryset))
    return { 'light': mean(l), 'computer': mean(c),
      'projector': mean(p), 'heater': mean(h) }

  def total_duration_for(queryset, device):
    d = list(map(lambda x: x.device_duration(device), queryset))
    return sum(d)

  def total_durations(queryset):
    return {
      'light': Prediction.total_duration_for(queryset,'light'),
      'projector': Prediction.total_duration_for(queryset,'computer'),
      'computer': Prediction.total_duration_for(queryset,'projector'),
      'heater': Prediction.total_duration_for(queryset,'heater')
    }

  def total_duration(queryset):
    durations = Prediction.total_durations(queryset)
    return (durations['light'] + durations['computer'] + durations['projector'] + durations['heater'])

  def __repr__ (self):
    return '<Prediction %s %s>' % (self.id, self.user,)