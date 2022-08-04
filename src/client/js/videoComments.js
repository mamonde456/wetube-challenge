import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("txtForm");
const txtBox = document.getElementById("txtBox");
const commentWrap = document.getElementById("commentWrap");
const commentList = document.getElementById("commentList");
const deleteBtn = document.getElementsByClassName("deleteBtn");

const createdComment = (text, name, newCommentId, createdAt) => {
  const li = document.createElement("li");
  li.className = "commentLi";
  li.dataset.id = newCommentId;
  const userName = document.createElement("p");
  userName.innerText = name;
  const txt = document.createElement("p");
  txt.innerText = text;
  const time = document.createElement("small");
  time.innerText = createdAt;
  const removeBtn = document.createElement("span");
  removeBtn.innerText = "❌";
  removeBtn.className = "deleteBtn";
  removeBtn.addEventListener("click", handleDelete);

  li.appendChild(userName);
  li.appendChild(txt);
  txt.appendChild(removeBtn);
  li.appendChild(time);
  commentList.prepend(li);
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
  const { name, newCommentId, createdAt } = await response.json();
  if (response.status === 201) {
    createdComment(text, name, newCommentId, createdAt);
  }
};

const handleDelete = async (event) => {
  const { id } = videoContainer.dataset;
  const li = event.target.parentElement.parentElement;
  const newCommentId = li.dataset.commentid;
  const { status } = await fetch(`/api/videos/${id}/comments`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newCommentId,
    }),
  });
  if (status === 201) {
    li.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
  for (const item of deleteBtn) {
    item.addEventListener("click", handleDelete);
  }
}
