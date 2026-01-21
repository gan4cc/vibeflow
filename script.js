let timerId = null;
let isPaused = true;

// Элементы
const timerDisplay = document.getElementById('timer');
const startStopBtn = document.getElementById('startStopBtn');
const timeSlider = document.getElementById('time-slider');
const timeValue = document.getElementById('time-value');
const audioPlayer = document.getElementById('audio-player');
const soundSelect = document.getElementById('bg-sound');

// Настройка времени и звука финиша
let timeLeft = timeSlider.value * 60;

const playlist = [
  { name: "Bird Tweet", url: "sounds/bird-tweet.ogg" },          // Индекс 0
  { name: "Body and Mind", url: "sounds/body_and_mind_harmony.ogg" }, // Индекс 1
  { name: "Cyberpunk Relax", url: "sounds/cyberpunk_relax.ogg" },   // Индекс 2
  { name: "Peaceful Water", url: "sounds/peaceful_water_sounds.ogg" } // Индекс 3
];

// Звук финиша подхватит обновленный путь
const finishSound = new Audio(playlist[0].url);

function toggleTimer() {
    if (isPaused) {
        isPaused = false;
        startStopBtn.textContent = "Pause Flow";
        startStopBtn.style.borderColor = "#ffeb3b"; 
        startStopBtn.style.color = "#ffeb3b";

        // Если НЕ тишина — запускаем фоновый звук
        if (soundSelect.value !== "none") {
            audioPlayer.play().catch(e => console.log("Audio waiting for user click"));
        }

        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerId);
                audioPlayer.pause();
                
                // Если выбран звук (не Silence) — поют птицы
                if (soundSelect.value !== "none") {
                    finishSound.play().catch(e => console.log("Finish sound blocked"));
                }
                
                resetTimer();
            }
        }, 1000);
    } else {
        isPaused = true;
        startStopBtn.textContent = "Resume Flow";
        startStopBtn.style.borderColor = "#ff00ff";
        startStopBtn.style.color = "#ff00ff";
        
        audioPlayer.pause();
        clearInterval(timerId);
        timerId = null;
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isPaused = true;
    
    // Сброс на время из слайдера
    timeLeft = timeSlider.value * 60; 
    updateDisplay();
    
    startStopBtn.textContent = "Enter the Flow";
    startStopBtn.style.borderColor = "#ff00ff";
    startStopBtn.style.color = "#ff00ff";
    
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function changeSound() {
    const selectedValue = soundSelect.value;
    
    if (selectedValue === "none") {
        audioPlayer.pause();
        audioPlayer.src = "";
        return;
    }

    const index = parseInt(selectedValue);
    
    // Проверка: существует ли такой элемент в массиве?
    if (playlist[index]) {
        console.log("Playing:", playlist[index].name);
        audioPlayer.src = playlist[index].url;
        audioPlayer.load();
        
        if (!isPaused) {
            audioPlayer.play().catch(e => console.log("Need to clock on display"));
        }
    } else {
        console.error("Ошибка: Sound with index " + index + " not found at the array playlist!");
    }
}

function updateTimerDuration() {
    if (!isPaused) resetTimer();
    const minutes = timeSlider.value;
    timeValue.textContent = minutes;
    timeLeft = minutes * 60;
    updateDisplay();
}
function showUpdateNotify() {
    const notify = document.createElement('div');
    notify.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; background: #00f3ff; color: #000; 
                    text-align: center; padding: 15px; z-index: 10000; font-weight: bold; cursor: pointer;">
            Доступна новая версия! Нажми, чтобы обновить.
        </div>
    `;
    notify.onclick = () => window.location.reload();
    document.body.appendChild(notify);
}
// Проверка обновления при регистрации SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
        reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    showUpdateNotify(); // Показываем плашку, когда файлы скачаны
                }
            };
        };
    });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('PWA Ready!'))
      .catch(err => console.log('PWA Error:', err));
  });
}