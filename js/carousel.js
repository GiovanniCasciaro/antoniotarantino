/**
 * MediaCarousel - sistema unificato editorial vanilla
 *
 * Auto-init su qualunque elemento con [data-carousel].
 * Varianti supportate via [data-carousel-variant]:
 *   - "editorial-3up"  : tre slide affiancate, centrale grande nitida, laterali blur
 *   - "gallery"        : una slide a tutta larghezza, transizione orizzontale
 *   - "rooms"          : una slide alla volta con dots, ottimizzato per camere bnb
 *
 * Config opzionali:
 *   - data-carousel-loop="true|false"      (default true)
 *   - data-carousel-autoplay="5000"        (ms, 0 o assente disabilita)
 *   - data-carousel-lightbox="true|false"  (default false)
 *   - data-carousel-counter="true|false"   (default true)
 *   - data-carousel-dots="true|false"      (default false; on per "rooms")
 */

(function () {
  "use strict";

  const PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  class MediaCarousel {
    constructor(root) {
      this.root = root;
      this.viewport = root.querySelector(".c-carousel__viewport");
      this.track = root.querySelector(".c-carousel__track");
      if (!this.viewport || !this.track) return;

      this.slides = Array.from(this.track.children);
      this.total = this.slides.length;
      if (this.total === 0) return;

      this.variant = root.dataset.carouselVariant || "gallery";
      this.loop = root.dataset.carouselLoop !== "false";
      this.autoplayMs = parseInt(root.dataset.carouselAutoplay || "0", 10);
      this.useLightbox = root.dataset.carouselLightbox === "true";
      this.showCounter = root.dataset.carouselCounter !== "false";
      this.showDots = root.dataset.carouselDots === "true" || this.variant === "rooms";

      this.index = 0;
      this.autoplayId = null;
      this.isVisible = false;
      this.slideWidth = 0;
      this.mqMobile = window.matchMedia("(max-width: 767px)");
      this._navLock = false;

      this.prevBtn = root.querySelector(".c-carousel__btn--prev");
      this.nextBtn = root.querySelector(".c-carousel__btn--next");
      this.counterEl = root.querySelector(".c-carousel__counter");
      this.dotsEl = root.querySelector(".c-carousel__dots");

      this._setup();
    }

    _setup() {
      this.root.setAttribute("role", this.root.getAttribute("role") || "region");
      this.root.setAttribute("aria-roledescription", "carousel");
      this.root.classList.add("c-carousel--ready");
      this.root.classList.add(`c-carousel--${this.variant}`);

      this.slides.forEach((slide, i) => {
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `${i + 1} di ${this.total}`);
        slide.dataset.index = String(i);

        const img = slide.querySelector("img");
        if (img) {
          img.setAttribute("decoding", "async");
          if (i < 2 && !img.hasAttribute("loading")) {
            img.setAttribute("loading", "eager");
          } else if (!img.hasAttribute("loading")) {
            img.setAttribute("loading", "lazy");
          }
          img.setAttribute("draggable", "false");
        }
      });

      // Frecce
      if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.prev());
      if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.next());

      // Dots
      if (this.showDots && this.dotsEl) {
        this._buildDots();
      } else if (this.dotsEl) {
        this.dotsEl.hidden = true;
      }

      // Counter
      if (!this.showCounter && this.counterEl) {
        this.counterEl.hidden = true;
      }

      // Tastiera (focus sul carosello)
      this.root.tabIndex = 0;
      this.root.addEventListener("keydown", (e) => this._onKey(e));

      // Pointer / swipe
      this._bindPointer();

      // Click apre lightbox (se richiesto)
      if (this.useLightbox && window.MediaLightbox) {
        this.viewport.addEventListener("click", (e) => {
          if (e.target.closest(".c-carousel__btn")) return;
          if (e.target.closest(".c-carousel__dot")) return;
          // editorial-3up: solo click sulla slide attiva
          if (this.variant === "editorial-3up" && !this._isMobileSingle()) {
            const activeSlide = this.track.querySelector(".is-active");
            if (!activeSlide || !activeSlide.contains(e.target)) return;
          }
          window.MediaLightbox.open(this);
        });
      }

      // Intersection observer: pausa autoplay fuori viewport, animazioni dolci all'ingresso
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              this.isVisible = entry.isIntersecting;
              if (entry.isIntersecting) {
                this.root.classList.add("is-visible");
                if (this.autoplayMs > 0) this._startAutoplay();
              } else {
                this._stopAutoplay();
              }
            });
          },
          { threshold: 0.2 }
        );
        io.observe(this.root);
      } else if (this.autoplayMs > 0) {
        this._startAutoplay();
      }

      // Pausa autoplay su hover/focus
      this.root.addEventListener("mouseenter", () => this._stopAutoplay());
      this.root.addEventListener("mouseleave", () => {
        if (this.isVisible && this.autoplayMs > 0) this._startAutoplay();
      });
      this.root.addEventListener("focusin", () => this._stopAutoplay());
      this.root.addEventListener("focusout", () => {
        if (this.isVisible && this.autoplayMs > 0) this._startAutoplay();
      });

      this._syncMobileMode();
      if (typeof this.mqMobile.addEventListener === "function") {
        this.mqMobile.addEventListener("change", () => this._onMobileBreakpoint());
      } else if (typeof this.mqMobile.addListener === "function") {
        this.mqMobile.addListener(() => this._onMobileBreakpoint());
      }

      if ("ResizeObserver" in window && this.viewport) {
        let resizeTimer;
        this._resizeObs = new ResizeObserver(() => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(() => {
            if (this._isGalleryFlush()) {
              this._syncFlushGallerySize();
              this._renderLinear(true);
            } else if (this._usesLinearLayout()) {
              this.goTo(this.index, { instant: true });
            }
          }, 120);
        });
        this._resizeObs.observe(this.viewport);
      }

      if (this._isGalleryFlush()) {
        this.slides.forEach((slide) => {
          const img = slide.querySelector("img");
          if (!img) return;
          img.addEventListener("load", () => this.goTo(this.index, { instant: true }));
        });
      }

      this.goTo(0, { instant: true });
    }

    _isGalleryFlush() {
      return this.root.classList.contains("c-carousel--gallery-flush");
    }

    _syncFlushGallerySize() {
      if (!this._isGalleryFlush()) return;
      const img = this.slides[this.index]?.querySelector("img");
      if (!img || !img.naturalWidth || !img.naturalHeight) return;
      const maxW = Math.min(680, window.innerWidth * 0.9);
      const maxH = Math.min(460, window.innerHeight * 0.52);
      const scale = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      this.root.style.width = `${w}px`;
      this.viewport.style.height = `${h}px`;
    }

    _usesLinearLayout() {
      return this.variant !== "editorial-3up" || this._isMobileSingle();
    }

    _isMobileSingle() {
      return this.variant === "editorial-3up" && this.mqMobile.matches;
    }

    _syncMobileMode() {
      this.root.classList.toggle("c-carousel--mobile-single", this._isMobileSingle());
    }

    _onMobileBreakpoint() {
      this._syncMobileMode();
      this.goTo(this.index, { instant: true });
    }

    _buildDots() {
      this.dotsEl.innerHTML = "";
      this.dotsEl.setAttribute("role", "tablist");
      for (let i = 0; i < this.total; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "c-carousel__dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Vai alla slide ${i + 1}`);
        dot.addEventListener("click", () => this.goTo(i));
        this.dotsEl.appendChild(dot);
      }
      this.dots = Array.from(this.dotsEl.children);
    }

    _bindPointer() {
      let startX = 0;
      let startY = 0;
      let active = false;
      const threshold = 40;

      const onDown = (e) => {
        if (e.target.closest(".c-carousel__btn")) return;
        if (e.target.closest(".c-carousel__dot")) return;
        active = true;
        startX = e.clientX;
        startY = e.clientY;
      };
      const onUp = (e) => {
        if (!active) return;
        active = false;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
        if (dx > 0) this.prev();
        else this.next();
      };
      this.viewport.addEventListener("pointerdown", onDown);
      this.viewport.addEventListener("pointerup", onUp);
      this.viewport.addEventListener("pointercancel", () => {
        active = false;
      });
    }

    _onKey(e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.next();
      } else if (e.key === "Home") {
        e.preventDefault();
        this.goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        this.goTo(this.total - 1);
      }
    }

    _startAutoplay() {
      this._stopAutoplay();
      if (PREFERS_REDUCED) return;
      this.autoplayId = window.setInterval(() => this.next(), this.autoplayMs);
    }

    _stopAutoplay() {
      if (this.autoplayId) {
        clearInterval(this.autoplayId);
        this.autoplayId = null;
      }
    }

    _preload(i) {
      const slide = this.slides[i];
      if (!slide) return;
      const img = slide.querySelector("img");
      if (!img) return;
      if (img.getAttribute("loading") === "lazy") {
        img.loading = "eager";
      }
      const src = img.getAttribute("src");
      if (src && !img.complete) {
        const pre = new Image();
        pre.src = src;
      }
    }

    _layoutLinearTrack() {
      const w = Math.round(this.viewport.clientWidth);
      if (!w) return 0;
      this.slideWidth = w;
      this.root.style.setProperty("--c-carousel-slide-w", `${w}px`);
      this.track.style.width = `${w * this.total}px`;
      return w;
    }

    _clearLinearLayout() {
      this.slideWidth = 0;
      this.track.style.width = "";
      this.track.style.transform = "";
      this.root.style.removeProperty("--c-carousel-slide-w");
    }

    next() {
      this.goTo(this.index + 1);
    }
    prev() {
      this.goTo(this.index - 1);
    }

    goTo(target, opts = {}) {
      const { instant = false } = opts;
      if (this.total <= 0) return;
      if (!instant && this._navLock) return;
      let next;
      if (this.loop) {
        next = ((target % this.total) + this.total) % this.total;
      } else {
        next = Math.max(0, Math.min(this.total - 1, target));
      }
      this.index = next;

      if (this._isMobileSingle()) {
        this._renderLinear(instant);
      } else if (this.variant === "editorial-3up") {
        this._renderEditorial(instant);
      } else {
        this._renderLinear(instant);
      }

      this._renderCounter();
      this._renderDots();
      this._preload(next);
      this._preload((next + 1) % this.total);
      this._preload((next - 1 + this.total) % this.total);

      if (!instant && !this._isMobileSingle() && this.variant === "editorial-3up") {
        this._navLock = true;
        window.clearTimeout(this._navLockId);
        this._navLockId = window.setTimeout(() => {
          this._navLock = false;
        }, 380);
      }

      this.root.dispatchEvent(
        new CustomEvent("carousel:change", { detail: { index: this.index, total: this.total } })
      );
    }

    _renderEditorial(instant) {
      this._clearLinearLayout();
      const len = this.total;
      const offset = (i) => {
        let d = i - this.index;
        if (d > len / 2) d -= len;
        if (d < -len / 2) d += len;
        return d;
      };
      this.slides.forEach((slide, i) => {
        const o = offset(i);
        slide.classList.remove("is-active", "is-prev", "is-next", "is-far");
        if (o === 0) slide.classList.add("is-active");
        else if (o === -1) slide.classList.add("is-prev");
        else if (o === 1) slide.classList.add("is-next");
        else slide.classList.add("is-far");
      });
      if (instant) {
        // eslint-disable-next-line no-unused-expressions
        this.track.offsetHeight;
      }
    }

    _renderLinear(instant) {
      if (this._isGalleryFlush()) this._syncFlushGallerySize();
      const w = this._layoutLinearTrack();
      if (!w) {
        if (!this._linearLayoutPending) {
          this._linearLayoutPending = true;
          requestAnimationFrame(() => {
            this._linearLayoutPending = false;
            this._renderLinear(instant);
          });
        }
        return;
      }
      const offset = this.index * w;
      this.track.style.transition = instant ? "none" : "";
      this.track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      this.slides.forEach((slide, i) => {
        slide.classList.remove("is-prev", "is-next", "is-far");
        slide.classList.toggle("is-active", i === this.index);
        slide.style.transition = instant ? "none" : "";
      });
      if (instant) {
        // eslint-disable-next-line no-unused-expressions
        this.track.offsetHeight;
        this.track.style.transition = "";
        this.slides.forEach((s) => (s.style.transition = ""));
      }
    }

    _renderCounter() {
      if (!this.showCounter || !this.counterEl) return;
      const len = this.total;
      const curr = this.index + 1;
      const prev = ((this.index - 1 + len) % len) + 1;
      const next = ((this.index + 1) % len) + 1;
      this.counterEl.innerHTML = `<span class="c-carousel__counter-side">${prev}</span><span class="c-carousel__counter-sep">/</span><span class="c-carousel__counter-current">${curr}</span><span class="c-carousel__counter-sep">/</span><span class="c-carousel__counter-side">${next}</span>`;
    }

    _renderDots() {
      if (!this.showDots || !this.dots) return;
      this.dots.forEach((d, i) => {
        d.classList.toggle("is-active", i === this.index);
        d.setAttribute("aria-selected", i === this.index ? "true" : "false");
      });
    }

    getCurrentSlide() {
      return this.slides[this.index] || null;
    }

    getImages() {
      return this.slides
        .map((s) => {
          const img = s.querySelector("img");
          return img ? { src: img.currentSrc || img.src, alt: img.alt || "" } : null;
        })
        .filter(Boolean);
    }
  }

  function autoInit() {
    const roots = document.querySelectorAll("[data-carousel]");
    roots.forEach((root) => {
      if (!root.__carousel) {
        root.__carousel = new MediaCarousel(root);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }

  window.MediaCarousel = MediaCarousel;
})();
