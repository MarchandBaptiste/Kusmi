import * as THREE from "three"; // Si tu utilises un bundler, ou un lien CDN
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function init3DScene() {
  const container3D = document.getElementById("logo-3d");
  const width = container3D.clientWidth;
  const height = container3D.clientHeight;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container3D.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 3;
  const ambientLight = new THREE.AmbientLight(0xffffff, 0, 8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
  directionalLight.position.set(10, 10, 20);
  scene.add(directionalLight);

  // Chargement des canettes
  let model = null;
  const loader = new GLTFLoader();

  loader.load(
    "./assets/models/",
    (gltf) => {
      // ajout du modèle à la scène
      model = gltf.scene;
      scene.add(model);
    },
    (xhr) => {
      console.log("chargé");
    },
    (error) => {
      console.error("Erreur lors du chargement du GLB :", error);
    },
  );
}
