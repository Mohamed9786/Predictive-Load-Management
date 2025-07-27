import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from joblib import dump

# Load historical data
data = pd.read_csv('data/historical_usage.csv')

# Create lag features for usage
data['lag1_usage'] = data['usage'].shift(1)
data['lag7_usage'] = data['usage'].shift(7)
data.dropna(inplace=True)  # Drop rows with NaN values

# Define features and target
features = ['temperature', 'humidity', 'wind_speed', 'day_of_week', 'is_holiday', 'lag1_usage', 'lag7_usage']
X = data[features]
y = data['usage']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
usage_model = xgb.XGBRegressor()
usage_model.fit(X_train, y_train)

# Save the model
dump(usage_model, 'models/usage_forecasting_model.joblib')
print("✅ Usage forecasting model saved.")
