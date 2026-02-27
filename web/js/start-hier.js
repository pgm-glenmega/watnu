const TOPICS = {
  geld: {
    label: "Geld",
    accent: "#00D6A4",
    subtitle:
      "Budgetteren, sparen en grip krijgen op je financiën zonder stress.",
    tagColor: "#00D6A4",
    cards: [
      { title: "Hoe maak ik een budget?", tags: ["Basics"] },
      { title: "Wat is een spaarrekening?", tags: ["Start"] },
      { title: "Hoe werkt rente?", tags: [] },
      { title: "Schulden: eerste stappen", tags: ["Belangrijk"] },
    ],
  },
  werk: {
    label: "Werk",
    accent: "#0898F8",
    subtitle:
      "Een job vinden, contracten begrijpen en je rechten als werknemer kennen.",
    tagColor: "#ED1B25",
    cards: [
      { title: "Solliciteren: waar begin ik?", tags: ["Tips", "CV"] },
      { title: "Wat staat er in mijn contract?", tags: [] },
      { title: "Proefperiode en opzeg", tags: [] },
      { title: "Vakantie en verlof", tags: [] },
      { title: "Loonbrief uitgelegd", tags: ["Uitleg"] },
      { title: "Ziek melden: wat nu?", tags: [] },
      { title: "Werkloosheid: eerste stappen", tags: ["Belangrijk"] },
      { title: "Bijbaan vs. contract", tags: [] },
      { title: "Discriminatie melden", tags: [] },
    ],
  },
  wonen: {
    label: "Wonen",
    accent: "#FFB200",
    subtitle:
      "Huren, waarborgen, huurdersrechten en van een plek een thuis maken.",
    tagColor: "#FFB200",
    cards: [
      { title: "Huurcontract: waar let ik op?", tags: ["Checklist"] },
      { title: "Waarborg: wat mag wel/niet?", tags: [] },
      { title: "Inschrijven op adres", tags: [] },
      { title: "Kosten: water/energie/internet", tags: [] },
    ],
  },
  zorg: {
    label: "Zorg",
    accent: "#ED1B25",
    subtitle:
      "Ziekteverzekering, een dokter vinden en goed voor jezelf zorgen zonder verwarring.",
    tagColor: "#ED1B25",
    cards: [
      { title: "Hoe kies ik een huisarts?", tags: ["Start"] },
      { title: "Ziekteverzekering: basis", tags: [] },
      { title: "Tandarts: kosten & terugbetaling", tags: [] },
      { title: "Spoed: wanneer ga ik?", tags: ["Belangrijk"] },
    ],
  },
  recht: {
    label: "Recht",
    accent: "#4C40FD",
    subtitle:
      "Contracten, je rechten en basiskennis die iedereen zou moeten hebben.",
    tagColor: "#4C40FD",
    cards: [
      { title: "Wat is een contract?", tags: ["Basics"] },
      { title: "Geschil? Eerste stappen", tags: ["Belangrijk"] },
      { title: "Waar kan ik gratis advies krijgen?", tags: [] },
      { title: "Boete/aanmaning: wat nu?", tags: [] },
    ],
  },
  welzijn: {
    label: "Welzijn",
    accent: "#FCA5EE",
    subtitle:
      "Zorg dragen voor je hoofd, omgaan met stress en weten wanneer je hulp mag vragen.",
    tagColor: "#FCA5EE",
    cards: [
      { title: "Stress: praktische stappen", tags: ["Tips"] },
      { title: "Hulp zoeken: waar begin ik?", tags: ["Start"] },
      { title: "Burn-out signalen", tags: [] },
      { title: "Slaap verbeteren", tags: [] },
    ],
  },
  relaties: {
    label: "Relaties",
    accent: "#FE5E20",
    subtitle:
      "Gezonde connecties, grenzen stellen en omgaan met sociale situaties.",
    tagColor: "#FE5E20",
    cards: [
      { title: "Grenzen aangeven", tags: ["Tips"] },
      { title: "Conflicten oplossen", tags: [] },
      { title: "Nieuwe mensen leren kennen", tags: [] },
      { title: "Rode vlaggen herkennen", tags: [] },
    ],
  },
  mobiliteit: {
    label: "Mobiliteit",
    accent: "#67DDE2",
    subtitle:
      "Je verplaatsen: autorijden, openbaar vervoer en verhuizen naar nieuwe plekken.",
    tagColor: "#67DDE2",
    cards: [
      { title: "OV: abonnement kiezen", tags: ["Start"] },
      { title: "Rijbewijs: stappenplan", tags: [] },
      { title: "Auto kopen: checklist", tags: ["Checklist"] },
      { title: "Fiets: veilig op weg", tags: [] },
    ],
  },
};

