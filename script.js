/* ==========================================================================
   Prospect Local — script.js
   Protótipo 100% front-end, sem backend e sem bibliotecas externas.

   IDs/classes esperados no HTML (ajuste se o seu markup usar outros nomes):
   - #searchBtn        -> botão "Buscar Empresas"
   - #companyList       -> container onde os cards das empresas serão inseridos
   - #modalOverlay       -> overlay/fundo do modal (clique fora fecha)
   - #modal          -> caixa do modal
   - #closeModalBtn      -> botão "Fechar" dentro do modal
   - #modalName, #modalCategory, #modalCity, #modalPhone,
    #modalWebsite, #modalInstagram, #modalFacebook,
    #modalAddress, #modalScore        -> campos exibidos no modal
   - #loadingOverlay      -> indicador de carregamento da busca
   - #toastContainer      -> container onde os toasts serão empilhados

   Se algum elemento não existir no HTML, o script cria um fallback simples
   automaticamente para não quebrar a demonstração.
   ========================================================================== */

(function () {
 "use strict";

 /* ------------------------------------------------------------------ *
  * 1. DADOS FICTÍCIOS
  * ------------------------------------------------------------------ */

 var NOMES = [
  "Padaria Pão Dourado", "Auto Peças Silva", "Clínica OdontoVida",
  "Studio Beleza & Cia", "Mercado Bom Preço", "Academia PowerFit",
  "Pet Shop Amigo Fiel", "Restaurante Sabor Caseiro", "Escritório Contábil Lima",
  "Loja Moda Urbana", "Imobiliária Novo Lar", "Oficina Mecânica Turbo",
  "Farmácia Vida Plena", "Barbearia Corte Fino", "Distribuidora Central"
 ];

 var CATEGORIAS = [
  "Alimentação", "Automotivo", "Saúde", "Beleza e Estética",
  "Varejo", "Fitness", "Pet Shop", "Serviços Contábeis",
  "Moda", "Imóveis", "Manutenção", "Farmácia", "Distribuição"
 ];

 var CIDADES = [
  "Brasília - DF", "São Paulo - SP", "Rio de Janeiro - RJ",
  "Belo Horizonte - MG", "Curitiba - PR", "Porto Alegre - RS",
  "Salvador - BA", "Fortaleza - CE", "Recife - PE", "Goiânia - GO"
 ];

 var RUAS = [
  "Rua das Flores", "Av. Central", "Rua 24 de Maio", "Av. Paulista",
  "Rua das Palmeiras", "Quadra 12", "Rua do Comércio", "Av. Brasil",
  "Rua Sete de Setembro", "Alameda dos Ipês"
 ];

 function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
 }

 function itemAleatorio(lista) {
  return lista[aleatorio(0, lista.length - 1)];
 }

 function gerarTelefone() {
  var ddd = aleatorio(11, 99);
  var parte1 = aleatorio(90000, 99999);
  var parte2 = aleatorio(1000, 9999);
  return "(" + ddd + ") " + parte1 + "-" + parte2;
 }

 function slugify(texto) {
  return texto
   .toLowerCase()
   .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9]+/g, "");
 }

 function gerarEmpresa(id) {
  var nome = NOMES[id % NOMES.length];
  var slug = slugify(nome);
  var score = aleatorio(0, 100);

  return {
   id: id,
   nome: nome,
   categoria: itemAleatorio(CATEGORIAS),
   cidade: itemAleatorio(CIDADES),
   telefone: gerarTelefone(),
   website: "www." + slug + ".com.br",
   instagram: "@" + slug,
   facebook: "facebook.com/" + slug,
   endereco: itemAleatorio(RUAS) + ", " + aleatorio(10, 999),
   score: score
  };
 }

 function gerarEmpresas(quantidade) {
  var lista = [];
  for (var i = 1; i <= quantidade; i++) {
   lista.push(gerarEmpresa(i));
  }
  return lista;
 }

 var QUANTIDADE_MINIMA = 12; // mínimo exigido: 10
 var empresas = gerarEmpresas(QUANTIDADE_MINIMA);

 /* ------------------------------------------------------------------ *
  * 2. UTILITÁRIOS DE COR DE SCORE
  * ------------------------------------------------------------------ */

 function corDoScore(score) {
  if (score >= 80) return { classe: "badge--success", label: "Alto" };
  if (score >= 50) return { classe: "badge--warning", label: "Médio" };
  return { classe: "badge--danger", label: "Baixo" };
 }

 /* ------------------------------------------------------------------ *
  * 3. FALLBACKS DE ELEMENTOS (garante que a demo funcione mesmo que o
  *  HTML não tenha todos os elementos previstos)
  * ------------------------------------------------------------------ */

 function garantirElemento(id, criarFn) {
  var el = document.getElementById(id);
  if (!el) {
   el = criarFn();
   el.id = id;
   document.body.appendChild(el);
  }
  return el;
 }

 var companyList = garantirElemento("companyList", function () {
  var div = document.createElement("div");
  div.className = "company-grid";
  return div;
 });

 var toastContainer = garantirElemento("toastContainer", function () {
  var div = document.createElement("div");
  div.className = "toast-container";
  return div;
 });

 var loadingOverlay = garantirElemento("loadingOverlay", function () {
  var div = document.createElement("div");
  div.className = "loading-overlay";
  div.innerText = "Buscando empresas...";
  return div;
 });

 var modalOverlay = garantirElemento("modalOverlay", function () {
  var div = document.createElement("div");
  div.className = "modal-overlay";
  div.style.display = "none";
  return div;
 });

 var modal = document.getElementById("modal");
 if (!modal) {
  modal = document.createElement("div");
  modal.id = "modal";
  modal.className = "modal";
  modal.innerHTML =
   '<div class="modal__header">' +
   ' <h3 id="modalName"></h3>' +
   ' <button id="closeModalBtn" class="modal__close" aria-label="Fechar">&times;</button>' +
   '</div>' +
   '<div class="modal__body">' +
   ' <dl class="modal-detalhes-lista">' +
   '  <dt>Categoria</dt><dd id="modalCategory"></dd>' +
   '  <dt>Cidade</dt><dd id="modalCity"></dd>' +
   '  <dt>Telefone</dt><dd id="modalPhone"></dd>' +
   '  <dt>Website</dt><dd id="modalWebsite"></dd>' +
   '  <dt>Instagram</dt><dd id="modalInstagram"></dd>' +
   '  <dt>Facebook</dt><dd id="modalFacebook"></dd>' +
   '  <dt>Endereço</dt><dd id="modalAddress"></dd>' +
   '  <dt>Score</dt><dd><span id="modalScore" class="badge"></span></dd>' +
   ' </dl>' +
   '</div>';
  modalOverlay.appendChild(modal);
 }

 if (!modalOverlay.contains(modal)) {
  modalOverlay.appendChild(modal);
 }

 var closeModalBtn = document.getElementById("closeModalBtn");

 var searchBtn = document.getElementById("searchBtn");
 if (!searchBtn) {
  searchBtn = document.createElement("button");
  searchBtn.id = "searchBtn";
  searchBtn.className = "btn btn-primary";
  searchBtn.innerText = "Buscar Empresas";
  document.body.insertBefore(searchBtn, document.body.firstChild);
 }

 /* ------------------------------------------------------------------ *
  * 4. TOASTS
  * ------------------------------------------------------------------ */

 function mostrarToast(mensagem, tipo) {
  tipo = tipo || "info"; // "success" | "error" | "info"

  var toast = document.createElement("div");
  toast.innerText = mensagem;
  toast.className = "toast toast--" + tipo;
  toast.style.opacity = "0";
  toast.style.transform = "translateY(-10px)";

  toastContainer.appendChild(toast);

  // força reflow para animar a entrada
  requestAnimationFrame(function () {
   toast.style.opacity = "1";
   toast.style.transform = "translateY(0)";
  });

  setTimeout(function () {
   toast.style.opacity = "0";
   toast.style.transform = "translateY(-10px)";
   setTimeout(function () {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
   }, 300);
  }, 3000);
 }

 /* ------------------------------------------------------------------ *
  * 5. RENDERIZAÇÃO DOS CARDS DE EMPRESA
  * ------------------------------------------------------------------ */

 function criarCardEmpresa(empresa) {
  var scoreInfo = corDoScore(empresa.score);

  var card = document.createElement("div");
  card.className = "company-card";
  card.setAttribute("data-id", empresa.id);

  card.innerHTML =
   '<h3 class="company-card__name">' + empresa.nome + '</h3>' +
   '<p class="company-card__meta">' + empresa.categoria + ' • ' + empresa.cidade + '</p>' +
   '<span class="badge ' + scoreInfo.classe + '">Score: ' + empresa.score + ' (' + scoreInfo.label + ')</span>';

  card.addEventListener("click", function () {
   abrirModal(empresa);
  });

  return card;
 }

 function renderizarEmpresas(lista) {
  companyList.innerHTML = "";
  lista.forEach(function (empresa) {
   companyList.appendChild(criarCardEmpresa(empresa));
  });
 }

 /* ------------------------------------------------------------------ *
  * 6. MODAL: abrir / fechar
  * ------------------------------------------------------------------ */

 function abrirModal(empresa) {
  var scoreInfo = corDoScore(empresa.score);

  setTextoSeExistir("modalName", empresa.nome);
  setTextoSeExistir("modalCategory", empresa.categoria);
  setTextoSeExistir("modalCity", empresa.cidade);
  setTextoSeExistir("modalPhone", empresa.telefone);
  setTextoSeExistir("modalWebsite", empresa.website);
  setTextoSeExistir("modalInstagram", empresa.instagram);
  setTextoSeExistir("modalFacebook", empresa.facebook);
  setTextoSeExistir("modalAddress", empresa.endereco);

  var modalScoreEl = document.getElementById("modalScore");
  if (modalScoreEl) {
   modalScoreEl.innerText = empresa.score + " (" + scoreInfo.label + ")";
   modalScoreEl.className = "badge " + scoreInfo.classe;
  }

  modalOverlay.removeAttribute("hidden");
  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
 }

 function fecharModal() {
  modalOverlay.style.display = "none";
  modalOverlay.setAttribute("hidden", "");
  document.body.style.overflow = "";
 }

 function setTextoSeExistir(id, valor) {
  var el = document.getElementById(id);
  if (el) el.innerText = valor;
 }

 // Fechar pelo botão
 document.addEventListener("click", function (event) {
  if (event.target && event.target.id === "closeModalBtn") {
   fecharModal();
  }
 });

 // Fechar clicando fora do modal (no overlay, fora da caixa)
 modalOverlay.addEventListener("click", function (event) {
  if (event.target === modalOverlay) {
   fecharModal();
  }
 });

 // Fechar com tecla ESC (extra, não quebra nada se não usado)
 document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modalOverlay.style.display === "flex") {
   fecharModal();
  }
 });

 /* ------------------------------------------------------------------ *
  * 7. SIMULAÇÃO DE BUSCA
  * ------------------------------------------------------------------ */

 function simularBusca() {
  loadingOverlay.style.display = "flex";
  searchBtn.disabled = true;

  setTimeout(function () {
   // Gera um novo conjunto de empresas fictícias a cada busca
   empresas = gerarEmpresas(QUANTIDADE_MINIMA);
   renderizarEmpresas(empresas);

   loadingOverlay.style.display = "none";
   searchBtn.disabled = false;

   mostrarToast("Consulta concluída", "success");
  }, 2000);
 }

 searchBtn.addEventListener("click", simularBusca);

 /* ------------------------------------------------------------------ *
  * 8. INICIALIZAÇÃO
  * ------------------------------------------------------------------ */

 document.addEventListener("DOMContentLoaded", function () {
  renderizarEmpresas(empresas);
 });

 // Caso o script seja carregado após o DOMContentLoaded já ter disparado
 if (document.readyState === "interactive" || document.readyState === "complete") {
  renderizarEmpresas(empresas);
 }

})();
