// Конфигурация
const CONFIG = {
    PWA_ID: 'sofia-hardcore-v2',
    SAVE_KEY: 'game_save_v2'
};

// Состояние
let state = JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY)) || {
    coins: 0,
    power: 1,
    auto: 0,
    level: 1,
    exp: 0,
    prestige: 1,
    upgrades: { p1: 100, a1: 500, c1: 1000 },
    lastTime: Date.now()
};

// Элементы
const ui = {
    coins: document.getElementById('clickCount'),
    img: document.getElementById('clickableImage'),
    expBar: document.getElementById('expFill'),
    lvl: document.getElementById('levelDisplay'),
    auto: document.getElementById('autoCountDisplay')
};

// Функция сохранения
const save = () => localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(state));

// Синхронизация между окнами (Биржа <-> Игра)
window.addEventListener('storage', (e) => {
    if (e.key === CONFIG.SAVE_KEY) {
        state = JSON.parse(e.newValue);
        updateUI();
    }
});

// Анимация вылетающих цифр
function spawnParticle(x, y, value, isCrit) {
    const p = document.createElement('div');
    p.className = 'click-particle';
    if (isCrit) {
        p.style.color = '#ff3b30';
        p.style.fontSize = '3.5rem';
        p.innerText = `🔥 ${value}`;
    } else {
        p.innerText = `+${value}`;
    }
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
}

// Клик
ui.img.addEventListener('mousedown', (e) => {
    let isCrit = Math.random() < 0.05; // 5% шанс крита по умолчанию
    let val = state.power * state.prestige * (isCrit ? 3 : 1);
    
    state.coins += val;
    state.exp += 1;

    // Левел-ап
    const nextLvlExp = state.level * 150;
    if (state.exp >= nextLvlExp) {
        state.level++;
        state.exp = 0;
        alert(`LEVEL UP! Теперь ты уровень ${state.level}`);
    }

    spawnParticle(e.pageX, e.pageY, val, isCrit);
    updateUI();
    save();
});

// Обновление интерфейса
function updateUI() {
    ui.coins.innerText = Math.floor(state.coins).toLocaleString();
    ui.lvl.innerText = `УРОВЕНЬ ${state.level}`;
    ui.auto.innerText = `${state.auto}/сек`;
    ui.expBar.style.width = (state.exp / (state.level * 150)) * 100 + '%';
    
    // Обновление цен в кнопках
    document.getElementById('priceDisplay').innerText = state.upgrades.p1 + ' C';
    document.getElementById('autoPriceDisplay').innerText = state.upgrades.a1 + ' C';
}

// Автокликер (1 раз в секунду)
setInterval(() => {
    if (state.auto > 0) {
        state.coins += (state.auto * state.prestige);
        updateUI();
        save();
    }
}, 1000);

// Покупка улучшений (Пример)
document.getElementById('plus1Click').onclick = () => {
    if (state.coins >= state.upgrades.p1) {
        state.coins -= state.upgrades.p1;
        state.power += 1;
        state.upgrades.p1 = Math.floor(state.upgrades.p1 * 1.5);
        updateUI(); save();
    }
};

document.getElementById('autoClickUpgrade').onclick = () => {
    if (state.coins >= state.upgrades.a1) {
        state.coins -= state.upgrades.a1;
        state.auto += 1;
        state.upgrades.a1 = Math.floor(state.upgrades.a1 * 1.6);
        updateUI(); save();
    }
};

// Инициализация
updateUI();

// PWA Регистрация
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}
