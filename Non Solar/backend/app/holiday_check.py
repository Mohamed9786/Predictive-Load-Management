import datetime

def is_today_holiday():
    today = datetime.datetime.now().date()
    holidays = [datetime.date(2023, 1, 1), datetime.date(2023, 8, 15)]  # Example holidays
    return today in holidays

