# learning-energy-systems-v2
2nd Generation of the Learning Energy Systems interface

## Quick run

Just run:

`./dockerize.sh`

## Running commands on the docker container

Migrating with `python manage.py`:

```
docker exec -i -t les python manage.py migrate
```

Creating a super user:

```
docker exec -i -t les python manage.py createsuperuser --email giannichan@gmail.com --username admin
``` 
