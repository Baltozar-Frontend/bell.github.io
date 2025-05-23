// Массив с путями к изображениям
const images = [
  "../img/luntik.jpg",
  "../img/guseneci.jpg",
  "../img/dadyasher.jpg",
  "../img/dadyakorney.jpg",
  "../img/babakapa.jpg",
];

// Проверка легальности открытия кейса
function checkCaseAccess() {
  // Проверяем, был ли кейс куплен и открыт через магазин
  if (!localStorage.getItem("case_luntik_purchased")) {
    window.location.href = "../index.html";
    return false;
  }
  
  // Проверяем одноразовый ключ доступа
  const accessKey = sessionStorage.getItem("case_access_key");
  if (!accessKey) {
    window.location.href = "../index.html";
    return false;
  }
  
  return true;
}

// Генерация сетки кейса (только если доступ разрешен)
if (checkCaseAccess()) {
  // Создаем элементы кейса
  for (let i = 0; i < 25; i++) {
    const cellColor = i % 2 ? "middle" : "";
    const randomImage = images[Math.floor(Math.random() * images.length)];

    document.querySelector(".scopeHidden > ul").innerHTML += `
      <li class="${cellColor}"><img src="${randomImage}" alt="Image ${
      i + 1
    }" width="100" height="100"></li>
    `;
  }

  // Функция анимации открытия кейса
  function start() {
    const move = -150 * 15;
    const elm = (str) => document.querySelector(str);

    elm(".scopeHidden > ul").style.left = move + "px";

    // Добавляем предмет в инвентарь
    const items = JSON.parse(localStorage.getItem('inventory')) || [];
    items.push({
      name: "Лунтик", 
      image: "./img/luntik.jpg"
    });
    localStorage.setItem('inventory', JSON.stringify(items));
    
    if (typeof updateInventory === 'function') {
      updateInventory();
    }
    
    // Удаляем метку покупки и ключ доступа
    localStorage.removeItem("case_luntik_purchased");
    sessionStorage.removeItem("case_access_key");
  }

  // Запускаем анимацию через небольшой таймаут для плавности
  setTimeout(start, 300);
  
  // Автоперенаправление через 10 секунд
  setTimeout(() => window.location.href = "https://baltozar-frontend.github.io/bell.github.io/#", 10000);
}
