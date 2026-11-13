# BurgerFlow — três páginas prontas para personalizar

Projeto de estudo da **Fogo de Palha**, sem framework, instalação, conta ou pagamento online.

## 1. Abrir e experimentar

1. Se recebeu um ZIP, extraia a pasta inteira. Não edite dentro do ZIP.
2. Faça uma cópia da pasta **Projeto pronto** com seu nome.
3. Abra essa pasta no VS Code por **Arquivo → Abrir Pasta…**.
4. No gerenciador de arquivos, abra **index.html** no Chrome. Mantenha `css`, `img` e `js` juntos.
5. Use a navegação: **Principal → Cardápio → Carrinho**.

Há exatamente três páginas do site:

- `index.html`: apresentação da loja e botões **Ver cardápio / Ver carrinho**.
- `cardapio.html`: Brasa Bacon (R$ 31,90), Clássico (R$ 24,90) e Veggie (R$ 27,90), com quantidade e extras independentes.
- `carrinho.html`: todos os lanches, alteração de quantidade, remoção, entrega, pagamento e revisão.

O HTML de `tests/browser-cenarios.html` é somente o laboratório automatizado do professor, não uma quarta página do site/navegação.

## 2. Montar a simulação

1. No Cardápio, escolha um inteiro de **1 a 10** e marque os extras desejados. Cada extra é cobrado em **cada unidade**.
2. Clique em **Adicionar ao carrinho**. Leia o retorno. O contador mostra a soma das unidades, não o número de combinações.
3. Mesmos produto e extras somam uma linha até 10; se ultrapassar, a adição inteira é rejeitada. Extras diferentes formam outra linha.
4. Abra o Carrinho. Altere quantidades, remova itens ou esvazie. Carrinho vazio mostra o link para voltar ao cardápio e impede revisar.
5. Use um **nome fictício**, como Ana de Teste. Escolha Centro (R$ 5), São Judas (R$ 7) ou retirada (R$ 0).
6. Escolha Pix, cartão ou dinheiro. Não há transação, QR Code ou coleta de cartão.
7. Dinheiro mostra o campo opcional de troco: informe com quanto pagaria. Abaixo do total é inválido; vazio significa sem troco solicitado. Pix/cartão escondem e limpam o campo.
8. Clique em **3. Revisar pedido**: aparece apenas uma mensagem na página. Alterar uma entrada invalida a revisão.
9. O WhatsApp é opcional e exige outro clique explícito após uma revisão válida. O envio ainda depende de você no aplicativo. **Revisar não envia nada.**

Exemplo: dois Brasa com queijo e bacon = `(31.90 + 4 + 5) × 2` = **R$ 81,80**. Com um Clássico, subtotal **R$ 106,70**; Centro, total **R$ 111,70**.

## 3. Personalizar em um arquivo

Abra `js/configuracao.js`. Mude valores à direita dos dois-pontos, salve no editor e **recarregue o navegador**. São duas ações diferentes.

| Campo | O que muda |
|---|---|
| `nomeLoja` | Nome no topo, apresentação e mensagem |
| `nomeProduto`, `precoProduto` | Primeiro lanche: nome e preço do Brasa Bacon |
| `nomeQueijo`, `nomeBacon` | Textos dos dois extras |
| `precoQueijo`, `precoBacon` | Preço de cada extra por unidade |
| `produtos` | Lista com IDs estáveis, descrição, imagem, nome/preço dos demais lanches |
| `telefoneWhatsApp` | Destino autorizado, já configurado a pedido de Luzardo |

O primeiro item da lista lê `nomeProduto` e `precoProduto` por funções `get` prontas: **não duplique esses valores**. Nos demais, edite `nome` e `preco` diretamente na lista. Preserve IDs `brasa-bacon`, `classico`, `veggie`.

Textos ficam entre aspas; preços usam ponto, sem `R$` e sem aspas (`24.90`). Preserve vírgulas e chaves. Os preços são sempre recalculados pela configuração, nunca confiados ao armazenamento.

O destino permanece exatamente o autorizado em `telefoneWhatsApp`. Não o substitua pelo telefone de colegas. Para demonstrar o botão desativado em uma cópia, use `""`; essa variação também é testada de forma isolada. Nenhuma mensagem real foi enviada na verificação deste projeto.

Cores: variáveis no começo de `css/estilo.css`. Imagens: arquivos locais em `img`, caminhos `imagem` no catálogo; a imagem principal fica em `index.html`. Ao trocar, ajuste também descrição e `alt` para combinar. Preserve contraste e nomes/IDs dos campos.

## 4. Onde está cada parte do JavaScript

- `configuracao.js`: uma única fonte dos nomes e preços.
- `regras.js`: cálculos/validações, sem DOM (sem procurar elementos HTML).
- `carrinho.js`: **complemento pronto** para ler, validar e guardar as escolhas.
- `app.js`: nome da loja, contador e leitura inicial, compartilhados nas três páginas.
- `cardapio.js`: cria três cards com IDs próprios e responde ao clique de adicionar.
- `carrinho-pagina.js`: lista, quantidades, formulário, resumo, revisão e clique opcional de WhatsApp.

Os comentários **PASSO1 / PASSO2 / PASSO3** estão em `regras.js` e `carrinho-pagina.js`. Os complementos de catálogo, persistência e WhatsApp podem ser observados prontos; não são sintaxe obrigatória para quem começa.

### Funções reais para acompanhar no material

