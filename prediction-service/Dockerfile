FROM amd64/python:3.9-bookworm

WORKDIR /app

RUN pip3 install --upgrade pip

COPY . /app

# Install app dependencies
# COPY requirements.txt ./

RUN pip3 install tensorflow

RUN pip3 install -r requirements.txt