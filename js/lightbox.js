/**
 * MediaLightbox - lightbox singleton condiviso fra tutti i caroselli.
 *
 * API:
 *   window.MediaLightbox.open(carouselInstance)  // apre puntando alla slide attiva
 *   window.MediaLightbox.close()
 *
 * Caratteristiche:
 *   - Markup montato una sola volta in <body>.
 *   - Focus trap, restituzione del focus al trigger.
 *   - <main> messo in `inert` mentre aperto.
 *   - Tastiera: ESC chiude, ← → navigano.
 *   - Swipe per navigare.
 *   - Max 90vw / 86vh, fade + leggera scala su apertura.
 */

(function () {
  "use strict";

  function build() {
    const overlay = document.createElement("div");
    overlay.className = "c-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Anteprima immagine");
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="c-lightbox__backdrop" data-lightbox-close></div>
      <div class="c-lightbox__stage">
        <button type="button" class="c-lightbox__btn c-lightbox__btn--prev" aria-label="Immagine precedente">‹</button>
        <figure class="c-lightbox__figure">
          <img class="c-lightbox__image" alt="" />
          <figcaption class="c-lightbox__caption" aria-live="polite"></figcaption>
        </figure>
        <button type="button" class="c-lightbox__btn c-lightbox__btn--next" aria-label="Immagine successiva">›</button>
        <button type="button" class="c-lightbox__close" aria-label="Chiudi anteprima" data-lightbox-close>×</button>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  let overlay = null;
  let imgEl = null;
  let captionEl = null;
  let prevBtn = null;
  let nextBtn = null;
  let closeBtns = [];
  let activeCarousel = null;
  let activeIndex = 0;
  let lastFocus = null;
  let touchStartX = 0;
  let touchActive = false;

  function ensure() {
    if (overlay) return;
    overlay = build();
    imgEl = overlay.querySelector(".c-lightbox__image");
    captionEl = overlay.querySelector(".c-lightbox__caption");
    prevBtn = overlay.querySelector(".c-lightbox__btn--prev");
    nextBtn = overlay.querySelector(".c-lightbox__btn--next");
    closeBtns = overlay.querySelectorAll("[data-lightbox-close]");

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
    closeBtns.forEach((b) => b.addEventListener("click", close));

    overlay.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".c-lightbox__btn")) return;
      if (e.target.closest(".c-lightbox__close")) return;
      touchActive = true;
      touchStartX = e.clientX;
    });
    overlay.addEventListener("pointerup", (e) => {
      if (!touchActive) return;
      touchActive = false;
      const dx = e.clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx > 0) prev();
        else next();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (overlay.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "Tab") {
        // semplice focus trap fra i bottoni
        const focusables = [prevBtn, nextBtn, overlay.querySelector(".c-lightbox__close")];
        const idx = focusables.indexOf(document.activeElement);
        if (e.shiftKey) {
          if (idx <= 0) {
            e.preventDefault();
            focusables[focusables.length - 1].focus();
          }
        } else if (idx === -1 || idx === focusables.length - 1) {
          e.preventDefault();
          focusables[0].focus();
        }
      }
    });
  }

  function render() {
    if (!activeCarousel) return;
    const images = activeCarousel.getImages();
    const total = images.length;
    if (total === 0) return;
    activeIndex = ((activeIndex % total) + total) % total;
    const data = images[activeIndex];
    imgEl.classList.remove("is-loaded");
    imgEl.src = data.src;
    imgEl.alt = data.alt || "";
    if (typeof imgEl.decode === "function") {
      imgEl.decode().then(() => imgEl.classList.add("is-loaded")).catch(() => imgEl.classList.add("is-loaded"));
    } else {
      imgEl.classList.add("is-loaded");
    }
    captionEl.textContent = `${activeIndex + 1} / ${total}`;
    prevBtn.hidden = total <= 1;
    nextBtn.hidden = total <= 1;
  }

  function prev() {
    if (!activeCarousel) return;
    activeIndex--;
    render();
  }
  function next() {
    if (!activeCarousel) return;
    activeIndex++;
    render();
  }

  function open(carousel) {
    ensure();
    if (!carousel) return;
    activeCarousel = carousel;
    activeIndex = carousel.index || 0;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("c-lightbox-open");
    const main = document.querySelector("main");
    if (main && "inert" in main) main.inert = true;
    render();
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      const closeBtn = overlay.querySelector(".c-lightbox__close");
      if (closeBtn) closeBtn.focus();
    });
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("c-lightbox-open");
    const main = document.querySelector("main");
    if (main && "inert" in main) main.inert = false;
    window.setTimeout(() => {
      overlay.hidden = true;
      imgEl.removeAttribute("src");
      activeCarousel = null;
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }, 200);
  }

  window.MediaLightbox = { open, close };
})();
