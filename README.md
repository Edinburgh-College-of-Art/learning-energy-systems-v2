# learning-energy-systems-v2
2nd Generation of the Learning Energy Systems interface

## Quick run

Just run `./dockerize.sh`, this should build a docker image then run it as a container called `les`. Once running the web-server should be reachable at `http://localhost:8000/`.

## Running commands on the docker container

Migrating with `python manage.py`:

```
docker exec -i -t les python manage.py migrate
```

Creating a super user:

```
docker exec -i -t les python manage.py createsuperuser --email giannichan@gmail.com --username admin
``` 
