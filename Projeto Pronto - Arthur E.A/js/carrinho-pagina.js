"use strict";
// ENTRADA — estes IDs também aparecem no material da oficina.
const nome = document.getElementById("nome");
const bairro = document.getElementById("bairro");
const pagamento = document.getElementById("pagamento");
const troco = document.getElementById("troco");
const formulario = document.getElementById("formulario");
const subtotal = document.getElementById("subtotal");
const taxa = document.getElementById("taxa");
const total = document.getElementById("total");
const mensagem = document.getElementById("mensagem");
const erro = document.getElementById("erro");
const whatsapp = document.getElementById("whatsapp");
const lista = document.getElementById("itens-carrinho");
let linkRevisado = "";
let escolhasRevisadas = "";

function invalidarRevisao() {
    mensagem.textContent = "Preencha o formulário e pressione “Revisar pedido”.";
    whatsapp.disabled = true;
    linkRevisado = "";
    escolhasRevisadas = "";
    erro.textContent = "";
}
function informarErro(texto) { erro.textContent = texto; erro.focus(); }
function quantidadesValidasNaTela() {
    return Array.from(lista.querySelectorAll('input[type="number"]')).every(function (campo, indice) {
        const valor = Number(campo.value);
        return Number.isInteger(valor) && valor >= 1 && valor <= 10 && valor === itensCarrinho[indice].quantidade;
    });
}
// PASSO1 — soma todos os produtos e seus adicionais; não lê preços do storage.
function atualizarResumo() {
    const taxaEntrega = obterTaxa(bairro.value);
    const valido = quantidadesValidasNaTela();
    subtotal.textContent = valido ? formatarMoeda(calcularTotalCarrinho(itensCarrinho)) : "Quantidade não confirmada";
    taxa.textContent = taxaEntrega === null ? "Escolha o bairro" : formatarMoeda(taxaEntrega);
    const valor = valido && taxaEntrega !== null ? Math.round((calcularTotalCarrinho(itensCarrinho) + taxaEntrega) * 100) / 100 : null;
    total.textContent = valor === null ? "—" : formatarMoeda(valor);
    document.getElementById("revisar").disabled = itensCarrinho.length === 0;
    return valor;
}
// PASSO2 — condição: só dinheiro mostra o campo de troco.
function atualizarTroco() {
    const usaDinheiro = pagamento.value === "dinheiro";
    document.getElementById("campo-troco").hidden = !usaDinheiro;
    troco.disabled = !usaDinheiro;
    if (!usaDinheiro) { troco.value = ""; }
}
function descreverExtras(item) {
    const extras = [];
    if (item.raspadinha) { extras.push(configuracao.nomeRaspadinha); }
    if (item.cobertura) { extras.push(configuracao.nomeCobertura); }
    return extras.length ? extras.join(" e ") : "sem extras";
}
function salvarAlteracao(proximos) {
    // Só modifica a tela/estado depois de ler de volta o valor salvo.
    armazenamento.salvar(proximos);
    itensCarrinho = proximos;
    atualizarContador();
    document.getElementById("status-armazenamento").textContent = "Carrinho atualizado neste navegador. Dados do formulário não são guardados.";
}
function mostrarItens() {
    lista.replaceChildren();
    document.getElementById("carrinho-vazio").hidden = itensCarrinho.length > 0;
    document.getElementById("esvaziar").disabled = itensCarrinho.length === 0;
    itensCarrinho.forEach(function (item, indice) {
        const produto = obterProduto(item.id);
        const linha = document.createElement("article");
        linha.className = "item-carrinho";
        linha.innerHTML = '<h3></h3><p class="extras"></p><label>Quantidade (1 a 10)</label>' +
            '<input type="number" min="1" max="10" step="1" required><p class="valor-item"></p><button type="button" class="secundario">Remover item</button>';
        linha.querySelector("h3").textContent = produto.nome;
        linha.querySelector(".extras").textContent = descreverExtras(item) + " por unidade";
        const campo = linha.querySelector("input");
        campo.id = "quantidade-item-" + indice; campo.name = campo.id; campo.value = item.quantidade;
        linha.querySelector("label").htmlFor = campo.id;
        const valorItem = linha.querySelector(".valor-item");
        valorItem.textContent = "Subtotal do item: " + formatarMoeda(calcularSubtotalItem(item));
        campo.addEventListener("input", function () {
            invalidarRevisao();
            const proximos = itensCarrinho.map(function (escolha) { return { ...escolha }; });
            proximos[indice].quantidade = Number(campo.value);
            try {
                if (!validarCarrinho({ versao: 1, itens: proximos })) { throw new Error("Escolha uma quantidade inteira de 1 a 10."); }
                salvarAlteracao(proximos);
                valorItem.textContent = "Subtotal do item: " + formatarMoeda(calcularSubtotalItem(proximos[indice]));
            } catch (falha) { erro.textContent = falha.message; }
            atualizarResumo();
        });
        const remover = linha.querySelector("button");
        remover.id = "remover-item-" + indice;
        remover.setAttribute("aria-label", "Remover " + produto.nome + ", " + descreverExtras(item));
        remover.addEventListener("click", function () {
            invalidarRevisao();
            try {
                salvarAlteracao(itensCarrinho.filter(function (escolha, posicao) { return posicao !== indice; }));
                mostrarItens(); atualizarResumo();
                document.getElementById("status-armazenamento").focus();
            } catch (falha) { informarErro(falha.message); }
        });
        lista.appendChild(linha);
    });
}
// PASSO3 — evento: revisar gera apenas texto. Nenhuma janela é aberta aqui.
function revisarPedido(evento) {
    evento.preventDefault(); invalidarRevisao();
    if (itensCarrinho.length === 0) { informarErro("Seu carrinho está vazio. Volte ao cardápio."); return; }
    if (!quantidadesValidasNaTela()) { informarErro("Escolha uma quantidade inteira de 1 a 10 e confirme o armazenamento."); return; }
    const valorTotal = atualizarResumo();
    const dados = { nome: nome.value, bairro: bairro.value, pagamento: pagamento.value, troco: troco.value };
    const aviso = validarFormulario(dados, valorTotal);
    if (aviso) { informarErro(aviso); return; }
    if (troco.validity.badInput) { informarErro("Informe um número válido para o troco."); return; }
    const linhas = itensCarrinho.map(function (item) {
        return item.quantidade + " × " + obterProduto(item.id).nome + " — " + descreverExtras(item) + " por unidade — " + formatarMoeda(calcularSubtotalItem(item));
    });
    const texto = "PRÉVIA — " + configuracao.nomeLoja + "\nNome fictício: " + nome.value.trim() +
        "\n" + linhas.join("\n") + "\nEntrega: " + bairro.options[bairro.selectedIndex].textContent +
        "\nPagamento: " + pagamento.options[pagamento.selectedIndex].textContent +
        "\nTroco: " + (pagamento.value === "dinheiro" && troco.value !== "" ? "pagar com " + formatarMoeda(Number(troco.value)) : "não solicitado") +
        "\nSubtotal: " + subtotal.textContent + "\nTaxa: " + taxa.textContent + "\nTotal previsto: " + formatarMoeda(valorTotal) +
        "\n\nIsto não confirma um pedido. A loja precisa conferir preços, disponibilidade e entrega.";
    mensagem.textContent = texto; mensagem.focus();
    escolhasRevisadas = JSON.stringify(itensCarrinho);
    linkRevisado = criarLinkWhatsApp(configuracao.telefoneWhatsApp, texto);
    whatsapp.disabled = linkRevisado === "";
    document.getElementById("aviso-whatsapp").textContent = linkRevisado ? "Destino autorizado configurado. Só outro clique abre o WhatsApp; o envio depende de você." : "WhatsApp desativado: configure um destino autorizado em configuracao.js.";
}
formulario.addEventListener("submit", revisarPedido);
function alterarFormulario() { invalidarRevisao(); atualizarTroco(); atualizarResumo(); }
nome.addEventListener("input", alterarFormulario);
bairro.addEventListener("change", alterarFormulario);
pagamento.addEventListener("change", alterarFormulario);
troco.addEventListener("input", alterarFormulario);
document.getElementById("esvaziar").addEventListener("click", function () {
    invalidarRevisao();
    try { armazenamento.esvaziar(); itensCarrinho = []; mostrarItens(); atualizarContador(); atualizarResumo(); }
    catch (falha) { informarErro(falha.message); }
});
// COMPLEMENTO PRONTO — segundo clique explícito, nunca envio automático.
whatsapp.addEventListener("click", function () {
    if (!linkRevisado) { return; }
    const atual = armazenamento.carregar();
    if (atual.aviso || JSON.stringify(atual.itens) !== escolhasRevisadas || !quantidadesValidasNaTela()) {
        invalidarRevisao(); informarErro("O carrinho mudou ou o armazenamento está indisponível. Confira e revise novamente."); return;
    }
    window.open(linkRevisado, "_blank", "noopener,noreferrer");
});
window.addEventListener("storage", function (evento) {
    if (evento.key === armazenamento.chave || evento.key === null) {
        invalidarRevisao(); carregarCarrinho(); mostrarItens(); atualizarResumo();
    }
});
mostrarItens(); atualizarTroco(); atualizarResumo();
