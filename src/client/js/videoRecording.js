import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { writeFile } from "fs";

const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

video.hidden = true;
let stream;
let recorder;
let videoFile;

const handleGetMedia = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.hidden = false;
  video.srcObject = stream;
  video.play();

  handleStart();
};

const handleStart = () => {
  startBtn.innerText = "stop Recording";
  startBtn.removeEventListener("click", handleGetMedia);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.play();
  };
  recorder.start();
};

const handleStop = () => {
  startBtn.innerText = "Download video";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};
const handleDownload = () => {
const ffmpeg=createFFmpeg({log:true});
ffmpeg.load();

ffmpeg.FS("writeFile", "recording.webm" , await fetchFile(videoFile));

await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4")


  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "myRecording.webm";
  document.body.appendChild(a);
  a.click();
  const tracks = stream.getTrack();
  tracks.forEach((track) => track.stop());
  stream = null;
};

startBtn.addEventListener("click", handleGetMedia);
