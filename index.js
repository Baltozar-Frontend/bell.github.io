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
    upgrades: { p1: 100, a1: 500 },
    lastTime: Date.now()
};

// Привязка UI элементов (Исправлены ID!)
const ui = {
    coins: document.getElementById('clickCount'),
    img: document.getElementById('main-target'),
    expBar: document.getElementById('expFill'),
    lvl: document.getElementById('levelDisplay'),
    
    // Магазин
    btnPower: document.getElementById('btn-power'),
    btnAuto: document.getElementById('btn-auto'),
    powerDesc: document.getElementById('power-desc'),
    autoDesc: document.getElementById('auto-desc'),
    costPower: document.getElementById('cost-power'),
    costAuto: document.getElementById('cost-auto')
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
        p.style.color = 'var(--crit)';
        p.style.fontSize = '3.5rem';
        p.innerText = `🔥 ${value}`;
    } else {
        p.innerText = `+${value}`;
    }
    // Рандомный разброс по оси X для красоты
    const offsetX = (Math.random() - 0.5) * 40;
    p.style.left = (x - 20 + offsetX) + 'px';
    p.style.top = (y - 40) + 'px';
    document.body.appendChild(p);
    
    setTimeout(() => p.remove(), 800);
}

// Клик по объекту
ui.img.addEventListener('mousedown', (e) => {
    let isCrit = Math.random() < 0.05; // 5% шанс крита
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
    ui.lvl.innerText = `LVL ${state.level}`;
    
    // Безопасная проверка, если уровень слишком большой
    let expPercent = (state.exp / (state.level * 150)) * 100;
    ui.expBar.style.width = Math.min(expPercent, 100) + '%';
    
    // Обновление текстов в магазине
    ui.powerDesc.innerText = `+${state.power} за клик`;
    ui.autoDesc.innerText = `${state.auto}/сек`;
    
    ui.costPower.innerText = state.upgrades.p1.toLocaleString();
    ui.costAuto.innerText = state.upgrades.a1.toLocaleString();
}

// Автокликер (срабатывает каждые 1000мс)
setInterval(() => {
    if (state.auto > 0) {
        state.coins += (state.auto * state.prestige);
        updateUI();
        save();
    }
}, 1000);

// Логика покупок
ui.btnPower.addEventListener('click', () => {
    if (state.coins >= state.upgrades.p1) {
        state.coins -= state.upgrades.p1;
        state.power += 1;
        state.upgrades.p1 = Math.floor(state.upgrades.p1 * 1.5);
        updateUI(); 
        save();
    }
});

ui.btnAuto.addEventListener('click', () => {
    if (state.coins >= state.upgrades.a1) {
        state.coins -= state.upgrades.a1;
        state.auto += 1;
        state.upgrades.a1 = Math.floor(state.upgrades.a1 * 1.6);
        updateUI(); 
        save();
    }
});

// Инициализация при старте
updateUI();

// PWA Регистрация
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW setup failed:', err));
}
