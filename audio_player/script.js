console.clear();
const musicUrl = 'https://spmdl.github.io/json-files/rain.mp3';

const audioPlayer       = new Audio(musicUrl);
const audioPlay         = document.querySelector('#audioPlay');
const audioPause        = document.querySelector('#audioPause');
const prevSecond        = document.querySelector('#prevSecond');
const nextSecond        = document.querySelector('#nextSecond');
const audioVolume       = document.querySelector('#audioVolume');
const audioVolumePlus   = document.querySelector('#audioVolumePlus');
const audioVolumeMinus  = document.querySelector('#audioVolumeMinus');
const audioSpeed        = document.querySelector('#audioSpeed');
const audioSpeedTxt     = document.querySelector('#audioSpeedTxt');
const timeSpent         = document.querySelector('#timeSpent');
const progress          = document.querySelector('#progress');
const progressLine      = document.querySelector('#progress-line');

const audioState = {
  speedList: [1, 1.25, 1.5, 2, 5],
  currentSpeedIndex: 0
};

audioPlayer.addEventListener('loadeddata', () => {
  // console.log('loaded video');
  audioPlayer.setAttribute('controls', '');
  audioPlayer.setAttribute('type', 'audio/mpeg');
});

audioPlay.addEventListener('click', () => {
  audioPlay.style.display = 'none';
  audioPause.style.display = 'inline-block';
  audioPlayer.play();
});

audioPause.addEventListener('click', () => {
  audioPause.style.display = 'none';
  audioPlay.style.display = 'inline-block';
  audioPlayer.pause();
});

prevSecond.addEventListener('click', () => {
  audioPlayer.currentTime -= 2;
});

nextSecond.addEventListener('click', () => {
  audioPlayer.currentTime += 2;
});

audioVolumePlus.addEventListener('click', () => {
  audioPlayer.volume = (audioPlayer.volume >= 1) ? 1 : Number((audioPlayer.volume + 0.1).toPrecision(2));
});

audioVolumeMinus.addEventListener('click', () => {
  audioPlayer.volume = (audioPlayer.volume <= 0) ? 0 : Number((audioPlayer.volume - 0.1).toPrecision(2));
});

audioVolume.addEventListener('click', (e) => {
  audioPlayer.muted = !audioPlayer.muted;
  audioVolume.innerHTML = audioPlayer.muted ? `<i class='fa-solid fa-volume-xmark'></i>` : `<i class='fa-solid fa-volume-high'></i>`;
});

audioSpeed.addEventListener('click', () => {
  audioState.currentSpeedIndex = (audioState.currentSpeedIndex + 1 >= audioState.speedList.length) ? 0 : audioState.currentSpeedIndex + 1;
  audioPlayer.playbackRate = audioState.speedList[audioState.currentSpeedIndex];
  audioSpeedTxt.innerText = `x${audioState.speedList[audioState.currentSpeedIndex]}`;
});

audioPlayer.addEventListener('timeupdate', () => {
  timeSpent.innerText = formatTime(Math.floor(audioPlayer.currentTime));
  const timeLeftCounted = Math.round(audioPlayer.duration) - Math.floor(audioPlayer.currentTime);
  timeLeft.innerText = formatTime(timeLeftCounted);
  setProgress(audioPlayer.currentTime, audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
  timeSpent.innerText = formatTime(Math.round(audioPlayer.duration));
  audioPause.style.display = 'none';
  audioPlay.style.display = 'inline-block';
  audioPlayer.currentTime = 0;
});

progress.addEventListener('click', dragProgressLine);

function setProgress(currentProgress, totalProgress) {
  const currentProgressPercent = (currentProgress / totalProgress) * 100;
  progressLine.style.width = `${currentProgressPercent}%`;
  return currentProgressPercent;
}

function formatTime(time) {
  const timeStr = time.toString();
  const currentTimeFormatted = `00:${timeStr.padStart(2, '0')}`; // 補 0
  return currentTimeFormatted;
}

function dragProgressLine(e) {
  console.log(e);
  const maxProgress = e.target.max;
  const minProgress = e.target.min;
  const selectedProgres = parseFloat(e.target.value);
  if (selectedProgres > maxProgress || selectedProgres < minProgress) return;
  const currentProgress = setProgress(selectedProgres, maxProgress);
  audioPlayer.currentTime = Math.ceil((currentProgress / 100) * maxProgress);
}
