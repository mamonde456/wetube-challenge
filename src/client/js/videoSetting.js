const wrap = document.querySelectorAll(".video-wrap");
const infoWrap = document.querySelectorAll(".infoWrap");
const settingBtn = document.querySelectorAll(".videoSettingBtn");
const videoSettingMenu = document.querySelectorAll(".videoSettingMenu");
const settingOption = document.querySelectorAll(".videoSettingMenu>div");
const login = document.querySelectorAll(".homeLoginBtn");

let isClick = false;
const handleMenuClick = (e) => {
  e.preventDefault();
  const wrap = e.currentTarget.parentElement.parentElement.parentElement;
  const btn = e.currentTarget;
  const menu = btn.nextElementSibling;
  if (!isClick) {
    handleShowMenu(wrap, btn, menu);
  } else {
    if (
      menu.style.display === "flex" &&
      menu === e.currentTarget.nextElementSibling
    ) {
      menu.style.display = "none";
      isClick = false;
    } else {
      handleHideMenu(btn, menu);
    }
  }
};

const handleShowMenu = (wrap, btn, menu) => {
  isClick = true;
  for (const item of videoSettingMenu) {
    item.style.display = "none";
  }
  wrap.removeEventListener("mouseleave", handleHideBtn);
  btn.style.display = "block";
  menu.style.display = "flex";
};

const handleHideMenu = (btn, menu) => {
  isClick = false;
  for (const item of videoSettingMenu) {
    item.style.display = "none";
  }
  btn.style.display = "block";
  menu.style.display = "flex";
};

function handleShowBtn() {
  const btn = this.children[0].children[1].children[1];
  btn.style.display = "block";
}
function handleHideBtn() {
  const btn = this.children[0].children[1].children[1];
  btn.style.display = "none";
}

const handleApi = async (e) => {
  e.preventDefault();
  const { videoid, set } = e.currentTarget.dataset;
  if (set === "good") {
    const response = await fetch(`/api/videos/${videoid}/feedbackApi`, {
      method: "post",
      body: JSON.stringify({ id: videoid }),
    });
    const data = await response.json();
    if (data !== 200) {
      console.log("좋아요 표시에 에러가 발생함.");
    }
  } else if (set === "restart") {
    console.log("restart");
  }
};

for (const item of wrap) {
  item.addEventListener("mouseenter", handleShowBtn);
  item.addEventListener("mouseleave", handleHideBtn);
}
for (const item of settingBtn) {
  item.addEventListener("click", handleMenuClick);
}
for (const item of settingOption) {
  item.addEventListener("click", handleApi);
}
for (const item of login) {
  item.addEventListener("click", () => (window.location.href = "/login"));
}
