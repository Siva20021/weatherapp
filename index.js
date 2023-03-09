const apiKey = "Replace it with your api key";
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};
function logout() {
  // perform any necessary cleanup or reset actions
  // such as clearing user data from local storage or resetting global variables

  // redirect the user to the login page
  window.location.href = "login.html";
}

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const currentWeather = document.getElementById("myLocationBtn");
const url = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

async function getWeatherByLocation(city) {
  const resp = await fetch(url(city), {
    origin: "cros",
  });
  const respData = await resp.json();

  addWeatherToPage(respData);
  console.log(respData);
}
const myLocationBtn = document.getElementById("myLocationBtn");
// function handleOpen() {
//   <Modal>
//     <h1>Hello</h1>
//   </Modal>;
// }
myLocationBtn.addEventListener("click", () => {
  getWeatherByMyLocation();
});
function getWeatherByMyLocation() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );
    const respData = await resp.json();
    // addWeatherToPage(respData);
    const temp = Ktoc(respData.main.temp);

    // Update the currentWeather element's text content with the temperature in Celsius
    currentWeather.textContent = temp + "°C";
  });
}

window.addEventListener("load", function () {
  // Select a random number between 1 and 12
  var randomBg = Math.floor(Math.random() * 12) + 1;

  // Set the body background to the random image
  document.body.style.backgroundImage =
    "url('backgrounds/bg-" + randomBg + ".jpg')";
});

function addWeatherToPage(data) {
  // handle error case where main property is not defined
  if (!data.main) {
    const weatherContainer = document.getElementById("weather-container");
    weatherContainer.innerHTML = "<div class='weather'>City not found</div>";
    return;
  }

  const temp = Ktoc(data.main.temp);

  const weatherContainer = document.getElementById("weather-container");
  weatherContainer.innerHTML = `
    <div class="weather">
      <h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" />
      </h2>
      <small>${data.weather[0].main}</small>
      <br/>
      <span>humidity:${data.main.humidity}</span>
      <span>wind:${data.wind.speed}</span>



      
    
    
    </div>
  `;
}

function Ktoc(K) {
  return Math.floor(K - 273.15);
}
const weatherForecast = document.querySelector(".weather-forecast");
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const city = search.value;
  weatherForecast.style.display = "block";
  if (city) {
    getWeatherByLocation(city);
    getWeatherForNext7days(city);
  }
});

function getWeatherForNext7days(city) {
  const ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=7`;

  console.log(ENDPOINT);

  const weatherCards = document.querySelectorAll(".weather-card");

  fetch(ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      const forecasts = data.list;
      // Use the entire forecast data for all 7 days

      forecasts.forEach((forecast, index) => {
        const weatherCard = weatherCards[index];
        const date = new Date(forecast.dt * 1000);
        const options = { weekday: "long", day: "numeric" };
        const dayOfWeek = date.toLocaleDateString("en-US", options);
        const iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

        weatherCard.querySelector(".icon img").src = iconUrl;
        weatherCard.querySelector(".description").textContent =
          forecast.weather[0].description;
        weatherCard.querySelector(
          ".temp"
        ).textContent = `${forecast.main.temp.toFixed(0)}°C`;
      });
    })
    .catch((error) => console.log(error));
}
