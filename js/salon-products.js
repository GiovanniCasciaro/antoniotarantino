document.addEventListener("DOMContentLoaded", async () => {
  // Lista di tutte le immagini nella cartella media-salone
  const imageFiles = [
    "WhatsApp Image 2026-01-24 at 14.03.07.jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.11.jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.20 (1).jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.20 (2).jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.20.jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.21 (1).jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.21 (2).jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.21 (3).jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.21 (4).jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.21 (5).jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.21 (6).jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.21.jpeg",
    "WhatsApp Image 2026-01-24 at 14.03.22.jpeg"
  ];

  // Genera titoli e descrizioni placeholder basati sul nome del file
  const generateProductInfo = (imageFile, index) => {
    return {
      title: "Inserisci nome corretto quando comunicato",
      description: "Prodotto professionale per la cura dei capelli. Formulato con ingredienti selezionati per garantire risultati ottimali. Disponibile in salone su consulenza."
    };
  };

  // Crea i prodotti combinando immagini e dati
  const products = imageFiles.map((imageFile, index) => {
    const info = generateProductInfo(imageFile, index);
    return {
      image: `media-salone/${imageFile}`,
      title: info.title,
      description: info.description
    };
  });

  // Crea il lightbox per le immagini
  const lightbox = document.createElement("div");
  lightbox.className = "salon-product-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <div class="salon-product-lightbox__scrim" data-close="true"></div>
    <div class="salon-product-lightbox__content">
      <button class="salon-product-lightbox__close" type="button" aria-label="Chiudi">×</button>
      <img class="salon-product-lightbox__image" alt="" />
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".salon-product-lightbox__image");
  const lightboxClose = lightbox.querySelector(".salon-product-lightbox__close");
  const lightboxScrim = lightbox.querySelector(".salon-product-lightbox__scrim");

  const openLightbox = (imageSrc, imageAlt) => {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("salon-lightbox-open");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("salon-lightbox-open");
    lightboxImage.src = "";
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxScrim.addEventListener("click", closeLightbox);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  const createProductCard = (product, index) => {
    const card = document.createElement("div");
    card.className = "salon-product-card";
    card.innerHTML = `
      <div class="salon-product-card__image">
        <img src="${product.image}" alt="${product.title}" loading="lazy" class="salon-product-card__img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\'%3E%3Crect fill=\\'%23e6edf7\\' width=\\'400\\' height=\\'300\\'/%3E%3Ctext fill=\\'%235a6b7a\\' font-family=\\'Arial\\' font-size=\\'18\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3E${encodeURIComponent(product.title)}%3C/text%3E%3C/svg%3E';" />
      </div>
      <div class="salon-product-card__content">
        <h3 class="salon-product-card__title">${product.title}</h3>
      </div>
    `;

    const image = card.querySelector(".salon-product-card__img");
    image.style.cursor = "pointer";
    image.addEventListener("click", () => {
      openLightbox(product.image, product.title);
    });

    return card;
  };

  // Distribuisci i prodotti: 4 card per ogni sezione
  const productsPerSection = 4;
  const containers = [
    document.getElementById("salonProducts1"),
    document.getElementById("salonProducts2"),
    document.getElementById("salonProducts3"),
    document.getElementById("salonProducts4")
  ];

  containers.forEach((container, containerIndex) => {
    if (!container) return;
    
    const startIndex = containerIndex * productsPerSection;
    const endIndex = Math.min(startIndex + productsPerSection, products.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      const card = createProductCard(products[i], i);
      container.appendChild(card);
    }
  });
});
