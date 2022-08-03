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
let volumeValue;

const handlePlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "play" : "pause";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "unMute" : "mute";
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

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolume);
video.addEventListener("loadedmetadata", handleLoadedMetaDataVideo);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleChangeTimeline);
fullScreen.addEventListener("click", handleFullScreen);
