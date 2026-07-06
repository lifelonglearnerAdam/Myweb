document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove("open");
      }
    });
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || href === "index.html" && currentPath === "") {
      link.classList.add("active");
    }
    if (currentPath !== "index.html" && href && href.includes(currentPath)) {
      link.classList.add("active");
    }
  });
});
