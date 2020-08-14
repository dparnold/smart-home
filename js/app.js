
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");
burger.addEventListener("click", burgerClick);

function burgerClick() {
  nav.classList.toggle('nav-active')
}

function loadContent(content) {
  $("#content").load(content + ".html");
  burgerClick();
}
