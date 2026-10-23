const DAILY_MENUS = [
  {
    day: "Hétfő",
    soup: { name: "Csontleves cérnametélttel" },
    mains: [
      { name: "Rántott csirkemell", desc: "sültburgonya, párolt rizs, savanyúság" },
      { name: "Bolognai spagetti", desc: "darált húsos paradicsomos ragu, sajt" }
    ],
    price: 2690,
    soupPrice: 1590
  },
  {
    day: "Kedd",
    soup: { name: "Babgulyás" },
    mains: [
      { name: "Roston csirkemell", desc: "sültburgonya, párolt rizs, savanyúság" },
      { name: "Rántott sertéskaraj", desc: "sültburgonya, párolt rizs, savanyúság" }
    ],
    price: 2790,
    soupPrice: 1590
  },
  {
    day: "Szerda",
    soup: { name: "Bográcsgulyás" },
    mains: [
      { name: "Sajttal, sonkával töltött csirkemell", desc: "sültburgonya, párolt rizs, savanyúság" },
      { name: "Spagetti a’la Carbonara", desc: "sonka, bacon, tejszín, fokhagyma, sajt" }
    ],
    price: 2890,
    soupPrice: 1690
  },
  {
    day: "Csütörtök",
    soup: { name: "Csontleves cérnametélttel" },
    mains: [
      { name: "Rántott csirkemell", desc: "sültburgonya, párolt rizs, savanyúság" },
      { name: "Bolognai spagetti", desc: "darált húsos paradicsomos ragu, sajt" },
      { name: "Rántott trapista sajt", desc: "3 db, sültburgonya, párolt rizs, tartármártás", vegetarian: true }
    ],
    price: 2690,
    soupPrice: 1590
  },
  {
    day: "Péntek",
    soup: { name: "Babgulyás" },
    mains: [
      { name: "Roston sült sertéstarja", desc: "sültburgonya, párolt rizs, savanyúság" },
      { name: "Bols saláta", desc: "grillezett csirkemell, főtt tojás, joghurtos kapros öntet" }
    ],
    price: 2890,
    soupPrice: 1690
  },
  {
    day: "Szombat",
    soup: { name: "Bográcsgulyás" },
    mains: [
      { name: "Sajttal, sonkával töltött csirkemell", desc: "sültburgonya, párolt rizs, savanyúság" },
      { name: "Marhapörkölt galuskával", desc: "savanyúsággal" }
    ],
    price: 3290,
    soupPrice: 1690
  },
  {
    day: "Vasárnap",
    soup: { name: "Csontleves cérnametélttel" },
    mains: [
      { name: "Rántott csirkemell", desc: "sültburgonya, párolt rizs, savanyúság" },
      { name: "Rántott trapista sajt", desc: "3 db, sültburgonya, párolt rizs, tartármártás", vegetarian: true }
    ],
    price: 2890,
    soupPrice: 1590
  }
];

const SCENARIO_LABELS = {
  full: "teljes minta",
  soup: "csak leves",
  empty: "nincs menü"
};

const todayIndex = (new Date().getDay() + 6) % 7;
const state = { demo: null };

const dailyCard = document.getElementById("dailyCard");
const dailyDate = document.getElementById("dailyDate");
const dailyDateLabel = document.getElementById("dailyDateLabel");
const dailyTitle = document.getElementById("dailyTitle");
const dailyStatus = document.getElementById("dailyStatus");
const previewBanner = document.getElementById("previewBanner");
const previewLabel = document.getElementById("previewLabel");
const demoDialog = document.getElementById("demoDialog");
const demoForm = document.getElementById("demoForm");
const dayGrid = document.getElementById("dayGrid");
const openDemoButton = document.getElementById("openDemo");
const exitDemoButton = document.getElementById("exitDemo");
const resetDemoButton = document.getElementById("resetDemo");
const closeDemoButton = document.getElementById("closeDemo");
let lastDemoTrigger = null;
let restoreFocus = true;
let pointerFocus = false;

document.addEventListener("pointerdown", () => { pointerFocus = true; }, true);
document.addEventListener("keydown", () => {
  pointerFocus = false;
  demoDialog.classList.remove("pointer-open");
}, true);

