const apiKey = "1a977d6f95907bde08d204b76bc90856";
let currentTempCelsius = null;
let isCelsius = true;

document.addEventListener("DOMContentLoaded", () => {
  // Greet user based on time
  const hour = new Date().getHours();
  let greet = "Good evening";
  if (hour < 12) greet = "Good morning";
  else if (hour < 17) greet = "Good afternoon";
  document.getElementById("greeting").innerText = `${greet}! Get your weather update.`;

  // Toggle button event
  document.getElementById("toggleUnit").addEventListener("click", () => {
    if (currentTempCelsius === null) return;
    isCelsius = !isCelsius;
    const temp = isCelsius
      ? currentTempCelsius
      : (currentTempCelsius * 9) / 5 + 32;
    document.getElementById("temp").innerText = temp.toFixed(1);
    document.getElementById("unit").innerText = isCelsius ? "°C" : "°F";
    document.getElementById("toggleUnit").innerText = isCelsius
      ? "Switch to °F"
      : "Switch to °C";
  });
});

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  fetchWeatherData(`q=${city}`);
}

function getLocationWeather() {
  if (!navigator.geolocation) {
    showError("Geolocation not supported in this browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
    },
    () => showError("Unable to retrieve your location.")
  );
}

function fetchWeatherData(query) {
  showLoader(true);
  hideError();
  fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`)
    .then(res => {
      if (!res.ok) throw new Error("City not found.");
      return res.json();
    })
    .then(data => {
      showLoader(false);
      updateWeather(data);
    })
    .catch(err => {
      showLoader(false);
      showError(err.message);
    });
}

function updateWeather(data) {
  document.getElementById("weatherResult").classList.remove("hidden");
  document.getElementById("cityName").innerText = `${data.name}, ${data.sys.country}`;
  currentTempCelsius = data.main.temp;
  isCelsius = true;
  document.getElementById("temp").innerText = currentTempCelsius.toFixed(1);
  document.getElementById("unit").innerText = "°C";
  document.getElementById("desc").innerText = data.weather[0].description;
  document.getElementById("humidity").innerText = data.main.humidity;
  document.getElementById("wind").innerText = data.wind.speed;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function showLoader(show) {
  document.getElementById("loader").classList.toggle("hidden", !show);
  document.getElementById("weatherResult").classList.add("hidden");
}

function showError(msg) {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.innerText = msg;
  errorDiv.classList.remove("hidden");
}

function hideError() {
  document.getElementById("errorMessage").classList.add("hidden");
}
