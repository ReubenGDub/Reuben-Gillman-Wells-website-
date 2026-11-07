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