function focusTarget(element) {
  element.focus({ preventScroll: true, focusVisible: !pointerFocus });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function priceFormat(value) {
  return new Intl.NumberFormat("hu-HU").format(value);
}

function dateFormat(date) {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  }).format(date);
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateForWeekday(index) {
  const now = new Date();
  const currentIndex = (now.getDay() + 6) % 7;
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  date.setDate(date.getDate() + ((index - currentIndex + 7) % 7));
  return date;
}

function courseMarkup(item) {
  const tag = item.vegetarian ? ' <span class="dish-tag">vegetáriánus</span>' : "";
  const desc = item.desc ? `<span class="course-desc">${item.desc}</span>` : "";
  return `<li><div class="course-copy"><span class="course-name">${item.name}${tag}</span>${desc}</div></li>`;
}

function fullMenuMarkup(menu) {
  return `
    <article class="daily-menu">
      <div class="daily-menu-head">
        <p class="service-label">Minta napi menü <span class="tag">MINTA</span></p>
        <p class="service-note">A fogások a 2026-os étlapról származnak, az összeállítás és az ár minta.</p>
      </div>
      <div class="course-group">
        <h3>Leves</h3>
        <ul class="course-list">${courseMarkup(menu.soup)}</ul>
      </div>
      <div class="course-group">
        <h3>Főételek</h3>
        <ul class="course-list">${menu.mains.map(courseMarkup).join("")}</ul>
      </div>
      <div class="daily-total">
        <span>Minta menü ára</span>
        <strong>${priceFormat(menu.price)} Ft</strong>
      </div>
      <p class="service-note service-note-bottom">Az ár nem valós, kizárólag a demó része. A napi kínálatért hívja a +36 30 978 7407 számot.</p>
    </article>
  `;
}

function soupOnlyMarkup(menu) {
  return `
    <article class="daily-menu">
      <div class="daily-menu-head">
        <p class="service-label">Minta napi menü <span class="tag">MINTA</span></p>
        <p class="service-note">Részleges előnézet: a főételek még nem kerültek fel.</p>
      </div>
      <div class="course-group">
        <h3>Leves</h3>
        <ul class="course-list">${courseMarkup(menu.soup)}</ul>
      </div>
      <div class="course-group">
        <h3>Főételek</h3>
        <p class="course-desc">A főételek ezen a napon még nem érkeztek meg. Kérjük, érdeklődjön telefonon.</p>
      </div>
      <div class="daily-total">
        <span>Minta leves ára</span>
        <strong>${priceFormat(menu.soupPrice)} Ft</strong>
      </div>
      <p class="service-note service-note-bottom">Az ár nem valós, kizárólag a demó része. A napi kínálatért hívja a +36 30 978 7407 számot.</p>
    </article>
  `;
}

function emptyMenuMarkup() {
  return `
    <article class="daily-empty">
      <p class="service-label">Napi menü <span class="tag">MINTA</span></p>
      <h3>Erre a napra még nincs közzétett menü.</h3>
      <p>Ilyenkor érdemes telefonon érdeklődni, vagy megnézni az étlapot. A napi ajánlat a helyszínen és telefonon is elérhető.</p>
      <a class="btn btn-light" href="tel:+36309787407">Hívás: +36 30 978 7407</a>
      <p class="service-note">Demó állapot: így nézne ki az oldal, ha a menü még nem lenne feltöltve.</p>
    </article>
  `;
}

