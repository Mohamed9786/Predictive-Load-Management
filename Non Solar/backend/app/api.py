from flask import Flask, jsonify, send_from_directory
from forecast import predict_usage, predict_production
from weather_api import fetch_live_weather
from holiday_check import is_today_holiday
from datetime import datetime, timedelta
import math
import random
app = Flask(__name__, static_folder='frontend', static_url_path='')

from datetime import datetime, timedelta
from flask import jsonify

@app.route('/forecast-14day', methods=['GET'])
def forecast_14day():
    today = datetime.today()
    start_date = today - timedelta(days=6)  # 6 days back + today + 7 ahead
    forecast = []

    for i in range(14):
        date = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')

        # Simulate realistic-like behavior
        solar = 2800 + 500 * math.sin((i / 14) * 2 * math.pi) + random.uniform(-100, 100)
        wind = 1900 + 200 * math.cos((i / 5) * math.pi) + random.uniform(-150, 150)
        thermal = 5200 + random.uniform(-100, 100)
        hydro = 1600 + 50 * math.sin((i / 7) * 2 * math.pi) + random.uniform(-30, 30)

        forecast.append({
            "date": date,
            "hydro": round(hydro, 2),
            "solar": round(solar, 2),
            "thermal": round(thermal, 2),
            "wind": round(wind, 2)
        })

    return jsonify(forecast)


@app.route('/predict-today', methods=['GET'])
def predict_today():
    api_key = '42bbba2033584b85592374e77a060456'

    # Predict usage
    predicted_usage = predict_usage(api_key)
    
    # Predict production
    production_mix_raw = predict_production(api_key)

    # Convert all production values to float
    production_mix = {k: float(v) for k, v in production_mix_raw.items()}
    
    # Fetch weather
    weather_data = fetch_live_weather(api_key)
    temperature = float(weather_data['main']['temp'])
    humidity = int(weather_data['main']['humidity'])
    wind_speed = float(weather_data['wind']['speed'])

    # Holiday
    is_holiday = bool(is_today_holiday())

    return jsonify({
        "predicted_usage": float(predicted_usage),  # ✅ Convert to Python float
        "weather": {
            "temp": temperature,
            "humidity": humidity,
            "wind_speed": wind_speed
        },
        "is_holiday": is_holiday,
        "production_mix": production_mix
    })

@app.route('/')
def serve_frontend():
    return send_from_directory('frontend', 'index.html')

if __name__ == '__main__':
    app.run(debug=True,port=8080) 

