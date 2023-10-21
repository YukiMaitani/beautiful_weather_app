import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getWeatherData } from './weatherAPI.js';

async function main() {
    const latitude = 35.6895;
    const longitude = 139.6917;

    const weatherInfo = await getWeatherData(latitude, longitude);
    console.log(weatherInfo);
}

main();