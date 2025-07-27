import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Simulate 7 days of hourly solar panel data
start_time = datetime.now() - timedelta(days=7)
rows = []

for i in range(7 * 24):  # 7 days * 24 hours
    ts = start_time + timedelta(hours=i)
    hour = ts.hour

    # Simulate sunlight effect
    if 6 <= hour <= 18:  # Daytime
        voltage = round(np.random.uniform(5.5, 6.2), 2)
        current = round(np.random.uniform(0.12, 0.22), 3)
    else:  # Night
        voltage = round(np.random.uniform(0.0, 1.0), 2)
        current = round(np.random.uniform(0.0, 0.02), 3)

    temperature = round(np.random.uniform(28, 36), 1)

    rows.append({
        "timestamp": ts.isoformat(),
        "voltage": voltage,
        "current": current,
        "temperature": temperature
    })

df = pd.DataFrame(rows)
df.to_csv("solar_data_log.csv", index=False)
print("✅ Simulated solar_data_log.csv created with 7 days of data.")
