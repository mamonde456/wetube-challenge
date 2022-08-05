const videoContainer = document.getElementById("videoContainer");
const video = videoContainer.querySelector("video");
const videoControls = videoContainer.querySelector("#videoContainer");
const playBtn = videoContainer.querySelector("#play");
const muteBtn = videoContainer.querySelector("#mute");
const volume = videoContainer.querySelector("#volume");
const timeline = videoContainer.querySelector("#timeline");
const minTime = videoContainer.querySelector("#currentTime");
const maxTime = videoContainer.querySelector("#maxTime");
const fullScreen = videoContainer.querySelector("#fullScreen");

video.volume = 0.5;
timeline.value = 0;
let volumeValue;
switch (volumeValue) {
  case 0:
    muteBtn.className = "fas fa-volume-xmark";
    break;
  case 0.5:
    muteBtn.className = "fas fa-volume-low";
    break;
  case 1:
    muteBtn.className = "fas fa-volume-high";
    break;
}

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
  muteBtn.className = video.muted ? "fas fa-volume-low" : "fas fa-volume-xmark";
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
  fetch(`/videos/${id}/views`, {
    method: "post",
  });
};

const handleFullScreen = () => {
  if (document.fullscreenElement) {
    fullScreen.innerText = "full";
    document.exitFullscreen();
  } else {
    fullScreen.innerText = "exit";
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
