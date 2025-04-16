// Theme handling utility for all pages
const themeToggle = document.getElementById("themeToggle");
let currentTheme = localStorage.getItem("theme") || "light";

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", initializeTheme);

// Set up event listener for theme toggle
if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

// Initialize theme settings
function initializeTheme() {
  // Check if theme is already stored
  if (!localStorage.getItem("theme")) {
    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    currentTheme = prefersDark ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
  }

  // Apply the theme
  applyTheme();
}

// Detect current theme from various sources
function detectCurrentTheme() {
  // Check HTML attribute data-theme
  const dataTheme = document.documentElement.getAttribute("data-theme");
  if (dataTheme) {
    currentTheme = dataTheme;
    return;
  }

  // Check body class
  if (document.body.classList.contains("dark-theme")) {
    currentTheme = "dark";
    return;
  }

  if (document.body.classList.contains("light-theme")) {
    currentTheme = "light";
    return;
  }

  // Read from localStorage
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    currentTheme = storedTheme;
    return;
  }

  // Check system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  currentTheme = prefersDark ? "dark" : "light";
}

// Apply current theme to document
function applyTheme() {
  // Remove existing theme classes
  document.body.classList.remove("light-theme", "dark-theme");

  // Add current theme class
  document.body.classList.add(`${currentTheme}-theme`);

  // Set HTML data-theme attribute
  document.documentElement.setAttribute("data-theme", currentTheme);

  // Update theme toggle icon
  updateThemeIcon();
}

// Update icon visibility based on current theme
function updateThemeIcon() {
  if (!themeToggle) return;

  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");

  if (currentTheme === "dark") {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  } else {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  }
}

// Toggle between light and dark themes
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
  applyTheme();
}
