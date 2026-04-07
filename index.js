// Объявляем все переменные в одном месте
const gameState = {
  clicks: parseInt(localStorage.getItem("clicks")) || 0,
  clickIncrement: parseInt(localStorage.getItem("clickIncrement")) || 1,
  priceForUpgrade: parseInt(localStorage.getItem("priceForUpgrade")) || 100,
  autoClickerCount: parseInt(localStorage.getItem("autoClickerCount")) || 0,
  autoPrice: parseInt(localStorage.getItem("autoPrice")) || 500,
  userName: localStorage.getItem("userName") || ""
};

// Получаем все DOM элементы
const elements = {
  image: document.getElementById("clickableImage"),
  clickCount: document.getElementById("clickCount"),
  increaseClick: document.getElementById("plus1Click"),
  priceDisplay: document.getElementById("priceDisplay"),
  autoUpgrade: document.getElementById("autoClickUpgrade"),
  autoPriceDisplay: document.getElementById("autoPriceDisplay"),
  autoCountDisplay: document.getElementById("autoCountDisplay"),
  userNameInput: document.getElementById("userName"),
  logoutBtn: document.getElementById("logoutBtn")
};

// Сохранение состояния
function saveGameState() {
  localStorage.setItem("clicks", gameState.clicks);
  localStorage.setItem("clickIncrement", gameState.clickIncrement);
  localStorage.setItem("priceForUpgrade", gameState.priceForUpgrade);
  localStorage.setItem("autoClickerCount", gameState.autoClickerCount);
  localStorage.setItem("autoPrice", gameState.autoPrice);
  localStorage.setItem("userName", gameState.userName);
}

// Обновление интерфейса
function updateUI() {
  if (elements.clickCount) elements.clickCount.textContent = `Кликов: ${gameState.clicks}`;
  if (elements.priceDisplay) elements.priceDisplay.textContent = gameState.priceForUpgrade;
  if (elements.autoPriceDisplay) elements.autoPriceDisplay.textContent = gameState.autoPrice;
  if (elements.autoCountDisplay) elements.autoCountDisplay.textContent = `Автоклик: ${gameState.autoClickerCount}/сек`;
  if (elements.userNameInput) elements.userNameInput.value = gameState.userName;
}

// Функция создания вылетающих цифр (Визуальный эффект)
function createFloatingNumber(e, amount) {
  const floatText = document.createElement("div");
  floatText.className = "float-text";
  floatText.innerText = `+${amount}`;
  
  // Позиционируем там, где был клик (с учетом прокрутки страницы)
  const rect = elements.image.getBoundingClientRect();
  const x = e.clientX - rect.left + (Math.random() * 20 - 10); // Немного рандома
  const y = e.clientY - rect.top;
  
  floatText.style.left = `${x}px`;
  floatText.style.top = `${y}px`;
  
  elements.image.parentElement.appendChild(floatText);
  
  // Удаляем элемент после анимации
  setTimeout(() => {
    floatText.remove();
  }, 800);
}

// Обработка клика по картинке
function handleClick(e) {
  gameState.clicks += gameState.clickIncrement;
  saveGameState();
  updateUI();
  createFloatingNumber(e, gameState.clickIncrement);
}

// Улучшение силы клика
function handleUpgrade() {
  if (gameState.clicks >= gameState.priceForUpgrade) {
    gameState.clicks -= gameState.priceForUpgrade;
    gameState.clickIncrement++;
    gameState.priceForUpgrade = Math.floor(gameState.priceForUpgrade * 1.5); // Цена растет на 50%
    saveGameState();
    updateUI();
  } else {
    alert(`Нужно больше кликов! Не хватает: ${gameState.priceForUpgrade - gameState.clicks}`);
  }
}

// Покупка Автокликера
function handleAutoUpgrade() {
  if (gameState.clicks >= gameState.autoPrice) {
    gameState.clicks -= gameState.autoPrice;
    gameState.autoClickerCount++;
    gameState.autoPrice = Math.floor(gameState.autoPrice * 1.8); // Цена автоклика растет быстрее
    saveGameState();
    updateUI();
  } else {
    alert(`На автокликер не хватает! Нужно: ${gameState.autoPrice} кликов.`);
  }
}

// Инициализация кликера
function initClicker() {
  if (elements.image) elements.image.addEventListener("mousedown", handleClick);
  if (elements.increaseClick) elements.increaseClick.addEventListener("click", handleUpgrade);
  if (elements.autoUpgrade) elements.autoUpgrade.addEventListener("click", handleAutoUpgrade);
  
  if (elements.userNameInput) {
    elements.userNameInput.addEventListener("input", (e) => {
      gameState.userName = e.target.value;
      localStorage.setItem("userName", gameState.userName);
    });
  }

  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener("click", function() {
      localStorage.removeItem('isLoggedIn');
      window.location.href = "./sign_in/sign-in.html";
    });
  }

  // Запуск цикла Автокликера (срабатывает каждую секунду)
  setInterval(() => {
    if (gameState.autoClickerCount > 0) {
      gameState.clicks += gameState.autoClickerCount;
      updateUI();
      saveGameState();
    }
  }, 1000);

  updateUI();
}

// Инвентарь логика
if (!localStorage.getItem('inventory')) {
  localStorage.setItem('inventory', JSON.stringify([]));
}

document.addEventListener('DOMContentLoaded', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // Убери коммент со следующей строки, если хочешь жестко проверять логин
  // if (!isLoggedIn) { window.location.href = "./sign_in/sign-in.html"; return; }

  initClicker();
});

document.getElementById('inventory-icon').addEventListener('click', function() {
  const panel = document.getElementById('inventory-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});

function updateInventory() {
  const items = JSON.parse(localStorage.getItem('inventory')) || [];
  const container = document.getElementById('inventory-items');
  
  if (items.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Инвентарь пуст</p>';
  } else {
    container.innerHTML = items.map(item => `
      <div style="text-align: center; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 8px;">
        <img src="${item.image}" width="60" height="60" style="border-radius: 5px; object-fit: cover;">
        <div style="font-size: 11px; margin-top: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem('inventory_initialized')) {
    localStorage.setItem('inventory', JSON.stringify([]));
    localStorage.setItem('inventory_initialized', 'true');
  }
  updateInventory();
});
