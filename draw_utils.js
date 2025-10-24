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

function drawAsteroid(ctx, x, y, pointslist) {
  // Cor principal do asteroide (tom de cinza médio)
  const mainColor = '#737373'; 
  const shadowColor = '#404040'; // Cinza escuro para sombras e crateras
  
  // 2. DESENHAR O CORPO PRINCIPAL
  ctx.beginPath();
  ctx.moveTo(pointslist[0].x + x, pointslist[0].y + y);

  // Desenha o polígono irregular que representa o asteroide
  for (let i = 1; i < 10; i++) {
    ctx.lineTo(pointslist[i].x + x, pointslist[i].y + y);
  }
  ctx.closePath();
  
  // Preenche com a cor base
  ctx.fillStyle = mainColor;
  ctx.fill();
  
  // Adiciona uma borda sutil para definir melhor a forma
  ctx.strokeStyle = shadowColor;
  ctx.lineWidth = 7;
  ctx.stroke();
}

function roundRect(ctx, centerX, centerY, width, height, radius) {
  const x = centerX - (width * 0.5);
  const y = centerY - (height * 0.5);
    
  if (width < 2 * radius) radius = width * 0.5;
  if (height < 2 * radius) radius = height * 0.5;
  ctx.beginPath(); // Inicia um novo caminho de desenho
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius); // Canto superior direito e largura 
  ctx.arcTo(x + width, y + height, x, y + height, radius); // Canto inferior direito e largura
  ctx.arcTo(x, y + height, x, y, radius); // Canto ingferior esquerdo
  ctx.arcTo(x, y, x + width, y, radius); // Canto superior direito
  ctx.closePath(); // Fecha o caminho
}











        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        