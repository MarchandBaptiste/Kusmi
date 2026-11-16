import { chargerModeleGLB } from "./scene3d.js";

document.addEventListener("DOMContentLoaded", () => {
  const flavorURL = "./assets/data/flavors.json";
  const body = document.querySelector("body");
  const container = document.getElementById("slider__container");
  const footer = document.querySelector(".l-footer");
  const btnPrev = document.querySelector(".slider__btn--prev");
  const btnNext = document.querySelector(".slider__btn--next");
  const scrollStep = 240; // largeur image + gap + marge
  const links = document.querySelectorAll("[data-flavor]");
  let flavorsData = [];

  // Render slider pour une saveur donnée
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

    flavor.images.forEach((imgSrc) => {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = flavor.flavor;
      img.classList.add("slider__img");
      img.loading = "lazy";
      container.appendChild(img);
    });
  }

  // Changer la classe de couleur sur le body
  function changerFlavor(flavor) {
    body.classList.remove("agrumes", "fleuries", "sucrees");
    body.classList.add(flavor);
  }

  // Changer le fond SVG du footer
  function changerFooterBg(bgUrl) {
    if (footer) {
      footer.style.backgroundImage = `url("${bgUrl}")`;
    }
  }

  // Changement de goût au clic
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const flavor = link.getAttribute("data-flavor");
      console.log("Goût sélectionné :", flavor);
      const flavorObj = flavorsData.find((item) => item.theme === flavor);
      if (!flavorObj) {
        console.warn(`Le goût "${flavor}" est introuvable.`);
        return;
      }

      // 1. Couleur du body
      changerFlavor(flavor);

      // 2. Images du slider
      renderImgSlider(flavor);

      // 3. Modèle 3D
      if (flavorObj.modelPaths) {
        chargerModeleGLB(flavorObj.modelPaths);
      }

      // 4. Fond SVG du footer
      if (flavorObj.footerBg) {
        changerFooterBg(flavorObj.footerBg);
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

      // Initialisation par défaut : Agrumes
      body.classList.add("agrumes");
      const defaultFlavor = flavorsData.find(
        (item) => item.theme === "agrumes",
      );
      if (defaultFlavor) {
        renderImgSlider("agrumes");
        if (defaultFlavor.modelPaths) {
          chargerModeleGLB(defaultFlavor.modelPaths);
        }
        if (defaultFlavor.footerBg) {
          changerFooterBg(defaultFlavor.footerBg);
        }
      }
    })
    .catch((err) => {
      console.error("Erreur chargement saveurs:", err);
      container.innerHTML = `<p class="empty-message">Impossible de charger les images.</p>`;
    });

  // Boutons carrousel desktop
  btnPrev.addEventListener("click", () => {
    container.scrollBy({ left: -scrollStep, behavior: "smooth" });
  });

  btnNext.addEventListener("click", () => {
    container.scrollBy({ left: scrollStep, behavior: "smooth" });
  });
});
