import { API_KEY } from './config.js';

const state = {
  loading: false,
  data: null,
  error: null,
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWeatherData(latitude, longitude) {
  const endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return {
      temperature: data.current.temp,
      weather: data.current.weather[0].description,
      timezone: data.timezone
  };
}

async function fetchWeatherData(latitude, longitude, updateUI) {
  state.loading = true;
  state.data = null;
  state.error = null;
  updateUI(state);
  try {
      const weatherInfo = await getWeatherData(latitude, longitude);
      state.loading = false;
      state.data = weatherInfo;
  } catch (error) {
      state.loading = false;
      state.error = error.message;
  }

  updateUI(state);
}

async function fetchMockWeatherData(ms, updateUI) {
    state.loading = true;
    state.data = null;
    state.error = null;
    updateUI(state);
    await sleep(ms); 

    const mockData = {
        temperature: 25,
        weather: "Sunny",
        timezone: "Asia/Tokyo"
    };
    state.loading = false;
    state.data = mockData;
    updateUI(state);
}

export { fetchWeatherData, fetchMockWeatherData };
