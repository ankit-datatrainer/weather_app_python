const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const buttonText = document.getElementById("button-text");
const message = document.getElementById("message");
const weatherPanel = document.getElementById("weather-panel");

const locationName = document.getElementById("location-name");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weather-icon");
const searchButton = document.getElementById("search-button");

async function loadWeather(city) {
    if (!city) return;
    message.textContent = "";
    message.className = "message";
    buttonText.textContent = "Loading...";
    searchButton.disabled = true;

    try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "City not found");

        locationName.textContent = `${data.city}, ${data.country}`;
        temperature.textContent = data.temperature;
        feelsLike.textContent = data.feels_like;
        humidity.textContent = data.humidity;
        windSpeed.textContent = data.wind_speed;
        description.textContent = data.description;
        weatherIcon.src = data.icon;
        weatherIcon.alt = data.description;
        document.body.dataset.weather = data.description.toLowerCase();
        weatherPanel.classList.remove("hidden");
    } catch (err) {
        message.textContent = err.message;
        message.className = "message error";
        weatherPanel.classList.add("hidden");
    } finally {
        buttonText.textContent = "Search";
        searchButton.disabled = false;
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    loadWeather(cityInput.value.trim());
});

document.querySelectorAll(".city-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
        cityInput.value = btn.dataset.city;
        loadWeather(btn.dataset.city);
    });
});


loadWeather("Delhi");
