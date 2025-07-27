from flask import Blueprint, jsonify
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from app.config import CSV_PATH, FORECAST_PATH
from app.services.model_utils import train_models, load_models
from app.services.forecast_generator import generate_forecast

bp = Blueprint('forecast', __name__)

@bp.route('/train-5day', methods=['POST'])
def train_and_predict_5day():
    if not os.path.exists(CSV_PATH):
        return jsonify({"error": "CSV file not found"}), 404

    df = pd.read_csv(CSV_PATH)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')

    df['hour'] = df['timestamp'].dt.hour
    df['dayofweek'] = df['timestamp'].dt.dayofweek
    df['dayofyear'] = df['timestamp'].dt.dayofyear
    df['power'] = df['voltage'] * df['current']

    features = ['hour', 'dayofweek', 'dayofyear', 'temperature']
    train_models(df, features)

    future_df = generate_forecast(df, features)
    future_df.to_csv(FORECAST_PATH, index=False)
    return jsonify({"message": "✅ 5-day forecast generated from live data"}), 200

@bp.route('/forecast-5days', methods=['GET'])
def get_forecast():
    if not os.path.exists(FORECAST_PATH):
        return jsonify({"error": "Run /train-5day first"}), 404
    df = pd.read_csv(FORECAST_PATH)
    df['timestamp'] = pd.to_datetime(df['timestamp']).astype(str)
    return jsonify(df.to_dict(orient='records'))
