import pandas as pd
import numpy as np

# Generate all dates in 2024
dates = pd.date_range(start='2024-01-01', end='2024-12-31')
n = len(dates)

# Tamil Nadu official government holidays (YYYY-MM-DD format)
govt_holidays = [
    "2024-01-01", "2024-01-15", "2024-01-16", "2024-01-17", "2024-01-26",
    "2024-03-29", "2024-04-14", "2024-04-21", "2024-05-01", "2024-06-17",
    "2024-07-17", "2024-08-15", "2024-08-26", "2024-09-07", "2024-10-02",
    "2024-10-12", "2024-10-13", "2024-10-31", "2024-12-25"
]
govt_holiday_set = set(govt_holidays)

# Create base DataFrame
df = pd.DataFrame({
    'date': dates,
    'usage': np.random.randint(15000, 20000, size=n),
    'temperature': np.random.uniform(25, 40, size=n).round(1),
    'humidity': np.random.uniform(30, 100, size=n).round(1),
    'wind_speed': np.random.uniform(0, 15, size=n).round(1),
})

# Add day of week
df['day_of_week'] = df['date'].dt.dayofweek  # 6 = Sunday

# Flag Sundays as holidays
df['is_sunday'] = (df['day_of_week'] == 6).astype(int)

# Flag official holidays
df['is_govt_holiday'] = df['date'].astype(str).isin(govt_holiday_set).astype(int)

# Combine both into final holiday flag
df['is_holiday'] = ((df['is_sunday'] == 1) | (df['is_govt_holiday'] == 1)).astype(int)

# Drop helper columns
df.drop(columns=['is_sunday', 'is_govt_holiday'], inplace=True)

# Save to CSV
df.to_csv('data/historical_usage.csv', index=False)  # Use relative path
print("✅ Dataset saved with Sundays and Tamil Nadu holidays marked as holidays.")
