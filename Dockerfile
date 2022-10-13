FROM python:3.4.0
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 8000
CMD [ "python3", "main.py","0.0.0.0:8000","--insecure"]
