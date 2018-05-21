FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

COPY . .

EXPOSE 8000

RUN env DJANGO_SETTINGS_MODULE=LES.settings python3 manage.py makemigrations
RUN env DJANGO_SETTINGS_MODULE=LES.settings python3 manage.py migrate

CMD ["./runserver.sh"]