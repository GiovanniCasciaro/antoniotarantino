document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Overlay di caricamento: schermo bianco + "Antonio Tarantino" tra una pagina e l’altra
  const loadingOverlay = document.createElement("div");
  loadingOverlay.id = "page-loading-overlay";
  loadingOverlay.className = "page-loading-overlay";
  loadingOverlay.setAttribute("aria-hidden", "true");
  loadingOverlay.innerHTML = '<span class="page-loading-overlay__text">Antonio Tarantino</span>';
  document.body.appendChild(loadingOverlay);

  const showPageLoading = (href) => {
    loadingOverlay.classList.add("is-visible");
    loadingOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      window.location.href = href;
    }, 900);
  };

  const isInternalLink = (href) => {
    if (!href || href === "#" || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return false;
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return true;
    }
  };

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;
    if (href === "#") return;
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    if (!isInternalLink(href)) return;
    e.preventDefault();
    showPageLoading(href);
  });

  // Smooth scroll per link in-page (gestito sopra con #)

  const body = document.body;
  const toggle = document.getElementById("menuToggle");
  const panel = document.getElementById("staggeredMenu");
  const backdrop = document.getElementById("menuBackdrop");
  const closeBtn = document.querySelector(".sm-close");

  const setMenuOpen = (isOpen) => {
    body.classList.toggle("sm-open", isOpen);
    if (toggle) toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (panel) panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
    if (backdrop) backdrop.hidden = !isOpen;
  };

  if (toggle && panel && backdrop) {
    toggle.addEventListener("click", () => {
      const isOpen = body.classList.contains("sm-open");
      setMenuOpen(!isOpen);
    });

    backdrop.addEventListener("click", () => setMenuOpen(false));
    if (closeBtn) {
      closeBtn.addEventListener("click", () => setMenuOpen(false));
    }
    panel.addEventListener("click", (event) => {
      const target = event.target.closest("a");
      if (!target) return;
      const href = target.getAttribute("href") || "";
      if (href.startsWith("#")) {
        setMenuOpen(false);
        return;
      }
      event.preventDefault();
      setMenuOpen(false);
      showPageLoading(href);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("sm-open")) {
      setMenuOpen(false);
    }
  });

  // Header trasparente su desktop: aggiunge sfondo dopo lo scroll (stile Dolce & Gabbana)
  const header = document.querySelector(".header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Desktop: pulsante comprimi navbar (nasconde logo, mantiene link)
  const navCompressBtn = document.querySelector(".js-nav-compress");
  if (navCompressBtn && header) {
    const storageKey = "at_nav_compressed";
    const isCompressed = () => sessionStorage.getItem(storageKey) === "1";
    const setCompressed = (compressed) => {
      sessionStorage.setItem(storageKey, compressed ? "1" : "0");
      header.classList.toggle("is-compressed", compressed);
      document.body.classList.toggle("header-nav-compressed", compressed);
      navCompressBtn.setAttribute("aria-label", compressed ? "Espandi navbar" : "Comprimi navbar");
      navCompressBtn.setAttribute("title", compressed ? "Espandi navbar" : "Comprimi navbar");
    };
    if (isCompressed()) setCompressed(true);
    navCompressBtn.addEventListener("click", () => setCompressed(!isCompressed()));
  }

  const cookieBanner = document.getElementById("cookieBanner");
  const cookieAccept = document.getElementById("cookieAccept");
  const cookieReject = document.getElementById("cookieReject");
  const COOKIE_KEY = "at_cookie_consent";

  const hideCookieBanner = () => cookieBanner && cookieBanner.classList.remove("is-visible");

  if (cookieBanner) {
    if (!localStorage.getItem(COOKIE_KEY)) {
      cookieBanner.classList.add("is-visible");
    }
    if (cookieAccept) {
      cookieAccept.addEventListener("click", () => {
        localStorage.setItem(COOKIE_KEY, "accepted");
        hideCookieBanner();
      });
    }
    if (cookieReject) {
      cookieReject.addEventListener("click", () => {
        localStorage.setItem(COOKIE_KEY, "rejected");
        hideCookieBanner();
      });
    }
  }

  // Biografia fullscreen lightbox (solo su index)
  const bioLightbox = document.getElementById("bioFullscreenLightbox");
  const bioLightboxMedia = document.querySelector(".bio-fullscreen-lightbox__media");
  const bioLightboxClose = document.querySelector(".bio-fullscreen-lightbox__close");
  const bioLightboxScrim = document.querySelector(".bio-fullscreen-lightbox__scrim");

  if (bioLightbox && bioLightboxMedia) {
    const openBioFullscreen = (src, isVideo) => {
      bioLightboxMedia.innerHTML = "";
      if (isVideo) {
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.classList.add("bio-fullscreen-video");
        bioLightboxMedia.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Visualizzazione a schermo intero";
        bioLightboxMedia.appendChild(img);
      }
      bioLightbox.hidden = false;
      bioLightbox.classList.add("is-open");
      document.body.classList.add("bio-fullscreen-open");
    };

    const closeBioFullscreen = () => {
      const video = bioLightboxMedia.querySelector("video");
      if (video) {
        video.pause();
        video.removeAttribute("src");
      }
      bioLightboxMedia.innerHTML = "";
      bioLightbox.classList.remove("is-open");
      bioLightbox.hidden = true;
      document.body.classList.remove("bio-fullscreen-open");
    };

    document.querySelectorAll(".image-card--expandable").forEach((card) => {
      card.addEventListener("click", (e) => {
        const img = card.querySelector("img.image-content");
        const video = card.querySelector("video.image-content");
        if (img && img.src) {
          e.preventDefault();
          openBioFullscreen(img.src, false);
        } else if (video && video.src) {
          e.preventDefault();
          openBioFullscreen(video.src, true);
        }
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    if (bioLightboxClose) bioLightboxClose.addEventListener("click", closeBioFullscreen);
    if (bioLightboxScrim) bioLightboxScrim.addEventListener("click", closeBioFullscreen);
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && bioLightbox.classList.contains("is-open")) {
        closeBioFullscreen();
      }
    });
  }

  // Form contatti: invio via mail (apre client email con dati precompilati)
  // Bottone torna su – transizione lenta verso l'alto
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    const SCROLL_DURATION_MS = 900;
    const SHOW_AFTER_PX = 320;

    const scrollToTop = () => {
      const start = window.pageYOffset;
      const startTime = performance.now();
      const easeOutCubic = (t) => 1 - (1 - t) ** 3;

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / SCROLL_DURATION_MS, 1);
        window.scrollTo(0, start * (1 - easeOutCubic(progress)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const toggleVisibility = () => {
      backToTop.classList.toggle("is-visible", window.pageYOffset > SHOW_AFTER_PX);
    };

    backToTop.addEventListener("click", scrollToTop);
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (contactForm.querySelector('[name="name"]')?.value || "").trim();
      const email = (contactForm.querySelector('[name="email"]')?.value || "").trim();
      const message = (contactForm.querySelector('[name="message"]')?.value || "").trim();
      const subject = encodeURIComponent("Messaggio da antoniotarantino.com – " + (name || "Contatto"));
      const body = encodeURIComponent(
        (name ? "Nome: " + name + "\n\n" : "") +
          (email ? "Email: " + email + "\n\n" : "") +
          "Messaggio:\n" + message
      );
      const mailto = "mailto:info@antoniotarantino.com?subject=" + subject + "&body=" + body;
      window.location.href = mailto;
    });
  }
});
