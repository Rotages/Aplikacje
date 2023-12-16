function getWeather() {
  const addressInput = document.getElementById("addressInput");
  const cityName = addressInput.value;

  document.getElementById("currentWeather").innerHTML = "";
  document.getElementById("forecast").innerHTML = "";

  const xmlReqS = new XMLHttpRequest();
  const keyApi = "7ded80d91f2b280ec979100cc8bbba94";
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${keyApi}`;
  xmlReqS.open("GET", currentWeatherUrl, true);

  xmlReqS.onload = function () {
    if (xmlReqS.status >= 200 && xmlReqS.status < 300) {
      const currentWeatherData = JSON.parse(xmlReqS.responseText);
      displayCurrentWeather(currentWeatherData);
    } else {
      console.error("Błąd");
    }
  };

  xmlReqS.send();

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${keyApi}`;

  fetch(forecastUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network is bad, status is here: ${response.status}`
        );
      }
      return response.json();
    })
    .then((forecastData) => {
      console.log(forecastData);
      displayForecast(forecastData);
    })
    .catch((error) => {
      console.error("Błąd:", error);
    });
}

function displayCurrentWeather(data) {
  const currentWeatherDiv = document.getElementById("currentWeather");
  const tempCelsius = (data.main.temp - 273.15).toFixed(1);
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

  currentWeatherDiv.innerHTML = `
        <h2>Current weather in ${data.name}</h2>
        <p>Temperature: ${tempCelsius} &deg;C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind speed: ${data.wind.speed} m/s</p>
      `;
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "<h2>Forecast for 5 days of weather:</h2>";

  for (let i = 0; i < data.list.length; i += 8) {
    const dayData = data.list[i];
    const date = new Date(dayData.dt_txt);
    const dayOfWeek = getDayOfWeek(date.getDay());

    const dayForecastDiv = document.createElement("div");
    dayForecastDiv.classList.add("dayForecast");

    dayForecastDiv.innerHTML = `<h3>${dayOfWeek}</h3>`;

    for (let j = i; j < i + 8; j++) {
      const hourData = data.list[j];
      const hour = new Date(hourData.dt_txt).getHours();

      if (hour === 0 || hour === 12 || hour === 18) {
        const tempCelsius = (hourData.main.temp - 273.15).toFixed(1);
        const humidity = hourData.main.humidity;
        const windSpeed = hourData.wind.speed;
        const iconCode = hourData.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

        const hourlyForecastDiv = document.createElement("div");
        hourlyForecastDiv.classList.add("hourlyForecast");

        hourlyForecastDiv.innerHTML = `
            <p>${hour}:00</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperature: ${tempCelsius} &deg;C</p>
            <p>Weather: ${hourData.weather[0].description}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind speed: ${windSpeed} m/s</p>
          `;

        dayForecastDiv.appendChild(hourlyForecastDiv);
      }
    }

    forecastDiv.appendChild(dayForecastDiv);
  }
}

function getDayOfWeek(dayIndex) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[dayIndex];
}