from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import load_model
import joblib
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import pandas as pd
from pymongo import MongoClient
import warnings
import numpy as np

# Ignore warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load model and scaler
best_model_filename = "./best_model.h5"  
best_scaler_filename = "./best_scaler.pkl"

best_model = load_model(best_model_filename)
best_scaler = joblib.load(best_scaler_filename)

# MONGODB_URL=mongodb+srv://admin:Pa$$word!@aircheckercluster.yymawyw.mongodb.net/aircheckerdb?retryWrites=true&w=majority
MONGODB_URL="mongodb://localhost:27017/aircheckerdb"

# Connect to MongoDB
mongo_client = MongoClient(MONGODB_URL)
mongo_db = mongo_client.get_database()
mongo_collection = mongo_db['dataset']

def predict_aqi(target_date, previous_aqi=None):
    # Get the data for the 5 days before the target_date
    n_input = 5
    n_features = 1

    start_date = target_date - timedelta(days=n_input)
    end_date = target_date - timedelta(days=1)

    # Query the previous 5 days data from MongoDB
    query = {'date': {'$gte': start_date, '$lte': end_date}}
    projection = {'_id': 0, 'date': 1, 'aqi': 1}
    data_from_mongo = list(mongo_collection.find(query, projection).sort('date', 1))

    input_data = np.array([entry['aqi'] for entry in data_from_mongo])

    # If a previous_aqi value is provided, use it as input for the last day
    if previous_aqi is not None:
        input_data[-1] = previous_aqi

    # Normalize the data using the best_scaler
    input_data = best_scaler.transform(input_data.reshape(-1, 1))
    input_data = input_data.reshape((1, n_input, n_features))

    # Use the model to make predictions
    predicted_aqi = best_model.predict(input_data)

    # Inverse transform the predictions to the original scale
    predicted_aqi = best_scaler.inverse_transform(predicted_aqi)

    return predicted_aqi[0][0]

@app.route('/new/aqi', methods=['POST'])
def update_new_aqi():
    try:
        # body: {newAqi, date}
        data = request.get_json()
        new_aqi = data['newAqi']
        new_date_str = data['date']

        # Convert the date string to a datetime object
        new_date = pd.to_datetime(new_date_str, format='%Y-%m-%d', errors='raise')

        # Check if new_date is not in the DataFrame index
        # if new_date not in df.index:
        #     # Append the newAqi value to the DataFrame
        #     df.loc[new_date] = new_aqi

        #     # Log the DataFrame after appending
        #     print("DataFrame after appending new value:")
        #     print(df)

        #     # Return success response
        #     response_data = {
        #         'status': 'success',
        #         'message': f'New AQI value {new_aqi} appended to DataFrame.'
        #     }

        #     return jsonify({'error': 'OK'}), 200

        # Check if new_date is not in the MongoDB collection
        if mongo_collection.find_one({'date': new_date}) is None:
            # Insert the new data into the MongoDB collection
            new_data = {'date': new_date, 'aqi': new_aqi}
            mongo_collection.insert_one(new_data)

            # Log the MongoDB collection after inserting new value
            print("MongoDB collection after inserting new value:")
            cursor = mongo_collection.find({})
            for document in cursor:
                print(document)

        # Return success response
        response_data = {
            'status': 'success',
            'message': f'New AQI value {new_aqi} appended to DataFrame.'
        }

        return jsonify(response_data), 200

    except KeyError:
        return jsonify({'error': 'Invalid request format. Please provide "newAqi" and "date" in the request body.'}), 400
    except ValueError as ve:
        return jsonify({'error': f'Invalid date format. {ve}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/aqi', methods=['GET'])
def predict_aqi_endpoint():
    target_date_str = request.args.get('target_date')
    
    if not target_date_str:
        return jsonify({'error': 'Please provide a target_date parameter in the format YYYY-MM-DD'}), 400

    try:
        target_date = datetime.strptime(target_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Please use the format YYYY-MM-DD'}), 400

    # Predict AQI for target_date
    predicted_aqi_target_date = predict_aqi(target_date)

    # Predict AQI for the day after target_date using the predicted_aqi_target_date as input
    next_day = target_date + timedelta(days=1)
    predicted_aqi_next_day = predict_aqi(next_day, previous_aqi=predicted_aqi_target_date)

    response_data = {
        'predictedDates': [target_date.strftime('%Y-%m-%d'), next_day.strftime('%Y-%m-%d')],
        'predictedAqis': [float(predicted_aqi_target_date), float(predicted_aqi_next_day)]
    }

    print(response_data)

    return jsonify(response_data)

@app.route('/', methods=['GET'])
def home():
    return '''<h1>AirChecker Prediction API</h1>
                <p>A flask api implementation for air quality prediction using LSTM model. </p>'''

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8081)