const TOPIC_ORDER = [
  "geld",
  "werk",
  "wonen",
  "zorg",
  "recht",
  "welzijn",
  "relaties",
  "mobiliteit",
];

const els = {
  menu: document.getElementById("topicMenu"),
  title: document.getElementById("topicTitle"),
  subtitle: document.getElementById("topicSubtitle"),
  icon: document.getElementById("topicIcon"),
  grid: document.getElementById("cardsGrid"),
  count: document.getElementById("topicCount"),
  search: document.getElementById("search"),
};

function setCSSAccent(hex) {
  document.documentElement.style.setProperty("--topic-accent", hex);
}

function createMenu() {
  els.menu.innerHTML = "";
  for (const key of TOPIC_ORDER) {
    const t = TOPICS[key];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "topic-pill";
    btn.setAttribute("role", "tab");
    btn.dataset.topic = key;

    const dot = document.createElement("span");
    dot.className = "topic-dot";
    dot.style.background = t.accent;
    dot.setAttribute("aria-hidden", "true");

    btn.append(dot, document.createTextNode(t.label));
    btn.addEventListener("click", () => setTopic(key, { pushState: true }));
    els.menu.appendChild(btn);
  }
}

function renderCards(topicKey, query) {
  const t = TOPICS[topicKey];
  const q = (query ?? "").trim().toLowerCase();

  const filtered = t.cards.filter((c) => {
    if (!q) return true;
    const inTitle = c.title.toLowerCase().includes(q);
    const inTags = (c.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
    return inTitle || inTags;
  });

  els.grid.innerHTML = "";

  for (const card of filtered) {
    const a = document.createElement("a");
    a.className = "qa-card";
    a.href = "#";
    a.setAttribute("role", "listitem");
    a.setAttribute("aria-label", card.title);

    const thumb = document.createElement("div");
    thumb.className = "qa-thumb";

    if (card.tags?.length) {
      const tags = document.createElement("div");
      tags.className = "qa-tags";

      for (const tag of card.tags.slice(0, 2)) {
        const span = document.createElement("span");
        span.className = "tag";
        span.style.background = TOPICS[topicKey].tagColor || "#ED1B25";
        span.textContent = tag;
        tags.appendChild(span);
      }
      thumb.appendChild(tags);
    }

    const footer = document.createElement("div");
    footer.className = "qa-footer";

    const title = document.createElement("span");
    title.className = "qa-title";
    title.textContent = card.title;

    footer.appendChild(title);
    a.append(thumb, footer);

    els.grid.appendChild(a);
  }

  els.count.textContent = `${filtered.length} vragen in ‘${t.label}’`;
}

function setTopic(topicKey, opts = { pushState: false }) {
  const t = TOPICS[topicKey] ?? TOPICS.werk;

  setCSSAccent(t.accent);
  els.title.textContent = t.label;
  els.subtitle.textContent = t.subtitle;

  // Update tabs state
  for (const btn of els.menu.querySelectorAll(".topic-pill")) {
    const active = btn.dataset.topic === topicKey;
    btn.setAttribute("aria-selected", active ? "true" : "false");
  }

  renderCards(topicKey, els.search.value);

  if (opts.pushState) {
    const url = new URL(window.location.href);
    url.searchParams.set("topic", topicKey);
    history.pushState({ topic: topicKey }, "", url);
  }
}

function getInitialTopic() {
  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get("topic");
  if (fromQuery && TOPICS[fromQuery]) return fromQuery;
  return "werk";
}

function wireFooterLinks() {
  document.querySelectorAll("[data-topic-link]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const topic = el.getAttribute("data-topic-link");
      if (topic && TOPICS[topic]) setTopic(topic, { pushState: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function init() {
  createMenu();
  wireFooterLinks();

  const initial = getInitialTopic();
  setTopic(initial);

  els.search.addEventListener("input", () => {
    const active =
      document.querySelector('.topic-pill[aria-selected="true"]')?.dataset
        .topic || initial;
    renderCards(active, els.search.value);
  });

  window.addEventListener("popstate", (e) => {
    const topic = e.state?.topic;
    if (topic && TOPICS[topic]) setTopic(topic, { pushState: false });
  });
}

init();
