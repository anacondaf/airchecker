from flask import Flask, request, jsonify
from keras.models import load_model
import joblib
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import pandas as pd

app = Flask(__name__)

app.config["DEBUG"] = True

# Tải best_model và best_scaler từ các tệp đã lưu
best_model_filename = "./best_model.h5"  # Thay thế bằng tên tệp của best_model đã lưu
best_scaler_filename = "./best_scaler.pkl"  # Thay thế bằng tên tệp của best_scaler đã lưu

best_model = load_model(best_model_filename)
best_scaler = joblib.load(best_scaler_filename)

df = pd.read_csv('./dataset.csv', header=0, names=["date", "pm25", "pm10", "so2", "no2", "co","o3","aqi"], index_col='date', parse_dates=True)
df = df[['aqi']]
df = df.astype('float64')
df = df.resample(rule='W').mean()

df.bfill(inplace=True) # Modify as FutureWarning
# df['aqi'].fillna(method = 'bfill',inplace = True)

Q1 = df['aqi'].quantile(0.25)
Q3 = df['aqi'].quantile(0.75)
IQR = Q3 - Q1

# identify outliers
threshold = 1.5
outliers = df[(df['aqi'] < Q1 - threshold * IQR) | (df['aqi'] > Q3 + threshold * IQR)]

# Replace outliers with minimum
df[(df['aqi'] < Q1 - threshold * IQR)] = Q1 - threshold * IQR

def predict_aqi(target_date):
    # Get the data for the 5 weeks preceding the target_date
    n_input = 5
    n_features = 1

    start_date = target_date - pd.DateOffset(weeks=n_input - 1)
    input_data = df.loc[start_date:target_date]['aqi'].values

    # Normalize the data using the best_scaler
    input_data = best_scaler.transform(input_data.reshape(-1, 1))
    input_data = input_data.reshape((1, n_input, n_features))

    # Use the model to make predictions
    predicted_aqi = best_model.predict(input_data)

    # Inverse transform the predictions to the original scale
    predicted_aqi = best_scaler.inverse_transform(predicted_aqi)

    return predicted_aqi[0][0]

@app.route('/predict/aqi', methods=['GET'])
def predict_aqi_endpoint():
    target_date_str = request.args.get('target_date')
    
    if not target_date_str:
        return jsonify({'error': 'Please provide a target_date parameter in the format YYYY-MM-DD'}), 400
    
    try:
        target_date = datetime.strptime(target_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Please use the format YYYY-MM-DD'}), 400
    
    predicted_aqi = predict_aqi(target_date)

    print(predicted_aqi)
    
    response_data = {
        'target_date': target_date_str,
        'predicted_aqi': float(predicted_aqi)
    }

    return jsonify(response_data)

@app.route('/', methods=['GET'])
def home():
    return '''<h1>VLib - Online Library</h1>
                <p>A flask api implementation for book information.   </p>'''

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)