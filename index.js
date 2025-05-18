// Объявляем все переменные в одном месте
const gameState = {
  clicks: parseInt(localStorage.getItem("clicks")) || 0,
  clickIncrement: parseInt(localStorage.getItem("clickIncrement")) || 1,
  priceForUpgrade: parseInt(localStorage.getItem("priceForUpgrade")) || 100,
  userName: localStorage.getItem("userName") || ""
};

// Получаем все DOM элементы
const elements = {
  image: document.getElementById("clickableImage"),
  clickCount: document.getElementById("clickCount"),
  increaseClick: document.getElementById("plus1Click"),
  priceDisplay: document.getElementById("priceDisplay"),
  userNameInput: document.getElementById("userName"),
  logoutBtn: document.getElementById("logoutBtn")
};

// Функция для сохранения состояния игры
function saveGameState() {
  localStorage.setItem("clicks", gameState.clicks);
  localStorage.setItem("clickIncrement", gameState.clickIncrement);
  localStorage.setItem("priceForUpgrade", gameState.priceForUpgrade);
  localStorage.setItem("userName", gameState.userName);
}

// Функция для обновления интерфейса
function updateUI() {
  if (elements.clickCount) elements.clickCount.textContent = `Кликов: ${gameState.clicks}`;
  if (elements.priceDisplay) elements.priceDisplay.textContent = `Цена улучшения: ${gameState.priceForUpgrade}`;
  if (elements.userNameInput) elements.userNameInput.value = gameState.userName;
}

// Функция обработки клика
function handleClick() {
  gameState.clicks += gameState.clickIncrement;
  saveGameState();
  updateUI();
}

// Функция улучшения
function handleUpgrade() {
  if (gameState.clicks >= gameState.priceForUpgrade) {
    gameState.clicks -= gameState.priceForUpgrade;
    gameState.clickIncrement++;
    gameState.priceForUpgrade += 100;
    saveGameState();
    updateUI();
  } else {
    alert(`У тебя недостаточно очков! Нужно ${gameState.priceForUpgrade} кликов.`);
  }
}

// Функция инициализации кликера
function initClicker() {
  // Настройка обработчиков событий
  if (elements.image) elements.image.addEventListener("click", handleClick);
  if (elements.increaseClick) elements.increaseClick.addEventListener("click", handleUpgrade);
  
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

  updateUI();
}


// Проверяем, есть ли сохранённый инвентарь, если нет - инициализируем пустым
if (!localStorage.getItem('inventory')) {
  localStorage.setItem('inventory', JSON.stringify([]));
}

// Проверка авторизации и запуск игры
document.addEventListener('DOMContentLoaded', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    window.location.href = "./sign_in/sign-in.html";
    return;
  }

  initClicker();
});

 // Обработчик клика по иконке
 document.getElementById('inventory-icon').addEventListener('click', function() {
  const panel = document.getElementById('inventory-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});

// Функция обновления инвентаря
function updateInventory() {
  const items = JSON.parse(localStorage.getItem('inventory')) || [];
  const container = document.getElementById('inventory-items');
  
  if (items.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Инвентарь пуст</p>';
  } else {
    container.innerHTML = items.map(item => `
      <div style="text-align: center;">
        <img src="${item.image}" width="70" height="70" style="border-radius: 5px;">
        <div style="font-size: 12px;">${item.name}</div>
      </div>
    `).join('');
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  // Гарантируем, что инвентарь пуст при первом запуске
  if (!localStorage.getItem('inventory_initialized')) {
    localStorage.setItem('inventory', JSON.stringify([]));
    localStorage.setItem('inventory_initialized', 'true');
  }
  updateInventory();
});
