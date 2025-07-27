from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from xgboost import XGBRegressor
import joblib
from datetime import datetime, timedelta
import os

app = Flask(__name__)

CSV_PATH = "D:\\solar electric 5 try\\backend\\solar_data_log.csv"
FORECAST_PATH = "D:\\solar electric 5 try\\backend\\solar_5day_forecast.csv"

# 🟢 Test route
@app.route('/')
def home():
    return "✅ Flask backend is running"

# 🔌 ESP32 Live Data Logging
@app.route('/solar-data', methods=['POST'])
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

# 📊 Live Monitoring Route
@app.route('/live-sensor-data', methods=['GET'])
def live_sensor_data():
    if not os.path.exists(CSV_PATH):
        return jsonify([])
    df = pd.read_csv(CSV_PATH)
    return jsonify(df.tail(50).to_dict(orient='records'))

# 🧠 Train and Forecast (uses real data only)
@app.route('/train-5day', methods=['POST'])
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

    models = {
        'predicted_power': ('power', XGBRegressor(n_estimators=100)),
        'predicted_voltage': ('voltage', XGBRegressor(n_estimators=100)),
        'predicted_current': ('current', XGBRegressor(n_estimators=100)),
        'predicted_temperature': ('temperature', XGBRegressor(n_estimators=100))
    }

    for label, (target, model) in models.items():
        model.fit(df[features], df[target])
        joblib.dump(model, f"{label}.pkl")

    future = []
    now = datetime.now()
    temp_mean = df['temperature'].mean()

    for i in range(5 * 24):
        ts = now + timedelta(hours=i)
        future.append({
            "timestamp": ts.isoformat(),
            "hour": ts.hour,
            "dayofweek": ts.weekday(),
            "dayofyear": ts.timetuple().tm_yday,
            "temperature": temp_mean + 5 * np.sin((2 * np.pi * ts.hour) / 24)
        })

    future_df = pd.DataFrame(future)

    for label in models:
        model = joblib.load(f"{label}.pkl")
        future_df[label] = model.predict(future_df[features])

    future_df.to_csv(FORECAST_PATH, index=False)
    return jsonify({"message": "✅ 5-day forecast generated from live data"}), 200

# 🔮 Get Forecast
@app.route('/forecast-5days', methods=['GET'])
def get_forecast():
    if not os.path.exists(FORECAST_PATH):
        return jsonify({"error": "Run /train-5day first"}), 404
    df = pd.read_csv(FORECAST_PATH)
    df['timestamp'] = pd.to_datetime(df['timestamp']).astype(str)
    return jsonify(df.to_dict(orient='records'))

# 📈 Forecast Power Extremes
@app.route('/forecast-extremes', methods=['GET'])
def forecast_extremes():
    if not os.path.exists(FORECAST_PATH):
        return jsonify({})
    df = pd.read_csv(FORECAST_PATH)
    max_row = df.loc[df['predicted_power'].idxmax()]
    min_row = df.loc[df['predicted_power'].idxmin()]
    return jsonify({
        "max_predicted_power": {"timestamp": str(max_row['timestamp']), "value": float(max_row['predicted_power'])},
        "min_predicted_power": {"timestamp": str(min_row['timestamp']), "value": float(min_row['predicted_power'])}
    })

# ✅ 📉 Forecast Voltage and Temperature Extremes Only
@app.route('/forecast-extremes-full', methods=['GET'])
def forecast_extremes_full():
    if not os.path.exists(FORECAST_PATH):
        return jsonify({"error": "Forecast data not available"}), 404

    df = pd.read_csv(FORECAST_PATH)

    # Ensure required columns are present
    if 'predicted_voltage' not in df.columns or 'predicted_temperature' not in df.columns:
        return jsonify({"error": "Forecast file missing required columns"}), 500

    def stat(col):
        try:
            max_row = df.loc[df[col].idxmax()]
            min_row = df.loc[df[col].idxmin()]
            return {
                "max": {
                    "timestamp": str(max_row["timestamp"]),
                    "value": float(max_row[col])
                },
                "min": {
                    "timestamp": str(min_row["timestamp"]),
                    "value": float(min_row[col])
                }
            }
        except:
            return {"max": {}, "min": {}}

    return jsonify({
        "voltage": stat("predicted_voltage"),
        "temperature": stat("predicted_temperature")
    })

# ⚡ Live Current Extremes
@app.route('/current-extremes', methods=['GET'])
def current_extremes():
    if not os.path.exists(CSV_PATH):
        return jsonify({})
    df = pd.read_csv(CSV_PATH)
    max_row = df.loc[df['current'].idxmax()]
    min_row = df.loc[df['current'].idxmin()]
    return jsonify({
        "max_current": {"timestamp": str(max_row['timestamp']), "value": float(max_row['current'])},
        "min_current": {"timestamp": str(min_row['timestamp']), "value": float(min_row['current'])}
    })

# 📡 Live Sensor Extremes (power, current, voltage, temperature)
@app.route('/live-extremes', methods=['GET'])
def live_extremes():
    if not os.path.exists(CSV_PATH):
        return jsonify({})
    df = pd.read_csv(CSV_PATH)
    df['power'] = df['voltage'] * df['current']

    def stat(col):
        return {
            "min": {
                "value": float(df[col].min()),
                "timestamp": str(df.loc[df[col].idxmin(), 'timestamp'])
            },
            "max": {
                "value": float(df[col].max()),
                "timestamp": str(df.loc[df[col].idxmax(), 'timestamp'])
            }
        }

    return jsonify({
        "power": stat("power"),
        "voltage": stat("voltage"),
        "current": stat("current"),
        "temperature": stat("temperature")
    })

# 🚀 Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)