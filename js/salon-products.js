document.addEventListener("DOMContentLoaded", () => {
  // —— Hero carousel (page-hero) ——
  const heroImageFiles = [
    "WhatsApp Image 2026-02-21 at 14.21.25.jpeg",
    "WhatsApp Image 2026-02-21 at 14.21.26.jpeg",
    "WhatsApp Image 2026-02-22 at 19.42.32.jpeg"
  ];
  const heroTrack = document.getElementById("heroCarouselTrack");
  const heroDotsContainer = document.getElementById("heroCarouselDots");
  const heroPrev = document.querySelector(".hero-carousel__prev");
  const heroNext = document.querySelector(".hero-carousel__next");
  if (heroTrack && heroDotsContainer) {
    const heroTotal = heroImageFiles.length;
    heroImageFiles.forEach((file, index) => {
      const slide = document.createElement("div");
      slide.className = "hero-carousel__slide";
      slide.setAttribute("data-index", index);
      slide.setAttribute("id", "hero-slide-" + index);
      const alt = index === 0 ? "Interno salone Antonio Tarantino – postazioni, prodotti haircare e illuminazione" : "Salone Antonio Tarantino – " + (index + 1);
      slide.innerHTML = `<img src="nuovi-media/${file}" alt="${alt}" loading="${index === 0 ? "eager" : "lazy"}" class="hero-carousel__img image-content image-content--large" />`;
      heroTrack.appendChild(slide);
    });
    let heroIndex = 0;
    for (let i = 0; i < heroTotal; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-carousel__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Vai alla slide " + (i + 1));
      dot.addEventListener("click", () => heroGoTo(i));
      heroDotsContainer.appendChild(dot);
    }
    const heroSlides = heroTrack.querySelectorAll(".hero-carousel__slide");
    const heroDots = heroDotsContainer.querySelectorAll(".hero-carousel__dot");
    const getCircularOffset = (index, active, length) => {
      let delta = index - active;
      if (delta > length / 2) delta -= length;
      if (delta < -length / 2) delta += length;
      return delta;
    };
    function heroGoTo(index) {
      heroIndex = ((index % heroTotal) + heroTotal) % heroTotal;
      heroSlides.forEach((slide, i) => {
        const offset = getCircularOffset(i, heroIndex, heroTotal);
        slide.classList.remove("is-active", "is-prev", "is-next", "is-far");
        slide.style.visibility = "hidden";
        if (offset === 0) slide.classList.add("is-active");
        if (offset === -1) slide.classList.add("is-prev");
        if (offset === 1) slide.classList.add("is-next");
        if (Math.abs(offset) === 2) slide.classList.add("is-far");
        if (Math.abs(offset) <= 2) slide.style.visibility = "visible";
      });
      heroDots.forEach((d, i) => {
        d.classList.toggle("is-active", i === heroIndex);
      });
    }
    heroPrev?.addEventListener("click", () => heroGoTo(heroIndex - 1));
    heroNext?.addEventListener("click", () => heroGoTo(heroIndex + 1));
    heroGoTo(0);
  }

  // —— Prodotti carousel ——
  const imageFiles = [
    "WhatsApp Image 2026-03-10 at 16.16.16 (1).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.16 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.16 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.16.jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.17 (1).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.17 (2).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.17 (3).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.17 (4).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.17 (5).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.17 (6).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.17 (7).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.17 (8).jpeg",
    "WhatsApp Image 2026-03-10 at 16.16.17.jpeg"
  ];

  const products = imageFiles.map((imageFile, index) => ({
    image: `media-salone/${imageFile}`,
    title: "Prodotto in salone – " + (index + 1)
  }));

  const track = document.getElementById("salonCarouselTrack");
  const dotsContainer = document.getElementById("salonCarouselDots");
  const prevBtn = document.querySelector(".salon-carousel__prev");
  const nextBtn = document.querySelector(".salon-carousel__next");

  if (!track || !dotsContainer) return;

  let currentIndex = 0;
  const total = products.length;

  // Lightbox
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
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });

  // Build slides
  products.forEach((product, index) => {
    const slide = document.createElement("div");
    slide.className = "salon-carousel__slide";
    slide.setAttribute("data-index", index);
    slide.setAttribute("role", "tabpanel");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("id", "salon-slide-" + index);
    slide.innerHTML = `
      <img src="${product.image}" alt="${product.title}" loading="${index === 0 ? "eager" : "lazy"}" class="salon-carousel__img" />
    `;
    const img = slide.querySelector(".salon-carousel__img");
    img.addEventListener("click", () => openLightbox(product.image, product.title));
    track.appendChild(slide);
  });

  // Dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "salon-carousel__dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-selected", i === 0);
    dot.setAttribute("aria-controls", "salon-slide-" + i);
    dot.setAttribute("aria-label", "Vai alla slide " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  const slides = track.querySelectorAll(".salon-carousel__slide");
  const dots = dotsContainer.querySelectorAll(".salon-carousel__dot");

  function goTo(index) {
    currentIndex = ((index % total) + total) % total;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === currentIndex));
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === currentIndex);
      d.setAttribute("aria-selected", i === currentIndex);
    });
  }

  prevBtn?.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn?.addEventListener("click", () => goTo(currentIndex + 1));

  // Keyboard
  track.closest(".salon-carousel")?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(currentIndex - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(currentIndex + 1); }
  });

  goTo(0);
});
