import { chargerModeleGLB } from "./scene3d.js";

document.addEventListener("DOMContentLoaded", () => {
  const flavorURL = "/assets/data/flavors.json";
  const body = document.querySelector("body");
  const container = document.getElementById("slider__container");
  const headerFlavor = document.getElementById("header__flavor");
  const btnPrev = document.querySelector(".slider__btn--prev");
  const btnNext = document.querySelector(".slider__btn--next");
  const scrollStep = 240; // largeur image + gap + marge
  const isHomePage = Boolean(container && headerFlavor);
  let flavorsData = [];

  function renderHeaderFlavor(flavorName) {
    if (!headerFlavor) return;

    headerFlavor.innerHTML = "";
    if (!flavorsData || flavorsData.length === 0) {
      headerFlavor.innerHTML = `<p class="empty-message">Aucune donnée chargée.</p>`;
      return;
    }
    const flavor = flavorsData.find((item) => item.theme === flavorName);

    if (!flavor) {
      console.warn(`Le goût "${flavorName}" est introuvable.`);
      return;
    }
    const title = document.createElement("h1");
    title.textContent = flavor.flavor + ".";
    headerFlavor.appendChild(title);
  }

  // Render slider pour une saveur donnée
  function renderImgSlider(flavorName) {
    if (!container) return;

    container.innerHTML = "";

    if (!flavorsData || flavorsData.length === 0) {
      container.innerHTML = `<p class="empty-message">Aucune donnée chargée.</p>`;
      return;
    }

    const flavor = flavorsData.find((item) => item.theme === flavorName);

    if (!flavor) {
      console.warn(`Le goût "${flavorName}" est introuvable.`);
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

  // Changement de goût au clic
  function appliquerFlavor(flavorName) {
    const flavorObj = flavorsData.find((item) => item.theme === flavorName);
    if (!flavorObj) {
      console.warn(`Le goût "${flavorName}" est introuvable.`);
      return false;
    }

    changerFlavor(flavorName);
    renderImgSlider(flavorName);
    renderHeaderFlavor(flavorName);
    if (flavorObj.modelPaths) {
      chargerModeleGLB(flavorObj.modelPaths);
    }
    return true;
  }

  function getFlavorFromURL() {
    const requested = new URLSearchParams(window.location.search).get("flavor");
    if (!requested) return null;

    const exists = flavorsData.some((item) => item.theme === requested);
    if (!exists) {
      console.warn(`La saveur "${requested}" de l'URL est introuvable.`);
      return null;
    }
    return requested;
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest?.("[data-flavor]");
    if (!link || !isHomePage) return;

    const flavor = link.getAttribute("data-flavor");
    if (!appliquerFlavor(flavor)) return;

    e.preventDefault();

    const url = new URL(window.location.href);
    url.searchParams.set("flavor", flavor);
    window.history.replaceState(null, "", url);
  });

  // Chargement JSON
  if (isHomePage) {
    fetch(flavorURL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        flavorsData = data;
        appliquerFlavor(getFlavorFromURL() ?? "agrumes");
      })
      .catch((err) => {
        console.error("Erreur chargement saveurs:", err);
        if (container) {
          container.innerHTML = `<p class="empty-message">Impossible de charger les images.</p>`;
        }
      });
  }

  // Boutons carrousel desktop
  btnPrev?.addEventListener("click", () => {
    container.scrollBy({ left: -scrollStep, behavior: "smooth" });
  });

  btnNext?.addEventListener("click", () => {
    container.scrollBy({ left: scrollStep, behavior: "smooth" });
  });
});
