"use strict";
// No navegador, configuracao vem do primeiro script do HTML.
// No Node, carregamos o mesmo arquivo para testar os mesmos preços.
let precos;
if (typeof module !== "undefined" && module.exports) {
    precos = require("./configuracao.js");
} else {
    precos = configuracao;
}

// PASSO1 — Processamento: preço de uma unidade vezes a quantidade.
function calcularSubtotal(quantidade, raspadinha, cobertura) {
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 10) {
        throw new Error("Escolha uma quantidade inteira de 1 a 10.");
    }
    let precoUnidade = precos.precoProduto;
    if (raspadinha) {
        precoUnidade = precoUnidade + precos.precoRaspadinha;
    }
    if (cobertura) {
        precoUnidade = precoUnidade + precos.precoRaspadinha;
    }
    return Math.round(precoUnidade * quantidade * 100) / 100;
}

// PASSO1 — cada item tem ID, quantidade e dois extras por unidade.
function obterProduto(id) {
    return precos.produtos.find(function (produto) { return produto.id === id; });
}
function calcularSubtotalItem(item) {
    const produto = obterProduto(item.id);
    if (!produto || !Number.isInteger(item.quantidade) || item.quantidade < 1 || item.quantidade > 10 ||
        typeof item.raspadinha !== "boolean" || typeof item.cobertura !== "boolean") {
        throw new Error("Produto inválido ou quantidade não inteira de 1 a 10.");
    }
    let unidade = produto.preco;
    if (item.raspadinha) { unidade += precos.precoCobertura; }
    if (item.cobertura) { unidade += precos.precoRaspadinha; }
    return Math.round(unidade * item.quantidade * 100) / 100;
}
// Soma em centavos para evitar erros de ponto flutuante na soma.
function calcularTotalCarrinho(itens) {
    return itens.reduce(function (soma, item) {
        return soma + Math.round(calcularSubtotalItem(item) * 100);
    }, 0) / 100;
}

// PASSO2 — Processamento: condições para entrega e formulário.
function obterTaxa(bairro) {
    if (bairro === "centro") { return 5; }
    if (bairro === "sao-judas") { return 7; }
    if (bairro === "retirada") { return 0; }
    return null;
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Retorna texto vazio quando os dados estão prontos para a prévia.
function validarFormulario(dados, total) {
    if (dados.nome.trim().length < 3 || dados.nome.trim().length > 60) {
        return "Use um nome fictício com 3 a 60 caracteres.";
    }
    if (obterTaxa(dados.bairro) === null) {
        return "Escolha um bairro ou a retirada.";
    }
    if (dados.pagamento !== "pix" && dados.pagamento !== "cartao" && dados.pagamento !== "dinheiro") {
        return "Escolha uma forma de pagamento.";
    }
    if (dados.pagamento === "dinheiro" && dados.troco !== "") {
        const valorTroco = Number(dados.troco);
        if (!Number.isFinite(valorTroco) || valorTroco < total) {
            return "O valor para troco deve ser igual ou maior que o total previsto.";
        }
    }
    return "";
}

// COMPLEMENTOS PRONTOS — não é necessário escrever estes blocos na oficina.
function validarRascunho(valor) {
    if (valor === null || typeof valor !== "object" || Array.isArray(valor)) {
        return false;
    }
    if (Object.keys(valor).length !== 4) { return false; }
    return valor.versao === 1 && Number.isInteger(valor.quantidade) &&
        valor.quantidade >= 1 && valor.quantidade <= 10 &&
        typeof valor.raspadinha === "boolean" && typeof valor.cobertura === "boolean";
}

// COMPLEMENTO PRONTO — formato mínimo aceito ao restaurar o carrinho.
function chaveItem(item) {
    return item.id + ":" + item.raspadinha + ":" + item.cobertura;
}
function validarCarrinho(valor) {
    if (!valor || typeof valor !== "object" || Array.isArray(valor) ||
        Object.keys(valor).sort().join(",") !== "itens,versao" || valor.versao !== 1 ||
        !Array.isArray(valor.itens) || valor.itens.length > precos.produtos.length * 4) { return false; }
    const vistas = new Set();
    for (const item of valor.itens) {
        if (!item || typeof item !== "object" || Array.isArray(item) ||
            Object.keys(item).sort().join(",") !== "cobertura,id,quantidade,raspadinha") { return false; }
        try { calcularSubtotalItem(item); } catch (erro) { return false; }
        const chave = chaveItem(item);
        if (vistas.has(chave)) { return false; }
        vistas.add(chave);
    }
    return true;
}
function adicionarItem(itens, novo) {
    if (!validarCarrinho({ versao: 1, itens: itens }) ||
        !validarCarrinho({ versao: 1, itens: [novo] })) {
        throw new Error("Escolha um produto e quantidade inteira de 1 a 10.");
    }
    // Uma cópia evita mudar o carrinho antes de conseguir salvá-lo.
    const copia = itens.map(function (item) { return { ...item }; });
    const existente = copia.find(function (item) { return chaveItem(item) === chaveItem(novo); });
    if (existente) {
        if (existente.quantidade + novo.quantidade > 10) {
            throw new Error("Esta combinação ultrapassa 10 unidades. Altere a quantidade no carrinho.");
        }
        existente.quantidade += novo.quantidade;
    } else { copia.push({ ...novo }); }
    return copia;
}

function criarLinkWhatsApp(telefone, mensagem) {
    if (!/^[1-9][0-9]{11,14}$/.test(telefone)) { return ""; }
    return "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { chaveItem, validarCarrinho, adicionarItem, obterProduto, calcularSubtotalItem, calcularTotalCarrinho, calcularSubtotal, obterTaxa, formatarMoeda, validarFormulario, validarRascunho, criarLinkWhatsApp };
}
