const learnButton = document.querySelector("#learnButton");
const message = document.querySelector("#message");

learnButton.addEventListener("click", () => {
  message.textContent = "很好，今天也完成了一次网页练习。";
});
