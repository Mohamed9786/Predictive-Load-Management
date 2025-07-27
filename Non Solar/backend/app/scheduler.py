import schedule
import time
from forecast import predict_usage

def job():
    api_key = '42bbba2033584b85592374e77a060456'  # Replace with your API key
    forecast = predict_usage(api_key)
    print(forecast)

schedule.every().day.at("08:00").do(job)  # Schedule job every day at 8 AM

while True:
    schedule.run_pending()
    time.sleep(1)
