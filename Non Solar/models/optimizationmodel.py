import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from joblib import dump

# Load historical data
data = pd.read_csv('data/historical_usage.csv')

# Create a synthetic production dataset for demonstration
# Replace this with your actual production data if available
production_data = pd.DataFrame({
    'temperature': data['temperature'],  # Use the same temperature data
    'wind_speed': data['wind_speed'],    # Use the same wind speed data
    'is_holiday': data['is_holiday'],    # Use the same holiday data
    'predicted_usage': data['usage'],     # Use the usage as a proxy for demand
    'solar': np.random.randint(1000, 5000, size=len(data)),  # Random values for solar
    'wind': np.random.randint(500, 3000, size=len(data)),     # Random values for wind
    'thermal': np.random.randint(5000, 10000, size=len(data)), # Random values for thermal
    'hydro': np.random.randint(1000, 3000, size=len(data)),    # Random values for hydro
})

# Train production optimization models
sources = ['solar', 'wind', 'thermal', 'hydro']
for source in sources:
    # Define features and target
    X = production_data[['temperature', 'wind_speed', 'is_holiday', 'predicted_usage']]
    y = production_data[source]
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train the model
    model = xgb.XGBRegressor()
    model.fit(X_train, y_train)
    
    # Save the model
    dump(model, f'models/{source}_production_model.joblib')
    print(f"✅ {source.capitalize()} production model saved.")
