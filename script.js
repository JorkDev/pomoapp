// script.js
let timer;
let isRunning = false;
let isWorkInterval = true;
let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let currentTime = workTime;

const timerDisplay = document.getElementById('timer');
const startStopBtn = document.getElementById('startStopBtn');
const workEndSound = document.getElementById('workEndSound');
const breakEndSound = document.getElementById('breakEndSound');
const workIntervalInput = document.getElementById('workInterval');
const breakIntervalInput = document.getElementById('breakInterval');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startStopBtn.textContent = 'Start';
    } else {
        isRunning = true;
        startStopBtn.textContent = 'Stop';
        timer = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
            } else {
                clearInterval(timer);
                notifyUser();
                switchInterval();
            }
        }, 1000);
    }
}

function switchInterval() {
    isWorkInterval = !isWorkInterval;
    currentTime = isWorkInterval ? workTime : breakTime;
    updateTimerDisplay();
    startTimer(); // Automatically start the next interval
}

function notifyUser() {
    const message = isWorkInterval ? "Time for a break!" : "Break over, back to work!";
    alert(message);
    if (isWorkInterval) {
        workEndSound.play();
    } else {
        breakEndSound.play();
    }
}

function saveSettings() {
    workTime = parseInt(workIntervalInput.value) * 60;
    breakTime = parseInt(breakIntervalInput.value) * 60;
    if (isWorkInterval) {
        currentTime = workTime;
    } else {
        currentTime = breakTime;
    }
    updateTimerDisplay();
}

startStopBtn.addEventListener('click', startTimer);
saveSettingsBtn.addEventListener('click', saveSettings);
updateTimerDisplay();
