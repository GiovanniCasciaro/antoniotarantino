/**
 * Pagina Profumo: tab Descrizione/Ingredienti e galleria thumbnails
 */
document.addEventListener("DOMContentLoaded", () => {
  const mainImg = document.getElementById("profumoMainImg");
  const thumbs = document.querySelectorAll(".profumo-thumb");
  const tabDesc = document.getElementById("tab-desc");
  const tabIngredients = document.getElementById("tab-ingredients");
  const panelDesc = document.getElementById("profumo-desc");
  const panelIngredients = document.getElementById("profumo-ingredients");

  // Thumbnails: clicca per cambiare immagine principale
  if (mainImg && thumbs.length) {
    const sources = Array.from(thumbs).map((t) => {
      const img = t.querySelector("img");
      return img ? img.src : null;
    }).filter(Boolean);

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener("click", () => {
        thumbs.forEach((t) => t.classList.remove("profumo-thumb--active"));
        thumb.classList.add("profumo-thumb--active");
        thumb.setAttribute("aria-pressed", "true");
        thumbs.forEach((t, j) => {
          if (j !== i) t.setAttribute("aria-pressed", "false");
        });
        if (sources[i]) mainImg.src = sources[i];
      });
    });
  }

  // Tab Descrizione / Ingredienti
  if (tabDesc && tabIngredients && panelDesc && panelIngredients) {
    tabDesc.addEventListener("click", () => {
      tabDesc.classList.add("profumo-tabs__btn--active");
      tabDesc.setAttribute("aria-selected", "true");
      tabIngredients.classList.remove("profumo-tabs__btn--active");
      tabIngredients.setAttribute("aria-selected", "false");
      panelDesc.hidden = false;
      panelIngredients.hidden = true;
    });

    tabIngredients.addEventListener("click", () => {
      tabIngredients.classList.add("profumo-tabs__btn--active");
      tabIngredients.setAttribute("aria-selected", "true");
      tabDesc.classList.remove("profumo-tabs__btn--active");
      tabDesc.setAttribute("aria-selected", "false");
      panelIngredients.hidden = false;
      panelDesc.hidden = true;
    });
  }
});
