const startButton = document.getElementById('startButton');
const missionButton = document.getElementById('missionButton');
const mainContainer = document.getElementById('mainContainer');
const textContainer = document.getElementById('typed-text-container');
const textElement = document.getElementById('typed-text');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
//gameCanvas.width = window.innerWidth;
//gameCanvas.height = window.innerHeight;
    
const typingSpeed = 15; // Milissegundos por caractere
const textToType = 'Antes do asteroide PALAS destruir a Biblioteca Espacial Internacional, seu acervo foi ejetado em cápsulas de segurança.\nMilhares dessas cápsulas estão espalhados pelo espaço. \n\n Sua missão: recuperar essas cápsulas e evitar que o conhecimento se perca para sempre.';

// Estado do personagem
const player = {
  x: canvas.width / 2,
  y: canvas.height * 0.7,
  width: 30 * 1,
  height: 50 * 1,
  color: 'red',
  speed: 10
};

// Estado do teclado
const keys = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false
};

let gameON = false;
let prop = 1;
let delay = 0;
const fator = 2.5;

// Adiciona os "ouvintes" de eventos
document.addEventListener('keydown', (event) => {
    if (event.key in keys) {
      event.preventDefault();
      keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

function update() {
  // Movimento para a direita
  if (keys.ArrowRight && player.x < canvas.width - player.width * 0.8) {
    player.x += player.speed;
  }
  
  // Movimento para a esquerda
  if (keys.ArrowLeft && player.x > player.width * 0.8) {
    player.x -= player.speed;
  }
  
  if (keys.ArrowUp && player.y > player.height * 0.5){
    player.y -= player.speed;
  }
  
  if(keys.ArrowDown && player.y < canvas.height - player.height * 0.5){
    player.y += player.speed;
  }
}

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

function ISLExplorer(ctx, x, y, largura, altura) {
  // Salva o estado atual do canvas (cores, estilos) para não afetar outros desenhos
  ctx.save();
  
  // --- Carenagem frontal dos motores
  ctx.beginPath();
  ctx.moveTo(x - largura * 0.11, y - altura * 0.2); // Ponto abaixo da cabine
  ctx.lineTo(x - largura * 0.27, y + altura * 0.15); // Linha para a esquerda
  
  ctx.moveTo(x + largura * 0.11, y - altura * 0.2);
  ctx.lineTo(x + largura * 0.27, y + altura * 0.15); // Linha para a direita
  
  ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)'; // Cor de contorno clara e suave
  ctx.lineWidth = largura * 0.6;
  ctx.stroke();
  
  // Asa Direita (simétrica)
  ctx.beginPath();
  ctx.moveTo(x + largura * 0.05, y - altura * 0.4);
  ctx.lineTo(x + largura * 0.7, y + altura * 0.25); // Aumentando a projeção da ponta da asa
  ctx.lineTo(x + largura * 0.3, y + altura * 0.25);
  ctx.closePath();
  ctx.fillStyle = '#1a75ff';
  ctx.fill();
  ctx.strokeStyle = '#005f99';
  ctx.lineWidth = largura * 0.02;
  ctx.stroke();
  
  // Asa Esquerda
  ctx.beginPath();
  ctx.moveTo(x - largura * 0.05, y - altura * 0.4); // Ponto de conexão com o corpo
  ctx.lineTo(x - largura * 0.7, y + altura * 0.25); // Aumentando a projeção da ponta da asa (de 0.8 para 1.1)
  ctx.lineTo(x - largura * 0.3, y + altura * 0.25); // Conecta com a base do corpo
  ctx.closePath();
  ctx.fillStyle = '#1a75ff'; // Um tom de azul intermediário
  ctx.fill();
  ctx.strokeStyle = '#005f99';
  ctx.lineWidth = largura * 0.02;
  ctx.stroke();
  
  // --- Corpo Principal da Nave ---
  ctx.beginPath();
  ctx.moveTo(x                  ,   y - altura * 0.5); // Ponto superior
  ctx.lineTo(x - largura * 0.4  ,   y + altura * 0.2); // Ponto inferior esquerdo
  ctx.lineTo(x + largura * 0.4  ,   y + altura * 0.2); // Ponto inferior direito
  ctx.closePath();

  // Gradiente para dar efeito de iluminação e volume
  const gradienteCorpo = ctx.createLinearGradient(x   , y - altura * 0.5, x, y + altura * 0.3);
  gradienteCorpo.addColorStop(0, '#3399ff'); // Azul mais claro no topo
  gradienteCorpo.addColorStop(1, '#003366'); // Azul bem escuro na base
  ctx.fillStyle = gradienteCorpo;
  ctx.fill();

  // Contorno sutil para definir melhor a forma
  ctx.strokeStyle = '#000';
  ctx.lineWidth = largura * 0.03;
  ctx.stroke();
  
  // --- Detalhes da Fuselagem
  ctx.beginPath();
  ctx.moveTo(x, y - altura * 0.3); // Ponto abaixo da cabine
  ctx.lineTo(x - largura * 0.2, y + altura * 0.1); // Linha para a esquerda
  
  ctx.moveTo(x, y - altura * 0.3);
  ctx.lineTo(x + largura * 0.2, y + altura * 0.1); // Linha para a direita
  
  ctx.strokeStyle = 'rgba(80, 80, 80)'; // Cor de contorno clara e suave
  ctx.lineWidth = largura * 0.1;
  ctx.stroke();
  
  // --- Cabine / Cockpit ---
  ctx.beginPath();
  ctx.moveTo(x                    ,   y - altura * 0.45); // Ponto superior da cabine
  ctx.lineTo(x - largura * 0.17   ,   y + altura * 0.1); // Base esquerda
  ctx.lineTo(x + largura * 0.17   ,   y + altura * 0.1); // Base direita
  ctx.closePath();
  ctx.fillStyle = '#aaddff'; // Azul bem claro, quase branco, para o vidro
  ctx.fill();
  
  // --- Detalhes das Asas (Marcações) ---
  // Marcação na asa esquerda
  ctx.beginPath();
  ctx.moveTo(x - largura * 0.4, y + altura * 0.01);
  ctx.lineTo(x - largura * 0.7, y + altura * 0.25);
  ctx.lineTo(x - largura * 0.5, y + altura * 0.25);
  ctx.closePath();
  ctx.fillStyle = '#66ffff50'; // Ciano brilhante para a marcação
  ctx.fill();
  
  // Marcação na asa direita
  ctx.beginPath();
  ctx.moveTo(x + largura * 0.4, y + altura * 0.01);
  ctx.lineTo(x + largura * 0.7, y + altura * 0.25);
  ctx.lineTo(x + largura * 0.5, y + altura * 0.25);
  ctx.closePath();
  ctx.fillStyle = '#66ffff50';
  ctx.fill();
  
  // --- Propulsor com Fogo Vermelho (desenhado primeiro para ficar atrás) ---
  // Camada externa do brilho (vermelho, mais transparente)
  ctx.beginPath();
  ctx.moveTo(x - largura * 0.15, y + altura * 0.23);
  ctx.lineTo(x + largura * 0.15, y + altura * 0.23);
  ctx.lineTo(x, y + altura * 0.55 * prop); // A chama vai bem para trás
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Vermelho com transparência
  ctx.fill();
  
  // Camada intermediária do brilho (laranja, mais opaco)
  ctx.beginPath();
  ctx.moveTo(x - largura * 0.1, y + altura * 0.23);
  ctx.lineTo(x + largura * 0.1, y + altura * 0.23);
  ctx.lineTo(x, y + altura * 0.45 * prop);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 165, 0, 0.8)'; // Laranja com transparência
  ctx.fill();
  
  // Núcleo do propulsor (amarelo claro, quase branco)
  ctx.beginPath();
  ctx.moveTo(x - largura * 0.08, y + altura * 0.23);
  ctx.lineTo(x + largura * 0.08, y + altura * 0.23);
  ctx.lineTo(x, y + altura * 0.4 * prop);
  ctx.closePath();
  ctx.fillStyle = '#FFFF99'; // Amarelo claro e brilhante
  ctx.fill();
  
  // Spoiler
  ctx.beginPath();
  ctx.moveTo(x - largura * 0.4    ,   y + altura * 0.01);
  ctx.lineTo(x - largura * 0.17   ,   y + altura * 0.1);
  ctx.lineTo(x + largura * 0.17   ,   y + altura * 0.1);
  ctx.lineTo(x + largura * 0.4    ,   y + altura * 0.01);
  ctx.lineTo(x + largura * 0.25   ,   y + altura * 0.129);
  ctx.lineTo(x - largura * 0.25   ,   y + altura * 0.129);
  ctx.closePath();
  ctx.fillStyle = '#000'; // Amarelo claro e brilhante
  ctx.fill();
  
  // motor
  ctx.beginPath();
  ctx.moveTo(x - largura * 0.25   ,   y + altura * 0.129);
  ctx.lineTo(x + largura * 0.25   ,   y + altura * 0.129);
  ctx.lineTo(x + largura * 0.2   ,   y + altura * 0.19);
  ctx.lineTo(x - largura * 0.2   ,   y + altura * 0.19);
  ctx.closePath();
  ctx.fillStyle = '#000'; // Amarelo claro e brilhante
  ctx.fill();
  
  // Restaura o estado do canvas
  ctx.restore();
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

player.width *= fator;
player.height *= fator;

function draw() {
    // Limpa o canvas a cada quadro
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o personagem
    //ctx.strokeStyle = player.color;
    //ctx.strokeRect(player.x - player.width * 0.5, player.y - player.height * 0.5, player.width, player.height);
    
    if(delay == 40){
      delay = 0;
      prop = 0.9;
    }else{
      if(delay == 20){
        prop = 1.0;
      }
      delay++;
    }
    ISLExplorer(ctx, player.x, player.y, player.width, player.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listener para o botão de iniciar a missão
missionButton.addEventListener('click', () => {
    mainContainer.classList.add('hidden');
    canvas.classList.remove('hidden');
    
    // Exemplo de texto no canvas
    ctx.fillStyle = 'var(--cor-brilho)';
    ctx.font = '30px "Orbitron"';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'var(--cor-brilho)';
    ctx.shadowBlur = 10;
    ctx.fillText('MISSÃO EM ANDAMENTO...', canvas.width / 2, canvas.height * 0.025);
    ctx.restore();
    
    gameON = true;
    gameLoop();
});

// Se for a primeira vez, adiciona o evento ao botão
startButton.addEventListener('click', () => {
// Marca como visitado e inicia a cena
localStorage.setItem('hasVisited', 'true');
startScene();
});
