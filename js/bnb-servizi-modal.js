document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("bnbServiziModal");
  const openButtons = document.querySelectorAll(".js-bnb-servizi-open");
  const closeBtn = modal?.querySelector(".bnb-servizi-modal__close");
  const scrim = modal?.querySelector(".bnb-servizi-modal__scrim");

  if (!modal) return;

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("bnb-servizi-modal-open");
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("bnb-servizi-modal-open");
  };

  openButtons.forEach((btn) => btn.addEventListener("click", open));
  closeBtn?.addEventListener("click", close);
  scrim?.addEventListener("click", () => {
    if (scrim.getAttribute("data-close") === "true") close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
});
