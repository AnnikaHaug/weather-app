//City Form + Date
function eventCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");

  let city = cityInput.value.trim();
  let units = "metric";
  let apiKey = "91b45ef981adb0448983aaf0bd46bb46";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

function doItForTheCity(city, country, timezone) {
  let inputCity = document.querySelector("#current-city");
  let cityTime = document.querySelector("#current-time");
  let cityDate = document.querySelector("#current-date");

  let now = new Date();
  now.setSeconds(now.getSeconds() + timezone + now.getTimezoneOffset() * 60);
  let hourTime = now.getHours();
  if (hourTime < 10) {
    hourTime = `0${hourTime}`;
  }
  let minutesTime = now.getMinutes();
  if (minutesTime < 10) {
    minutesTime = `0${minutesTime}`;
  }
  let year = now.getFullYear();
  let date = now.getDate();
  if (date < 10) {
    date = `0${date}`;
  }
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];
  let months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  let month = months[now.getMonth()];

  inputCity.innerHTML = `${
    city.slice(0, 1).toUpperCase() + city.slice(1)
  }, ${country}`;
  cityTime.innerHTML = `${day}, ${hourTime}:${minutesTime}`;
  cityDate.innerHTML = `${date}.${month}.${year}`;
}

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", eventCity);
doItForTheCity("Stuttgart", "DE", 0);

//Forecast
function formatDay(timestamp){
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}


function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
   if (index < 6){
    forecastHTML =
      forecastHTML +
      `
  <div class="col-2">
    <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
    <img
      src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
      alt=""
      class="upcoming-weather-icon"
    />
    <div class_="weather-forecast-temperature">
      <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span>
      <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
    </div>
  </div>`;
  }});

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

//Celsius vs Fahrenheit
function celsiusClick(event) {
  event.preventDefault();
  let degrees = document.querySelector("#current-degrees");

  unitCelsius.classList.add("active");
  unitFahrenheit.classList.remove("active");

  degrees.innerHTML = `${Math.round(celsiusTemperature)} `;
}

let celsiusTemperature = null;
let unitCelsius = document.querySelector("#celsius");
unitCelsius.addEventListener("click", celsiusClick);

function fahrenheitClick(event) {
  event.preventDefault();
  let degrees = document.querySelector("#current-degrees");

  unitCelsius.classList.remove("active");
  unitFahrenheit.classList.add("active");

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  degrees.innerHTML = `${Math.round(fahrenheitTemperature)} `;
}

let unitFahrenheit = document.querySelector("#fahrenheit");
unitFahrenheit.addEventListener("click", fahrenheitClick);

//API Call
function getForecast(coordinates){
  console.log(coordinates);
  let apiKey = "91b45ef981adb0448983aaf0bd46bb46";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  celsiusTemperature = Math.round(response.data.main.temp);

  let temperature = Math.round(response.data.main.temp);
  let temp = document.querySelector("#current-degrees");
  temp.innerHTML = `${temperature} `;

  let weatherIcon = document.querySelector("#weather-icon");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  let currentHumidity = document.querySelector("#hum");
  currentHumidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let currentWind = document.querySelector("#wind");
  currentWind.innerHTML = `Wind: ${response.data.wind.speed} km/h`;

  let weatherCondition = document.querySelector("#weather-condition");
  weatherCondition.innerHTML = response.data.weather[0].main;

  doItForTheCity(
    response.data.name,
    response.data.sys.country,
    response.data.timezone
  );

  getForecast(response.data.coord);
}

function currentCity() {
  function showCurrentCity(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let units = "metric";
    let apiKey = "91b45ef981adb0448983aaf0bd46bb46";
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
    let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showTemperature);
  }

  navigator.geolocation.getCurrentPosition(showCurrentCity);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", currentCity);
