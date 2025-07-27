import joblib
from xgboost import XGBRegressor
import os
from app.config import MODEL_DIR

def train_models(df, features):
    models = {
        'predicted_power': ('power', XGBRegressor(n_estimators=100)),
        'predicted_voltage': ('voltage', XGBRegressor(n_estimators=100)),
        'predicted_current': ('current', XGBRegressor(n_estimators=100)),
        'predicted_temperature': ('temperature', XGBRegressor(n_estimators=100))
    }

    for label, (target, model) in models.items():
        model.fit(df[features], df[target])
        joblib.dump(model, os.path.join(MODEL_DIR, f"{label}.pkl"))

def load_models():
    labels = ['predicted_power', 'predicted_voltage', 'predicted_current', 'predicted_temperature']
    return {label: joblib.load(os.path.join(MODEL_DIR, f"{label}.pkl")) for label in labels}
