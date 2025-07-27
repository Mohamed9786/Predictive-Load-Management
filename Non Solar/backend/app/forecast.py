import pandas as pd
import xgboost as xgb
import datetime
from joblib import load
from weather_api import fetch_live_weather
from holiday_check import is_today_holiday

def load_historical_data():
    return pd.read_csv('D:\\Tansam\\backend\\data\\historical_usage.csv')

def preprocess_usage_data(data):
    data['lag1_usage'] = data['usage'].shift(1)
    data['lag7_usage'] = data['usage'].shift(7)
    data.dropna(inplace=True)
    return data

def predict_usage(api_key):
    weather_data = fetch_live_weather(api_key)
    temperature = weather_data['main']['temp']
    humidity = weather_data['main']['humidity']
    wind_speed = weather_data['wind']['speed']
    
    is_holiday_today = is_today_holiday()
    
    past_usage_data = load_historical_data()
    last_day_data = past_usage_data.iloc[-1]
    
    input_data = pd.DataFrame({
        'temperature': [temperature],
        'humidity': [humidity],
        'wind_speed': [wind_speed],
        'day_of_week': [datetime.datetime.now().weekday()],
        'is_holiday': [int(is_holiday_today)],
        'lag1_usage': [last_day_data['usage']],
        'lag7_usage': [past_usage_data['usage'].shift(7).iloc[-1]]
    })

    usage_model = load('D:\\Tansam\\models\\usage_forecasting_model.joblib')
    predicted_usage = usage_model.predict(input_data)

    
    return predicted_usage[0]

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
        model = load(f'D:/Tansam/models/{source}_production_model.joblib')
        production_mix[source] = model.predict(production_input)[0]
    
    return production_mix
