// Основное состояние игры (Сохраняется в localStorage)
const gameState = {
  clicks: parseInt(localStorage.getItem("clicks")) || 0,
  clickIncrement: parseInt(localStorage.getItem("clickIncrement")) || 1,
  priceForUpgrade: parseInt(localStorage.getItem("priceForUpgrade")) || 100,
  autoClickerCount: parseInt(localStorage.getItem("autoClickerCount")) || 0,
  autoPrice: parseInt(localStorage.getItem("autoPrice")) || 500,
  critChance: parseFloat(localStorage.getItem("critChance")) || 0, // в процентах (0-100)
  critPrice: parseInt(localStorage.getItem("critPrice")) || 1000,
  level: parseInt(localStorage.getItem("level")) || 1,
  exp: parseInt(localStorage.getItem("exp")) || 0,
  hasGlolves: localStorage.getItem("hasGlolves") === 'true',
  userName: localStorage.getItem("userName") || ""
};

// Временные переменные (не сохраняются)
let comboCounter = 0;
let comboMultiplier = 1;
let comboTimer = null;

// Элементы DOM
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
  comboMeter: document.getElementById("comboMeter"),
  levelDisp: document.getElementById("levelDisplay"),
  expFill: document.getElementById("expFill"),
  userInput: document.getElementById("userName"),
  logoutBtn: document.getElementById("logoutBtn")
};

// Функция расчета опыта до следующего уровня
function getExpForNextLevel() {
  return Math.floor(100 * Math.pow(1.5, gameState.level - 1));
}

// Сохранение
function saveState() {
  localStorage.setItem("clicks", gameState.clicks);
  localStorage.setItem("clickIncrement", gameState.clickIncrement);
  localStorage.setItem("priceForUpgrade", gameState.priceForUpgrade);
  localStorage.setItem("autoClickerCount", gameState.autoClickerCount);
  localStorage.setItem("autoPrice", gameState.autoPrice);
  localStorage.setItem("critChance", gameState.critChance);
  localStorage.setItem("critPrice", gameState.critPrice);
  localStorage.setItem("level", gameState.level);
  localStorage.setItem("exp", gameState.exp);
  localStorage.setItem("hasGlolves", gameState.hasGlolves);
  localStorage.setItem("userName", gameState.userName);
}

// Обновление интерфейса
function updateUI() {
  el.clickCount.textContent = Math.floor(gameState.clicks);
  el.priceDisp.textContent = gameState.priceForUpgrade + " C";
  el.autoPriceDisp.textContent = gameState.autoPrice + " C";
  el.autoCountDisp.textContent = `${gameState.autoClickerCount}/сек`;
  el.critPriceDisp.textContent = gameState.critPrice + " C";
  el.userInput.value = gameState.userName;
  
  // Уровень и Опыт
  el.levelDisp.textContent = `LVL: ${gameState.level}`;
  const expNeeded = getExpForNextLevel();
  const expPercent = Math.min(100, (gameState.exp / expNeeded) * 100);
  el.expFill.style.width = `${expPercent}%`;

  // Появление секретного апгрейда (На 10 уровне)
  if (gameState.level >= 10 && !gameState.hasGlolves) {
    el.glolvesBtn.style.display = "grid";
  } else {
    el.glolvesBtn.style.display = "none";
  }
}

// Управление Комбо
function resetCombo() {
  comboCounter = 0;
  comboMultiplier = 1;
  el.comboMeter.classList.remove("active");
}

function handleCombo() {
  comboCounter++;
  clearTimeout(comboTimer);
  
  // Каждые 10 быстрых кликов увеличивают множитель, максимум x5
  comboMultiplier = Math.min(5, 1 + Math.floor(comboCounter / 10) * 0.5);
  
  if (comboMultiplier > 1) {
    el.comboMeter.classList.add("active");
    el.comboMeter.textContent = `COMBO x${comboMultiplier.toFixed(1)}`;
  }

  // Если не кликать 1.5 секунды - комбо сбрасывается
  comboTimer = setTimeout(resetCombo, 1500);
}

// Получение опыта
function addExp(amount) {
  gameState.exp += amount;
  let expNeeded = getExpForNextLevel();
  
  if (gameState.exp >= expNeeded) {
    gameState.level++;
    gameState.exp -= expNeeded;
    // Визуальный эффект левелапа (Тряска экрана)
    document.body.classList.add("shake-active");
    setTimeout(() => document.body.classList.remove("shake-active"), 200);
  }
}

