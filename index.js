if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

const gameState = {
  clicks: parseInt(localStorage.getItem("clicks")) || 0,
  totalClicks: parseInt(localStorage.getItem("totalClicks")) || 0, // Для ачивок
  clickIncrement: parseInt(localStorage.getItem("clickIncrement")) || 1,
  priceForUpgrade: parseInt(localStorage.getItem("priceForUpgrade")) || 100,
  autoClickerCount: parseInt(localStorage.getItem("autoClickerCount")) || 0,
  autoPrice: parseInt(localStorage.getItem("autoPrice")) || 500,
  critChance: parseFloat(localStorage.getItem("critChance")) || 0,
  critPrice: parseInt(localStorage.getItem("critPrice")) || 1000,
  level: parseInt(localStorage.getItem("level")) || 1,
  exp: parseInt(localStorage.getItem("exp")) || 0,
  hasGlolves: localStorage.getItem("hasGlolves") === 'true',
  prestigeCount: parseInt(localStorage.getItem("prestigeCount")) || 0,
  userName: localStorage.getItem("userName") || "",
  achievements: JSON.parse(localStorage.getItem("achievements")) || { ach1: false, ach2: false, ach3: false }
};

let comboCounter = 0;
let comboMultiplier = 1;
let comboTimer = null;
let skillActive = false;
let skillCooldown = false;

const el = {
  image: document.getElementById("clickableImage"),
  zone: document.getElementById("container"),
  clickCount: document.getElementById("clickCount"),
  plus1Btn: document.getElementById("plus1Click"),
  priceDisp: document.getElementById("priceDisplay"),
  autoBtn: document.getElementById("autoClickUpgrade"),
  autoPriceDisp: document.getElementById("autoPriceDisplay"),
  autoCountDisp: document.getElementById("autoCountDisplay"),
  critBtn: document.getElementById("critUpgrade"),
  critPriceDisp: document.getElementById("critPriceDisplay"),
  glolvesBtn: document.getElementById("glolvesUpgrade"),
  prestigeBtn: document.getElementById("prestigeBtn"),
  prestigeLevel: document.getElementById("prestigeLevel"),
  comboMeter: document.getElementById("comboMeter"),
  levelDisp: document.getElementById("levelDisplay"),
  expFill: document.getElementById("expFill"),
  skillBtn: document.getElementById("skillBoostBtn")
};

function getExpForNextLevel() { return Math.floor(100 * Math.pow(1.5, gameState.level - 1)); }

function saveState() {
  for (let key in gameState) {
    if(key === 'achievements') localStorage.setItem(key, JSON.stringify(gameState[key]));
    else localStorage.setItem(key, gameState[key]);
  }
}

// ОФФЛАЙН ДОХОД
function checkOfflineProgress() {
  const lastLogin = parseInt(localStorage.getItem("lastLogin")) || Date.now();
  const now = Date.now();
  const offlineSeconds = Math.floor((now - lastLogin) / 1000);
  
  if (offlineSeconds > 60 && gameState.autoClickerCount > 0) {
    const earned = offlineSeconds * gameState.autoClickerCount * (1 + gameState.prestigeCount);
    gameState.clicks += earned;
    alert(`ОФФЛАЙН ОТЧЕТ:\nДроны работали ${offlineSeconds} сек. и добыли ${earned} Коинов!`);
    saveState();
  }
  localStorage.setItem("lastLogin", now);
}

window.addEventListener('focus', () => {
  const latestClicks = parseInt(localStorage.getItem("clicks")) || 0;
  if (latestClicks > gameState.clicks) { gameState.clicks = latestClicks; updateUI(); }
});

// АЧИВКИ
function checkAchievements() {
  if (gameState.totalClicks >= 100 && !gameState.achievements.ach1) { gameState.achievements.ach1 = true; }
  if (gameState.totalClicks >= 1000 && !gameState.achievements.ach2) { gameState.achievements.ach2 = true; }
  if (gameState.clicks >= 10000 && !gameState.achievements.ach3) { gameState.achievements.ach3 = true; }
  
  for (let i = 1; i <= 3; i++) {
    const achEl = document.getElementById(`ach${i}`);
    if (gameState.achievements[`ach${i}`]) {
      achEl.classList.add("unlocked");
      achEl.innerText = achEl.innerText.replace(' (', ' ✔️ (');
    }
  }
}

function updateUI() {
  el.clickCount.textContent = Math.floor(gameState.clicks).toLocaleString();
  el.priceDisp.textContent = gameState.priceForUpgrade + " C";
  el.autoPriceDisp.textContent = gameState.autoPrice + " C";
  el.autoCountDisp.textContent = `${gameState.autoClickerCount}/сек`;
  el.critPriceDisp.textContent = gameState.critPrice + " C";
  el.prestigeLevel.textContent = `Ранг: ${gameState.prestigeCount}`;
  
  el.levelDisp.textContent = `УРОВЕНЬ ${gameState.level}`;
  el.expFill.style.width = `${Math.min(100, (gameState.exp / getExpForNextLevel()) * 100)}%`;

  if (gameState.level >= 10 && !gameState.hasGlolves) el.glolvesBtn.style.display = "flex";
  else el.glolvesBtn.style.display = "none";
  
  checkAchievements();
}

function handleCombo() {
  comboCounter++;
  clearTimeout(comboTimer);
  comboMultiplier = Math.min(5, 1 + Math.floor(comboCounter / 10) * 0.5);
  if (comboMultiplier > 1) {
    el.comboMeter.classList.add("active");
    el.comboMeter.textContent = `COMBO x${comboMultiplier.toFixed(1)}`;
  }
  comboTimer = setTimeout(() => { comboCounter = 0; comboMultiplier = 1; el.comboMeter.classList.remove("active"); }, 1500);
}

