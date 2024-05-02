const moranguinho = document.querySelector('#moranguinho');
const cenario = document.querySelector('#cenario');

let larguraCenario = cenario.offsetWidth;
let alturaCenario = cenario.offsetHeight;
let larguraPersonagem = moranguinho.offsetWidth;

let posicao = 0;
let direcao = 0;
let velocidade = 30;

const limparTexto = () => {
    inputJogador.value = '';
}

function teclaPressionada(event) {

    if (event.key === 'ArrowRight') {
        direcao = 1;
        moranguinho.src = '../../../img/moranguinho-direita.png';
    }
    if (event.key === 'ArrowLeft') {
        direcao = -1;
        moranguinho.src = '../../../img/moranguinho-esquerda.png';
    }
}

function teclaSolta(event) {
    if (event.key === 'ArrowRight') {
        direcao = 0;
    }
    if (event.key === 'ArrowLeft') {
        direcao = 0;
    }
}

function atualizarMovimentos() {
    posicao += direcao * velocidade;

    if (posicao < 0) {
        posicao = 0;
    } else if (posicao + larguraPersonagem > larguraCenario) {
        posicao = larguraCenario - larguraPersonagem;
    }
    moranguinho.style.left = posicao + 'px';
}

const removerTeclas = () => {
    document.removeEventListener('keydown', teclaPressionada);
    document.removeEventListener('keyup', teclaSolta);
}

export { limparTexto, teclaPressionada, teclaSolta, atualizarMovimentos, removerTeclas, larguraCenario, alturaCenario, moranguinho};