// =========================================================
// FIND: MOBILE NAVIGATION — Opens/closes the menu on small screens.
// FIND: COPYRIGHT YEAR — Automatically displays the current year.
// =========================================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

// Toggle the mobile navigation when the menu button is clicked.
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

// Close the mobile menu after someone chooses a navigation link.
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

// Automatically update the year in the footer.
document.getElementById("currentYear").textContent = new Date().getFullYear();
