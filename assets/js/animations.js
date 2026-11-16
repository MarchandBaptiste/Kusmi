document.addEventListener("DOMContentLoaded", () => {
  const flavorURL = "./assets/data/flavors.json";
  const body = document.querySelector("body");
  const container = document.getElementById("slider__container");
  const btnPrev = document.querySelector(".slider__btn--prev");
  const btnNext = document.querySelector(".slider__btn--next");
  const scrollStep = 240; // largeur image (200px) + gap (20px) + marge
  const links = document.querySelectorAll("[data-flavor]");
  let flavorsData = [];

  // Render slider
  function renderImgSlider(list) {
    const flavor = flavorsData.find((item) => item.flavor === list);
    container.innerHTML = "";
    if (goutTrouve) {
      if (!list || list.length === 0) {
        container.innerHTML = `<p class="empty-message">Aucune images à afficher.</p>`;
        return;
      }
    } else {
      console.warn(`Le goût "${choix}" est introuvable dans flavorsData.`);
    }

    list.forEach((flavor) => {
      flavor.images.forEach((imgSrc) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = flavor.flavor;
        img.classList.add("slider__img");
        img.loading = "lazy";
        container.appendChild(img);
      });
    });
  }
  function changerFlavor(flavor) {
    body.classList.remove(agrumes, fleuries, sucrees);
    body.classList.add(flavor);
  }

  // Changement de gout
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // empeche le rechargement
      const flavor = link.getAttribute("data-flavor");
      console.log("Goût sélectionné :", flavor);
      changerFlavor(flavor);
      renderImgSlider(flavor);
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
