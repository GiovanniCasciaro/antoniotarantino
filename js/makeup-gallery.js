document.addEventListener("DOMContentLoaded", () => {
  const imageFiles = [
    "WhatsApp Image 2026-03-10 at 17.09.53.jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.55.jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.56 (1).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.56 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.56 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.56 (4).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.56.jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.57 (1).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.57 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.57 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.57 (4).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.57 (5).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.57 (6).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.57.jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.58 (1).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.58 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.58 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.58 (4).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.58 (5).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.58 (6).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.58 (7).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.58.jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.59 (1).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.59 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.59 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.59 (4).jpeg",
    "WhatsApp Image 2026-03-10 at 17.09.59.jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.00 (1).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.00 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.00 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.00 (4).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.00 (5).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.00 (6).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.00 (7).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.00.jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.01 (1).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.01 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.01 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.01 (4).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.01 (5).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.01.jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.02 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.02 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.02 (4).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.02 (5).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.02.jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.03 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.03 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.03 (4).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.03 (5).jpeg",
    "WhatsApp Image 2026-03-10 at 17.10.03.jpeg"
  ];

  const track = document.getElementById("makeupCarouselTrack");
  const dotsContainer = document.getElementById("makeupCarouselDots");
  const carousel = document.getElementById("makeupCarousel");
  const prevBtn = document.querySelector(".makeup-carousel__prev");
  const nextBtn = document.querySelector(".makeup-carousel__next");

  if (!track || !dotsContainer || imageFiles.length === 0) return;

  let currentIndex = 0;
  const total = imageFiles.length;
  const getCircularOffset = (index, active, length) => {
    let delta = index - active;
    if (delta > length / 2) delta -= length;
    if (delta < -length / 2) delta += length;
    return delta;
  };

  imageFiles.forEach((file, index) => {
    const slide = document.createElement("div");
    slide.className = "makeup-carousel__slide";
    slide.innerHTML = `<img src="media-makeup/${file}" alt="Make up Antonio Tarantino - look ${index + 1}" loading="${index < 3 ? "eager" : "lazy"}" class="makeup-carousel__img" />`;
    track.appendChild(slide);
  });

  const status = document.createElement("div");
  status.className = "makeup-carousel__status";
  status.setAttribute("aria-live", "polite");
  dotsContainer.appendChild(status);

  // Lightbox quasi full-screen
  const lightbox = document.createElement("div");
  lightbox.className = "makeup-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <div class="makeup-lightbox__scrim" data-close="true"></div>
    <div class="makeup-lightbox__content">
      <button class="makeup-lightbox__close" type="button" aria-label="Chiudi">×</button>
      <img class="makeup-lightbox__image" alt="" />
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".makeup-lightbox__image");
  const lightboxClose = lightbox.querySelector(".makeup-lightbox__close");
  const lightboxScrim = lightbox.querySelector(".makeup-lightbox__scrim");

  const updateLightboxImage = () => {
    lightboxImage.src = `media-makeup/${imageFiles[currentIndex]}`;
    lightboxImage.alt = `Make up Antonio Tarantino - look ${currentIndex + 1}`;
  };

  const openLightbox = () => {
    updateLightboxImage();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("makeup-lightbox-open");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("makeup-lightbox-open");
  };

  function goTo(index) {
    currentIndex = ((index % total) + total) % total;
    const slides = track.querySelectorAll(".makeup-carousel__slide");
    slides.forEach((slide, i) => {
      const offset = getCircularOffset(i, currentIndex, total);
      slide.classList.remove("is-active", "is-prev", "is-next", "is-far");
      slide.style.visibility = "hidden";
      if (offset === 0) slide.classList.add("is-active");
      if (offset === -1) slide.classList.add("is-prev");
      if (offset === 1) slide.classList.add("is-next");
      if (Math.abs(offset) === 2) slide.classList.add("is-far");
      if (Math.abs(offset) <= 2) slide.style.visibility = "visible";
    });
    const prev = ((currentIndex - 1 + total) % total) + 1;
    const curr = currentIndex + 1;
    const next = ((currentIndex + 1) % total) + 1;
    status.innerHTML = `<span>${prev}</span><span class="makeup-carousel__status-sep">·</span><span class="makeup-carousel__status-current">${curr}</span><span class="makeup-carousel__status-sep">·</span><span>${next}</span>`;
    if (lightbox.classList.contains("is-open")) updateLightboxImage();
  }

  prevBtn?.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn?.addEventListener("click", () => goTo(currentIndex + 1));

  // Click sull'immagine corrente apre l'anteprima
  carousel?.addEventListener("click", (event) => {
    if (event.target.closest(".makeup-carousel__btn")) return;
    const activeSlide = carousel.querySelector(".makeup-carousel__slide.is-active");
    if (!activeSlide || !activeSlide.contains(event.target)) return;
    openLightbox();
  });

  // Swipe touch/mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let hasTouchStart = false;
  const swipeThreshold = 40;

  carousel?.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    hasTouchStart = true;
  }, { passive: true });

  carousel?.addEventListener("touchend", (event) => {
    if (!hasTouchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    hasTouchStart = false;
    if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX > 0) {
      goTo(currentIndex - 1);
    } else {
      goTo(currentIndex + 1);
    }
  }, { passive: true });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxScrim?.addEventListener("click", closeLightbox);

  // Swipe nel lightbox
  let lbTouchStartX = 0;
  let lbTouchStartY = 0;
  let lbTouchActive = false;

  lightbox?.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    lbTouchStartX = touch.clientX;
    lbTouchStartY = touch.clientY;
    lbTouchActive = true;
  }, { passive: true });

  lightbox?.addEventListener("touchend", (event) => {
    if (!lbTouchActive) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - lbTouchStartX;
    const deltaY = touch.clientY - lbTouchStartY;
    lbTouchActive = false;
    if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX > 0) {
      goTo(currentIndex - 1);
    } else {
      goTo(currentIndex + 1);
    }
  }, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") goTo(currentIndex - 1);
    if (event.key === "ArrowRight") goTo(currentIndex + 1);
  });

  goTo(0);
});