function renderDaily(animate = false) {
  const dayIndex = state.demo ? state.demo.day : todayIndex;
  const scenario = state.demo ? state.demo.scenario : "full";
  const menu = DAILY_MENUS[dayIndex];
  const date = state.demo ? dateForWeekday(dayIndex) : new Date();

  dailyDate.textContent = dateFormat(date);
  dailyDate.setAttribute("datetime", isoDate(date));
  dailyDateLabel.textContent = state.demo ? "Előnézet" : "Ma";

  if (state.demo) {
    previewBanner.hidden = false;
    previewLabel.textContent = `${menu.day.toLocaleLowerCase("hu-HU")} · ${SCENARIO_LABELS[scenario]}`;
  } else {
    previewBanner.hidden = true;
  }

  if (scenario === "empty") {
    dailyCard.innerHTML = emptyMenuMarkup();
  } else if (scenario === "soup") {
    dailyCard.innerHTML = soupOnlyMarkup(menu);
  } else {
    dailyCard.innerHTML = fullMenuMarkup(menu);
  }

  if (animate && !prefersReducedMotion.matches) {
    dailyCard.classList.remove("is-updating");
    void dailyCard.offsetWidth;
    dailyCard.classList.add("is-updating");
  }

  dailyStatus.textContent = state.demo
    ? `Előnézet frissítve: ${menu.day}, ${SCENARIO_LABELS[scenario]}.`
    : "A mai minta napi menü megjelenítve.";
}

function populateDayChoices() {
  dayGrid.innerHTML = DAILY_MENUS.map((menu, index) => `
    <label class="day-option">
      <input type="radio" name="day" value="${index}" ${index === todayIndex ? "checked" : ""}>
      <span>${menu.day}</span>
    </label>
  `).join("");
}

function selectedValue(name) {
  const checked = demoForm.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

function openDemo(trigger) {
  lastDemoTrigger = trigger || openDemoButton;
  restoreFocus = true;
  const day = state.demo ? state.demo.day : todayIndex;
  const scenario = state.demo ? state.demo.scenario : "full";

  const dayInput = demoForm.querySelector(`input[name="day"][value="${day}"]`);
  if (dayInput) dayInput.checked = true;

  const scenarioInput = demoForm.querySelector(`input[name="scenario"][value="${scenario}"]`);
  if (scenarioInput) scenarioInput.checked = true;

  demoDialog.showModal();
  demoDialog.classList.toggle("pointer-open", pointerFocus);
  document.body.classList.add("dialog-open");
  focusTarget(closeDemoButton);
}

function closeDemo(restore = true) {
  restoreFocus = restore;
  demoDialog.close();
}

function resetDemo() {
  state.demo = null;
  renderDaily(true);
  closeDemo(false);
  dailyTitle.tabIndex = -1;
  focusTarget(dailyTitle);
  document.getElementById("napi-menu").scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start"
  });
}

function applyDemo() {
  const day = Number(selectedValue("day"));
  const scenario = selectedValue("scenario");

  if (!Number.isInteger(day) || !SCENARIO_LABELS[scenario]) return;

  state.demo = { day, scenario };
  renderDaily(true);
  closeDemo(false);
  dailyTitle.tabIndex = -1;
  focusTarget(dailyTitle);

  document.getElementById("napi-menu").scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start"
  });
}

const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const navLabel = navToggle.querySelector(".nav-toggle-label");

function setNav(open) {
  header.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navLabel.textContent = open ? "Bezárás" : "Menü";
  document.body.classList.toggle("nav-open", open && window.innerWidth <= 820);
}

navToggle.addEventListener("click", () => {
  setNav(!header.classList.contains("nav-open"));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNav(false));
});

document.addEventListener("click", (event) => {
  if (header.classList.contains("nav-open") && !header.contains(event.target)) {
    setNav(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.classList.contains("nav-open")) {
    setNav(false);
    focusTarget(navToggle);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) setNav(false);
});

const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

openDemoButton.addEventListener("click", () => openDemo(openDemoButton));
closeDemoButton.addEventListener("click", closeDemo);
resetDemoButton.addEventListener("click", resetDemo);
exitDemoButton.addEventListener("click", resetDemo);

demoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyDemo();
});

demoDialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  if (restoreFocus && lastDemoTrigger) focusTarget(lastDemoTrigger);
});

demoDialog.addEventListener("click", (event) => {
  if (event.target === demoDialog) closeDemo();
});

if (window.location.hash === "#demo" || new URLSearchParams(window.location.search).get("demo") === "1") {
  window.setTimeout(() => openDemo(openDemoButton), 250);
}

populateDayChoices();
renderDaily();
