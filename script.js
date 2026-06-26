// 这个文件集中放置页面的小互动，方便后续练习和修改。
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const testButtons = document.querySelectorAll(".test-trigger");
const toast = document.querySelector("#toast");
const revealItems = document.querySelectorAll(".reveal");
let toastTimer;

// 显示上线成功提示。多个按钮共用这个函数。
function showOnlineToast() {
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

testButtons.forEach((button) => button.addEventListener("click", showOnlineToast));

// 手机端：打开或关闭导航菜单；点击任一链接后自动收起。
menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// 页面向下滚动后，让导航栏更清晰；同时更新当前区域的导航高亮。
function updateHeaderAndNav() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  let currentId = "home";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 150) currentId = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

window.addEventListener("scroll", updateHeaderAndNav, { passive: true });
updateHeaderAndNav();

// 卡片进入视口时再显示，避免动画过多影响阅读。
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));