function handleClick(e) {
  handleCombo();
  let prestigeMult = 1 + gameState.prestigeCount;
  let skillMult = skillActive ? 5 : 1;
  let currentPower = gameState.clickIncrement * comboMultiplier * prestigeMult * skillMult;
  let isCrit = false;

  if (Math.random() * 100 < gameState.critChance) { currentPower *= 3; isCrit = true; }

  currentPower = Math.floor(currentPower);
  gameState.clicks += currentPower;
  gameState.totalClicks += 1;
  gameState.exp += 1;
  
  if (gameState.exp >= getExpForNextLevel()) { gameState.level++; gameState.exp = 0; }
  
  saveState(); updateUI();

  const rect = el.zone.getBoundingClientRect();
  const floatText = document.createElement("div");
  floatText.className = `float-text ${isCrit ? 'crit-hit' : ''}`;
  floatText.innerText = isCrit ? `КРИТ! +${currentPower}` : `+${currentPower}`;
  floatText.style.left = `${e.clientX - rect.left + (Math.random()*40-20)}px`;
  floatText.style.top = `${e.clientY - rect.top}px`;
  el.zone.appendChild(floatText);
  setTimeout(() => floatText.remove(), 700);
}

function buyUpgrade(costVar, levelVar, costMult) {
  if (gameState.clicks >= gameState[costVar]) {
    gameState.clicks -= gameState[costVar];
    gameState[levelVar] += (levelVar === 'critChance' ? 5 : 1);
    gameState[costVar] = Math.floor(gameState[costVar] * costMult);
    saveState(); updateUI();
  }
}

// АКТИВНЫЙ НАВЫК
el.skillBtn.addEventListener("click", () => {
  if (skillCooldown || skillActive) return;
  
  skillActive = true;
  el.skillBtn.classList.add("active");
  el.skillBtn.innerText = "⚡ ПЕРЕГРУЗКА АКТИВНА!";
  
  setTimeout(() => {
    skillActive = false;
    skillCooldown = true;
    el.skillBtn.classList.remove("active");
    el.skillBtn.disabled = true;
    
    let timer = 120; // 2 минуты откат
    const cdInterval = setInterval(() => {
      timer--;
      el.skillBtn.innerText = `⏳ Откат: ${timer}с`;
      if (timer <= 0) {
        clearInterval(cdInterval);
        skillCooldown = false;
        el.skillBtn.disabled = false;
        el.skillBtn.innerText = "⚡ ПЕРЕГРУЗКА (Готово)";
      }
    }, 1000);
  }, 10000); // Действует 10 секунд
});

el.prestigeBtn.addEventListener("click", () => {
  if (gameState.level >= 15) {
    if(confirm("Сбросить прогресс ради вечного x2 бонуса к добыче?")) {
      gameState.clicks = 0; gameState.clickIncrement = 1;
      gameState.priceForUpgrade = 100; gameState.autoClickerCount = 0;
      gameState.autoPrice = 500; gameState.critChance = 0;
      gameState.critPrice = 1000; gameState.level = 1; gameState.exp = 0;
      gameState.prestigeCount++; saveState(); updateUI();
    }
  } else { alert("Престиж доступен с 15 уровня!"); }
});

function initGame() {
  checkOfflineProgress();
  el.image.addEventListener("mousedown", handleClick);
  el.plus1Btn.addEventListener("click", () => buyUpgrade('priceForUpgrade', 'clickIncrement', 1.6));
  el.autoBtn.addEventListener("click", () => buyUpgrade('autoPrice', 'autoClickerCount', 1.8));
  el.critBtn.addEventListener("click", () => { if (gameState.critChance < 50) buyUpgrade('critPrice', 'critChance', 2.5); });

  el.glolvesBtn.addEventListener("click", () => {
    if (gameState.clicks >= 100000) {
      gameState.clicks -= 100000; gameState.hasGlolves = true; gameState.clickIncrement *= 10;
      const inv = JSON.parse(localStorage.getItem('inventory')) || [];
      inv.push({ name: "Glolves.glb", image: "./img/inventar.jpg" });
      localStorage.setItem('inventory', JSON.stringify(inv));
      updateInventory(); saveState(); updateUI();
    }
  });

  document.getElementById("userName").addEventListener("input", (e) => { gameState.userName = e.target.value; saveState(); });

  setInterval(() => {
    if (gameState.autoClickerCount > 0) {
      let skillMult = skillActive ? 5 : 1;
      gameState.clicks += gameState.autoClickerCount * (1 + gameState.prestigeCount) * skillMult;
      updateUI(); saveState();
    }
    localStorage.setItem("lastLogin", Date.now()); // Обновляем время для оффлайна
  }, 1000);

  updateUI();
}

document.getElementById('inventory-icon').addEventListener('click', () => {
  const panel = document.getElementById('inventory-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});

function updateInventory() {
  const items = JSON.parse(localStorage.getItem('inventory')) || [];
  const container = document.getElementById('inventory-items');
  if (items.length === 0) container.innerHTML = '<div style="color: #666; font-size: 0.9rem;">Пусто</div>';
  else container.innerHTML = items.map(i => `<div class="inv-item"><img src="${i.image}"><div class="inv-item-name">${i.name}</div></div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  updateInventory(); initGame();
});
