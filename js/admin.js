document.addEventListener("DOMContentLoaded", () => {
  const PASS_KEY = "at_admin_pass";
  const SESSION_KEY = "at_admin_session";
  const EVENTS_KEY = "at_events";

  const setupCard = document.getElementById("setupCard");
  const setupForm = document.getElementById("adminSetup");
  const setupStatus = document.getElementById("setupStatus");
  const loginCard = document.getElementById("loginCard");
  const adminPanel = document.getElementById("adminPanel");
  const loginForm = document.getElementById("adminLogin");
  const loginStatus = document.getElementById("loginStatus");
  const eventForm = document.getElementById("eventForm");
  const eventList = document.getElementById("eventList");
  const logoutBtn = document.getElementById("logoutBtn");
  const clearEvents = document.getElementById("clearEvents");

  if (!setupCard || !loginCard || !adminPanel) return;

  const getEvents = () => JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
  const setEvents = (events) => localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

  const renderEvents = () => {
    const events = getEvents();
    if (!eventList) return;
    if (!events.length) {
      eventList.innerHTML = "<p class='form-status'>Nessun evento salvato.</p>";
      return;
    }
    eventList.innerHTML = events
      .map(
        (eventItem, index) => `
        <div class="admin-list-item">
          <strong>${eventItem.title}</strong>
          <span>${eventItem.place} · ${eventItem.month} ${eventItem.year}</span>
          <p class="form-status">${eventItem.description}</p>
          <div class="admin-actions">
            <button class="btn btn-outline" type="button" data-remove="${index}">Rimuovi</button>
          </div>
        </div>
      `
      )
      .join("");
  };

  const showPanel = () => {
    setupCard.hidden = true;
    loginCard.hidden = true;
    adminPanel.hidden = false;
    renderEvents();
  };

  const showLogin = () => {
    setupCard.hidden = true;
    loginCard.hidden = false;
    adminPanel.hidden = true;
  };

  const showSetup = () => {
    setupCard.hidden = false;
    loginCard.hidden = true;
    adminPanel.hidden = true;
  };

  const savedPass = localStorage.getItem(PASS_KEY);
  if (!savedPass) {
    showSetup();
  } else if (sessionStorage.getItem(SESSION_KEY) === "true") {
    showPanel();
  } else {
    showLogin();
  }

  setupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(setupForm);
    const pass = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (pass.length < 6) {
      if (setupStatus) setupStatus.textContent = "Usa almeno 6 caratteri.";
      return;
    }
    if (pass !== confirm) {
      if (setupStatus) setupStatus.textContent = "Le password non coincidono.";
      return;
    }
    localStorage.setItem(PASS_KEY, pass);
    sessionStorage.setItem(SESSION_KEY, "true");
    if (setupStatus) setupStatus.textContent = "";
    showPanel();
  });

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = new FormData(loginForm).get("password");
    const currentPass = localStorage.getItem(PASS_KEY);
    if (currentPass && password === currentPass) {
      sessionStorage.setItem(SESSION_KEY, "true");
      if (loginStatus) loginStatus.textContent = "";
      showPanel();
    } else {
      if (loginStatus) loginStatus.textContent = "Password errata.";
    }
  });

  logoutBtn?.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  clearEvents?.addEventListener("click", () => {
    setEvents([]);
    renderEvents();
  });

  eventForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(eventForm);
    const images = String(data.get("images") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const newEvent = {
      title: String(data.get("title") || ""),
      place: String(data.get("place") || ""),
      month: String(data.get("month") || ""),
      year: String(data.get("year") || ""),
      description: String(data.get("description") || ""),
      images
    };
    const events = getEvents();
    events.unshift(newEvent);
    setEvents(events);
    eventForm.reset();
    renderEvents();
  });

  eventList?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-remove]");
    if (!target) return;
    const index = Number(target.dataset.remove);
    const events = getEvents();
    events.splice(index, 1);
    setEvents(events);
    renderEvents();
  });
});
