/* ============================================================
   PROSPECT LOCAL
   script.js
   ============================================================ */

"use strict";


/* ============================================================
   DADOS
   ============================================================ */

const empresas = [

    {
        id: 1,
        nome: "Padaria Pão Dourado",
        categoria: "Restaurante",
        cidade: "São Paulo",
        telefone: "(11) 3456-7890",
        website: "Não possui",
        instagram: "@paodouradosp",
        facebook: "facebook.com/paodouradosp",
        endereco: "Rua das Flores, 123 - São Paulo, SP",
        score: 82
    },

    {
        id: 2,
        nome: "Salão Beleza Real",
        categoria: "Salão de Beleza",
        cidade: "Rio de Janeiro",
        telefone: "(21) 2345-6789",
        website: "Não possui",
        instagram: "@belezareal",
        facebook: "facebook.com/belezareal",
        endereco: "Rua das Palmeiras, 456 - Rio de Janeiro, RJ",
        score: 75
    },

    {
        id: 3,
        nome: "Oficina do Zé",
        categoria: "Oficina Mecânica",
        cidade: "Belo Horizonte",
        telefone: "(31) 3344-5566",
        website: "Não possui",
        instagram: "@oficinad oze",
        facebook: "facebook.com/oficinadoze",
        endereco: "Av. Central, 789 - Belo Horizonte, MG",
        score: 91
    },

    {
        id: 4,
        nome: "Boutique Elegance",
        categoria: "Loja de Roupas",
        cidade: "Curitiba",
        telefone: "(41) 3322-1100",
        website: "Possui",
        instagram: "@boutiqueelegance",
        facebook: "facebook.com/boutiqueelegance",
        endereco: "Rua do Comércio, 100 - Curitiba, PR",
        score: 45
    },

    {
        id: 5,
        nome: "Clínica Vida Saudável",
        categoria: "Clínica",
        cidade: "Brasília",
        telefone: "(61) 3987-6543",
        website: "Não possui",
        instagram: "@vidasaudavel",
        facebook: "facebook.com/vidasaudavel",
        endereco: "Quadra 12, 200 - Brasília, DF",
        score: 88
    },

    {
        id: 6,
        nome: "Pet Shop Amigo Fiel",
        categoria: "Pet Shop",
        cidade: "São Paulo",
        telefone: "(11) 4455-6677",
        website: "Não possui",
        instagram: "@amigofiel",
        facebook: "facebook.com/amigofiel",
        endereco: "Av. Brasil, 350 - São Paulo, SP",
        score: 70
    },

    {
        id: 7,
        nome: "Restaurante Sabor da Terra",
        categoria: "Restaurante",
        cidade: "Rio de Janeiro",
        telefone: "(21) 3211-9900",
        website: "Não possui",
        instagram: "@sabordaterra",
        facebook: "facebook.com/sabordaterra",
        endereco: "Rua 24 de Maio, 400 - Rio de Janeiro, RJ",
        score: 63
    },

    {
        id: 8,
        nome: "Studio Corte & Cia",
        categoria: "Salão de Beleza",
        cidade: "Belo Horizonte",
        telefone: "(31) 3200-1122",
        website: "Possui",
        instagram: "@cortecia",
        facebook: "facebook.com/cortecia",
        endereco: "Rua das Flores, 550 - Belo Horizonte, MG",
        score: 38
    },

    {
        id: 9,
        nome: "Auto Center Rodas Novas",
        categoria: "Oficina Mecânica",
        cidade: "Curitiba",
        telefone: "(41) 3455-8899",
        website: "Não possui",
        instagram: "@rodasnovas",
        facebook: "facebook.com/rodasnovas",
        endereco: "Av. Brasil, 600 - Curitiba, PR",
        score: 79
    },

    {
        id: 10,
        nome: "Clínica Odontológica Sorriso",
        categoria: "Clínica",
        cidade: "Brasília",
        telefone: "(61) 3222-4433",
        website: "Não possui",
        instagram: "@sorrisoclinica",
        facebook: "facebook.com/sorrisoclinica",
        endereco: "Quadra 12, 700 - Brasília, DF",
        score: 85
    }

];


