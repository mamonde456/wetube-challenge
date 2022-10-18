const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const videoControls = document.querySelector("#videoControls");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const volume = document.querySelector("#volume");
const timeline = document.querySelector("#timeline");
const minTime = document.querySelector("#currentTime");
const maxTime = document.querySelector("#maxTime");
const fullScreen = document.querySelector("#fullScreen");

let volumeValue;

const handlePlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.className = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.className = video.muted ? "fas fa-volume-xmark" : "fas fa-volume-low";
  volume.value = video.muted ? 0 : volumeValue;
};

const handleVolume = (event) => {
  const {
    target: { value },
  } = event;
  video.volume = value;
  volumeValue = value;
};

const formatTime = (time) =>
  new Date(time * 1000).toISOString().substring(11, 19);

const handleLoadedMetaDataVideo = () => {
  maxTime.innerText = formatTime(Math.floor(video.duration));
  console.log(maxTime);
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  minTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleChangeTimeline = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/views`, {
    method: "post",
  });
};

const handleFullScreen = () => {
  if (document.fullscreenElement) {
    fullScreen.className = "fas fa-expand";
    video.style.height = "720px";
    document.exitFullscreen();
  } else {
    fullScreen.className = "fas fa-compress";
    video.style.height = "100%";
    videoContainer.requestFullscreen();
  }
};

const handleMouseEnter = () => {
  videoControls.style.display = "hidden";
};

const handleVolumeEnter = () => {
  volume.style.display = "block";
};
const handleVolumeLeave = () => {
  volume.style.display = "none";
};

const handleKeyDown = (event) => {
  if (event.keyCode === 32) {
    handlePlay();
  } else if (event.keyCode === 70) {
    handleFullScreen();
  }
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("mouseenter", handleVolumeEnter);
volume.addEventListener("mouseleave", handleVolumeLeave);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolume);
video.addEventListener("loadedmetadata", handleLoadedMetaDataVideo);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
video.addEventListener("mouseenter", handleMouseEnter);
timeline.addEventListener("input", handleChangeTimeline);
fullScreen.addEventListener("click", handleFullScreen);
window.addEventListener("keydown", handleKeyDown);
