const countdownEl = document.querySelector("#race-countdown");

const raceSchedule = [
  { name: "Australian Grand Prix", date: "2026-03-08T05:00:00Z" },
  { name: "Bahrain Grand Prix", date: "2026-03-15T15:00:00Z" },
  { name: "Saudi Arabian Grand Prix", date: "2026-03-29T17:00:00Z" },
  { name: "Japanese Grand Prix", date: "2026-04-12T06:00:00Z" },
  { name: "Belgian Grand Prix", date: "2026-08-30T13:00:00Z" }
];

function getNextRace() {
  const now = new Date();

  const upcoming = raceSchedule
    .map((race) => ({
      ...race,
      date: new Date(race.date)
    }))
    .filter((race) => race.date > now)
    .sort((a, b) => a.date - b.date);

  return upcoming[0] || null;
}

if (countdownEl) {
  const daysEl = document.querySelector(".cd-days");
  const hoursEl = document.querySelector(".cd-hours");
  const minutesEl = document.querySelector(".cd-minutes");
  const secondsEl = document.querySelector(".cd-seconds");
  const raceNameEl = document.querySelector(".next-race-name");

  let targetDate = countdownEl.dataset.target
    ? new Date(countdownEl.dataset.target)
    : null;

  function setNextRace() {
    const nextRace = getNextRace();

    if (nextRace) {
      targetDate = nextRace.date;
      countdownEl.dataset.target = nextRace.date.toISOString();

      if (raceNameEl) {
        raceNameEl.textContent = nextRace.name;
      }
    } else {
      targetDate = null;

      if (raceNameEl) {
        raceNameEl.textContent = "Next race to be announced";
      }

      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
    }
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    if (!targetDate || Number.isNaN(targetDate.getTime())) {
      setNextRace();
      if (!targetDate) return;
    }

    const currentDate = new Date();
    const diff = targetDate - currentDate;

    if (diff <= 0) {
      setNextRace();
      if (!targetDate) return;
      updateCountdown();
      return;
    }

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  setNextRace();
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

(function () {
  const messages = [
    "Vroom vroom — not a button",
    "Pure Ferrari energy",
    "Don't click me, I'm posing",
    "Built with ❤️ for Rokas",
    "Shift to 7th gear mentally"
  ];

  document.querySelectorAll(".logo-container").forEach((container) => {
    container.dataset.tooltip = messages[0];
    container.addEventListener("mouseenter", () => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      container.dataset.tooltip = msg;
    });
  });
})();

async function loadNews() {
  const newsGrid = document.querySelector(".news-grid");
  if (!newsGrid) return;

  const originalMarkup = newsGrid.innerHTML;

  try {
    const response = await fetch("news.json");
    if (!response.ok) throw new Error("failed to load news");

    const data = await response.json();
    const items = Array.isArray(data) ? data : [];

    // fallback images to use when news items don't include an image
    const fallbackImages = [
      "news-1.jpg",
      "news-2.jpg",
      "news-3.jpg",
      "news-4.jpg",
    ];

    if (items.length === 0) {
      throw new Error("No news items found");
    }

    newsGrid.innerHTML = items
      .map((item, idx) => {
        const title = item.title || "Latest update";
        const link = item.link || "#";
        const tag = item.tag || "News";
        const image = item.image || fallbackImages[idx % fallbackImages.length];

        return `
          <a href="${link}" class="news-card" target="_blank" rel="noopener">
            <img src="${image}" alt="${title}">
            <div class="news-card-body">
              <span class="news-tag">${tag}</span>
              <p>${title}</p>
            </div>
          </a>
        `;
      })
      .join("");
  } catch (error) {
    console.error("News load failed:", error);

    if (!newsGrid.querySelector(".news-card")) {
      newsGrid.innerHTML = originalMarkup;
    }
  }
}

loadNews();
setInterval(loadNews, 5 * 60 * 1000);

function playEngineSound() {
  const sound = document.getElementById('f1-engine-sound');
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(error => {
    console.log('Playback blocked or failed:', error);
  });
}

const heroCard = document.querySelector('.f1-hero-card');
if (heroCard) {
  heroCard.addEventListener('click', playEngineSound);
  heroCard.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      playEngineSound();
    }
  });
}


function playEngineSound() {
  const sound = document.getElementById('f1-engine-sound');
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(error => {
    console.log('Playback blocked or failed:', error);
  });
}

document.addEventListener('keydown', (event) => {
  const heroCard = document.querySelector('.f1-hero-card');
  if (!heroCard || document.activeElement !== heroCard) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    playEngineSound();
  }
});