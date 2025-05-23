const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  const button = card.querySelector(".card-button");
  button.addEventListener("click", () => {
    const price = parseInt(card.dataset.price, 10);
    const itemName = card.dataset.itemName;
    buyItem(itemName, price);
  });
});


function buyItem(itemName, price) {
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;

  if (clicks >= price) {
    clicks -= price;
    localStorage.setItem("clicks", clicks);

    if (itemName === "Кейс: Лунтик") {
      // Помечаем кейс как купленный
      localStorage.setItem("case_luntik_purchased", "true");
      // Генерируем одноразовый ключ доступа
      const accessKey = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      sessionStorage.setItem("case_access_key", accessKey);
      // Переходим на страницу кейса
      window.location.href = "../case/case.html";
      return;
    }

    alert("Вы купили " + itemName + "!");
    updateClicksDisplay();
  } else {
    alert("Недостаточно кликов!");
  }
}
