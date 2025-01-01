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
const realTimeClock = document.getElementById('realTimeClock');
const savedTimesList = document.getElementById('timesList');
const clearTimesBtn = document.getElementById('clearTimesBtn');

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateRealTimeClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    realTimeClock.textContent = timeString;
}
setInterval(updateRealTimeClock, 1000);
updateRealTimeClock();

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
                saveTime(isWorkInterval ? 'Work' : 'Break');
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
    localStorage.setItem('workInterval', workIntervalInput.value);
    localStorage.setItem('breakInterval', breakIntervalInput.value);
    if (isWorkInterval) {
        currentTime = workTime;
    } else {
        currentTime = breakTime;
    }
    updateTimerDisplay();
}

function saveTime(type) {
    const savedTimes = JSON.parse(localStorage.getItem('savedTimes')) || [];
    if (savedTimes.length >= 5) savedTimes.shift();
    const now = new Date();
    savedTimes.push(`${type}: ${now.toLocaleTimeString()}`);
    localStorage.setItem('savedTimes', JSON.stringify(savedTimes));
    displaySavedTimes();
}

function displaySavedTimes() {
    const savedTimes = JSON.parse(localStorage.getItem('savedTimes')) || [];
    savedTimesList.innerHTML = savedTimes.map(time => `<li>${time}</li>`).join('');
}

function clearSavedTimes() {
    localStorage.removeItem('savedTimes');
    displaySavedTimes();
}

startStopBtn.addEventListener('click', startTimer);
saveSettingsBtn.addEventListener('click', saveSettings);
clearTimesBtn.addEventListener('click', clearSavedTimes);
displaySavedTimes();

// Load saved settings
workIntervalInput.value = localStorage.getItem('workInterval') || 25;
breakIntervalInput.value = localStorage.getItem('breakInterval') || 5;
saveSettings();
updateTimerDisplay();