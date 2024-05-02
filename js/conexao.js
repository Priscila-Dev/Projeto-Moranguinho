const setBanco = (banco) => {
    localStorage.setItem('bd-moranguinho', banco);
};

const getBanco = () => {
    return JSON.parse(localStorage.getItem('bd-moranguuinho')) ?? [];
};

const bancoTemp = (nome, morango, morangos, tempo, pontuacao) => {

    let banco = getBanco();

    let dados = {
        nomeJogador: nome,
        morangoJogador: morango,
        morangosJogador: morangos,
        tempoJogador: tempo,
        pontuacaoJogador: pontuacao
    };

    //Esse metodo permite acrescentar novos dados sem apagar os que já existem
    banco.unshift(banco);

    setBanco(JSON.stringify(dados));
};

export { setBanco, getBanco, bancoTemp }