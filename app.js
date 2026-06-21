const API_KEY = "9cf7eb1a9d8c86121d093d13e407f6ec";

async function checkWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log(data);

    if (data.cod != 200) {
        document.getElementById("error-message").textContent = data.message;
        return;
    }

    document.getElementById("city-name").textContent = data.name;
    document.getElementById("temperature").textContent =
        `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").textContent =
        data.weather[0].description;

    document.getElementById("weather-info").style.display = "block";
}

document.getElementById("search-btn").addEventListener("click", () => {
    checkWeather(document.getElementById("city-input").value);
});