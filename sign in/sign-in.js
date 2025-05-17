function login() {
    const users = [
        { username: "Артем", key: "React" },
        { username: "Леша", key: "1937" },
        { username: "Сережа", key: "Игорь" },
        { username: "Игорь", key: "Сережа" },
        { username: "Яромир", key: "негр" },
        { username: "Рома", key: "иды" },
    ];

    const usernameInput = document.getElementById("username");
    const keyInput = document.getElementById("key");
    const errorMessage = document.getElementById("error-message");

    const enteredUsername = usernameInput.value.trim();
    const enteredKey = keyInput.value.trim();

    const user = users.find(u => u.username === enteredUsername && u.key === enteredKey);

    if (user) {
        // Успешный вход
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', enteredUsername); // Сохраняем имя пользователя
        window.location.href = "../index.html"; // Перенаправление на страницу кликера
    } else {
        // Неверные данные
        errorMessage.style.display = "block";
        errorMessage.textContent = "Неверное имя пользователя или ключ.";
    }
}