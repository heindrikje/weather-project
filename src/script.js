function formatDate(date) {
  let now = new Date();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentDay = days[now.getDay()];
  let currentHour = now.getHours();
  let currentMinute = now.getMinutes();
  if (currentMinute <= 9) currentMinute = "0" + currentMinute;
  let currentDate = now.getDate();
  if (currentDate <= 9) currentDate = "0" + currentDay;
  let currentMonth = now.getMonth() + 1;
  if (currentMonth <= 9) currentMonth = "0" + currentMonth;
  let currentYear = now.getFullYear();
  let displayDate = `${currentDay}, ${currentDate}.${currentMonth}.${currentYear} ${currentHour}:${currentMinute}`;
  return displayDate;
}

let presentDate = document.querySelector(".current-time");
presentDate.innerHTML = formatDate();

function showWeatherConditions(response) {
  let temperature = Math.round(response.data.main.temp);
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
}

function searchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-bar");
  let currentCity = document.querySelector("#current-city");
  if (cityInput.value) {
    let apiKey = "203fa770242fcd2b9555d832a88ea567";
    let unit = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(showWeatherConditions);
  } else {
    currentCity.innerHTML = "Searching...";
    alert("Please type a city");
  }
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

function changeUnitCtoF(event) {
  let currentTemperatureinF = document.querySelector("h1");
  currentTemperatureinF.innerHTML = `🌤 59`;
}

function changeUnitFtoC(event) {
  let currentTemperatureinC = document.querySelector("h1");
  currentTemperatureinC.innerHTML = `🌤 23`;
}

let unitCelsius = document.querySelector("#unit-celsius");
unitCelsius.addEventListener("click", changeUnitFtoC);

let unitFahrenheit = document.querySelector("#unit-fahrenheit");
unitFahrenheit.addEventListener("click", changeUnitCtoF);

function showCurrentCity(response) {
  let respondedCurrentCity = response.data.city;
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = respondedCurrentCity;
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "203fa770242fcd2b9555d832a88ea567";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showWeatherConditions);
  let reverseApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  axios.get(reverseApiUrl).then(showCurrentCity);
}
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert(
      "Sorry, we couldn't find your current position. Please type your city, instead"
    );
  }
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

// Hintergrund + icons: abhängig von Wetterlage
// ein paar Städte als Bsp.
// Current Location Button mit in die Reihe
