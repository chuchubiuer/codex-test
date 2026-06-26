// 点击按钮后，显示上线成功的反馈。
const celebrateButton = document.querySelector("#celebrateButton");
const message = document.querySelector("#message");

celebrateButton.addEventListener("click", () => {
  message.textContent = "网页已经成功上线啦！";
  message.classList.add("is-visible");
});

// 在手机上点击导航链接后，自动收起菜单。
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector("#nav-links");
const navItems = document.querySelectorAll(".nav-links a");

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});
