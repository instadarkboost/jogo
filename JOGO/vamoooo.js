const canvas = document.getElementById('jogo2D');
const ctx = canvas.getContext('2d');

const gravidade = 0.6;
const velocidadeObstaculo = 5;
let obstaculos = [];
let gameOver = false;

const personagem = {
    x: 100,
    y: canvas.height - 50,
    altura: 50,
    largura: 50,
    velocidadey: 0,
    pulando: false
};

// Evento de pulo
document.addEventListener('keydown', (e) => {
    if (e.code === "Space" && !personagem.pulando && !gameOver) {
        personagem.velocidadey = -12;
        personagem.pulando = true;
    }
});

function desenharPersonagem() {
    ctx.fillStyle = 'black';
    ctx.fillRect(personagem.x, personagem.y, personagem.largura, personagem.altura);
}

function atualizarPersonagem() {
    personagem.velocidadey += gravidade;
    personagem.y += personagem.velocidadey;
    
    if (personagem.y >= canvas.height - personagem.altura) {
        personagem.y = canvas.height - personagem.altura;
        personagem.velocidadey = 0;
        personagem.pulando = false;
    }
}

function criarObstaculo() {
    if (!gameOver) {
        const obstaculo = {
            x: canvas.width,
            y: canvas.height - 50,
            largura: 20,
            altura: 50,
            velocidade: velocidadeObstaculo
        };
        obstaculos.push(obstaculo);
    }
}

function desenharObstaculos() {
    ctx.fillStyle = 'red';
    obstaculos.forEach((obstaculo) => {
        ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
    });
}

function atualizarObstaculos() {
    obstaculos.forEach((obstaculo, index) => {
        obstaculo.x -= obstaculo.velocidade;
        if (obstaculo.x + obstaculo.largura < 0) {
            obstaculos.splice(index, 1);
        }
    });
}

function detectarColisao() {
    obstaculos.forEach((obstaculo) => {
        if (
            personagem.x < obstaculo.x + obstaculo.largura &&
            personagem.x + personagem.largura > obstaculo.x &&
            personagem.y < obstaculo.y + obstaculo.altura &&
            personagem.y + personagem.altura > obstaculo.y
        ) {
            gameOver = true;
            exibirGameOver();
        }
    });
}

function exibirGameOver() {
    const overlay = document.getElementById("gameOverScreen");
    overlay.style.display = "flex";
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    gameOver = false;
    obstaculos = [];
    personagem.y = canvas.height - personagem.altura;
    personagem.velocidadey = 0;
    
    document.getElementById("gameOverScreen").style.display = "none";
    loop();
}

// Criar obstáculos a cada 2 segundos
setInterval(criarObstaculo, 2000);

function loop() {
    if (gameOver) return; // Para o loop se o jogo acabar

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    atualizarPersonagem();
    atualizarObstaculos();
    
    desenharPersonagem();
    desenharObstaculos();
    
    detectarColisao();
    
    requestAnimationFrame(loop);
}

// Iniciar o loop
loop();
