import { API_KEY } from './config.js';

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

export { getWeatherData };