/* ============================================================
   ELEMENTOS DO HTML
   ============================================================ */

const tabelaCorpo =
    document.getElementById("tabela-corpo");

const buscaForm =
    document.getElementById("busca-form");

const buscaInput =
    document.getElementById("busca-input");

const filtrosForm =
    document.getElementById("filtros-form");

const filtroCidade =
    document.getElementById("filtro-cidade");

const filtroCategoria =
    document.getElementById("filtro-categoria");

const filtroScore =
    document.getElementById("filtro-score-minimo");

const modal =
    document.getElementById("modal-detalhes");

const modalFechar =
    document.getElementById("modal-fechar");

const toastContainer =
    document.getElementById("toast-container");


/* ============================================================
   FUNÇÃO PARA IDENTIFICAR O SCORE
   ============================================================ */

function obterClasseScore(score) {

    if (score >= 80) {

        return "score-alto";

    }

    if (score >= 50) {

        return "score-medio";

    }

    return "score-baixo";
}


/* ============================================================
   ATUALIZAR DASHBOARD
   ============================================================ */

function atualizarDashboard(lista) {

    const empresasAnalisadas =
        document.getElementById(
            "card-empresas-analisadas"
        );

    const empresasSemWebsite =
        document.getElementById(
            "card-empresas-sem-website"
        );

    const scoreMedio =
        document.getElementById(
            "card-score-medio"
        );

    const cidadesConsultadas =
        document.getElementById(
            "card-cidades-consultadas"
        );


    /* Total */

    empresasAnalisadas.textContent =
        lista.length;


    /* Empresas sem website */

    const semWebsite =
        lista.filter(function (empresa) {

            return empresa.website === "Não possui";

        }).length;


    empresasSemWebsite.textContent =
        semWebsite;


    /* Score médio */

    if (lista.length > 0) {

        const soma =
            lista.reduce(function (total, empresa) {

                return total + empresa.score;

            }, 0);

        const media =
            Math.round(soma / lista.length);

        scoreMedio.textContent =
            media;

    } else {

        scoreMedio.textContent = "0";

    }


    /* Cidades */

    const cidades =
        new Set(
            lista.map(function (empresa) {

                return empresa.cidade;

            })
        );

    cidadesConsultadas.textContent =
        cidades.size;
}


/* ============================================================
   RENDERIZAR TABELA
   ============================================================ */

function renderizarTabela(lista) {

    tabelaCorpo.innerHTML = "";


    if (lista.length === 0) {

        const linha =
            document.createElement("tr");

        linha.innerHTML = `
            <td colspan="7" style="text-align:center;">
                Nenhuma empresa encontrada.
            </td>
        `;

        tabelaCorpo.appendChild(linha);

        atualizarDashboard([]);

        return;
    }


    lista.forEach(function (empresa) {

        const linha =
            document.createElement("tr");


        const classeScore =
            obterClasseScore(
                empresa.score
            );


        linha.innerHTML = `

            <td>
                <strong>
                    ${empresa.nome}
                </strong>
            </td>

            <td>
                ${empresa.categoria}
            </td>

            <td>
                ${empresa.cidade}
            </td>

            <td>
                ${empresa.telefone}
            </td>

            <td>
                ${empresa.website}
            </td>

            <td>
                <span class="score ${classeScore}">
                    ${empresa.score}
                </span>
            </td>

            <td>

                <button
                    type="button"
                    class="btn-detalhes"
                    data-id="${empresa.id}"
                >
                    Ver Detalhes
                </button>

            </td>

        `;


        tabelaCorpo.appendChild(linha);

    });


    atualizarDashboard(lista);
}


/* ============================================================
   ABRIR MODAL
   ============================================================ */

