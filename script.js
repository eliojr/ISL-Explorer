const startButton = document.getElementById('startButton');
const missionButton = document.getElementById('missionButton');
const mainContainer = document.getElementById('mainContainer');
const textContainer = document.getElementById('typed-text-container');
const textElement = document.getElementById('typed-text');
const gameCanvas = document.getElementById('gameCanvas');
// Prepara o canvas
    const ctx = gameCanvas.getContext('2d');
    //gameCanvas.width = window.innerWidth;
    //gameCanvas.height = window.innerHeight;
    
const typingSpeed = 15; // Milissegundos por caractere
const textToType = 'Antes do asteroide PALAS destruir a Biblioteca Espacial Internacional, seu acervo foi ejetado em cápsulas de segurança.\nMilhares dessas cápsulas estão espalhados pelo espaço. \n\n Sua missão: recuperar essas cápsulas e evitar que o conhecimento se perca para sempre.';

// Função que simula a digitação, com um callback ao finalizar
function typeWriter(text, element, speed, callback) {
    let i = 0;
    // Garante que o elemento está visível e adiciona o cursor
    element.parentElement.style.display = 'block';
    element.classList.add('typing-cursor');

    function type() {
        if (i < text.length) {
            let char = text.charAt(i);

            //Verifique se o caractere é uma quebra de linha
            if (char === '\n') {
                // Se for, adicione a tag <br> ao HTML e avance o índice
                element.innerHTML += '<br>';
                i++;
                // Chame o setTimeout com o próximo caractere
                setTimeout(type, speed);
            } else {
                // Se for um caractere normal, adicione-o
                element.innerHTML += char;
                i++;
                // Chame o setTimeout com o próximo caractere
                setTimeout(type, speed);
            }
        } else {
            // Remove o cursor quando a digitação terminar
            element.classList.remove('typing-cursor');
            if (callback) {
                callback();
            }
        }
    }
    type();
}

// Função para mostrar o botão da missão
function showMissionButton() {
    missionButton.classList.remove('hidden');
}

// Função para iniciar a cena de texto
function startScene() {
    startButton.classList.add('hidden');
    typeWriter(textToType, textElement, typingSpeed, showMissionButton);
}

// Event listener para o botão de iniciar a missão
missionButton.addEventListener('click', () => {
    mainContainer.classList.add('hidden');
    gameCanvas.classList.remove('hidden');
    
    // Exemplo de texto no canvas
    ctx.fillStyle = 'var(--cor-brilho)';
    ctx.font = '30px "Orbitron"';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'var(--cor-brilho)';
    ctx.shadowBlur = 10;
    ctx.fillText('MISSÃO EM ANDAMENTO...', gameCanvas.width / 2, gameCanvas.height / 2);
    ctx.restore();
});


// Se for a primeira vez, adiciona o evento ao botão
startButton.addEventListener('click', () => {
// Marca como visitado e inicia a cena
localStorage.setItem('hasVisited', 'true');
startScene();
});
