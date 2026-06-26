// 作品集页面的轻量互动：导航状态、手机菜单与滚动入场。
const portfolioHeader = document.querySelector(".portfolio-header");
const portfolioMenu = document.querySelector(".portfolio-menu");
const portfolioLinks = document.querySelector("#portfolio-links");
const portfolioLinkItems = document.querySelectorAll(".portfolio-links a");
const portfolioRevealItems = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  portfolioHeader.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

portfolioMenu.addEventListener("click", () => {
  const isOpen = portfolioLinks.classList.toggle("open");
  portfolioMenu.setAttribute("aria-expanded", isOpen);
});

portfolioLinkItems.forEach((link) => {
  link.addEventListener("click", () => {
    portfolioLinks.classList.remove("open");
    portfolioMenu.setAttribute("aria-expanded", "false");
  });
});

const portfolioObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      portfolioObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

portfolioRevealItems.forEach((item) => portfolioObserver.observe(item));
