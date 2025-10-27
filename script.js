const startButton = document.getElementById('startButton'); // Acessa o startButton
const missionButton = document.getElementById('missionButton');
const mainContainer = document.getElementById('mainContainer');
const textElement = document.getElementById('typed-text');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const musicaFundo = document.getElementById('musicaFundo');

const typingSpeed = 1; // Milissegundos por caractere o certo é 15
const textToType = 'Antes do asteroide PALAS destruir a Biblioteca Espacial Internacional, seu acervo foi ejetado em cápsulas de segurança.\nMilhares dessas cápsulas estão espalhados pelo espaço. \n\n Sua missão: recuperar essas cápsulas e evitar que o conhecimento se perca para sempre.';
const fator = 2.5; // Define a escala da espaçonave.
const HIGH_SCORE_KEY = 'highscore';
const DEBUG_MODE = false;


// Estado do teclado
const keys = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false
};

const touchcontrols = {
  id: null, // Controla para evitar eventos estranhos
  origin: 0,     // Base do calculo para medir a distância percorrida
  active: false, // Indica que o dedo ainda está na tela
  axis_x: 0 // distância qeu foi percorrida desde a ultima leitura
};

let ratio = window.innerHeight / canvas.height; // Identifica a razão entre a tela e o canvas
let player;
let asteroids = []; // Vetor que armazena os asteroides que estão caindo
let capsulas = []; // Vetor que armazena as capsulas que estão caindo
let score = 0; // Armazena a pontuação do jogador
let highScore = localStorage.getItem(HIGH_SCORE_KEY) ? parseInt(localStorage.getItem(HIGH_SCORE_KEY)) : 0; // Se consiguir ler abre com o valor, se não 0
let gameON = false;
let asteroidSpawnRate = 80;
let spawnCounter = 0;
let gameSpeed = 1; // Multiplicador de velocidade para dificuldade
let prop = 1; // Define o tamanho da chama do propulsor
let delay = 0; // Controla o tempo de atulização da chama
let dist = 0;
let frag = 0;
let musicaIniciada = false;
let t100ms = 0;
let segundo = 0;

// --- Variáveis de Tempo ---
let lastTime = 0;           // Armazena o timestamp do frame anterior
let totalTimeElapsed = 0;   // Armazena o tempo total da partida (em milissegundos)
let gameActive = true;

class Player{ // Classe do jogador
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
  
  getVertices() { // Calcula e retorna os 3 vértices do triângulo (V1: topo, V2: inf-esquerda, V3: inf-direita).
    const v1 = {  // V1: Ponta superior (ápice)
      x: this.x, 
      y: this.y - this.height * 0.5
    };
    const v2 = {  // V2: Canto inferior-esquerdo
      x: this.x - this.width * 0.8, 
      y: this.y + this.height * 0.25
    };
    const v3 = { // V3: Canto inferior-direito
      x: this.x + this.width * 0.8, 
      y: this.y + this.height * 0.25
    };
    return [v1, v2, v3];
  }
  
  update(){ // Função que atualiza as açoes do jogador
    touchcontrols.axis_x /= ratio;
    if(this.x + touchcontrols.axis_x > this.width * 0.8 && this.x + touchcontrols.axis_x < canvas.width - this.width * 0.8){
       this.x += touchcontrols.axis_x;
    }
    touchcontrols.axis_x = 0;
    
    if (keys.ArrowRight && this.x < canvas.width - this.width * 0.8) { // Movimento para a direita
      this.x += this.speed;
    }
    
    if (keys.ArrowLeft && this.x > this.width * 0.8) { // Movimento para a esquerda
      this.x -= this.speed;
    }
  }
  
  draw(){
    if(delay == 30){
      delay = 0;
      prop = gameSpeed * 0.2;
    }else{
      if(delay == 15){
        prop = gameSpeed * 0.3;
      }
      delay++;
    }
    
    ISLExplorer(ctx, this.x, this.y, this.width, this.height);
    
    if (DEBUG_MODE) {
      const vertices = this.getVertices();
      
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y); // Ponto 1 (Topo)
      ctx.lineTo(vertices[1].x, vertices[1].y); // Ponto 2 (Inf. Esquerda)
      ctx.lineTo(vertices[2].x, vertices[2].y); // Ponto 3 (Inf. Direita)
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 165, 0, 0.8)'; // Azul bem claro, quase branco, para o vidro
      ctx.fill();
      
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 5;
      ctx.strokeRect(this.x - this.width * 0.76, this.y - this.height * 0.5, this.width * 1.54, this.height);
    }
  }
}

