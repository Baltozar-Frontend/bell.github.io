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
  let clicks = parseInt(localStorage.getItem("clicks")) || 0; // Исправлено: используем || 0

  if (clicks >= price) {
    clicks -= price;
    localStorage.setItem("clicks", clicks);

    if (itemName === "Кейс: Лунтик" || itemName === "Кейс: Лунтик") { // Объединяем условия
      localStorage.setItem("case_luntik_purchased", "true"); // Помечаем кейс как купленный
      window.location.href = "../case/case.html"; // Или другой путь, если нужно
      return; // Добавляем return, чтобы предотвратить выполнение alert после редиректа
    }


    alert("Вы купили " + itemName + "!"); // Этот alert выполнится только для других предметов
    updateClicksDisplay();
  } else {
    alert("Недостаточно кликов!");
  }
}

// ... остальной код (updateClicksDisplay) ...
