FROM python:3.11.8-alpine

ADD . /www
WORKDIR /www

RUN python3 -m pip install -U pip
RUN pip3 install -r requirements.txt

CMD ["python3",  "-m", "flask",  "run",  "--host=0.0.0.0"]