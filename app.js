import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { fetchWeatherData } from './weatherAPI.js';

function updateUI(state) {
  if (state.loading) {
      console.log("Loading...");
  } else if (state.data) {
      console.log(state.data);
  } else if (state.error) {
      console.log(`Error: ${state.error}`);
  }
}

async function main() {
  //await fetchWeatherData(35.6895, 139.6917, updateUI);
}

main();
