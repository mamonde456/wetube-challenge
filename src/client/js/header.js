const header = document.querySelector("header");
const menu = document.getElementById("menuIcon");
const li = document.querySelectorAll("#headerList li");
const a = document.querySelectorAll("#headerList li a");
const icon = document.querySelectorAll("#headerList li a i");
const span = document.querySelectorAll("#headerList li a span");

const handleMenuOpen = () => {
  menu.removeEventListener("click", handleMenuOpen);
  menu.addEventListener("click", handleMenuClose);
  header.style.width = "250px";
  menu.style.textAlign = "";
  for (const item of a) {
    item.style.display = "flex";
    item.style.alignItems = "center";
  }
  for (const item of icon) {
    item.style.fontSize = "28px";
  }
  for (const item of span) {
    item.style.fontSize = "18px";
  }
};

const handleMenuClose = () => {
  menu.removeEventListener("click", handleMenuClose);
  menu.addEventListener("click", handleMenuOpen);
  header.style.width = "80px";
  menu.style.textAlign = "center";

  for (const item of a) {
    item.style.display = "";
    item.style.alignItems = "";
  }
  for (const item of icon) {
    item.style.fontSize = "25px";
  }
  for (const item of span) {
    item.style.fontSize = "13px";
  }
};

menu.addEventListener("click", handleMenuOpen);
