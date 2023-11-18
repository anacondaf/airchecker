FROM amd64/python:3.9-bookworm

WORKDIR /app

RUN pip3 install --upgrade pip

COPY . /app

# Install app dependencies
# COPY requirements.txt ./

RUN pip3 install Flask Flask-CORS keras joblib pandas pymongo numpy scikit-learn python-dateutil