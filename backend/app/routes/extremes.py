from flask import Blueprint, jsonify
import pandas as pd
import os
from app.config import CSV_PATH, FORECAST_PATH

bp = Blueprint('extremes', __name__)

@bp.route('/forecast-extremes', methods=['GET'])
def forecast_extremes():
    if not os.path.exists(FORECAST_PATH):
        return jsonify({})
    df = pd.read_csv(FORECAST_PATH)
    max_row = df.loc[df['predicted_power'].idxmax()]
    min_row = df.loc[df['predicted_power'].idxmin()]
    return jsonify({
        "max_predicted_power": {"timestamp": str(max_row['timestamp']), "value": float(max_row['predicted_power'])},
        "min_predicted_power": {"timestamp": str(min_row['timestamp']), "value": float(min_row['predicted_power'])}
    })

@bp.route('/forecast-extremes-full', methods=['GET'])
def forecast_extremes_full():
    if not os.path.exists(FORECAST_PATH):
        return jsonify({"error": "Forecast data not available"}), 404

    df = pd.read_csv(FORECAST_PATH)

    def stat(col):
        try:
            max_row = df.loc[df[col].idxmax()]
            min_row = df.loc[df[col].idxmin()]
            return {
                "max": {"timestamp": str(max_row["timestamp"]), "value": float(max_row[col])},
                "min": {"timestamp": str(min_row["timestamp"]), "value": float(min_row[col])}
            }
        except:
            return {"max": {}, "min": {}}

    return jsonify({
        "voltage": stat("predicted_voltage"),
        "temperature": stat("predicted_temperature")
    })

@bp.route('/current-extremes', methods=['GET'])
@bp.route('/live-extremes', methods=['GET'])
def live_extremes():
    if not os.path.exists(CSV_PATH):
        return jsonify({})
    df = pd.read_csv(CSV_PATH)
    df['power'] = df['voltage'] * df['current']

    def stat(col):
        return {
            "min": {
                "value": float(df[col].min()),
                "timestamp": str(df.loc[df[col].idxmin(), 'timestamp'])
            },
            "max": {
                "value": float(df[col].max()),
                "timestamp": str(df.loc[df[col].idxmax(), 'timestamp'])
            }
        }

    return jsonify({
        "power": stat("power"),
        "voltage": stat("voltage"),
        "current": stat("current"),
        "temperature": stat("temperature")
    })
