from flask import Blueprint, request, jsonify
import pandas as pd
from datetime import datetime
import os
from app.config import CSV_PATH

bp = Blueprint('live_data', __name__)

@bp.route('/')
def home():
    return "✅ Flask backend is running"

@bp.route('/solar-data', methods=['POST'])
def receive_data():
    data = request.get_json()
    row = {
        "timestamp": datetime.now().isoformat(),
        "voltage": data['voltage'],
        "current": data['current'],
        "temperature": data['temperature']
    }
    df = pd.DataFrame([row])

    if not os.path.exists(CSV_PATH) or os.stat(CSV_PATH).st_size == 0:
        df.to_csv(CSV_PATH, index=False)
    else:
        df.to_csv(CSV_PATH, mode='a', index=False, header=False)

    return jsonify({"message": "Data saved"}), 200

@bp.route('/live-sensor-data', methods=['GET'])
def live_sensor_data():
    if not os.path.exists(CSV_PATH):
        return jsonify([])
    df = pd.read_csv(CSV_PATH)
    return jsonify(df.tail(50).to_dict(orient='records'))
