import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

CSV_PATH = os.path.join(BASE_DIR, '..', 'data', 'solar_data_log.csv')
FORECAST_PATH = os.path.join(BASE_DIR, '..', 'data', 'solar_5day_forecast.csv')

MODEL_DIR = os.path.join(BASE_DIR, '..', 'models')
