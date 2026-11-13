"use strict";
// PERSONALIZE AQUI: nomes e preços. Use ponto nos números, não vírgula.
const configuracao = {
    nomeLoja: "Gelo No Espeto",
    nomeProduto: "Gelo Grelhado",
    nomeRaspadinha: "Raspadinha Extra",
    nomeCobertura: "Cobertura extra",
    precoProduto: 28.90,
    precoRaspadinha: 4,
    precoCobertura: 5,
    // Destino autorizado por Luzardo para a demonstração da oficina.
    // Só configure um destino autorizado, com país + DDD + número, apenas dígitos.
    telefoneWhatsApp: "55995886059"
};

// Catálogo: mantenha os IDs. O primeiro lanche usa os campos acima,
// sem copiar seu nome/preço para um segundo lugar.
configuracao.produtos = [
    { id: "Gelo-Grelhado", get nome() { return configuracao.nomeProduto; },
      get preco() { return configuracao.precoProduto; },
      descricao: "Gelo, Molho barbie kill, raspadinha e cobertura.", imagem: "img/GeloGrelhadojpg.jpg"},
    { id: "classico", nome: "Gelo Na Cumbuca", preco: 17.90,
      descricao: "Gelo, Àgua(molhada), cobertura e rapaspadinha", imagem: "img/GeloPuroJPG.jpg" },
    { id: "PoloNorte", nome: "Pedaço do Polo Norte", preco: 27.90,
      descricao: "escama de gelo, molho barbie kill, raspadinha e cobertura.", imagem: "img/PedacoDeneveJPG.jpg" }
];

// Permite testar com Node sem exigir ferramentas para abrir o site.
if (typeof module !== "undefined" && module.exports) {
    module.exports = configuracao;
}
