document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".bnb-room-carousel");
  if (!carousels.length) return;

  // Lightbox per le camere (una sola istanza)
  const lightbox = document.createElement("div");
  lightbox.className = "bnb-room-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.setAttribute("aria-label", "Anteprima immagine camera");
  lightbox.innerHTML = `
    <div class="bnb-room-lightbox__scrim" data-close="true"></div>
    <div class="bnb-room-lightbox__content" role="document">
      <button class="bnb-room-lightbox__close" type="button" aria-label="Chiudi">×</button>
      <img src="" alt="" />
      <div class="bnb-room-lightbox__nav">
        <button type="button" class="bnb-room-lightbox__arrow" data-action="prev" aria-label="Immagine precedente">‹</button>
        <button type="button" class="bnb-room-lightbox__arrow" data-action="next" aria-label="Immagine successiva">›</button>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector("img");
  const lbClose = lightbox.querySelector(".bnb-room-lightbox__close");
  const lbScrim = lightbox.querySelector("[data-close='true']");
  const lbPrev = lightbox.querySelector("[data-action='prev']");
  const lbNext = lightbox.querySelector("[data-action='next']");

  let lightboxImages = [];
  let lightboxIndex = 0;

  const openRoomLightbox = (images, index) => {
    lightboxImages = images;
    lightboxIndex = ((index % images.length) + images.length) % images.length;
    lbImg.src = images[lightboxIndex].src;
    lbImg.alt = images[lightboxIndex].alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("bnb-room-lightbox-open");
  };

  const closeRoomLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("bnb-room-lightbox-open");
    lbImg.src = "";
  };

  const showLightboxImage = (index) => {
    if (!lightboxImages.length) return;
    lightboxIndex = ((index % lightboxImages.length) + lightboxImages.length) % lightboxImages.length;
    lbImg.src = lightboxImages[lightboxIndex].src;
    lbImg.alt = lightboxImages[lightboxIndex].alt || "";
  };

  lbClose.addEventListener("click", closeRoomLightbox);
  lbScrim.addEventListener("click", closeRoomLightbox);
  lbPrev.addEventListener("click", () => {
    showLightboxImage(lightboxIndex - 1);
  });
  lbNext.addEventListener("click", () => {
    showLightboxImage(lightboxIndex + 1);
  });
  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeRoomLightbox();
    if (e.key === "ArrowLeft") showLightboxImage(lightboxIndex - 1);
    if (e.key === "ArrowRight") showLightboxImage(lightboxIndex + 1);
  });

  const ROOM_AUTOPLAY_MS = 4500;

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".bnb-room-carousel__track");
    const slides = carousel.querySelectorAll(".bnb-room-carousel__slide");
    const dotsWrap = carousel.querySelector(".bnb-room-carousel__dots");
    const dataImages = carousel.getAttribute("data-images");
    const images = dataImages ? JSON.parse(dataImages) : [];

    if (!track || !slides.length) return;

    const n = slides.length;
    const slidePercent = 100 / n;
    track.style.width = `${n * 100}%`;
    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slidePercent}%`;
    });

    let current = 0;
    let autoplayTimer = null;

    // Dots
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "bnb-room-carousel__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Vai alla slide " + (i + 1));
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        goTo(i);
      });
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll(".bnb-room-carousel__dot");

    const goTo = (index) => {
      current = ((index % slides.length) + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * slidePercent}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
    };

    const next = () => goTo(current + 1);

    const startAutoplay = () => {
      if (autoplayTimer) return;
      autoplayTimer = setInterval(next, ROOM_AUTOPLAY_MS);
    };
    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    // Click su carousel apre lightbox con immagini della camera
    carousel.addEventListener("click", (e) => {
      if (e.target.closest(".bnb-room-carousel__dot")) return;
      if (images.length) openRoomLightbox(images, current);
    });

    startAutoplay();
    goTo(0);
  });
});
