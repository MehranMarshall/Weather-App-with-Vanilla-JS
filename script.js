const cityInput = document.querySelector(".search");
const searchBtn = document.querySelector(".submitBtn");
const error = document.querySelector(".error");
const API_KEY = "01101de0d94cf883037ae342e6d43375";

function createWeatherCard(weatherItem) {
  const temperatureDisplay = document.querySelector(".tempDeg");
  const weatherIcon = document.querySelector(".weatherIcon");
  const cityDisplay = document.querySelector(".city");
  const dateDisplay = document.querySelector(".date");
  const tempMax = document.querySelector(".temp");
  const weatherConditions = document.querySelector(".weatherConditions");

  cityDisplay.innerHTML = cityInput.value;
  weatherConditions.innerHTML = weatherItem.weather[0].description;
  dateDisplay.innerHTML = weatherItem.dt_txt.split(" ")[0];
  temperatureDisplay.innerHTML = `${(weatherItem.main.temp - 273.15).toFixed(
    0
  )}°C`;
  tempMax.innerText = temperatureDisplay.innerHTML = `${(
    weatherItem.main.temp_max - 273.15
  ).toFixed(0)}°C`;
  //weatherIcon.src = `https://https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`;
}

function getWeatherDetails(cityName, lat, lon) {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      // filter the forecast to get only one forecast perday
      const uniqueForecastDate = [];
      const fiveDaysForecast = data.list.filter((forecat) => {
        const forecastDate = new Date(forecat.dt_txt[0]).getDate();
        if (!uniqueForecastDate.includes(forecastDate)) {
          return uniqueForecastDate.push(forecastDate);
        }
      });

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherItem) => {
        createWeatherCard(weatherItem);
      });
    })
    .catch((err) => console.log(err));
}

searchBtn.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (!cityName) {
    error.innerHTML = "Enter a City Name Please!";
  }
  const API = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  // Get Entered City Cordinates (latitude, longitude and name) from the API Response
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) {
        error.innerHTML = "Enter a Valid City Name Please!";
      }
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch((err) => console.log(err));
  document.querySelector(".infos").classList.remove("disable");
});
