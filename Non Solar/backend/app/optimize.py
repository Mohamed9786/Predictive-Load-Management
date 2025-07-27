import pandas as pd
import xgboost as xgb
from joblib import load
from forecast import predict_usage
from weather_api import fetch_live_weather
from holiday_check import is_today_holiday

def predict_production(api_key):
    weather_data = fetch_live_weather(api_key)
    temperature = weather_data['main']['temp']
    wind_speed = weather_data['wind']['speed']
    is_holiday_today = is_today_holiday()
    
    predicted_usage = predict_usage(api_key)
    
    production_input = pd.DataFrame({
        'temperature': [temperature],
        'wind_speed': [wind_speed],
        'is_holiday': [int(is_holiday_today)],
        'predicted_usage': [predicted_usage]
    })
    
    sources = ['solar', 'wind', 'thermal', 'hydro']
    production_mix = {}
    
    for source in sources:
        model = load(f'C:/Users/HP/Python/Projects/TANSAM/models/{source}_production_model.joblib')
        production_mix[source] = model.predict(production_input)[0]
    
    return production_mix
