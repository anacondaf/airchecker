FROM amd64/python:3.9-bookworm

WORKDIR /app

RUN pip3 install --upgrade pip

COPY . /app

# Install app dependencies
# COPY requirements.txt ./

RUN pip3 install tensorflow

RUN pip3 install -r requirements.txt

# RUN python -m pip install Flask keras joblib pandas tensorflow

# Run the application on port 5000
EXPOSE 5000
CMD ["python", "app.py"]