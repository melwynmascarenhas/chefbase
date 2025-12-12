document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const logoutBtn = document.getElementById("logout-btn");

  // ✅ Mobile menu toggle
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const opened = navLinks.classList.toggle("open");
      toggle.classList.toggle("active", opened);
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });

    // ✅ Auto-close mobile menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ✅ Logout button — directly visible now
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        location.href = "index.html";
      } catch (err) {
        console.error("Logout failed:", err);
      }
    });
  }
});
