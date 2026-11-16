import * as THREE from "https://esm.sh/three@0.160.0";
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

let scene = null;
let camera = null;
let renderer = null;
let currentModel = null;

export function init3DScene() {
  const container3D = document.getElementById("three-container");
  if (!container3D) {
    console.warn("Conteneur #three-container introuvable");
    return;
  }
  const width = container3D.clientWidth || 400;
  const height = container3D.clientHeight || 300;
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container3D.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 3;
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(10, 10, 20);
  scene.add(directionalLight);
}

export function chargerModeleGLB(chemin) {
  if (!scene || !renderer) {
    console.error("La scène 3D n'est pas initialisée");
    return;
  }
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }

  const loader = new GLTFLoader();

  loader.load(
    chemin,
    (gltf) => {
      currentModel = gltf.scene;
      scene.add(currentModel);
      console.log("Modèle 3D chargé :", chemin);
    },
    (xhr) => {
      console.log(
        "Chargement du modèle :",
        Math.round((xhr.loaded / xhr.total) * 100) + "%",
      );
    },
    (error) => {
      console.error("Erreur lors du chargement du GLB :", error);
    },
  );
}