- `calcularSubtotal(quantidade, queijo, bacon)`: API original, calcula só o primeiro lanche; exemplo didático reduzido.
- `obterProduto(id)`: procura um produto da configuração.
- `calcularSubtotalItem({ id, quantidade, queijo, bacon })`: calcula um item com extras por unidade.
- `calcularTotalCarrinho(itens)`: **subtotal dos produtos**, sem taxa. `atualizarResumo()` soma `obterTaxa(bairro)` para mostrar o total final.
- `obterTaxa(bairro)`: `centro` → 5; `sao-judas` → 7; `retirada` → 0; desconhecido → `null`.
- `formatarMoeda(valor)`, `validarFormulario(dados, total)` e `criarLinkWhatsApp(telefone, mensagem)`.
- `validarCarrinho({versao:1, itens})`, `adicionarItem(itens, novo)` e `chaveItem(item)` são complementos prontos; adicionar devolve uma cópia ou lança erro, sem alterar a lista original.
- `criarArmazenamento(acessar)` devolve `chave`, `carregar()`, `salvar(itens)`, `esvaziar()`.
- `carregar()` devolve `{itens, aviso}`; gravação/remoção com erro lançam uma mensagem orientativa.
- `validarRascunho(valor)` permanece somente como exemplo compatível do formato antigo de um produto; não é usado pelo carrinho atual.

IDs fixos do Carrinho: `nome`, `bairro`, `pagamento`, `troco`, `formulario`, `mensagem`, `revisar`, `whatsapp`, `subtotal`, `total`, `taxa`.

No Cardápio os campos têm IDs como `quantidade-brasa-bacon`, `queijo-brasa-bacon`, `bacon-brasa-bacon`, e botão `adicionar-brasa-bacon`. Troque o sufixo pelo ID do produto. No Carrinho, IDs como `quantidade-item-0` e `remover-item-0` usam a posição da linha. O campo genérico `quantidade` de um exemplo reduzido não é um seletor do catálogo completo.

## 5. Armazenamento e privacidade

`localStorage` é memória **deste navegador**, não conta, banco de dados nem pedido registrado na loja. A única chave atual é `burgerflow-oficina-carrinho-v1`:

```json
{"versao":1,"itens":[{"id":"brasa-bacon","quantidade":2,"queijo":true,"bacon":false}]}
```

Só IDs, quantidades e dois booleanos de extras são persistidos. **Nome, endereço/bairro, pagamento, troco e preços nunca são salvos.** O formato é validado estritamente: IDs desconhecidos, dados extras, duplicatas, tipos errados e quantidades fora do limite são ignorados com aviso. A antiga chave `burgerflow-oficina-rascunho-v1` não é lida nem apagada.

A adição e as alterações só anunciam sucesso após gravar **e ler de volta**. Se o armazenamento for negado, a alteração não é confirmada: leia a orientação de permissões/servidor local, não presuma que os itens passaram para a próxima página. Esvaziar remove só a chave própria, nunca usa `localStorage.clear()`.

**Arquivos locais (`file:`):** o projeto abre por duplo clique e foi exercitado no Chrome local. Outros navegadores/perfis podem bloquear ou separar o armazenamento entre arquivos; não é possível garantir esse comportamento em todos eles. A interface avisa. Se as escolhas desaparecerem entre páginas, peça ajuda ao professor para liberar armazenamento ou abrir a pasta por um servidor local. Não é preciso instalar npm/build. Para o professor com Python disponível: `python3 -m http.server 8000 --bind 127.0.0.1`, nesta pasta, e abrir `http://127.0.0.1:8000/index.html`. Pare com Ctrl+C. Não há backend de pedidos nesse servidor de arquivos.

## 6. Se algo não funcionar

- Mudou e não apareceu? Salve o arquivo certo no VS Code e recarregue sua cópia no navegador.
- Sem imagem/estilo? Extraia a pasta inteira e preserve as subpastas.
- Não adiciona? Confira inteiro de 1 a 10, limite da combinação e aviso de armazenamento.
- Carrinho vazio? Volte ao Cardápio. Se já adicionou, leia a limitação de `file:` acima.
- Troco sumiu? É esperado com Pix/cartão. O valor é limpo.
- Nome/pagamento sumiram após recarregar? É proteção de privacidade.
- WhatsApp desativado? Preencha tudo e revise novamente; alterações invalidam a prévia.

## 7. Testes — complemento do professor

Na pasta `Projeto pronto`:

```text
node --test
python3 tests/validar_html.py
node tests/capturar.js
```

`node --check` deve ser executado em cada JS de `js/` e `tests/`. Node é usado somente para testes, não para abrir o site. Não há dependências npm. O teste real usa Chrome headless isolado, navega entre **documentos diferentes** por `file:` e HTTP, valida DOM gerado e intercepta `window.open`: nenhuma mensagem real é enviada. `CHROME_BIN` permite indicar outro executável; sem Chrome o teste anuncia que foi ignorado. Nesta entrega não houve testes ignorados.

`tests/capturar.js` usa Node com WebSocket nativo (Node 22+), Chrome e perfil isolado para gerar as seis capturas desktop/celular, incluindo carrinho preenchido e revisado. Não clica no WhatsApp. Os perfis temporários são removidos. `--no-sandbox` só pertence ao laboratório isolado, não é orientação para navegar na internet.

Consulte `VERIFICACAO.md` e `tests/evidencias/testes.txt` para o resultado real. Originais SENAC fora desta oficina não foram modificados. Sem banco, autenticação, servidor de pedidos, processamento de pagamento ou confirmação automática.
