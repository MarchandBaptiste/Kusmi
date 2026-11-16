import { chargerModeleGLB } from "./scene3d.js";

document.addEventListener("DOMContentLoaded", () => {
  const flavorURL = "./assets/data/flavors.json";
  const body = document.querySelector("body");
  const container = document.getElementById("slider__container");
  const btnPrev = document.querySelector(".slider__btn--prev");
  const btnNext = document.querySelector(".slider__btn--next");
  const scrollStep = 240; // largeur image + gap + marge
  const links = document.querySelectorAll("[data-flavor]");
  let flavorsData = [];
  const modelPaths = {
    agrumes: "./assets/models/originalglb.glb",
    fleuries: "./assets/models/fleurie.glb",
    sucrees: "./assets/models/sucre.glb",
  };

  // Render slider
  function renderImgSlider(flavorName) {
    container.innerHTML = "";

    if (!flavorsData || flavorsData.length === 0) {
      container.innerHTML = `<p class="empty-message">Aucune donnée chargée.</p>`;
      return;
    }
    const flavor = flavorsData.find((item) => item.theme === flavorName);
    if (!flavor) {
      console.warn(`Le goût "${flavorName}" est introuvable dans flavorsData.`);
      return;
    }

    // Afficher images saveur
    flavor.images.forEach((imgSrc) => {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = flavor.flavor;
      img.classList.add("slider__img");
      img.loading = "lazy";
      container.appendChild(img);
    });
  }

  // Changer couleur sur le body
  function changerFlavor(flavor) {
    body.classList.remove("agrumes", "fleuries", "sucrees");
    body.classList.add(flavor);
  }

  // Changement de goût
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // empêche le rechargement de la page
      const flavor = link.getAttribute("data-flavor");
      console.log("Goût sélectionné :", flavor);
      changerFlavor(flavor);
      renderImgSlider(flavor);
      const cheminModele = modelPaths[flavor];
      if (cheminModele) {
        chargerModeleGLB(cheminModele);
      }
    });
  });

  // Chargement JSON
  fetch(flavorURL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      flavorsData = data;
      body.classList.add("agrumes");
      renderImgSlider("agrumes");
      const cheminModele = modelPaths["agrumes"];
      if (cheminModele) {
        chargerModeleGLB(cheminModele);
      }
    })
    .catch((err) => {
      console.error("Erreur chargement saveurs:", err);
      container.innerHTML = `<p class="empty-message">Impossible de charger les images.</p>`;
    });

  // Boutons carrousel
  btnPrev.addEventListener("click", () => {
    container.scrollBy({ left: -scrollStep, behavior: "smooth" });
  });

  btnNext.addEventListener("click", () => {
    container.scrollBy({ left: scrollStep, behavior: "smooth" });
  });
});
