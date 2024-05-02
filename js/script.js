import * as conexao from './conexao.js';
import * as modulos from './modulos.js';

const inputJogador = document.querySelector("#inputJogador");
const btnStart = document.querySelector("#btnStart");
const modal = document.querySelector("#modal");
const modalLogin = document.querySelector("#modalLogin");
const txtNomeJogador = document.querySelector("#txtNomeJogador");
const sleep = document.querySelector("#sleep");
const cenario = document.querySelector("#cenario");
const moranguinho = document.querySelector("#moranguinho");
const morangoDuplo = document.querySelector("#morangoDuplo");
const morango = Array.from(document.querySelectorAll(".morango")).concat(morangoDuplo); //transformar qualquer elemento em array o que estiver dentro do .from, o concat é pra juntar um array com outro e transformar em um só
const numeros = document.querySelectorAll("#numeros img");
const txtTempo = document.querySelector("#txtTempo");
const txtMorango = document.querySelector("#txtMorango");
const txtMorangoDuplo = document.querySelector("#txtMorangoDuplo");
const vidas = document.querySelector("#vidas");

//Variaveis globais
let nomeJogador;
let morangoJogador = 0;
let morangosJogador = 0;
let tempoJogador = 0;
let pontuacaoJogador = 0;
let numeroIndex = 0;
let contador = 0;

let vidasAtual = parseInt(localStorage.getItem('vidasAtual')) || 3;
vidas.textContent = vidasAtual;

let loopSleep;
let loopTime;
let loopMoverElementos;
let loopGerarElementos;
let loopPegarElementos;
let loopPerderElemento;



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
        cenario.classList.add('start');
        clearInterval(loopSleep);

        document.addEventListener('keydown', modulos.teclaPressionada);
        document.addEventListener('keyup', modulos.teclaSolta);

        time();

        // morango.forEach(moverElementos);
        // moverElementos(morangoDuplo, 12);

        setInterval(() => {
            modulos.atualizarMovimentos();
        }, 50);
    
        //loopGerarElementos = setInterval(() => {
            
            morango.forEach(geradorMorangos);
            geradorMorangos(morangoDuplo);
       // }, 5000)
        
        pegarElementos();
       // controlePartida();

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

const moverElementos = (elemento, retardo = 0) => {

    loopMoverElementos = setInterval(() => {
        if (tempoJogador <= 10) {
            elemento.style.animation = `mover-elementos 5s infinite linear ${retardo}s`;
        }
        //  else if (tempoJogador <= 20) {
        //     elemento.style.animation = `mover-elementos 4.8s infinite linear `;
        // } 
        // else if (tempoJogador <= 30) {
        //     elemento.style.animation = `mover-elementos 4.6s infinite linear `;
        // }
        //  else if (tempoJogador > 40) {
        //     elemento.style.animation = `mover-elementos 4.5s infinite linear `;
        // };
    }, 1);
};

const geradorMorangos = (elemento) => {
    //let morangoTop = -100;
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

        const posicaoMoranguinho = modulos.moranguinho.getBoundingClientRect();
        const posicaoMorangoDuplo = morangoDuplo.getBoundingClientRect();

        morango.forEach((item, index) => {

            const posicaoMorango = item.getBoundingClientRect();

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

        // if (posicaoMorangoDuplo.bottom > posicaoMoranguinho.top &&
        //     posicaoMorangoDuplo.top <posicaoMoranguinho.bottom &&
        //     posicaoMorangoDuplo.right > posicaoMoranguinho.left &&
        //     posicaoMorangoDuplo.left < posicaoMoranguinho.right) {

        //         morangosJogador++;
        //         txtMorangoDuplo.innerHTML = morangosJogador;
        //         morangoDuplo.style.display = 'none';
        //         setTimeout(() => {
        //             morangoDuplo.style.display = 'block';
        //         }, 50);
        // };
    });
};

const controlePartida = () => {
    const loopControlePartida = setInterval(() => {
        const posicaoMorangoDuplo = morangoDuplo.offsetTop;
    //const alturaCenario = window.innerHeight;

    morango.forEach((item, index) => {
        const posicaoMorango = item.offsetTop;

        if (posicaoMorango >= modulos.alturaCenario -70) {
            
            vidasAtual--;
            vidas.textContent = vidasAtual;
            localStorage.setItem("vidasAtual", vidasAtual);

            if (vidasAtual <= 0) {
                alert('voce perdeu!')
                console.log('voce perdeu')

            }
        };

    });

    if (posicaoMorangoDuplo >= modulos.alturaCenario) {
        vidasAtual--;
        vidas.textContent = vidasAtual;
        localStorage.setItem("vidasAtual", vidasAtual);

       if (vidasAtual <= 0) {
       alert('voce perdeu!')
        console.log('voce perdeu')
    }
    };

    }, 1)
}
