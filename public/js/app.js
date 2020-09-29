
const burger = document.querySelector(".burger");
const cross = document.querySelector(".cross");
const nav = document.querySelector(".nav-links");
const content = document.querySelector(".content");

burger.addEventListener("click", burgerClick);
cross.addEventListener("click", burgerClick);

// get rid of the closing x when the page is loaded (e.g. when a link is openend)
cross.classList.toggle('hide');
// toggles burger and x symbol and opens the menu
function burgerClick() {
  nav.classList.toggle('nav-active');
  cross.classList.toggle('hide');
  burger.classList.toggle('hide');
  content.classList.toggle('blur');
}



function sendMessage(message, messageTime=1500){
  if(messageTime==""){
    messageTime=Math.max(message.length*50,1500);
  }
  document.getElementById("message").innerHTML = message;
  content.classList.toggle("blur");
  setTimeout(function () { 
      document.getElementById("message").innerHTML = ""; 
      content.classList.toggle("blur");
  }, messageTime);
}

// not needed anymore
function loadContent(content) {
  $("#content").load(content + ".html");
  burgerClick();
}
