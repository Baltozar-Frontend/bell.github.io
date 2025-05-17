let clicks = parseInt(localStorage.getItem("clicks")) || 0;
let clickIncrement = parseInt(localStorage.getItem("clickIncrement")) || 1;
let priceForUpgrade = parseInt(localStorage.getItem("priceForUpgrade")) || 100; // Цена улучшения
const image = document.getElementById("clickableImage");
const clickCount = document.getElementById("clickCount");
const increaseClick = document.getElementById("plus1Click");
const priceDisplay = document.getElementById("priceDisplay"); // Добавляем элемент для отображения цены

// Отображаем начальную цену
if (priceDisplay) {
  // Проверяем, существует ли элемент
  priceDisplay.textContent = `Цена улучшения: ${priceForUpgrade}`;
}

clickCount.textContent = `Кликов: ${clicks}`;

image.addEventListener("click", () => {
  clicks += clickIncrement;
  clickCount.textContent = `Кликов: ${clicks}`;
  localStorage.setItem("clicks", clicks);
});

// --- ИМЯ ПОЛЬЗОВАТЕЛЯ ---
// ... (код для имени пользователя без изменений)
const userNameInput = document.getElementById("userName");
userNameInput.value = localStorage.getItem("userName") || "";
userNameInput.addEventListener("input", () => {
  localStorage.setItem("userName", userNameInput.value);
});

increaseClick.addEventListener("click", () => {
  if (clicks >= priceForUpgrade) {
    clicks -= priceForUpgrade;
    clickIncrement++;
    priceForUpgrade += 100; // Увеличиваем цену улучшения
    localStorage.setItem("priceForUpgrade", priceForUpgrade); // Сохраняем новую цену
    localStorage.setItem("clickIncrement", clickIncrement);
    localStorage.setItem("clicks", clicks);
    clickCount.textContent = `Кликов: ${clicks}`;

    if (priceDisplay) {
      // Обновляем отображение цены, если элемент существует
      priceDisplay.textContent = `Цена улучшения: ${priceForUpgrade}`;
    }
  } else {
    alert(`У тебя недостаточно очков! Нужно ${priceForUpgrade} кликов.`);
  }
});


// Проверяем авторизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
      // Если не авторизован, перенаправляем на страницу входа
      window.location.href = "login.html"; // Укажите правильный путь к вашей странице входа
      return;
  }

  // Только если пользователь авторизован, инициализируем кликер
  initClicker();
});

function initClicker() {
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;
  let clickIncrement = parseInt(localStorage.getItem("clickIncrement")) || 1;
  let priceForUpgrade = parseInt(localStorage.getItem("priceForUpgrade")) || 100;
  const image = document.getElementById("clickableImage");
  const clickCount = document.getElementById("clickCount");
  const increaseClick = document.getElementById("plus1Click");
  const priceDisplay = document.getElementById("priceDisplay");
  const logoutBtn = document.getElementById("logoutBtn");

  // Отображаем начальную цену
  if (priceDisplay) {
      priceDisplay.textContent = `Цена улучшения: ${priceForUpgrade}`;
  }

  clickCount.textContent = `Кликов: ${clicks}`;

  // Обработчик кликов по изображению
  image.addEventListener("click", () => {
      clicks += clickIncrement;
      clickCount.textContent = `Кликов: ${clicks}`;
      localStorage.setItem("clicks", clicks);
  });

  // Обработчик улучшения
  increaseClick.addEventListener("click", () => {
      if (clicks >= priceForUpgrade) {
          clicks -= priceForUpgrade;
          clickIncrement++;
          priceForUpgrade += 100;
          localStorage.setItem("priceForUpgrade", priceForUpgrade);
          localStorage.setItem("clickIncrement", clickIncrement);
          localStorage.setItem("clicks", clicks);
          clickCount.textContent = `Кликов: ${clicks}`;

          if (priceDisplay) {
              priceDisplay.textContent = `Цена улучшения: ${priceForUpgrade}`;
          }
      } else {
          alert(`У тебя недостаточно очков! Нужно ${priceForUpgrade} кликов.`);
      }
  });

  // Имя пользователя
  const userNameInput = document.getElementById("userName");
  userNameInput.value = localStorage.getItem("userName") || "";
  userNameInput.addEventListener("input", () => {
      localStorage.setItem("userName", userNameInput.value);
  });

  // Кнопка выхода (если есть)
  if (logoutBtn) {
      logoutBtn.addEventListener("click", function() {
          localStorage.removeItem('isLoggedIn');
          window.location.href = "../sign in/sign-in.html";
      });
  }
}
