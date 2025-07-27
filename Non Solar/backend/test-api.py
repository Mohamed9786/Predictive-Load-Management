import requests

api_key = "42bbba2033584b85592374e77a060456"  # Your exact key
city = "Chennai"
url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

print(f"Requesting: {url}")
response = requests.get(url)

try:
    data = response.json()
except Exception as e:
    print("⚠️ Failed to parse response as JSON:", e)
    print(response.text)
    exit()

if response.status_code == 200:
    print("✅ Success:")
    print("Temperature:", data['main']['temp'], "°C")
    print("Humidity:", data['main']['humidity'], "%")
    print("Wind Speed:", data['wind']['speed'], "m/s")
else:
    print("❌ Error:", data)
