const countdownEl = document.querySelector("#race-countdown");

// 1. LIVE API SCHEDULE FETCHER
async function getNextRace() {
  try {
    // Fetches the official calendar dynamically from the community server
    const response = await fetch("https://jolpi.ca");
    if (!response.ok) throw new Error("Network response failed");
    
    const data = await response.json();
    const races = data.MRData.RaceTable.Races;
    const now = new Date();

    // Map fields, filter out completed rounds, and sort chronologically
    const upcoming = races
      .map(race => ({
        name: race.raceName,
        date: new Date(`${race.date}T${race.time}`)
      }))
      .filter(race => race.date > now)
      .sort((a, b) => a.date - b.date);

    return upcoming[0] || null; // Returns the single closest upcoming race
  } catch (error) {
    console.warn("Live schedule unavailable, using local fallback:", error);

    const now = new Date();
    const backupSchedule = [
      { name: "British Grand Prix", date: "2026-07-05T14:00:00Z" },
      { name: "Belgian Grand Prix", date: "2026-07-19T13:00:00Z" },
      { name: "Hungarian Grand Prix", date: "2026-07-26T13:00:00Z" },
      { name: "Dutch Grand Prix", date: "2026-08-23T13:00:00Z" }
    ];

    const upcoming = backupSchedule
      .map(race => ({ ...race, date: new Date(race.date) }))
      .filter(race => race.date > now)
      .sort((a, b) => a.date - b.date);

    return upcoming[0] || null;
  }
}

// Global UI trackers
let targetDate = null;
const daysEl = document.querySelector(".cd-days");
const hoursEl = document.querySelector(".cd-hours");
const minutesEl = document.querySelector(".cd-minutes");
const secondsEl = document.querySelector(".cd-seconds");
const raceNameEl = document.querySelector(".next-race-name");

function pad(value) {
  return String(value).padStart(2, "0");
}

// 2. YOUR ORIGINAL MATH COMPONENT (CONNECTED TO THE API)
function updateCountdown() {
  if (!targetDate || Number.isNaN(targetDate.getTime())) {
    if (raceNameEl) raceNameEl.textContent = "Loading live schedule...";
    return;
  }

  const currentDate = new Date();
  const diff = targetDate - currentDate;

  // Auto-rolls over to the next race when the timer strikes zero
  if (diff <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    
    initializeCountdown(); 
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

// 3. ASYNC INITIALIZATION ENGINE
async function initializeCountdown() {
  const nextRace = await getNextRace();
  
  if (nextRace && countdownEl) {
    if (raceNameEl) raceNameEl.textContent = nextRace.name;
    
    targetDate = nextRace.date; 
    countdownEl.dataset.target = nextRace.date.toISOString();
    
    console.log(`Successfully locked onto: ${nextRace.name} (${targetDate})`);
    updateCountdown();
  } else {
    targetDate = null;
    if (raceNameEl) raceNameEl.textContent = "Next race to be announced";
  }
}

// Kickstart clock logic
if (countdownEl) {
  initializeCountdown();
  setInterval(updateCountdown, 1000);
}

// 4. LOGO TOOLTIP INTERACTION BLOCK
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

// 5. NEWS COMPONENT ENGINE
async function loadNews() {
  const newsGrid = document.querySelector(".news-grid");
  if (!newsGrid) return;

  const originalMarkup = newsGrid.innerHTML;

  try {
    const response = await fetch("news.json");
    if (!response.ok) throw new Error("failed to load news");

    const data = await response.json();
    const items = Array.isArray(data) ? data : [];
    const fallbackImages = ["Assets/news-1.jpg", "Assets/news-2.jpg", "Assets/news-3.jpg", "Assets/news-4.jpg"];

    if (items.length === 0) throw new Error("No news items found");

    newsGrid.innerHTML = items
      .map((item, idx) => {
        const title = item.title || "Latest update";
        const link = item.link || "#";
        const tag = item.tag || "News";
        const rawImage = item.image || fallbackImages[idx % fallbackImages.length];
        const image = rawImage.startsWith("http") || rawImage.startsWith("/") || rawImage.startsWith("Assets/")
          ? rawImage
          : `Assets/${rawImage}`;

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

// 6. AUDIO EFFECTS SYSTEM
function getEngineAudio() {
  const sound = document.getElementById('f1-engine-sound');
  if (sound) {
    sound.preload = 'auto';
    sound.muted = false;
    sound.volume = 0.85;
  }
  return sound || new Audio('Engine.mp3');
}

function playEngineSound() {
  const sound = getEngineAudio();
  if (!sound) return;

  sound.pause();
  sound.currentTime = 0;
  sound.muted = false;
  sound.volume = 0.85;

  const playPromise = sound.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.warn('Engine audio playback blocked or failed:', error);
    });
  }
}

const heroCard = document.querySelector('.f1-hero-card');
const secretClicks = { count: 0, timeoutId: null };
const SECRET_CLICK_TARGET = 2;
const SECRET_CLICK_WINDOW = 1500;

if (heroCard) {
  heroCard.addEventListener('click', () => {
    secretClicks.count += 1;
    clearTimeout(secretClicks.timeoutId);
    secretClicks.timeoutId = setTimeout(() => {
      secretClicks.count = 0;
    }, SECRET_CLICK_WINDOW);

    if (secretClicks.count >= SECRET_CLICK_TARGET) {
      secretClicks.count = 0;
      playEngineSound();
    }
  });
}