// Создание вылетающих цифр
function createFloatingNumber(x, y, amount, isCrit) {
  const floatText = document.createElement("div");
  floatText.className = `float-text ${isCrit ? 'crit-hit' : 'normal-hit'}`;
  floatText.innerText = isCrit ? `КРИТ! +${amount}` : `+${amount}`;
  
  floatText.style.left = `${x + (Math.random() * 40 - 20)}px`;
  floatText.style.top = `${y}px`;
  
  el.zone.appendChild(floatText);
  setTimeout(() => floatText.remove(), 800);
}

// Основной Клик
function handleClick(e) {
  handleCombo();
  
  let currentPower = gameState.clickIncrement * comboMultiplier;
  let isCrit = false;

  // Проверка на Крит
  if (Math.random() * 100 < gameState.critChance) {
    currentPower *= 3; // Крит умножает силу на 3
    isCrit = true;
    el.zone.classList.add("shake-active");
    setTimeout(() => el.zone.classList.remove("shake-active"), 200);
  }

  currentPower = Math.floor(currentPower);
  gameState.clicks += currentPower;
  
  addExp(1); // 1 клик = 1 опыт
  saveState();
  updateUI();

  // Координаты для текста
  const rect = el.zone.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  createFloatingNumber(x, y, currentPower, isCrit);
}

// Покупки
function buyUpgrade(costVar, levelVar, costMult, callback) {
  if (gameState.clicks >= gameState[costVar]) {
    gameState.clicks -= gameState[costVar];
    gameState[levelVar] += (levelVar === 'critChance' ? 5 : 1); // Крит растет на 5%
    gameState[costVar] = Math.floor(gameState[costVar] * costMult);
    if(callback) callback();
    saveState();
    updateUI();
  } else {
    alert("НЕДОСТАТОЧНО СРЕДСТВ В СИСТЕМЕ!");
  }
}

// Инициализация
function initGame() {
  // Обработчики кликов
  el.image.addEventListener("mousedown", handleClick);
  
  el.plus1Btn.addEventListener("click", () => buyUpgrade('priceForUpgrade', 'clickIncrement', 1.6));
  el.autoBtn.addEventListener("click", () => buyUpgrade('autoPrice', 'autoClickerCount', 1.8));
  el.critBtn.addEventListener("click", () => {
    if (gameState.critChance >= 50) return alert("Максимальный шанс крита достигнут!");
    buyUpgrade('critPrice', 'critChance', 2.5);
  });

  // Легендарный апгрейд
  el.glolvesBtn.addEventListener("click", () => {
    if (gameState.clicks >= 100000) {
      gameState.clicks -= 100000;
      gameState.hasGlolves = true;
      gameState.clickIncrement *= 10; // Умножаем силу в 10 раз
      alert("АРТЕФАКТ 'Glolves.glb' ИНТЕГРИРОВАН! Сила клика x10!");
      
      // Добавляем в инвентарь (визуально)
      const inv = JSON.parse(localStorage.getItem('inventory')) || [];
      inv.push({ name: "Glolves.glb", image: "./img/inventar.jpg" }); // Используем заглушку картинки
      localStorage.setItem('inventory', JSON.stringify(inv));
      updateInventory();

      saveState();
      updateUI();
    } else {
      alert("НУЖНО БОЛЬШЕ КЛИКОВ (100,000)!");
    }
  });

  // Имя и Выход
  el.userInput.addEventListener("input", (e) => {
    gameState.userName = e.target.value;
    saveState();
  });
  el.logoutBtn.addEventListener("click", () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = "./sign_in/sign-in.html";
  });

  // Автокликер (раз в секунду)
  setInterval(() => {
    if (gameState.autoClickerCount > 0) {
      gameState.clicks += gameState.autoClickerCount;
      addExp(Math.floor(gameState.autoClickerCount / 2)); // Пассивный опыт
      updateUI();
      saveState();
    }
  }, 1000);

  updateUI();
}

// --- ИНВЕНТАРЬ ---
document.getElementById('inventory-icon').addEventListener('click', function() {
  const panel = document.getElementById('inventory-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});

function updateInventory() {
  const items = JSON.parse(localStorage.getItem('inventory')) || [];
  const container = document.getElementById('inventory-items');
  
  if (items.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666; font-size: 0.9rem;">Пусто</div>';
  } else {
    container.innerHTML = items.map(item => `
      <div class="inv-item">
        <img src="${item.image}" alt="item">
        <div class="inv-item-name">${item.name}</div>
      </div>
    `).join('');
  }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('inventory_initialized')) {
    localStorage.setItem('inventory', JSON.stringify([]));
    localStorage.setItem('inventory_initialized', 'true');
  }
  updateInventory();
  initGame();
});
