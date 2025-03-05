const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getWeatherByLocation(city) {
  try {
    // city latitude and longitude fetch

    const geoResp = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );

    if (!geoResp.ok) {
      throw new Error("City not found.");
    }

    const geoData = await geoResp.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found.");
    }

    const { latitude, longitude } = geoData.results[0];

    //latitude and longitude weather data fetch

    const weatherResp = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!weatherResp.ok) {
      throw new Error("Weather data not available.");
    }

    const weatherData = await weatherResp.json();

    // put data on page

    addWeatherToPage(weatherData, city);
  } catch (error) {
    main.innerHTML = `<p>${error.message}</p>`;
  }
}

function addWeatherToPage(data, city) {
  const { temperature, weathercode, windspeed, winddirection } =
    data.current_weather;

  const weather = document.createElement("div");
  weather.classList.add("weather");

  weather.innerHTML = `
    <h2>Weather in ${city} </h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Weather Code: ${weathercode}</p>
    <p>Wind Speed: ${windspeed} m/s</p>
    <p>Wind Direction: ${winddirection}°</p>
  `;

  // cleanup container.
  main.innerHTML = "";

  main.appendChild(weather);
}

// Event listener
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const regex = / {2,}/g;

  // remove whitespace from middle.

  let city = search.value.replaceAll(regex, " ").trim();

  // letter to proper case.

  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  if (city) {
    getWeatherByLocation(city);
  }
});
