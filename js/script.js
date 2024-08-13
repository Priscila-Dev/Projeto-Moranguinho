import * as conexao from './conexao.js';
import * as modulos from './modulos.js';

const inputJogador = document.querySelector("#inputJogador");
const btnStart = document.querySelector("#btnStart");
const btnReiniciar = document.querySelectorAll("#btnReiniciar");
const btnRanking = document.querySelector("#btnRanking");
const modal = document.querySelector("#modal");
const modalLogin = document.querySelector("#modalLogin");
const modalGameOver = document.querySelector("#modalGameOver");
const modalRanking = document.querySelector("#modalRanking");
const txtNomeJogador = document.querySelector("#txtNomeJogador");
const sleep = document.querySelector("#sleep");
const cenario = document.querySelector("#cenario");
const morangoDuplo = document.querySelector("#morangoDuplo");
const morango = Array.from(document.querySelectorAll(".morango")).concat(morangoDuplo); //transformar qualquer elemento em array o que estiver dentro do .from, o concat é pra juntar um array com outro e transformar em um só
const numeros = document.querySelectorAll("#numeros img");
const txtTempo = document.querySelector("#txtTempo");
const txtMorango = document.querySelector("#txtMorango");
const txtMorangoDuplo = document.querySelector("#txtMorangoDuplo");
const vidas = document.querySelector("#vidas");
const tabela = document.querySelector("#tabela");

//Variaveis globais
let nomeJogador;
let morangoJogador = 0;
let morangosJogador = 0;
let tempoJogador = 0;
let pontuacaoJogador = 0;
let numeroIndex = 0;

let vidasAtual = parseInt(localStorage.getItem('vidasAtual')) || 3;
vidas.textContent = vidasAtual;

let loopSleep;
let loopTime;
let loopGerarElementos;
let loopPegarElementos;

//Funcoes

//Essa funcao verifica se o nome do jogador tem mais que 3 caracteres para habilitar o botao de start
const validarJogador = ({ target }) => {

    if (target.value.length > 2) {

        btnStart.removeAttribute('disabled');

        nomeJogador = target.value.trim().toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
        });

        btnStart.addEventListener('click', start);

        document.addEventListener('keypress', ({ key }) => {
            if (key === 'Enter' && target.value.length > 2) {
                start();
            }
        });
    } else {
        btnStart.setAttribute('disabled', '');
    }
}

inputJogador.addEventListener('input', validarJogador)

const start = () => {

    modulos.limparTexto();

    btnStart.setAttribute('disabled', '');

    modal.classList.remove('habilitar');
    modalLogin.classList.remove('active');

    sleep.classList.add('active');
    mudarNumeroSleep();
    txtNomeJogador.innerHTML = nomeJogador;

    setTimeout(() => {

        sleep.classList.remove('active');
        //cenario.classList.add('start');
        clearInterval(loopSleep);
        
        document.addEventListener('keydown', modulos.teclaPressionada);
        document.addEventListener('keyup', modulos.teclaSolta);

        time();

        setInterval(() => {
            modulos.atualizarMovimentos();
        }, 30);

        morango.forEach(geradorMorangos);
        geradorMorangos(morangoDuplo);
       

        pegarElementos();
        controlePartida();

    }, 6000);
};