function abrirModal(empresa) {

    document.getElementById(
        "modal-nome"
    ).textContent = empresa.nome;


    document.getElementById(
        "modal-categoria"
    ).textContent = empresa.categoria;


    document.getElementById(
        "modal-cidade"
    ).textContent = empresa.cidade;


    document.getElementById(
        "modal-telefone"
    ).textContent = empresa.telefone;


    document.getElementById(
        "modal-endereco"
    ).textContent = empresa.endereco;


    document.getElementById(
        "modal-instagram"
    ).textContent = empresa.instagram;


    document.getElementById(
        "modal-facebook"
    ).textContent = empresa.facebook;


    document.getElementById(
        "modal-website"
    ).textContent = empresa.website;


    document.getElementById(
        "modal-score"
    ).textContent = empresa.score;


    modal.hidden = false;

    document.body.style.overflow =
        "hidden";
}


/* ============================================================
   FECHAR MODAL
   ============================================================ */

function fecharModal() {

    modal.hidden = true;

    document.body.style.overflow =
        "";
}


modalFechar.addEventListener(
    "click",
    fecharModal
);


modal.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {

            fecharModal();

        }

    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !modal.hidden
        ) {

            fecharModal();

        }

    }
);


/* ============================================================
   CLIQUE NO BOTÃO "VER DETALHES"
   ============================================================ */

tabelaCorpo.addEventListener(
    "click",
    function (event) {

        const botao =
            event.target.closest(
                ".btn-detalhes"
            );


        if (!botao) {

            return;

        }


        const id =
            Number(
                botao.dataset.id
            );


        const empresa =
            empresas.find(
                function (empresa) {

                    return empresa.id === id;

                }
            );


        if (empresa) {

            abrirModal(empresa);

        }

    }
);


/* ============================================================
   TOAST
   ============================================================ */

function mostrarToast(
    mensagem,
    tipo = "sucesso"
) {

    const toast =
        document.createElement("div");


    toast.className =
        `toast toast-${tipo}`;


    toast.textContent =
        mensagem;


    toastContainer.appendChild(
        toast
    );


    setTimeout(
        function () {

            toast.remove();

        },
        3000
    );
}


/* ============================================================
   APLICAR FILTROS
   ============================================================ */

function aplicarFiltros() {

    const texto =
        buscaInput.value
            .trim()
            .toLowerCase();


    const cidade =
        filtroCidade.value;


    const categoria =
        filtroCategoria.value;


    const scoreMinimo =
        Number(
            filtroScore.value
        ) || 0;


    const resultado =
        empresas.filter(
            function (empresa) {


                /* Busca */

                const correspondeBusca =
                    texto === "" ||

                    empresa.nome
                        .toLowerCase()
                        .includes(texto) ||

                    empresa.cidade
                        .toLowerCase()
                        .includes(texto) ||

                    empresa.categoria
                        .toLowerCase()
                        .includes(texto);


                /* Cidade */

                const correspondeCidade =
                    cidade === "" ||

                    empresa.cidade === cidade;


                /* Categoria */

                const correspondeCategoria =
                    categoria === "" ||

                    empresa.categoria === categoria;


                /* Score */

                const correspondeScore =
                    empresa.score >= scoreMinimo;


                return (
                    correspondeBusca &&
                    correspondeCidade &&
                    correspondeCategoria &&
                    correspondeScore
                );

            }
        );


    renderizarTabela(resultado);

    mostrarToast(
        `${resultado.length} empresa(s) encontrada(s).`,
        "sucesso"
    );
}


/* ============================================================
   FORMULÁRIO DE BUSCA
   ============================================================ */

buscaForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        aplicarFiltros();

    }
);


/* ============================================================
   FORMULÁRIO DE FILTROS
   ============================================================ */

filtrosForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        aplicarFiltros();

    }
);


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderizarTabela(
            empresas
        );

    }
);
