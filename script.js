const countdownE1 = document.querySelector("#race-countdown");
const targetdate = new Date(countdownE1.dataset.target);

const daysE1 = document.querySelector(".cd-days");
const hoursE1 = document.querySelector(".cd-hours");
const minutesE1 = document.querySelector(".cd-minutes");
const secondsE1 = document.querySelector(".cd-seconds");

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const currentDate = new Date();
  const diff = targetdate - currentDate;

  if (diff <= 0) {
    daysE1.textContent = "00";
    hoursE1.textContent = "00";
    minutesE1.textContent = "00";
    secondsE1.textContent = "00";
    clearInterval(timer);
    return;
  }

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  daysE1.textContent = pad(days);
  hoursE1.textContent = pad(hours);
  minutesE1.textContent = pad(minutes);
  secondsE1.textContent = pad(seconds);
}

updateCountdown();
const timer = setInterval(updateCountdown, 1000);

/* Logo tooltip: pick a playful message on hover */
(function () {
  const messages = [
    "Vroom vroom — not a button",
    "Pure Ferrari energy",
    "Don't click me, I'm posing",
    "Built with ❤️ for Rokas",
    "Shift to 7th gear mentally"
  ];

  const containers = document.querySelectorAll('.logo-container');
  if (!containers || containers.length === 0) return;

  containers.forEach((c) => {
    // ensure a default tooltip exists
    c.dataset.tooltip = messages[0];
    c.addEventListener('mouseenter', () => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      c.dataset.tooltip = msg;
    });
  });
})();