import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { fetchWeatherData, fetchMockWeatherData } from './weather_api.js';

let camera, scene, renderer, font, mesh;

async function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const loader = new FontLoader();
    font = await loader.loadAsync('/fonts/merriweather_italic.json');

    camera.position.z = 5;
    const controls = new OrbitControls(camera, renderer.domElement);

    animate();
}

function updateUI(state) {
  if (scene.getObjectByName('textMesh')) {
      scene.remove(scene.getObjectByName('textMesh'));
  }

  if (state.loading || state.error) {
      let text = state.loading ? "Loading..." : `Error: ${state.error}`;

      const textGeometry = createTextGeometry(text);
      textGeometry.center();
      mesh = createTextMesh(textGeometry);
      mesh.name = 'textMesh';

      scene.add(mesh);
  } else if (state.data) {
    const temperatureGeometry = createTextGeometry(`Temperature: ${state.data.temperature}`);
    temperatureGeometry.computeBoundingBox();

    const weatherGeometry = createTextGeometry(`Weather: ${state.data.weather}`);
    weatherGeometry.computeBoundingBox();

    const timezoneGeometry = createTextGeometry(`Timezone: ${state.data.timezone}`);
    timezoneGeometry.computeBoundingBox();

    // Positioning
    const temperatureMesh = createTextMesh(temperatureGeometry);
    temperatureMesh.position.copy(getWorldPosition(-0.9, -0.9, -2, camera));

    const weatherMesh = createTextMesh(weatherGeometry);
    weatherMesh.position.copy(getWorldPosition(-0.9, 0.8, -2, camera));

    const timezoneMesh = createTextMesh(timezoneGeometry);
    timezoneMesh.position.copy(getWorldPosition(0.3, -0.9, -2, camera));

    scene.add(temperatureMesh, weatherMesh, timezoneMesh);
  }
}

function getWorldPosition(x, y, distance, camera) {
    let vector = new THREE.Vector3(x, y, -1).unproject(camera);
    let dir = vector.sub(camera.position).normalize();
    let distanceToPlane = distance / dir.z; 
    let pos = camera.position.clone().add(dir.multiplyScalar(distanceToPlane));
    return pos;
}

function createTextGeometry(text) {
    const textGeometry = new TextGeometry(text, {
        font: font,
        size: 0.15,
        height: 0.01,
    });
    return textGeometry;
}

function createTextMesh(geometry) {
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, textMaterial);
    return mesh;
}

async function main() {
    await init();
    await fetchMockWeatherData(1000, updateUI);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

main();