class Asteroid{ // Classe dos asteroides
  constructor(x, y, pointslist, initialSpeed) {
    this.x = x;
    this.y = y;
    this.pointslist = pointslist;
    this.velocity = initialSpeed;
  }
  
  update(){
    this.y += this.velocity * gameSpeed; // A velocidade é ajustada pelo multiplicador de velocidade do jogo
  }
  
  draw(){
    drawAsteroid(ctx, this.x, this.y, this.pointslist);
    
    if (DEBUG_MODE) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 40, 0, Math.PI * 2, false);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fill();
    }
  }
}

class Capsula{
  constructor(x, y, initialSpeed) {
    this.x = x;
    this.y = y;
    this.velocity = initialSpeed;
  }
  
  update(){
    this.y += this.velocity * gameSpeed; // A velocidade é ajustada pelo multiplicador de velocidade do jogo
  }
  
  draw(){
    drawCapsula(ctx, this.x, this.y, 40, 70); // Tamnho da Capsula
    
    if(DEBUG_MODE){
      ctx.beginPath();
      ctx.arc(this.x, this.y, 40, 0, Math.PI * 2, false);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fill();
    }
  }
}

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

function iniciarMusica() {
    if(musicaIniciada){
      return; // Se já estiver tocando, ignore
    }

    musicaFundo.volume = 0.5; // Configura o volume (opcional, entre 0.0 e 1.0)
    const promise = musicaFundo.play(); // Tenta iniciar a reprodução. O 'play()' retorna uma Promise.

    // Lida com a Promise para verificar se o áudio foi iniciado com sucesso
    if (promise !== undefined) {
        promise.then(() => {
            // O áudio começou a tocar.
            musicaIniciada = true;
            console.log("Música de fundo iniciada.");
            // Oculta ou desabilita o botão depois de clicar
            //botaoIniciar.style.display = 'none';

        }).catch(error => {
            // A reprodução automática falhou (geralmente por falta de interação)
            console.warn("A reprodução automática foi impedida: ", error);
            // Neste caso, a música será iniciada no primeiro clique do usuário.
        });
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

function setupTouchControls() {
  
  function Touchstart(event){
    event.preventDefault(); // Previne o comportamento padrão do navegador (como rolar a página ou dar zoom)
    
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect(); // Retorna Retorna a Posição e o Tamanho do canvas em relação ao viewport.
    const touchX = touch.clientX - rect.left; // Calcula a posição x do pointer no canvas
    
    touchcontrols.id = touch.identifier;
    touchcontrols.origin = touchX;  // Armazena a coordenada x do contato inicial.
    touchcontrols.active = true;
    //touchcontrols.origin = 0;
  }
  
  // Função auxiliar para atualizar a posição do jogador
  function Touchmove(event) {
    event.preventDefault(); // Previne o comportamento padrão do navegador (como rolar a página ou dar zoom)
    
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect(); // Retorna Retorna a Posição e o Tamanho do canvas em relação ao viewport.
    const touchX = touch.clientX - rect.left; // Calcula a posição x do pointer no canvas

    if (touchcontrols.active && touchcontrols.origin != touchX) { // Pega as informações do toque. Usamos event.touches[0] para o primeiro dedo.
      touchcontrols.axis_x = touchX - touchcontrols.origin;
      touchcontrols.origin = touchX;
    }
  }

  function Touchend(event){
    event.preventDefault(); // Previne o comportamento padrão do navegador (como rolar a página ou dar zoom)
    
    const touch = event.changedTouches[0];
    const rect = canvas.getBoundingClientRect(); // Retorna Retorna a Posição e o Tamanho do canvas em relação ao viewport.
    const touchX = (touch.clientX - rect.left) / ratio; // Calcula a posição x do pointer no canvas
    const touchY = (touch.clientY - rect.top) / ratio;
     
    if(touchcontrols.id == touch.identifier){
      
    }

    // B. Verificar se as coordenadas (mouseX, mouseY) caem dentro da área do retângulo
    if (touchX >= 300 && // O clique está à direita da borda X inicial?
        touchX <= 600 && // O clique está à esquerda da borda X final?
        touchY >= 750 && // O clique está abaixo da borda Y inicial?
        touchY <= 850 &&   // O clique está acima da borda Y final?
        gameON == false
    ) {
      init();
    }
  }

  // Adiciona o "ouvinte" para quando o dedo TOCA a tela
  canvas.addEventListener('touchstart', Touchstart, { passive: false });

  // Adiciona o "ouvinte" para quando o dedo MOVE na tela
  canvas.addEventListener('touchmove', Touchmove, { passive: false });
  
  // Adiciona o "ouvinte" para quando o dedo MOVE na tela
  canvas.addEventListener('touchend', Touchend, { passive: false });
  // NOTA: { passive: false } é importante.
  // Ele diz ao navegador que podemos chamar event.preventDefault()
  // para impedir que a página role enquanto o jogador arrasta o dedo.
}

function updateUI() {
  //ctx.shadowColor = '#00FFFF33';
  //ctx.shadowBlur = 109;
  
  ctx.font = '32px sans-serif';
  ctx.fillStyle = '#00FFFF';
  
  // Lado esquerdo
  ctx.textAlign = 'left';
  const timeString = formatTime(totalTimeElapsed); // Desenhar o Tempo Formatado no Canvas
  ctx.fillText(`TIME: ${timeString}`, 20, 70);
  ctx.fillText(`X: ${player.x.toFixed(0)}`, 20, 110);
  ctx.fillText(`Y: ${dist.toFixed(0)}`, 20, 150);
  ctx.fillText(`SPEED: ${(gameSpeed * 100).toFixed(2)} m/s`, 20, 190);
  
  //ctx.fillText(`id: ${touchcontrols.id}`, 20, 150);
  
  // Lado direito
  ctx.fillText(`SCORE: ${score.toFixed(0)}`, canvas.width - 260, 70);
  ctx.fillText(`HIGHT: ${highScore}`, canvas.width - 260, 110);
  ctx.fillText(`Count: ${spawnCounter}`, canvas.width - 260, 150);
  
}

function getRandomArbitrary(min, max) { // Permite gerar números aleatórios dentro de um intervalo
  return Math.random() * (max - min) + min;
}

function spawnAsteroid(){
  const x = getRandomArbitrary(25, canvas.width - 25); // Posição X aleatória
  const y = -40; // -40 Começa acima do canvas
  const speed = getRandomArbitrary(1.5, 4.0); // Velocidade base entre 1.5 e 3.0
  const angleStep = Math.PI * 0.2; // Define a angulação entre cada raio, no caso para 10 pontos
  
  let pointslist = []; // Armazenará a lista de pontos que forma a extremindade do asteroide
            
  for (let i = 0; i < 10; i++) {
    const currentAngle = i * angleStep; // Identifica o ângulo atual do raio para o ponto aleatório 
    const radius = 40 + getRandomArbitrary(-8, 8); // Adiciona ruído ao raio (baseRadius +/- 20% do raio)
    
    // Converte coordenadas polares (raio, ângulo) para cartesianas (x, y)
    const x = Math.cos(currentAngle) * radius;
    const y = Math.sin(currentAngle) * radius;
    pointslist.push({x, y});
  }
  
  asteroids.push(new Asteroid(x, y, pointslist, speed));
}

function spawnCapsula(){
  const x = getRandomArbitrary(25, canvas.width - 25); // Posição X aleatória
  const y = -40; // -40; // -40 Começa acima do canvas
  const speed = 2; // Velocidade base entre 1.5 e 3.0
  
  capsulas.push(new Capsula(x, y, speed));
}

function closestPointOnSegment(p1, p2, p3) { // Encontra o ponto mais próximo no segmento de linha (p1-p2) ao ponto (p3).
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  // Comprimento quadrado do segmento
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) return p1;

  // Projeta o ponto p3 na linha (obtém 't')
  let t = ((p3.x - p1.x) * dx + (p3.y - p1.y) * dy) / lenSq;

  // Garante que o ponto mais próximo esteja dentro do segmento [0, 1]
  t = Math.max(0, Math.min(1, t));

  // Calcula as coordenadas do ponto mais próximo (P_closest)
  return {x: p1.x + t * dx, y: p1.y + t * dy};
}

function checkCollision(p, a) {
  const vertices = p.getVertices(); // Obtém os 3 vértices do triângulo
  const radiusSq = 40 * 40;

  // Itera sobre as 3 arestas do triângulo: V1-V2, V2-V3, V3-V1
  for (let i = 0; i < 3; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % 3]; // Loop para o próximo vértice

    // 1. Encontra o ponto mais próximo na aresta ao centro do círculo
    const closest = closestPointOnSegment(p1, p2, { x: a.x, y: a.y });

    // 2. Calcula a distância quadrada desse ponto até o centro do círculo
    const distanceX = a.x - closest.x;
    const distanceY = a.y - closest.y;
    const distanceSq = distanceX * distanceX + distanceY * distanceY;

    // 3. Checa se a distância é menor que o raio do círculo
    if (distanceSq < radiusSq) {
      return true;
    }
  }
  
  return false; // Se nenhuma aresta colidiu, não há colisão.
}

