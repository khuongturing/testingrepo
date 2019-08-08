# Pull the base image
FROM python:3

# Set environment variables
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code

# Upgrade pip
RUN pip install pip -U
COPY requirements.txt /code/

# Install dependencies
RUN pip install -r requirements.txt

COPY . /code/