const mudarNumeroSleep = () => {
    loopSleep = setInterval(() => {

        numeros.forEach((item, index) => {
            if (index === numeroIndex) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        numeroIndex++;

        if (numeroIndex >= numeros.length) {
            numeroIndex = 0;
        };
    }, 1000);
};

const time = () => {
    loopTime = setInterval(() => {
        tempoJogador = txtTempo.innerHTML;
        tempoJogador++;
        txtTempo.innerHTML = tempoJogador;
    }, 1000);
};

const geradorMorangos = (elemento) => {
   
    console.log(elemento.getAttribute('tempo'));

    setTimeout(() => {
        loopGerarElementos = setInterval(() => {

            let morangoLeft = Math.random() * (window.innerWidth - elemento.clientWidth);

            elemento.style.left = morangoLeft + 'px';
            elemento.setAttribute('tempo', 0);
        }, 5000)
    }, elemento.getAttribute('tempo'));
};

const pegarElementos = () => {
    loopPegarElementos = setInterval(() => {

        let posicaoMoranguinho = modulos.moranguinho.getBoundingClientRect();
        let posicaoMorangoDuplo = morangoDuplo.getBoundingClientRect();

        morango.forEach((item, index) => {

            let posicaoMorango = item.getBoundingClientRect();

            if (posicaoMorango.bottom > posicaoMoranguinho.top &&
                posicaoMorango.top < posicaoMoranguinho.bottom &&
                posicaoMorango.right > posicaoMoranguinho.left &&
                posicaoMorango.left < posicaoMoranguinho.right) {

                morangoJogador++;
                txtMorango.innerHTML = morangoJogador;
                item.style.opacity = '0';
                console.log(loopGerarElementos);
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 1200);
            };
        });

        if (posicaoMorangoDuplo.bottom > posicaoMoranguinho.top &&
            posicaoMorangoDuplo.top < posicaoMoranguinho.bottom &&
            posicaoMorangoDuplo.right > posicaoMoranguinho.left &&
            posicaoMorangoDuplo.left < posicaoMoranguinho.right) {

            morangosJogador++;
            txtMorangoDuplo.innerHTML = morangosJogador;
            morangoDuplo.style.opacity = '0';
            setTimeout(() => {
                morangoDuplo.style.opacity = '1';
            }, 1200);
        }
    }, 800);
};

const controlePartida = () => {
    let loopControlePartida = setInterval(() => {
      

        morango.forEach((item, index) => {
            let posicaoMorango = item.offsetTop;

            if (posicaoMorango >= modulos.alturaCenario - 70 &&
                item.style.opacity !== '0') {

                vidasAtual--;
                vidas.textContent = vidasAtual;
                localStorage.setItem("vidasAtual", vidasAtual);

                item.style.opacity = '0';

                if (vidasAtual === 0) {
                    gameOver();
                    clearInterval(loopControlePartida);
                };
            };
        });
    }, 600);
};

const calcularPontuacao = () => {

    pontuacaoJogador = (morangoJogador * 2) + (morangosJogador * 5) + tempoJogador;
};

const gameOver = () => {

    document.removeEventListener('keydown', modulos.atualizarMovimentos);

    clearInterval(loopTime);
    clearInterval(loopGerarElementos);
    clearInterval(loopPegarElementos);

    calcularPontuacao();
    conexao.bancoTemp(nomeJogador, morangoJogador, morangosJogador, tempoJogador, pontuacaoJogador);

    modal.classList.add('habilitar');
    modalGameOver.classList.add('active');
};

const reiniciarPartida = () => {
    location.reload(true);
};

btnReiniciar.forEach((btn) => {
    btn.addEventListener('click', reiniciarPartida);
});

const telaRanking = () => {
    modalGameOver.classList.remove('active');
    modalRanking.classList.add('active');

    tabelaRanking();
};

btnRanking.addEventListener('click', telaRanking);

const tabelaRanking = () => {
    const classificacao = conexao.getBanco().sort(colocacao).reverse();

    classificacao.forEach((item, index) => {
        let posicao = index + 1;
        let nome = item.nomeJogador;
        let morango = item.morangoJogador;
        let morangos = item.morangosJogador;
        let tempo = item.tempoJogador;
        let pontuacao = item.pontuacaoJogador;

        criarTabela(posicao, nome, morango, morangos, tempo, pontuacao);

        // criarTabela(index+1, item.nomeJogador, item.morangoJogador, item.morangosJogador, 
        //     item.tempoJogador, item.pontuacaoJogador);
    });
};

const criarTabela = (posicao, nome, morango, morangos, tempo, pontuacao) => {

    const elementoHtml = document.createElement('tr');
    elementoHtml.classList.add('linha');

    elementoHtml.innerHTML = `
    <td class="coluna">${posicao}</td>
    <td class="coluna">${nome}</td>
    <td class="coluna">${morango}</td>
    <td class="coluna">${morangos}</td>
    <td class="coluna">${tempo}</td>
    <td class="coluna">${pontuacao}</td>
    `;

    tabela.appendChild(elementoHtml);
}

const colocacao = (a, b) => {
    if (a.pontuacaoJogador > b.pontuacaoJogador) {
        return 1;
    } else if (a.pontuacaoJogador < b.pontuacaoJogador) {
        return -1;
    } else {
        return 0;
    }

    //Forma mais compacta da funçao acima
    // return a.pontuacaoJogador > b.pontuacaoJogador ? 1 : a.pontuacaoJogador < b.pontuacaoJogador ? -1 : 0;
};



