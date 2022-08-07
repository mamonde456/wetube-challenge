const errorBox = document.querySelector("#errorBox");
const errorBtn = document.querySelector("#errorBtn");

const handleClose = () => {
  errorBox.display = "none";
};

errorBtn.addEventListener("click", handleClose);
