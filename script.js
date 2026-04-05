// Генерация звёздного неба
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Случайная позиция
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Случайный размер (1-3px)
        const size = Math.random() * 2 + 1;
        
        // Случайная длительность мерцания (2-5 секунд)
        const duration = Math.random() * 3 + 2;
        
        // Случайная базовая прозрачность
        const opacity = Math.random() * 0.7 + 0.3;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--opacity', opacity);
        
        starsContainer.appendChild(star);
    }
}

// Циклическая смена слов с плавной анимацией
function initWordChanger() {
    const words = ['Быстро', 'Просто', 'Безопасно'];
    let currentIndex = 0;
    const changingWordElement = document.getElementById('changingWord');

    function changeWord() {
        // Добавляем класс для анимации исчезновения
        changingWordElement.classList.add('fade-out');
        
        setTimeout(() => {
            // Меняем слово
            currentIndex = (currentIndex + 1) % words.length;
            changingWordElement.textContent = words[currentIndex];
            
            // Убираем класс fade-out и добавляем fade-in
            changingWordElement.classList.remove('fade-out');
            changingWordElement.classList.add('fade-in');
            
            setTimeout(() => {
                // Убираем класс fade-in после завершения анимации
                changingWordElement.classList.remove('fade-in');
            }, 800);
        }, 800);
    }

    // Меняем слово каждые 3 секунды
    setInterval(changeWord, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initWordChanger();
});
