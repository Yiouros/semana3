"use strict";
// COMPLEMENTO PRONTO — compartilhar escolhas entre documentos, não dados pessoais.
// Injetar o acesso permite testar também navegadores que negam o localStorage.
function criarArmazenamento(acessar) {
    const chave = "burgerflow-oficina-carrinho-v1";
    const regrasStorage = typeof module !== "undefined" && module.exports ? require("./regras.js") : { validarCarrinho };
    const orientacao = "Não foi possível usar o armazenamento. Verifique as permissões do navegador ou peça ao professor um servidor local. Nenhuma alteração foi confirmada.";
    function carregar() {
        try {
            const texto = acessar().getItem(chave);
            if (texto === null) { return { itens: [], aviso: "" }; }
            const valor = JSON.parse(texto);
            if (!regrasStorage.validarCarrinho(valor)) { throw new Error("inválido"); }
            return { itens: valor.itens, aviso: "" };
        } catch (erro) {
            // Distingue conteúdo corrompido de acesso negado sem expor detalhes técnicos.
            try { acessar().getItem(chave); }
            catch (falha) { return { itens: [], aviso: orientacao }; }
            return { itens: [], aviso: "Carrinho inválido ignorado. Escolha os produtos novamente no cardápio." };
        }
    }
    function salvar(itens) {
        if (!regrasStorage.validarCarrinho({ versao: 1, itens })) { throw new Error("Carrinho inválido."); }
        try {
            const texto = JSON.stringify({ versao: 1, itens });
            const storage = acessar();
            storage.setItem(chave, texto);
            if (storage.getItem(chave) !== texto) { throw new Error("Não gravou"); }
        } catch (erro) { throw new Error(orientacao); }
    }
    function esvaziar() {
        try {
            const storage = acessar();
            // Nunca use clear(): isso apagaria dados de outros projetos.
            storage.removeItem(chave);
            if (storage.getItem(chave) !== null) { throw new Error("Não removeu"); }
        } catch (erro) { throw new Error(orientacao); }
    }
    return { chave, carregar, salvar, esvaziar };
}
if (typeof module !== "undefined" && module.exports) { module.exports = { criarArmazenamento }; }
