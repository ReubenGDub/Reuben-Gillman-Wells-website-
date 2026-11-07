// =========================================================
// FIND: MOBILE NAVIGATION — Opens/closes the menu on small screens.
// FIND: COPYRIGHT YEAR — Automatically displays the current year.
// =========================================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function setMenu(open) {
  mainNav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
}

// Only set up the menu if this page actually has it.
if (menuToggle && mainNav) {
  // Toggle the mobile navigation when the menu button is clicked.
  menuToggle.addEventListener("click", () => {
    setMenu(!mainNav.classList.contains("is-open"));
  });

  // Close the mobile menu after someone chooses a navigation link.
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
}

// Automatically update the year in the footer (only if it exists on the page).
const yearEl = document.getElementById("currentYear");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scale the whole page smoothly as the window gets wider (desktop only).
const ZOOM_START = 1200;    // below this width, no scaling at all
const ZOOM_STRENGTH = 0.6;  // higher = scales up faster

function updateZoom() {
  const w = window.innerWidth;
  const zoom = w > ZOOM_START ? 1 + ((w - ZOOM_START) / ZOOM_START) * ZOOM_STRENGTH : 1;
  document.documentElement.style.zoom = zoom.toFixed(3);
}

updateZoom();
window.addEventListener("resize", updateZoom);

// =========================================================
// FIND: AUDIO PLAYERS — Play/pause, progress and seeking for the music samples.
// =========================================================
function formatTime(s) {
  if (!isFinite(s)) return "0:00";
  s = Math.max(0, Math.round(s));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

const audioPlayers = document.querySelectorAll(".audio-player");

audioPlayers.forEach((player) => {
  const audio = player.querySelector("audio");
  const btn = player.querySelector(".audio-btn");
  const track = player.querySelector(".audio-track");
  const fill = player.querySelector(".audio-fill");
  const time = player.querySelector(".audio-time");
  if (!audio || !btn || !track || !fill || !time) return;

  function update() {
    const d = audio.duration;
    const pct = d ? (audio.currentTime / d) * 100 : 0;
    fill.style.width = pct + "%";
    track.setAttribute("aria-valuenow", String(Math.round(pct)));
    time.textContent = d ? formatTime(d - audio.currentTime) : "0:00"; // counts down
  }

  audio.addEventListener("loadedmetadata", update);
  audio.addEventListener("timeupdate", update);

  audio.addEventListener("play", () => {
    // Only one sample plays at a time
    audioPlayers.forEach((other) => {
      if (other !== player) {
        const a = other.querySelector("audio");
        if (a) a.pause();
      }
    });
    player.classList.add("is-playing");
    btn.setAttribute("aria-label", "Pause sample");
  });

  function stopped() {
    player.classList.remove("is-playing");
    btn.setAttribute("aria-label", "Play sample");
  }
  audio.addEventListener("pause", stopped);
  audio.addEventListener("ended", () => {
    stopped();
    audio.currentTime = 0;
    update();
  });

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  // Click or drag on the bars to jump to a point in the sample
  function seek(e) {
    if (!audio.duration) return;
    const ratio = Math.min(1, Math.max(0, e.offsetX / track.offsetWidth));
    audio.currentTime = ratio * audio.duration;
    update();
  }
  let dragging = false;
  track.addEventListener("pointerdown", (e) => {
    dragging = true;
    track.setPointerCapture(e.pointerId);
    seek(e);
  });
  track.addEventListener("pointermove", (e) => { if (dragging) seek(e); });
  track.addEventListener("pointerup", () => { dragging = false; });
  track.addEventListener("pointercancel", () => { dragging = false; });

  // Keyboard: left/right arrows skip 5 seconds
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
    if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
});
