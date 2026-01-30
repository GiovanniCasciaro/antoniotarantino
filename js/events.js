document.addEventListener("DOMContentLoaded", () => {
  const eventsGrid = document.getElementById("eventsGrid");
  if (!eventsGrid) return;

  const fallbackEvents = [
    {
      title: "Atelier Aperto",
      place: "Lecce",
      month: "Aprile",
      year: "2025",
      description: "Visita privata in atelier con presentazione di capsule collection.",
      images: ["media/antonio-logo.png", "media/antonio-logo-removebg-preview.png"]
    },
    {
      title: "Salon Experience",
      place: "Milano",
      month: "Giugno",
      year: "2025",
      description: "Evento dedicato a haircare e styling con consulenze personalizzate.",
      images: ["media/antonio-logo-removebg-preview.png", "media/antonio-logo.png"]
    }
  ];

  const storedEvents = JSON.parse(localStorage.getItem("at_events") || "[]");
  const events = storedEvents.length ? storedEvents : fallbackEvents;

  const buildCarousel = (images, index) => {
    const slides = images
      .map(
        (src, i) =>
          `<div class="event-slide${i === 0 ? " is-active" : ""}" data-index="${i}">
            <img src="${src}" alt="Evento ${index + 1} immagine ${i + 1}" />
          </div>`
      )
      .join("");
    const dots = images
      .map(
        (src, i) =>
          `<button class="event-dot${i === 0 ? " is-active" : ""}" type="button" data-index="${i}" aria-label="Vai a immagine ${i + 1}"></button>`
      )
      .join("");
    return `
      <div class="event-carousel" data-carousel>
        <div class="event-slides">${slides}</div>
        <div class="event-controls">
          <button class="event-btn" type="button" data-prev aria-label="Immagine precedente">‹</button>
          <div class="event-dots">${dots}</div>
          <button class="event-btn" type="button" data-next aria-label="Immagine successiva">›</button>
        </div>
      </div>`;
  };

  eventsGrid.innerHTML = events
    .map(
      (eventItem, index) => `
      <article class="event-card">
        <div class="event-meta">
          <span class="event-place">${eventItem.place}</span>
          <span class="event-date">${eventItem.month} ${eventItem.year}</span>
        </div>
        <h3>${eventItem.title}</h3>
        <p>${eventItem.description}</p>
        ${buildCarousel(eventItem.images, index)}
      </article>
    `
    )
    .join("");

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".event-slide"));
    const dots = Array.from(carousel.querySelectorAll(".event-dot"));
    const prev = carousel.querySelector("[data-prev]");
    const next = carousel.querySelector("[data-next]");
    let current = 0;

    const goTo = (index) => {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
    };

    if (prev) prev.addEventListener("click", () => goTo(current - 1));
    if (next) next.addEventListener("click", () => goTo(current + 1));
    dots.forEach((dot) =>
      dot.addEventListener("click", () => goTo(Number(dot.dataset.index)))
    );
  });
});
