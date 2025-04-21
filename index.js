// --- КЛИКИ ---
let clicks = localStorage.getItem('clicks') || 0;
clicks = parseInt(clicks);
const image = document.getElementById('clickableImage');
const clickCount = document.getElementById('clickCount');
clickCount.textContent = `Кликов: ${clicks}`;

image.addEventListener('click', () => {
  clicks++;
  clickCount.textContent = `Кликов: ${clicks}`;
  localStorage.setItem('clicks', clicks);
});

// --- ИМЯ ПОЛЬЗОВАТЕЛЯ ---
const userNameInput = document.getElementById('userName');

// Загружаем имя пользователя из localStorage
userNameInput.value = localStorage.getItem('userName') || '';

// Сохраняем имя пользователя при изменении input
userNameInput.addEventListener('input', () => {
  localStorage.setItem('userName', userNameInput.value);
});
