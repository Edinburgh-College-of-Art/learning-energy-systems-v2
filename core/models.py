from django.db import models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


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

  @property
  def token(self):
    return Token.objects.get(user=self.user)

  def __repr__ (self):
    return '<Student %s %s>' % (self.id, self.user,)

  def __str__ (self):
    return '%s (%s)' % (self.user.username, self.yeargroup.name,)


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
    return '%s: %s (%s %s)' % (self.subject.yeargroup.name, self.subject.name, self.date.strftime('%A'), self.date,)


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


  #.2 kilowatt-hour for desktop + monitor + stuff
  #.018 kilowatt-hour per flourescent tube
  #(0.8 kilowatt-hour per 10sqm) with 50sqm avg classroom
  #300 watt projector

  def energy_use(queryset):
    durations = Prediction.average_duration(queryset)
    kwh_usage = {
      'light': (durations['light']/60) * (0.18 * 15),
      'computer': (durations['computer']/60) * 0.2,
      'projector': (durations['projector']/60) * 0.3,
      'heater': (durations['heater']/60) * (0.8 * 5)
      }
    return kwh_usage

  def total_energy_use(queryset):
    kwh_usage = Prediction.energy_use(queryset)
    return kwh_usage['light'] + kwh_usage['heater'] + kwh_usage['computer'] + kwh_usage['projector']

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