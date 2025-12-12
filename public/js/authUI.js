export async function checkSession() {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });
    const data = await res.json();

    const authLinks = document.querySelectorAll(".auth-link");
    const userLinks = document.querySelectorAll(".user-link, .profile-menu");

    if (data.isLoggedIn) {
      authLinks.forEach((e) => e.classList.add("hidden"));
      userLinks.forEach((e) => e.classList.remove("hidden"));
      document.getElementById("profile-name").textContent = `${data.name} ▾`;
    } else {
      authLinks.forEach((e) => e.classList.remove("hidden"));
      userLinks.forEach((e) => e.classList.add("hidden"));
    }

    return data;
  } catch (err) {
    console.error("Session check failed", err);
  }
}
