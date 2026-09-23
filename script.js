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
  if (score >= 80) return { classe: "score-verde", cor: "#2e7d32", label: "Alto" };
  if (score >= 50) return { classe: "score-amarelo", cor: "#f9a825", label: "Médio" };
  return { classe: "score-vermelho", cor: "#c62828", label: "Baixo" };
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
  div.style.display = "grid";
  div.style.gridTemplateColumns = "repeat(auto-fill, minmax(260px, 1fr))";
  div.style.gap = "16px";
  div.style.padding = "16px";
  return div;
 });

 var toastContainer = garantirElemento("toastContainer", function () {
  var div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = "16px";
  div.style.right = "16px";
  div.style.zIndex = "9999";
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.gap = "8px";
  return div;
 });

 var loadingOverlay = garantirElemento("loadingOverlay", function () {
  var div = document.createElement("div");
  div.style.position = "fixed";
  div.style.inset = "0";
  div.style.background = "rgba(0,0,0,0.45)";
  div.style.display = "none";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.zIndex = "9998";
  div.style.color = "#fff";
  div.style.fontSize = "18px";
  div.style.fontFamily = "sans-serif";
  div.innerText = "Buscando empresas...";
  return div;
 });

 var modalOverlay = garantirElemento("modalOverlay", function () {
  var div = document.createElement("div");
  div.style.position = "fixed";
  div.style.inset = "0";
  div.style.background = "rgba(0,0,0,0.55)";
  div.style.display = "none";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.zIndex = "10000";
  return div;
 });

 var modal = document.getElementById("modal");
 if (!modal) {
  modal = document.createElement("div");
  modal.id = "modal";
  modal.style.background = "#fff";
  modal.style.borderRadius = "12px";
  modal.style.padding = "24px";
  modal.style.maxWidth = "420px";
  modal.style.width = "90%";
  modal.style.fontFamily = "sans-serif";
  modal.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
  modal.innerHTML =
   '<div style="display:flex;justify-content:space-between;align-items:center;">' +
   ' <h2 id="modalName" style="margin:0;font-size:20px;"></h2>' +
   ' <button id="closeModalBtn" aria-label="Fechar" style="border:none;background:transparent;font-size:20px;cursor:pointer;">&times;</button>' +
   '</div>' +
   '<p><strong>Categoria:</strong> <span id="modalCategory"></span></p>' +
   '<p><strong>Cidade:</strong> <span id="modalCity"></span></p>' +
   '<p><strong>Telefone:</strong> <span id="modalPhone"></span></p>' +
   '<p><strong>Website:</strong> <span id="modalWebsite"></span></p>' +
   '<p><strong>Instagram:</strong> <span id="modalInstagram"></span></p>' +
   '<p><strong>Facebook:</strong> <span id="modalFacebook"></span></p>' +
   '<p><strong>Endereço:</strong> <span id="modalAddress"></span></p>' +
   '<p><strong>Score:</strong> <span id="modalScore" style="font-weight:bold;padding:2px 10px;border-radius:12px;color:#fff;"></span></p>';
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
  searchBtn.innerText = "Buscar Empresas";
  searchBtn.style.margin = "16px";
  searchBtn.style.padding = "10px 20px";
  searchBtn.style.cursor = "pointer";
  document.body.insertBefore(searchBtn, document.body.firstChild);
 }

 /* ------------------------------------------------------------------ *
  * 4. TOASTS
  * ------------------------------------------------------------------ */

 function mostrarToast(mensagem, tipo) {
  tipo = tipo || "info"; // "success" | "error" | "info"

  var cores = {
   success: "#2e7d32",
   error: "#c62828",
   info: "#1565c0"
  };

  var toast = document.createElement("div");
  toast.innerText = mensagem;
  toast.style.background = cores[tipo] || cores.info;
  toast.style.color = "#fff";
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "8px";
  toast.style.fontFamily = "sans-serif";
  toast.style.fontSize = "14px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(-10px)";
  toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";

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
  card.style.border = "1px solid #e0e0e0";
  card.style.borderRadius = "10px";
  card.style.padding = "16px";
  card.style.cursor = "pointer";
  card.style.fontFamily = "sans-serif";
  card.style.background = "#fff";
  card.style.transition = "transform 0.15s ease, box-shadow 0.15s ease";

  card.addEventListener("mouseenter", function () {
   card.style.transform = "translateY(-2px)";
   card.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
  });
  card.addEventListener("mouseleave", function () {
   card.style.transform = "translateY(0)";
   card.style.boxShadow = "none";
  });

  card.innerHTML =
   '<h3 style="margin:0 0 6px;font-size:16px;">' + empresa.nome + '</h3>' +
   '<p style="margin:0 0 4px;color:#555;font-size:13px;">' + empresa.categoria + ' • ' + empresa.cidade + '</p>' +
   '<span style="display:inline-block;margin-top:6px;padding:2px 10px;border-radius:12px;color:#fff;font-size:12px;font-weight:bold;background:' +
   scoreInfo.cor + ';">Score: ' + empresa.score + ' (' + scoreInfo.label + ')</span>';

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
   modalScoreEl.style.background = scoreInfo.cor;
  }

  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
 }

 function fecharModal() {
  modalOverlay.style.display = "none";
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
