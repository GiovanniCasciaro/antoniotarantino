document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("bnbGallery");
  if (!gallery) return;

  const images = [
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.03 (1).jpeg", alt: "BnB gallery 01" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.03.jpeg", alt: "BnB gallery 02" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.04 (1).jpeg", alt: "BnB gallery 03" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.04 (2).jpeg", alt: "BnB gallery 04" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.04 (3).jpeg", alt: "BnB gallery 05" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.04 (4).jpeg", alt: "BnB gallery 06" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.04.jpeg", alt: "BnB gallery 07" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.05 (1).jpeg", alt: "BnB gallery 08" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.05 (2).jpeg", alt: "BnB gallery 09" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.05 (4).jpeg", alt: "BnB gallery 11" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.05 (5).jpeg", alt: "BnB gallery 12" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.05 (6).jpeg", alt: "BnB gallery 13" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.05 (7).jpeg", alt: "BnB gallery 14" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.05.jpeg", alt: "BnB gallery 15" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.06 (1).jpeg", alt: "BnB gallery 16" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.06 (2).jpeg", alt: "BnB gallery 17" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.06 (3).jpeg", alt: "BnB gallery 18" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.06 (4).jpeg", alt: "BnB gallery 19" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.06 (5).jpeg", alt: "BnB gallery 20" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.06 (6).jpeg", alt: "BnB gallery 21" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.06 (7).jpeg", alt: "BnB gallery 22" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.06 (8).jpeg", alt: "BnB gallery 23" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.06.jpeg", alt: "BnB gallery 24" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.07 (1).jpeg", alt: "BnB gallery 25" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.07 (2).jpeg", alt: "BnB gallery 26" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.07 (3).jpeg", alt: "BnB gallery 27" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.07 (4).jpeg", alt: "BnB gallery 28" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.07 (5).jpeg", alt: "BnB gallery 29" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.07 (6).jpeg", alt: "BnB gallery 30" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.07 (7).jpeg", alt: "BnB gallery 31" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.07.jpeg", alt: "BnB gallery 32" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.08 (1).jpeg", alt: "BnB gallery 33" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.08 (2).jpeg", alt: "BnB gallery 34" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.08 (3).jpeg", alt: "BnB gallery 35" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.08 (4).jpeg", alt: "BnB gallery 36" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.08 (5).jpeg", alt: "BnB gallery 37" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.08 (6).jpeg", alt: "BnB gallery 38" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.08.jpeg", alt: "BnB gallery 39" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.09 (1).jpeg", alt: "BnB gallery 40" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.09 (3).jpeg", alt: "BnB gallery 42" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.09 (4).jpeg", alt: "BnB gallery 43" },
    { src: "media/WhatsApp Image 2026-01-22 at 09.57.09.jpeg", alt: "BnB gallery 44" }
  ];

  const buildItem = (image) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bnb-gallery__item";
    button.setAttribute("aria-label", "Apri immagine");

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.fetchPriority = "low";

    button.appendChild(img);
    return button;
  };

  const overlay = document.createElement("div");
  overlay.className = "bnb-lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="bnb-lightbox__scrim" data-close="true"></div>
    <div class="bnb-lightbox__content" role="document">
      <button class="bnb-lightbox__close" type="button" aria-label="Chiudi">×</button>
      <div class="bnb-lightbox__image-wrap">
        <img class="bnb-lightbox__image" alt="" />
        <div class="bnb-lightbox__progress" aria-hidden="true">
          <span class="bnb-lightbox__progress-label">Prossima foto</span>
          <span class="bnb-lightbox__progress-bar">
            <span class="bnb-lightbox__progress-fill"></span>
          </span>
        </div>
      </div>
      <div class="bnb-lightbox__footer">
        <div class="bnb-lightbox__nav">
          <button class="bnb-lightbox__arrow" type="button" data-action="prev" aria-label="Foto precedente">‹</button>
          <button class="bnb-lightbox__toggle" type="button" aria-label="Avvia autoplay">▶</button>
          <button class="bnb-lightbox__arrow" type="button" data-action="next" aria-label="Foto successiva">›</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const overlayImage = overlay.querySelector(".bnb-lightbox__image");
  const closeBtn = overlay.querySelector(".bnb-lightbox__close");
  const scrim = overlay.querySelector(".bnb-lightbox__scrim");
  const prevBtn = overlay.querySelector("[data-action='prev']");
  const nextBtn = overlay.querySelector("[data-action='next']");
  const progressFill = overlay.querySelector(".bnb-lightbox__progress-fill");
  const toggleBtn = overlay.querySelector(".bnb-lightbox__toggle");
  let autoAdvanceTimer = null;
  let currentIndex = 0;
  let autoplayActive = true;

  const restartProgress = () => {
    if (!progressFill) return;
    progressFill.style.animation = "none";
    void progressFill.offsetHeight;
    progressFill.style.animation = "bnb-progress 3s linear";
  };

  const showImageAt = (index) => {
    const normalized = ((index % images.length) + images.length) % images.length;
    currentIndex = normalized;
    const image = images[normalized];
    overlayImage.src = image.src;
    overlayImage.alt = image.alt || "";
    restartProgress();
  };

  const setAutoplay = (active) => {
    autoplayActive = active;
    overlay.classList.toggle("is-autoplay", autoplayActive);
    toggleBtn.textContent = autoplayActive ? "⏸" : "▶";
    toggleBtn.setAttribute("aria-label", autoplayActive ? "Pausa autoplay" : "Avvia autoplay");
    if (autoplayActive) {
      restartProgress();
      startAutoAdvance();
    } else {
      stopAutoAdvance();
    }
  };

  const startAutoAdvance = () => {
    if (!autoplayActive || autoAdvanceTimer) return;
    autoAdvanceTimer = window.setInterval(() => {
      showImageAt(currentIndex + 1);
    }, 3000);
  };

  const stopAutoAdvance = () => {
    if (!autoAdvanceTimer) return;
    window.clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = null;
  };

  const openLightbox = (index) => {
    showImageAt(index);
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("bnb-lightbox-open");
    setAutoplay(autoplayActive);
  };

  const closeLightbox = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("bnb-lightbox-open");
    overlayImage.src = "";
    stopAutoAdvance();
  };

  images.forEach((image, index) => {
    const item = buildItem(image);
    item.addEventListener("click", () => openLightbox(index));
    gallery.appendChild(item);
  });

  const goNext = () => {
    showImageAt(currentIndex + 1);
    if (autoplayActive) {
      stopAutoAdvance();
      startAutoAdvance();
    }
  };
  const goPrev = () => {
    showImageAt(currentIndex - 1);
    if (autoplayActive) {
      stopAutoAdvance();
      startAutoAdvance();
    }
  };

  closeBtn.addEventListener("click", closeLightbox);
  scrim.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);
  toggleBtn.addEventListener("click", () => setAutoplay(!autoplayActive));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") goNext();
    if (event.key === "ArrowLeft") goPrev();
  });
});
