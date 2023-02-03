FROM python:3.10
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN mkdir -p /var/log/leviatom/
COPY . .
EXPOSE 8000
CMD [ "python3", "manage.py","runserver","0.0.0.0:8000","--insecure"]