function splitStringByLength(saying, maxLength){
  if (!saying.dizer) {
      return [];
  }
  const dizer = '\"' + saying.dizer + '\"';

  const words = dizer.trim().split(/\s+/); // Divide a string em um array de palavras. Remove múltiplos espaços extras.

  const result = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Se for a primeira palavra da linha, simplesmente a adiciona
    if (currentLine === '') {
      currentLine = word;
    }else{
      if ((currentLine + ' ' + word).length <= maxLength) { // Se a palavra + o espaço + a linha atual NÃO excederem o comprimento máximo}else { // Se exceder, a linha atual está completa.
        currentLine = currentLine + ' ' + word;
      }else{
        result.push(currentLine); // Empurra a linha atual para o resultado
        currentLine = word; // Inicia uma nova linha com a palavra que não coube
      }
    }
  }

  if (currentLine.length > 0) { // Adiciona a última linha que pode não ter sido empurrada dentro do loop
    result.push(currentLine);
  }
  
  if (saying.autor) {
      result.push(saying.autor);
  }
  return result;
}

function gameOver(){
  const maxLength = 40; // Núemro de caracteres por linha 
  const sayingid = Math.round(getRandomArbitrary(0, sayings.length-2));
  const lines = splitStringByLength(sayings[sayingid], maxLength); // Divide a string em linhas menores
  const x = canvas.width * 0.5;
  const y = canvas.height * 0.7;
  const lineHeight = 42;
  let currentY = 0;
  gameON = false; // Para a execução do jogo
  
  if (score > highScore) { // Verifica se tem um novo recorde.
    highScore = score;
    localStorage.setItem(HIGH_SCORE_KEY, highScore); // Atualiza o valor do highScore.
  }
  
  // Primeira abordagem
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela
  
  ctx.font = '32px sans-serif';
  ctx.fillStyle = '#00FFFF';
  ctx.fillText(`SCORE: ${score}`, canvas.width - 260, 70);
  ctx.fillText(`HIGHT: ${highScore}`, canvas.width - 260, 110);
  
  ctx.font = '120px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`GAME OVER`, canvas.width * 0.5, canvas.height * 0.30);
  
  ctx.fillStyle = '#333';
  roundRect(ctx, canvas.width * 0.5, canvas.height * 0.5, 300, 100, 17);
  ctx.fill();
  
  ctx.font = '32px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#00FFFF';
  ctx.fillText(`REPLAY`, canvas.width * 0.5, canvas.height * 0.5);
  
  ctx.font = '40px sans-serif';
  ctx.textBaseline = 'bottom';
  
  for (let i = 0; i < lines.length; i++) {
        // Aumenta a coordenada Y para posicionar a próxima linha
        const currentY = y + (i * lineHeight);
        ctx.fillText(lines[i], x, currentY);
    }
}

