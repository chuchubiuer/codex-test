const celebrateButton = document.querySelector("#celebrateButton");
const message = document.querySelector("#message");

celebrateButton.addEventListener("click", () => {
  message.textContent = "网页已经成功上线啦！";
});
