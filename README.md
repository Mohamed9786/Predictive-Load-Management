# ⚡ Solar Energy Data Logger & Forecasting Dashboard

This is a full-stack project built to **log**, **monitor**, and **forecast** solar energy data using an ESP32 or simulator. It includes a Flask backend with machine learning (XGBoost) for forecasting and a React + Vite + Tailwind frontend for visualization.

---

## 📁 Project Structure

```
.
├── backend
│   ├── app/
│   │   ├── routes/                # All Flask routes
│   │   ├── services/              # Data handling, model training, forecasting
│   │   ├── __init__.py            # Initializes the app
│   │   └── config.py              # Centralized file paths and settings
│   ├── data/                      # CSV log and forecast data
│   ├── models/                    # Trained XGBoost models (.pkl)
│   ├── scripts/                   # Data generator (optional)
│   ├── run.py                     # Entry point to run Flask
│   └── requirements.txt
│
└── frontend
    ├── src/
    │   ├── components/            # Dashboard, Charts, Layout
    │   └── main.jsx, index.css
    ├── dist/                      # Production build output
    ├── index.html, package.json
    └── vite.config.js, tailwind.config.js
```

## 📸 Demo video

[![Watch Demo](https://img.shields.io/badge/Click%20to-Watch%20Demo-red?style=for-the-badge&logo=google-drive)](https://drive.google.com/file/d/1AEH8xbykdbH2d-y6XSxLDNdetJTymZmR/view?usp=sharing)

---

## 🚀 Features

### ✅ Backend (Flask)
- `/solar-data`: Accepts live solar data from ESP32 (POST)
- `/live-sensor-data`: Returns latest 50 data points (GET)
- `/train-5day`: Trains XGBoost models and forecasts 5-day solar data (POST)
- `/forecast-5days`: Get full 5-day forecast (GET)
- `/forecast-extremes`: Get max/min forecasted power (GET)
- `/forecast-extremes-full`: Voltage + Temperature extremes (GET)
- `/live-extremes`: Live power, voltage, current, temperature extremes (GET)
- `/current-extremes`: Max/min current live (GET)

### ✅ Frontend (React + Vite + Tailwind)
- 📊 Realtime monitoring of voltage, current, temperature
- 🔮 Forecast plots of solar power
- 📈 Highlight max/min predicted values
- 🖼️ Responsive UI with Sidebar Layout

---

## ⚙️ Setup

### 1️⃣ Backend

#### ▶ Install dependencies
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

#### ▶ Run Flask server
```bash
python run.py
```

Runs on `http://localhost:5000`

---

### 2️⃣ Frontend

#### ▶ Install and run
```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

## 🧪 Simulate ESP32 POST
Use the included script or a tool like `curl` or Postman:
```bash
curl -X POST http://localhost:5000/solar-data \
     -H "Content-Type: application/json" \
     -d '{"voltage": 12.5, "current": 2.1, "temperature": 30.7}'
```

---

## 💡 Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Flask, Pandas, XGBoost, joblib
- **Data Format**: CSV
- **Modeling**: 4 XGBoost models trained on past solar data
- **Communication**: JSON APIs between ESP32 (or frontend) ↔ Flask

---

## 📌 Folder Paths Used

| File                        | Path                                |
|-----------------------------|-------------------------------------|
| Solar Log CSV              | `backend/data/solar_data_log.csv`  |
| 5-Day Forecast CSV         | `backend/data/solar_5day_forecast.csv` |
| Model Pickles              | `backend/models/`                   |

---

## 📈 Sample Forecasted Data (5-day)
Each entry includes:
- `timestamp`
- `predicted_power`
- `predicted_voltage`
- `predicted_current`
- `predicted_temperature`

---

## 🧠 Future Enhancements

- ⏱️ Auto-refresh frontend dashboard
- ☁️ Integrate with AWS IoT or MQTT
- 🧪 Add unit testing using `pytest`
- 📬 Email alert system for power anomalies
- 🌐 Dockerize for easy deployment
- 📉 Export CSV from frontend

---

## 📜 License

This project is open-source and free to use under the [MIT License](LICENSE).
