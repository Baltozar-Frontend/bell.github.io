// Массив с путями к изображениям
const images = [
  "../img/luntik.jpg", // Замените на ваши изображения
  "../img/guseneci.jpg",
  "../img/dadyasher.jpg",
  "../img/dadyakorney.jpg",
  "../img/babakapa.jpg",
];

for (let i = 0; i < 25; i++) {
  const cellColor = i % 2 ? "middle" : "";
  const randomImage = images[Math.floor(Math.random() * images.length)];

  document.querySelector(".scopeHidden > ul").innerHTML += `
    <li class="${cellColor}"><img src="${randomImage}" alt="Image ${
    i + 1
  }" width="100" height="100"></li>
    `;
}

function start() {
  const move = -150 * 15;
  const elm = (str) => document.querySelector(str);
  const elms = (str) => document.querySelectorAll(str);

  elm(".scopeHidden > ul").style.left = move + "px";

  const index =
    -Math.floor((move + elm(".scopeHidden").offsetWidth / 2 / -150) / 150) + 1;
}



// ... ваш код для анимации и определения выпавшего изображения ...

// Предположим, что droppedImage содержит путь к выпавшему изображению,
// например droppedImage = '../img/luntik.jpg';

let droppedItem = null; // Объявляем переменную droppedItem

if (droppedImage === "../img/luntik.jpg") {
  droppedItem = { name: "Лунтик", image: droppedImage };
  localStorage.setItem("droppedItem", JSON.stringify(droppedItem));
}





// ... код для открытия кейса ...

// Перенаправление на главную страницу
setTimeout(() => { // Небольшая задержка, чтобы пользователь успел увидеть результат
  window.location.href = "../index.html"; // Или другой URL главной страницы
}, 10000); // Задержка 1 секунда (1000 миллисекунд). Подберите нужное значение.

// Или, если нужно очистить историю браузера:
// window.location.replace("index.html");
