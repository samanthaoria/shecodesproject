let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatHours(timestamp) {
  let date = timestamp.getDate();
  let hours = timestamp.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = timestamp.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayWeatherNow(response) {
  console.log(response.data);

  document.querySelector("#city").innerHTML = response.data.name;

  let now = new Date();
  let currentDate = document.querySelector("#current-date");

  let date = now.getDate();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let month = months[now.getMonth()];
  let day = days[now.getDay()];
  let year = now.getFullYear();
  currentDate.innerHTML = `${day} - ${month} ${date} ${year}, ${hours}:${minutes}`;
  document.querySelector("#temperature-value").innerHTML = Math.round(
    response.data.main.temp
  );

  celsiusTemperature = response.data.main.temp;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#result-sky-condition").innerHTML =
    response.data.weather[0].main;

  document.querySelector("#current-high").innerHTML = `${Math.round(
    response.data.main.temp_max
  )}°C `;

  document.querySelector("#current-low").innerHTML = `${Math.round(
    response.data.main.temp_min
  )}°C`;

  document.querySelector("#result-feels-like").innerHTML = `${Math.round(
    response.data.main.feels_like
  )}°C`;

  const iconCurrent = document.querySelector("#icon-current");
  iconCurrent.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let i = 0; i < 6; i++) {
    forecast = response.data.list[i];
    forecastElement.innerHTML += `<div class="col-2">
     ${formatHours(new Date(forecast.dt * 1000))} 
     <div class="img-forecast"> 
      <img src="http://openweathermap.org/img/wn/${
        forecast.weather[0].icon
      }@2x.png"
      />
      </div>
        <div class="high-low-temperature italic light-blue">
            <p> H: ${Math.round(forecast.main.temp_max)}°C 
            / L: ${Math.round(forecast.main.temp_min)}°C
    </p>
        </div>
    </div>`;
    // console.log(forecast);
  }
}

function searchCity(city) {
  const apiKey = "d09585e76f8833f9d740d8b7cf3fe689";
  let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(urlApi).then(displayWeatherNow);

  urlApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(urlApi).then(displayForecast);
}
function handleSubmit(event) {
  event.preventDefault();
  const city = document.querySelector("#city-search").value;
  searchCity(city);
}

const form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function searchLocation(position) {
  const apiKey = "d09585e76f8833f9d740d8b7cf3fe689";
  const urlApi = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(urlApi).then(displayWeatherNow);
}

function currentLocationWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  const currentTemperatureInFahrenheit = (celsiusTemperature * 9) / 5 + 32;
  linkCelsius.classList.remove("active");
  linkFahrenheit.classList.add("active");
  const currentTemperature = document.querySelector("#temperature-value");
  currentTemperature.innerHTML = Math.round(currentTemperatureInFahrenheit);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  linkCelsius.classList.add("active");
  linkFahrenheit.classList.remove("active");
  const currentTemperature = document.querySelector("#temperature-value");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

const linkFahrenheit = document.querySelector("#link-fahrenheit");
linkFahrenheit.addEventListener("click", displayFahrenheitTemperature);

const linkCelsius = document.querySelector("#link-celsius");
linkCelsius.addEventListener("click", displayCelsiusTemperature);

const currentLocation = document.querySelector("#btn-current");
currentLocation.addEventListener("click", currentLocationWeather);

searchCity("Amsterdam");
