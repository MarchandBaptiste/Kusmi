import { init3DScene } from "./scene3d.js";

async function loadInclude(id, path) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(path);
  if (!res.ok) {
    console.error(`Include introuvable : ${path} (${res.status})`);
    return;
  }
  el.innerHTML = await res.text();
}

await Promise.all([
  loadInclude("header-include", "../assets/includes/header.html"),
  loadInclude("footer-include", "../assets/includes/footer.html"),
]);

document.addEventListener("DOMContentLoaded", () => {
  console.log("Site prêt");
  init3DScene();
});