function formatTime(ms) { // Entra com o tempo em ms e a saída é o tempo em mm:ss
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  // Adiciona um zero à esquerda se o número for menor que 10
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
}









function gameLoop(timestamp) {
  if (!gameON) {
    return;
  }
  if(lastTime == 0){
    lastTime = timestamp;
  }
  const deltaTime = timestamp - lastTime; // Calcular o Delta Time (diferença de tempo entre frames)
  totalTimeElapsed += deltaTime; // Acumular o tempo total de partida
  lastTime = timestamp; // Atualizar o timestamp para a próxima iteração

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas a cada quadro
  
  t100ms += deltaTime;
  if(Math.floor(t100ms) > 100){ // Quando passa de 100ms
    t100ms -= 100;
    segundo++;
    if(segundo == 10){ // Passou um segundo;
      dist += 7 + gameSpeed;
      segundo = 0;
      switch(Math.floor(gameSpeed)){
        case 7: 
        case 6: spawnAsteroid();
        case 5: 
        case 4: spawnAsteroid();
        case 3: 
        case 2: spawnAsteroid();
      }
    }
    if (gameSpeed < 7.5) { // A cada 100ms atualiza a velocidade do jogo
        gameSpeed += 0.005;
    }
    spawnCounter++; // Incrementa a cada 100ms o cantador do contador dos asteroides
    if (spawnCounter >= asteroidSpawnRate) {
      
      spawnCounter = 0;
      spawnCapsula(); // Adiciona uma cápsula por segundo
      
      if (asteroidSpawnRate > 20) { // Diminui o tempo e spawn dos asteroides
          asteroidSpawnRate -= 1;
      }
    }
  }

  player.update(); // Atualiza a posição do jogador
  player.draw(); // Desenha o jogador na tela
  
  for(let i = asteroids.length - 1; i >= 0; i--){ // Atualiza, desenha e checa colisões dos asteroides
    const asteroid = asteroids[i];
    asteroid.update();
    asteroid.draw();

    if(checkCollision(player, asteroid)){ // Verifica se o asteroide colidiu com a nave
      gameOver();
      return;
    }

    if(asteroid.y - 40 > canvas.height){ // Remove asteroides que saíram da tela e aumenta a pontuação
      score += 10;
      asteroids.splice(i, 1);
    }
  }
  
  for(let i = capsulas.length - 1; i >= 0; i--){ // Atualiza, desenha e checa colisões das cápsulas
    const capsula = capsulas[i];
    capsula.update();
    capsula.draw();

    if(checkCollision(player, capsula)){ // Verifica se a cápsula colidiu com a nave
      capsulas.splice(i, 1); // Apaga a cápsula
      score += 40; // Aumenta os pontos
    }

    if(capsula.y - 40 > canvas.height){ // Remove cápsulas que saíram da tela e aumenta a pontuação
      capsulas.splice(i, 1);
    }
  }
  
  if(score > 999999){
    // Pontuação máxima
    console.log('Pontuação máxima');
    return;
  }
  
  updateUI(); // Atualiza o display do usuário
  requestAnimationFrame(gameLoop); // Continuar o loop
}
        
        
canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect(); 
    
  // Calcula a posição do clique relativa à origem (0,0) do Canvas
  const mouseX = (event.clientX - rect.left) / ratio;
  const mouseY = (event.clientY - rect.top) / ratio;

  if (mouseX >= 300 && mouseX <= 600 && mouseY >= 750 && mouseY <= 850 && gameON == false ){
    init();
  }
});

