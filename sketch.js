//Variáveis
let tratorX = 100;
let tratorY = 100;
let frutas = [];
let cidadeX = 400;
let cidadeY = 300;
let pontuacao = 0;
let entregaRealizada = false;
let tempoEntrega = 0;
let morto = false;
let estado = "inicio"; // "inicio", "jogo"

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(24); // tamanho para emoji
  iniciarJogo();
}

function iniciarJogo() {
  tratorX = 100;
  tratorY = 100;
  pontuacao = 0;
  entregaRealizada = false;
  tempoEntrega = 0;
  morto = false;
  frutas = [];
  for (let i = 0; i < 10; i++) {
    let tipo = (i < 2) ? "podre" : (random() < 0.5 ? "banana" : "apple");
    frutas.push({ 
      x: random(0, 300), 
      y: random(0, 400), 
      tipo: tipo 
    });
  }
  frutas = shuffle(frutas);
}

function drawCampoDetalhado() {
  fill(34, 139, 34);
  rect(0, 20, width, height - 20);

  stroke(60, 179, 113);
  strokeWeight(2);
  for (let y = 40; y < height; y += 40) {
    line(0, y, width, y + random(-5, 5));
  }

  stroke(255);
  strokeWeight(6);
  for (let x = 0; x < width; x += 40) {
    line(x, 25, x + 30, 25);
    line(x, height - 10, x + 30, height - 10);
  }

  drawArvore(50, 50);
  drawArvore(80, 340);
  drawArvore(550, 60);
  drawArvore(520, 350);

  noStroke();
}

function drawArvore(x, y) {
  stroke(139, 69, 19);
  strokeWeight(8);
  line(x, y + 20, x, y + 45);
  noStroke();
  fill(34, 139, 34);
  ellipse(x, y + 10, 28, 28);
  fill(50, 205, 50);
  ellipse(x - 10, y + 16, 18, 18);
  ellipse(x + 10, y + 16, 18, 18);
}

function draw() {
  if (estado === "inicio") {
    telaInicial();
    return;
  }

  if (morto) {
    background(0);
    fill(255, 0, 0);
    textSize(40);
    text("Você morreu!", width / 2, height / 2);
    return;
  }

  if (entregaRealizada && millis() - tempoEntrega < 1000) {
    background(255, 255, 0);
    fill(0);
    textSize(32);
    text("Entrega realizada!", width / 2, height / 2);
    return;
  } else if (entregaRealizada) {
    entregaRealizada = false;
  }

  background(135, 206, 235); // Céu
  drawCampoDetalhado();

  textSize(48);
  text("🏪", cidadeX + 50, cidadeY + 25);

  textSize(32);
  text("🚜", tratorX + 15, tratorY + 10);

  for (let i = 0; i < frutas.length; i++) {
    let emoji;
    if (frutas[i].tipo === "banana") emoji = "🍌";
    else if (frutas[i].tipo === "apple") emoji = "🍎";
    else emoji = "💩";
    text(emoji, frutas[i].x, frutas[i].y);
  }

  for (let i = frutas.length - 1; i >= 0; i--) {
    if (dist(tratorX + 15, tratorY + 10, frutas[i].x, frutas[i].y) < 20) {
      if (frutas[i].tipo === "podre") {
        morto = true;
        return;
      } else {
        frutas.splice(i, 1);
        pontuacao++;
      }
    }
  }

  if (
    tratorX + 15 > cidadeX &&
    tratorX + 15 < cidadeX + 100 &&
    tratorY + 10 > cidadeY &&
    tratorY + 10 < cidadeY + 50 &&
    pontuacao > 0
  ) {
    entregaRealizada = true;
    tempoEntrega = millis();
    pontuacao = 0;
  }

  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Pontuação: " + pontuacao, 10, 30);

  if (
    tratorX < 0 ||
    tratorX + 30 > width ||
    tratorY < 20 ||
    tratorY + 20 > height
  ) {
    morto = true;
  }
}

function telaInicial() {
  background(135, 206, 235);
  fill(34, 139, 34);
  rect(0, 20, width, height - 20);

  textSize(48);
  fill(0);
  text("🚜 JOGO DO TRATOR 🚜", width / 2, 100);
  textSize(24);
  text("Pegue frutas 🍌🍎 e entregue no mercado 🏪", width / 2, 180);
  text("Cuidado com frutas podres 💩!", width / 2, 220);
  text("Use as setas do teclado para mover o trator.", width / 2, 260);
  text("Pressione ESPAÇO para começar.", width / 2, 320);
}

function keyPressed() {
  if (estado === "inicio" && key === " ") {
    estado = "jogo";
    iniciarJogo();
    return;
  }

  if (!morto && estado === "jogo") {
    if (keyCode === LEFT_ARROW) {
      tratorX -= 10;
    } else if (keyCode === RIGHT_ARROW) {
      tratorX += 10;
    } else if (keyCode === UP_ARROW) {
      tratorY -= 10;
    } else if (keyCode === DOWN_ARROW) {
      tratorY += 10;
    }
  }
}