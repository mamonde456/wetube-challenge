import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("txtForm");
const txtBox = document.getElementById("txtBox");
const txtBtn = document.getElementById("txtBtn");
const commentWrap = document.getElementById("commentWrap");
const commentList = document.getElementById("commentList");
const deleteBtn = document.getElementsByClassName("deleteBtn");
const btnBox = document.querySelectorAll(".btnBox");
const commentsBtnIcon = document.querySelectorAll(".commentsBtnIcon");

let isClose = false;

const createdComment = (text, name, newCommentId, createdAt, avatarUrl) => {
  const li = document.createElement("li");
  li.className = "commentLi watchComment";
  li.dataset.id = newCommentId;
  const avatar = document.createElement("p");
  avatar.style.backgroundImage = `url(/${avatarUrl})`;
  avatar.style.backgroundSize = "cover";
  avatar.style.backgroundPosition = "center";
  avatar.className = "txtAvatar";
  const userName = document.createElement("p");
  userName.className = "commentName";
  userName.innerText = name;
  const txt = document.createElement("p");
  txt.className = "commentText";
  txt.innerText = text;
  const time = document.createElement("small");
  time.className = "commentCreatedAt";
  time.innerText = createdAt;
  const editBtn = document.createElement("p");
  editBtn.className = "editBtn";
  const removeBtn = document.createElement("p");
  removeBtn.className = "deleteBtn";
  //
  const userWrap = document.createElement("div");
  userWrap.className = "userWrap";
  const commentTxtWrap = document.createElement("div");
  commentTxtWrap.className = "commentTxtWrap";
  const btnWrap = document.createElement("div");
  btnWrap.className = "btnWrap";
  const btnBox = document.createElement("div");
  btnBox.className = "btnBox";
  const i = document.createElement("i");
  i.className = "fas fa-ellipsis-vertical commentsBtnIcon";
  const pen = document.createElement("i");
  pen.className = "fas fa-pen";
  const xmark = document.createElement("i");
  xmark.className = "fas fa-xmark";
  const span = document.createElement("span");
  span.innerText = "수정";
  const span2 = document.createElement("span");
  span2.innerText = "삭제";
  const hr = document.createElement("hr");

  commentList.prepend(li);

  li.appendChild(avatar);
  li.appendChild(userWrap);
  li.appendChild(btnWrap);

  userWrap.appendChild(userName);
  userWrap.appendChild(commentTxtWrap);
  commentTxtWrap.appendChild(txt);
  commentTxtWrap.appendChild(time);
  btnWrap.appendChild(i);
  btnWrap.appendChild(btnBox);
  btnBox.appendChild(editBtn);
  btnBox.appendChild(hr);
  btnBox.appendChild(removeBtn);
  editBtn.appendChild(pen);
  editBtn.appendChild(span);
  removeBtn.appendChild(xmark);
  removeBtn.appendChild(span2);

  i.addEventListener("click", handleBtnClick);
  removeBtn.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const { id } = videoContainer.dataset;
  const text = txtBox.value;
  const response = await fetch(`/api/videos/${id}/comments`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  txtBox.value = "";
  const { name, newCommentId, createdAt, avatarUrl } = await response.json();
  if (response.status === 201) {
    createdComment(text, name, newCommentId, createdAt, avatarUrl);
  }
};

const handleDelete = async (event) => {
  let id;
  if (videoContainer) {
    id = videoContainer.dataset.id;
  }
  const li = event.currentTarget.parentElement.parentElement.parentElement;
  const newCommentId = li.dataset.commentid;
  const commentVideoId = li.dataset.commentvideoid;
  const { status } = await fetch(
    `/api/videos/${id ? id : commentVideoId}/comments`,
    {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newCommentId,
      }),
    }
  );
  if (status === 201) {
    li.remove();
  }
};
const handleEditBtnClose = () => {
  if (isClose) {
    isClose = false;
    for (const item of btnBox) {
      item.style.display = "none";
    }
  }
};

const handleBtnClick = async (event) => {
  event.stopPropagation();
  isClose = true;
  event.currentTarget.nextElementSibling.style.display = "flex";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
  txtBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      if (event.target.value.trim() == "") return;
      txtBtn.click();
    }
  });
  txtBox.addEventListener("click", function () {
    txtBtn.style.opacity = 1;
  });
}
for (const item of deleteBtn) {
  item.addEventListener("click", handleDelete);
}
for (const item of commentsBtnIcon) {
  item.addEventListener("click", handleBtnClick);
}

document.body.addEventListener("click", handleEditBtnClose);
