
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
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
    },
    () => {
      const latitude = 28.6667; // Delhi's latitude
      const longitude =  77.2167; // Delhi's longitude

      // Fetch weather data from weather API using Delhi's coordinates
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
    }
  );
}

const searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", () => {
  const searchInput = document.querySelector("#search-input");
  const location = searchInput.value;
  getWeatherData(location);
  getForecastData(location);
});

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


let forecastChart;

// Inside the getForecastData function
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

      // Update the chart if it has already been initialized
      if (forecastChart) {
        // Update chart data
        forecastChart.data.labels = data.list.map(item => item.dt_txt);
        forecastChart.data.datasets[0].data = data.list.map(item => item.main.temp);
        forecastChart.data.datasets[1].data = data.list.map(item => item.main.humidity);

        // Update the chart
        forecastChart.update();
      } else {
        // Create chart using Chart.js if it's not already initialized
        const ctx = document.getElementById('myChart').getContext('2d');
        forecastChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.list.map(item => item.dt_txt),
            datasets: [{
              label: 'Temperature',
              data: data.list.map(item => item.main.temp),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              yAxisID: 'temperature'
            }, {
              label: 'Humidity',
              data: data.list.map(item => item.main.humidity),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'humidity'
            }]
          },
          options: {
            scales: {
              yAxes: [{
                id: 'temperature',
                type: 'linear',
                position: 'left',
                ticks: {
                  beginAtZero: true
                }
              }, {
                id: 'humidity',
                type: 'linear',
                position: 'right',
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      }
    })
    .catch((error) => console.error(error));
}


