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
  
  
  
  
  
  
  
  // ... код для открытия кейса ...
  
  
  // URL сайта, на который нужно перенаправить
  const redirectURL = "../index.html"; // Замени на нужный URL
  
  // Функция для перенаправления
  function redirectToSite() {
    window.location.href = redirectURL;
  }
  
  // Устанавливаем таймер на 10 секунд (10000 миллисекунд)
  setTimeout(redirectToSite, 10000); 



  // После получения предмета:
const items = JSON.parse(localStorage.getItem('inventory')) || [];
items.push({
  name: "Лунтик", 
  image: "./img/luntik.jpg"
});
localStorage.setItem('inventory', JSON.stringify(items));
updateInventory(); // Вызов функции обновления
