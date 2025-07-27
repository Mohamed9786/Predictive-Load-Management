from flask import Flask

def create_app():
    app = Flask(__name__)

    from app.routes.live_data import live_data_bp
    from app.routes.train_forecast import forecast_bp
    from app.routes.extremes import extremes_bp

    app.register_blueprint(live_data_bp)
    app.register_blueprint(forecast_bp)
    app.register_blueprint(extremes_bp)

    @app.route('/')
    def home():
        return "✅ Flask backend is running"

    return app
