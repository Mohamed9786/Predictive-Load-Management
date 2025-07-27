from flask import Flask

def create_app():
    app = Flask(__name__)

    from .routes import live_data, train_forecast, extremes
    app.register_blueprint(live_data.bp)
    app.register_blueprint(train_forecast.bp)
    app.register_blueprint(extremes.bp)

    return app