function init(){
  // Inicializa o jogador
  player = new Player(canvas.width * 0.5, canvas.height * 0.75, 30 * fator, 60 * fator, 10); // (x, y, width, height, speed)
  asteroids = []; // Cria um vetor vazio
  capsulas = [];
  score = 0;
  spawnCounter = 0;
  gameSpeed = 2;
  gameON = true;
  dist = 0;
  totalTimeElapsed = 0;
  lastTime = 0;
  t100ms = 0;
  segundo = 0;
  
  setupTouchControls();
  updateUI();
  requestAnimationFrame(gameLoop);
}

// Event listener para o botão de iniciar a missão
missionButton.addEventListener('click', () => {
  mainContainer.classList.add('hidden');
  canvas.classList.remove('hidden');
  
  init();
});

function showMissionButton() { // Função para mostrar o botão da missão 
  missionButton.classList.remove('hidden');
}

function startScene() { // Função para iniciar a cena de texto 
  startButton.classList.add('hidden');
  typeWriter(textToType, textElement, typingSpeed, showMissionButton);
}

// Se for a primeira vez, adiciona o evento ao botão
startButton.addEventListener('click', () => {
  // Marca como visitado e inicia a cena
  localStorage.setItem('hasVisited', 'true');
  iniciarMusica();
  startScene();
});
