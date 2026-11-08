import os
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

load_dotenv()

app = Flask(__name__)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route("/") 
def home():
    return render_template("index.html")

@app.route("/api/weather")
def get_weather():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({"error": "Please enter a city name."}), 400

    if not OPENWEATHER_API_KEY:
        return jsonify({"error": "Weather service is not configured."}), 503

    try:
        response = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "q": city,
                "appid": OPENWEATHER_API_KEY,
                "units": "metric",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
    except requests.Timeout:
        return jsonify({"error": "The weather service timed out. Please try again."}), 504
    except requests.RequestException:
        try:
            data = response.json()
            message = data.get("message", "Unable to fetch weather data.")
        except (ValueError, UnboundLocalError):
            message = "Unable to fetch weather data."
        return jsonify({"error": message.capitalize()}), getattr(response, "status_code", 502)
    except ValueError:
        return jsonify({"error": "The weather service returned invalid data."}), 502

    return jsonify({
        "city": data["name"],
        "country": data["sys"].get("country", ""),
        "temperature": round(data["main"]["temp"]),
        "feels_like": round(data["main"]["feels_like"]),
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"].title(),
        "icon": f"https://openweathermap.org/img/wn/{data['weather'][0]['icon']}@2x.png"
    })

if __name__ == "__main__":
    app.run(debug=True)