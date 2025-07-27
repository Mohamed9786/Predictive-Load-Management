import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from .model_utils import load_models

def generate_forecast(df, features):
    models = load_models()
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

    for label, model in models.items():
        future_df[label] = model.predict(future_df[features])

    return future_df
