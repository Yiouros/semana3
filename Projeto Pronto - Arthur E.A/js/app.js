"use strict";
// COMPARTILHADO — nomes e contador nas três páginas.
const armazenamento = criarArmazenamento(function () { return window.localStorage; });
let itensCarrinho = [];
function atualizarContador() {
    const unidades = itensCarrinho.reduce(function (soma, item) { return soma + item.quantidade; }, 0);
    document.querySelectorAll("[data-contador]").forEach(function (elemento) { elemento.textContent = unidades; });
}
function carregarCarrinho() {
    const resultado = armazenamento.carregar();
    itensCarrinho = resultado.itens;
    const status = document.getElementById("status-armazenamento");
    status.textContent = resultado.aviso;
    if (!resultado.aviso && window.location.protocol === "file:") {
        status.textContent = "Arquivo local: o carrinho depende do armazenamento compartilhado do navegador. Se as escolhas não aparecerem na outra página, peça ao professor um servidor local. Só produtos e extras são guardados.";
    }
    atualizarContador();
}
document.getElementById("nome-loja").textContent = configuracao.nomeLoja;
document.querySelectorAll("[data-nome-loja]").forEach(function (elemento) { elemento.textContent = configuracao.nomeLoja; });
carregarCarrinho();
