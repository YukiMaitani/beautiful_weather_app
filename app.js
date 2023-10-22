import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { fetchWeatherData } from './weatherAPI.js';

let camera, scene, renderer, font, mesh;

async function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const loader = new FontLoader();
    font = await loader.loadAsync('/fonts/merriweather_Italic.json');

    camera.position.z = 5;
    const controls = new OrbitControls(camera, renderer.domElement);

    animate();
}

function updateUI(state) {
    if (scene.getObjectByName('textMesh')) {
        scene.remove(scene.getObjectByName('textMesh'));
    }

    let text = '';
    if (state.loading) {
        text = "Loading...";
    } else if (state.data) {
        text = `Temperature: ${state.data.temperature}\nWeather: ${state.data.weather}\nTimezone: ${state.data.timezone}`;
    } else if (state.error) {
        text = `Error: ${state.error}`;
    }

    const textGeometry = new TextGeometry(text, {
        font: font,
        size: 0.2,
        height: 0.05,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    mesh = new THREE.Mesh(textGeometry, textMaterial);
    mesh.name = 'textMesh';

    scene.add(mesh);
}

async function main() {
    await init();
    await fetchWeatherData(35.6895, 139.6917, updateUI);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

main();
