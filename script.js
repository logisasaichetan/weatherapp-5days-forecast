const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;
function getWeatherData(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=c1518ea45a928df704dadd58f0d3222d&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weather = document.querySelector(".weather");
      const temp = data.main.temp;
      const description = data.weather[0].description;
      const icon = data.weather[0].icon;

      weather.innerHTML = `
      <h2>current weather</h2>
        <p>${formattedDate}</p>
        <p> ${data.name}</p>
        <p>${description}</p>
        <img src=${"https://openweathermap.org/img/wn/" + icon + "@2x.png"}>
        <p>Temperature: ${temp}c</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} km/h</p>
      `;
    })
    .catch((error) => console.error(error));
}

function getForecastData(location) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=c1518ea45a928df704dadd58f0d3222d&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const forecast = document.querySelector(".forecast");
      forecast.innerHTML = "";

      for (let i = 0; i < data.list.length; i += 8) {
        const day = new Date(data.list[i].dt_txt).toLocaleDateString("en-US", {
          weekday: "short",
        });
        const temp = data.list[i].main.temp;
        const icon = data.list[i].weather[0].icon;

        forecast.innerHTML += `
        <div class='card'>
          <h3>${day}</h3> 
          
          <p>${temp}°C</p>
          <img src=${"https://openweathermap.org/img/wn/" + icon + "@2x.png"}>
          <p>Temperature: ${temp}c</p>
          <p>Humidity: ${data.list[i].main.humidity}%</p>
          <p>Wind Speed: ${data.list[i].wind.speed} km/h</p>
          
          </div>
        `;
      }
    })
    .catch((error) => console.error(error));
}
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Fetch weather data from weather API using the user's location
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=c1518ea45a928df704dadd58f0d3222d&units=metric#`
    )
      .then((response) => response.json())
      .then((data) => {
        getWeatherData(data.name);
        getForecastData(data.name);
      })
      .catch((error) => {
        console.log(error);
      });
  });
} else {
  setDefaultLocation();
}
function setDefaultLocation() {
  const defaultLocation = "Delhi";
  getWeatherData(defaultLocation);
  getForecastData(defaultLocation);
}

const searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", () => {
  const searchInput = document.querySelector("#search-input");
  const location = searchInput.value;
  getWeatherData(location);
  getForecastData(location);
});
