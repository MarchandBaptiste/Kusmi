document.addEventListener("DOMContentLoaded", () => {
  const flavorURL = "./assets/data/flavors.json";
  const container = document.getElementById("slider__container");
  const btnPrev = document.querySelector(".slider__btn--prev");
  const btnNext = document.querySelector(".slider__btn--next");
  const scrollStep = 240; // largeur image (200px) + gap (20px) + marge
  let flavorsData = [];

  // Render slider
  function renderImgSlider(list) {
    container.innerHTML = "";

    if (!list || list.length === 0) {
      container.innerHTML = `<p class="empty-message">Aucun projet à afficher.</p>`;
      return;
    }

    list.forEach((flavor) => {
      // flavor.images est un tableau : on boucle sur chaque image
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

  // Chargement JSON
  fetch(flavorURL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      flavorsData = data;
      renderImgSlider(flavorsData);
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
