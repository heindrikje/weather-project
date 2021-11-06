function formatDate(date) {
  let now = new Date();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentDay = days[now.getDay()];
  let currentHour = now.getHours();
  let currentMinute = now.getMinutes();
  if (currentMinute <= 9) currentMinute = `0${currentMinute}`;
  let currentDate = now.getDate();
  if (currentDate <= 9) currentDate = `0${currentDate}`;
  let currentMonth = now.getMonth() + 1;
  if (currentMonth <= 9) currentMonth = `0${currentMonth}`;
  let currentYear = now.getFullYear();
  let displayDate = `${currentDay}, ${currentDate}.${currentMonth}.${currentYear} ${currentHour}:${currentMinute}`;
  return displayDate;
}

let presentDate = document.querySelector(".current-time");
presentDate.innerHTML = formatDate();

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row forecast-row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 forecast">
       <div class="forecast-day">
          ${formatForecastDay(forecastDay.dt)}
       </div>
       <div class="forecast-icon">
          <i class="wi wi-owm-${
            forecastDay.weather[0].id
          } fa-spin" style="-webkit-animation: fa-spin 6s infinite linear;
            animation: fa-spin 6s infinite linear;"></i>
       </div>
       <span class="forecast-temp-min">
          ${Math.round(forecastDay.temp.min)}°
       </span>
       <strong class="forecast-temp-max">${Math.round(
         forecastDay.temp.max
       )}°</strong>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let urlBase = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiKey = "203fa770242fcd2b9555d832a88ea567";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `${urlBase}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showWeatherConditions(response) {
  celsiusTemperature = response.data.main.temp;

  let temperature = Math.round(celsiusTemperature);
  let temperatureElement = document.querySelector("h1");
  temperatureElement.innerHTML = `${temperature}`;

  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;

  let weatherText = document.querySelector(".weather-text");
  weatherText.innerHTML = response.data.weather[0].description;

  let wind = document.querySelector("#wind-speed");
  wind.innerHTML = `${response.data.wind.speed} km/h`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.main.humidity}% Humidity`;

  let tempRange = document.querySelector("#temp-range");
  tempRange.innerHTML = `${Math.round(
    response.data.main.temp_min
  )} / ${Math.round(response.data.main.temp_max)}°C`;

  let iconId = response.data.weather[0].id;
  let weatherIcon = document.querySelector("#weather-icon");
  weatherIcon.innerHTML = `<i class="wi wi-owm-${iconId} fa-spin"
  style="-webkit-animation: fa-spin 6s infinite linear;
  animation: fa-spin 6s infinite linear;"></i>`;

  getForecast(response.data.coord);
}

function searchCity(city) {
  let urlBase = "https://api.openweathermap.org/data/2.5/weather?q=";
  let apiKey = "203fa770242fcd2b9555d832a88ea567";
  let apiUrl = `${urlBase}${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeatherConditions);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-bar").value;
  searchCity(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

function showCurrentCity(response) {
  let respondedCurrentCity = response.data.city;
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = respondedCurrentCity;
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "203fa770242fcd2b9555d832a88ea567";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeatherConditions);
  let reverseApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  axios.get(reverseApiUrl).then(showCurrentCity);
}
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert(
      "Sorry, we couldn't find your current position. Please type your city, instead."
    );
  }
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = celsiusTemperature * 1.8 + 32;
  let temperatureElement = document.querySelector(".current-temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".current-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let fahrenheitLink = document.querySelector("#unit-fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#unit-celsius");
celsiusLink.addEventListener("click", showCelsiusTemperature);

let celsiusTemperature = null;

searchCity("New York");
