// --- РЕГИСТРАЦИЯ PWA (SERVICE WORKER) ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(() => console.log("PWA Ready"));
}

// --- СОСТОЯНИЕ ИГРЫ ---
const gameState = {
  clicks: parseInt(localStorage.getItem("clicks")) || 0,
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
  userName: localStorage.getItem("userName") || ""
};

let comboCounter = 0;
let comboMultiplier = 1;
let comboTimer = null;

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
  expFill: document.getElementById("expFill")
};

function getExpForNextLevel() { return Math.floor(100 * Math.pow(1.5, gameState.level - 1)); }

function saveState() {
  for (let key in gameState) {
    localStorage.setItem(key, gameState[key]);
  }
}

// СИНХРОНИЗАЦИЯ: Ловим обновления из других вкладок (Биржи)
window.addEventListener('focus', () => {
  const latestClicks = parseInt(localStorage.getItem("clicks")) || 0;
  if (latestClicks !== gameState.clicks) {
    gameState.clicks = latestClicks;
    updateUI();
  }
});

function updateUI() {
  el.clickCount.textContent = Math.floor(gameState.clicks).toLocaleString();
  el.priceDisp.textContent = gameState.priceForUpgrade + " C";
  el.autoPriceDisp.textContent = gameState.autoPrice + " C";
  el.autoCountDisp.textContent = `${gameState.autoClickerCount}/сек`;
  el.critPriceDisp.textContent = gameState.critPrice + " C";
  el.prestigeLevel.textContent = `Престиж: ${gameState.prestigeCount}`;
  
  el.levelDisp.textContent = `Уровень ${gameState.level}`;
  el.expFill.style.width = `${Math.min(100, (gameState.exp / getExpForNextLevel()) * 100)}%`;

  if (gameState.level >= 10 && !gameState.hasGlolves) el.glolvesBtn.style.display = "flex";
  else el.glolvesBtn.style.display = "none";
}

function handleCombo() {
  comboCounter++;
  clearTimeout(comboTimer);
  comboMultiplier = Math.min(5, 1 + Math.floor(comboCounter / 10) * 0.5);
  
  if (comboMultiplier > 1) {
    el.comboMeter.classList.add("active");
    el.comboMeter.textContent = `COMBO x${comboMultiplier.toFixed(1)}`;
  }
  comboTimer = setTimeout(() => {
    comboCounter = 0; comboMultiplier = 1; el.comboMeter.classList.remove("active");
  }, 1500);
}

function handleClick(e) {
  handleCombo();
  // Бонус от престижа (каждый престиж дает +100% к базе)
  let prestigeMult = 1 + gameState.prestigeCount;
  let currentPower = gameState.clickIncrement * comboMultiplier * prestigeMult;
  let isCrit = false;

  if (Math.random() * 100 < gameState.critChance) {
    currentPower *= 3; isCrit = true;
  }

  currentPower = Math.floor(currentPower);
  gameState.clicks += currentPower;
  gameState.exp += 1;
  
  if (gameState.exp >= getExpForNextLevel()) {
    gameState.level++; gameState.exp = 0;
  }
  
  saveState(); updateUI();

  const rect = el.zone.getBoundingClientRect();
  const floatText = document.createElement("div");
  floatText.className = `float-text ${isCrit ? 'crit-hit' : ''}`;
  floatText.innerText = isCrit ? `КРИТ! +${currentPower}` : `+${currentPower}`;
  floatText.style.left = `${e.clientX - rect.left + (Math.random()*40-20)}px`;
  floatText.style.top = `${e.clientY - rect.top}px`;
  el.zone.appendChild(floatText);
  setTimeout(() => floatText.remove(), 800);
}

function buyUpgrade(costVar, levelVar, costMult) {
  if (gameState.clicks >= gameState[costVar]) {
    gameState.clicks -= gameState[costVar];
    gameState[levelVar] += (levelVar === 'critChance' ? 5 : 1);
    gameState[costVar] = Math.floor(gameState[costVar] * costMult);
    saveState(); updateUI();
  }
}

// Престиж (Сброс прогресса ради множителя)
el.prestigeBtn.addEventListener("click", () => {
  if (gameState.level >= 15) {
    if(confirm("Сбросить весь прогресс (кроме Glolves) ради вечного x2 множителя?")) {
      gameState.clicks = 0; gameState.clickIncrement = 1;
      gameState.priceForUpgrade = 100; gameState.autoClickerCount = 0;
      gameState.autoPrice = 500; gameState.critChance = 0;
      gameState.critPrice = 1000; gameState.level = 1; gameState.exp = 0;
      gameState.prestigeCount++;
      saveState(); updateUI();
    }
  } else {
    alert("Престиж доступен только с 15 уровня!");
  }
});

function initGame() {
  el.image.addEventListener("mousedown", handleClick);
  el.plus1Btn.addEventListener("click", () => buyUpgrade('priceForUpgrade', 'clickIncrement', 1.6));
  el.autoBtn.addEventListener("click", () => buyUpgrade('autoPrice', 'autoClickerCount', 1.8));
  el.critBtn.addEventListener("click", () => {
    if (gameState.critChance >= 50) return;
    buyUpgrade('critPrice', 'critChance', 2.5);
  });

  el.glolvesBtn.addEventListener("click", () => {
    if (gameState.clicks >= 100000) {
      gameState.clicks -= 100000;
      gameState.hasGlolves = true;
      gameState.clickIncrement *= 10;
      
      const inv = JSON.parse(localStorage.getItem('inventory')) || [];
      inv.push({ name: "Glolves.glb", image: "./img/inventar.jpg" });
      localStorage.setItem('inventory', JSON.stringify(inv));
      updateInventory();
      
      saveState(); updateUI();
      alert("Экипирован предмет: Glolves.glb. Сила x10!");
    }
  });

  document.getElementById("userName").addEventListener("input", (e) => {
    gameState.userName = e.target.value; saveState();
  });

  setInterval(() => {
    if (gameState.autoClickerCount > 0) {
      gameState.clicks += gameState.autoClickerCount * (1 + gameState.prestigeCount);
      updateUI(); saveState();
    }
  }, 1000);

  updateUI();
}

// Инвентарь
document.getElementById('inventory-icon').addEventListener('click', () => {
  const panel = document.getElementById('inventory-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});

function updateInventory() {
  const items = JSON.parse(localStorage.getItem('inventory')) || [];
  const container = document.getElementById('inventory-items');
  if (items.length === 0) container.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">Пусто</div>';
  else container.innerHTML = items.map(i => `<div class="inv-item"><img src="${i.image}"><div class="inv-item-name">${i.name}</div></div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('inventory_initialized')) {
    localStorage.setItem('inventory', JSON.stringify([]));
    localStorage.setItem('inventory_initialized', 'true');
  }
  updateInventory(); initGame();
});
