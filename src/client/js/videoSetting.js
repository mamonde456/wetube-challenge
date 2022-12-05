const wrap = document.querySelectorAll(".video-wrap");
const infoWrap = document.querySelectorAll(".infoWrap");
const settingBtn = document.querySelectorAll(".videoSettingBtn");
const videoSettingMenu = document.querySelectorAll(".videoSettingMenu");

let isClick = false;

const handleShowMenu = (e) => {
  e.preventDefault();
  const wrap = e.currentTarget.parentElement.parentElement.parentElement;
  const btn = e.currentTarget;
  const menu = btn.nextElementSibling;
  if (!isClick) {
    wrap.removeEventListener("mouseleave", handleHideBtn);
    btn.style.display = "block";
    menu.style.display = "flex";
    isClick = true;
  }
  if (isClick) {
    for (const item of videoSettingMenu) {
      item.style.display = "none";
    }
    btn.style.display = "block";
    menu.style.display = "flex";
    isClick = false;
  }
};

function handleShowBtn() {
  const btn = this.children[0].children[1].children[1];
  btn.style.display = "block";
}
function handleHideBtn() {
  const btn = this.children[0].children[1].children[1];
  btn.style.display = "none";
}

for (const item of wrap) {
  item.addEventListener("mouseenter", handleShowBtn);
  item.addEventListener("mouseleave", handleHideBtn);
}
for (const item of settingBtn) {
  item.addEventListener("click", handleShowMenu);
}
