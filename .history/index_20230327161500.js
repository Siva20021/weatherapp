const apiKey = "9069ea7df5255bddc76e81b66070ca9a";
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};

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

function requestNotificationPermission() {
  Swal.fire({
    title: "Do you want to enable notifications?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: `Allow`,
    denyButtonText: `Don't allow`,
  }).then((result) => {
    if (result.isConfirmed) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          Swal.fire("Notifications enabled!", "", "success");
          showNotification();
        } else {
          Swal.fire("Notifications denied", "", "error");
        }
      });
    } else if (result.isDenied) {
      Swal.fire("Notifications denied", "", "error");
    }
  });
}
console.log(getWeatherByMyLocation);

async function showNotification() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );
    const respData = await resp.json();
    const temp = Ktoc(respData.main.temp);

    let weatherCondition = "";
    respData.weather.forEach((condition) => {
      if (condition.main === "Rain") {
        weatherCondition = "rainy";
        Swal.fire({
          title: "Notification title",
          text: `The current temperature is ${temp}°C and it is ${weatherCondition}`,
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timerProgressBar: true,
        });
      } else if (condition.main === "Drizzle") {
        weatherCondition = "drizzling";
        Swal.fire({
          title: "Notification title",
          text: `The current temperature is ${temp}°C and it is ${weatherCondition}`,
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timerProgressBar: true,
        });
      } else {
        weatherCondition = "Fine";
      }
    });

    Swal.fire({
      title: "Notification title",
      text: `The current temperature is ${temp}°C and it is ${weatherCondition}`,
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timerProgressBar: true,
    });
  });
  checkIfRainToday();
  // setInterval(checkWeatherAndAlert, 24 * 60 * 60 * 1000);
}

var modal = document.getElementById("myModal");

var btn = document.getElementsByTagName("button")[0];

var span = document.getElementsByClassName("close")[0];
function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop().split(";").shift();
    return cookieValue.split(",");
  }
}

const cookieValue = getCookie("access_token");
document.getElementById("UserName").textContent = cookieValue[0];
document.getElementById("UserEmail").textContent = cookieValue[1];
document.getElementById("Usercity1").textContent = cookieValue[2];
document.getElementById("Usercity2").textContent = cookieValue[3];
document.getElementById("Usercity3").textContent = cookieValue[4];

const preferredCities = ["Cochin", "Chennai", "Sydney"];

// function checkWeatherAndAlert() {
//   preferredCities.forEach((city) => {
//     fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         const isRaining = data.weather[0].main.toLowerCase().includes("rain");
//         console.log("Hello");
//         console.log(isRaining);
//         if (isRaining) {
//           Swal.fire({
//             title: "Notification title",
//             text: `Its raining in ${city}°C and it is ${weatherCondition}`,
//             icon: "warning",
//             toast: true,
//             position: "top-end",
//             showConfirmButton: false,
//             timerProgressBar: true,
//           });
//         }
//       })
//       .catch((error) => console.error(error));
//   });
// }

function checkIfRainToday() {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Check if it's going to rain today
        const weatherCondition = data.weather[0].main.toLowerCase();
        const isRaining = weatherCondition.includes("rain");

        if (isRaining) {
          alert("It's going to rain today!");
        } else {
          alert("It's not going to rain today.");
        }
      })
      .catch((error) => console.error(error));
  });
}
