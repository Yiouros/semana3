"use strict";
// ENTRADA — cada card tem IDs próprios. O catálogo vem da configuração.
const catalogo = document.getElementById("catalogo");
const feedback = document.getElementById("feedback");
for (const produto of configuracao.produtos) {
    const card = document.createElement("article");
    card.className = "cartao produto-card";
    // Estrutura fixa: os textos personalizados entram com textContent abaixo.
    card.innerHTML = '<img class="produto" width="640" height="420" alt="">' +
        '<h2></h2><p class="descricao"></p><p class="preco"></p>' +
        '<label>Quantidade (1 a 10)</label><input type="number" min="1" max="10" step="1" value="1" required>' +
        '<fieldset><legend>Extras por unidade</legend><label class="opcao"><input type="checkbox"><span></span></label>' +
        '<label class="opcao"><input type="checkbox"><span></span></label></fieldset><p class="previa-item" aria-live="polite"></p><button type="button">Adicionar ao carrinho</button>';
    card.querySelector("h2").textContent = produto.nome;
    card.querySelector(".descricao").textContent = produto.descricao;
    card.querySelector(".preco").textContent = formatarMoeda(produto.preco);
    const imagem = card.querySelector("img");
    imagem.src = produto.imagem; imagem.alt = "Ilustração de " + produto.nome;
    const campos = card.querySelectorAll("input");
    const rotulos = card.querySelectorAll("label");
    ["quantidade", "Raspadinha", "Cobertura"].forEach(function (nome, indice) {
        campos[indice].id = nome + "-" + produto.id;
        campos[indice].name = campos[indice].id;
        rotulos[indice].htmlFor = campos[indice].id;
    });
    const extras = card.querySelectorAll(".opcao span");
    extras[0].textContent = configuracao.nomeRaspadinha + " + " + formatarMoeda(configuracao.precoRaspadinha);
    extras[1].textContent = configuracao.nomeCobertura + " + " + formatarMoeda(configuracao.precoCobertura);
    // PASSO1 — ler escolhas, calcular e mostrar antes de adicionar ao carrinho.
    const previa = card.querySelector(".previa-item");
    previa.id = "previa-" + produto.id;
    function atualizarPrevia() {
        const item = { id: produto.id, quantidade: Number(campos[0].value), raspadinha: campos[1].checked, cobertura: campos[2].checked };
        try {
            previa.textContent = "Subtotal da escolha: " + formatarMoeda(calcularSubtotalItem(item));
        } catch (erro) {
            previa.textContent = "Escolha uma quantidade inteira de 1 a 10.";
        }
    }
    campos[0].addEventListener("input", atualizarPrevia);
    campos[1].addEventListener("change", atualizarPrevia);
    campos[2].addEventListener("change", atualizarPrevia);
    atualizarPrevia();
    const botao = card.querySelector("button");
    botao.id = "adicionar-" + produto.id;
    botao.setAttribute("aria-label", "Adicionar " + produto.nome + " ao carrinho");
    botao.addEventListener("click", function () {
        try {
            // Releia antes da escrita para não substituir escolhas feitas em outra aba.
            const atual = armazenamento.carregar();
            if (atual.aviso.includes("armazenamento")) { throw new Error(atual.aviso); }
            const novo = { id: produto.id, quantidade: Number(campos[0].value), raspadinha: campos[1].checked, cobertura: campos[2].checked };
            const proximos = adicionarItem(atual.itens, novo);
            armazenamento.salvar(proximos);
            itensCarrinho = proximos;
            atualizarContador();
            feedback.textContent = "Adicionado: " + novo.quantidade + " × " + produto.nome + ". Confira seu carrinho.";
            document.getElementById("status-armazenamento").textContent = "Escolhas guardadas neste navegador; nenhum dado pessoal foi salvo.";
        } catch (erro) { feedback.textContent = erro.message; }
        feedback.focus();
    });
    catalogo.appendChild(card);
}
window.addEventListener("storage", carregarCarrinho);
