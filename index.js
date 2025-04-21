let clicks = localStorage.getItem('clicks') || 0; // Загружаем клики из localStorage
  clicks = parseInt(clicks); // Преобразуем в число

  const image = document.getElementById('clickableImage');
  const clickCount = document.getElementById('clickCount');

  // Отображаем начальное значение
  clickCount.textContent = `Кликов: ${clicks}`;

  image.addEventListener('click', () => {
    clicks++;
    clickCount.textContent = `Кликов: ${clicks}`;
    localStorage.setItem('clicks', clicks); // Сохраняем клики в localStorage
  });