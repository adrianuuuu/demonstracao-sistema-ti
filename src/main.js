// frontend/src/main.js 
// Simple SPA loader: carrega sidebar + header + páginas (fetch local files)
const API_BASE = 'https://sistema-ti-backend.onrender.com';

import { getDashboardStats, getUltimosChamados, getChamadosPorTipo } from "./services/dashboardService.js";
import { getChamados, getChamado } from "./services/chamadosService.js";
import { getUsuariosAgrupados } from "./services/usuariosService.js";
import { updateChamado } from "./services/chamadosService.js";
import { arquivar, restaurar } from "./services/chamadosService.js";
import { removerChamado } from "./services/chamadosService.js";
import { getAnotacoes, addAnotacao, removeAnotacao } from "./services/anotacoesService.js";
import { criarChamado } from "../js/mock/api.js";
import { listarArquivadosPorData, listarDiasComArquivados } from "../js/mock/api.js";
import { listarDepartamentos, listarEquipamentos } from "../js/mock/api.js";
import { criarEquipamento } from "../js/mock/api.js";
import { atualizarEquipamento, deletarEquipamento } from "../js/mock/api.js";
import { getUsuarioLogado } from '../js/mock/api.js';


// 🎨 CORES PADRÃO DO DASHBOARD (GLOBAL)
const CORES_CHAMADOS = [
    '#3b82f6', // azul
    '#6366f1', // indigo
    '#8b5cf6', // roxo
    '#06b6d4', // cyan
    '#10b981', // verde
    '#f59e0b', // amarelo
    '#ef4444'  // vermelho
];

function getAuthHeaders(extra = {}) {
    const token = localStorage.getItem('token');

    return {
        ...extra,
        Authorization: `Bearer ${token}`
    };
}

function getUsuario() {
    const user = localStorage.getItem("usuario");
    if (!user) return null;
    return JSON.parse(user);
}


function bloquearRotasPorPermissao() {
    const usuarioString = localStorage.getItem("usuario");

    if (!usuarioString) return;

    let usuario;

    try {
        usuario = JSON.parse(usuarioString);
    } catch (e) {
        console.error("Erro ao parsear usuário:", e);
        return;
    }

    // admin pode tudo
    if (usuario.nivel === "admin") return;

    const rota = location.hash;

    const rotasAdmin = [
        "#/dashboard",
        "#/inventario",
        "#/usuarios"
    ];

    if (rotasAdmin.some(r => rota.startsWith(r))) {
        alert("Você não tem permissão para acessar esta área.");
        location.hash = "#/chamados";
    }
}

// ===============================
// CONTROLLER GLOBAL - ATRIBUIR A
// ===============================
let atribuirController = {
    input: null,
    dropdown: null,
    aberto: false,
    tecnicoId: null   // 🔥 ESSENCIAL
};

let filtroInventario = {
    texto: '',
    tipo: '',
    status: '',
    condicao: ''
};

const MAPA_ATRIBUICAO = {
    1: { grupo: 'ANALISTAS', nome: 'Idalécio Diógenes' },
    2: { grupo: 'TÉCNICOS', nome: 'Adriano Mesquita' },
    3: { grupo: 'TÉCNICOS', nome: 'Bruna Paiva' },
    4: { grupo: 'TÉCNICOS', nome: 'Wesley Sousa' }
};

async function fetchText(path) {
    const r = await fetch(path);
    return await r.text();
}

async function loadLayout() {
    const app = document.getElementById('app');

    // 🚫 Se não existir o container #app, não é página do sistema
    if (!app) {
        return;
    }

    const sidebarHtml = await fetchText('./src/components/sidebar.html');

    // criar wrapper com a classe flex para garantir layout: sidebar + main
    const wrapper = document.createElement('div');
    wrapper.id = 'app';
    wrapper.className = 'flex min-h-screen w-full overflow-x-hidden';

    // injetar sidebar + área principal
    wrapper.innerHTML =
        sidebarHtml +
        '<div id="main-area" class="flex-1 bg-slate-50 px-8 py-6"></div>';

    // substituir o node antigo (mantém o mesmo id "app")
    app.replaceWith(wrapper);
    window.appWrapper = wrapper;

    // configurar navegação da sidebar apenas se ela existir
    const sidebar = document.querySelector('aside');

    if (!sidebar) {
        return;
    }

    sidebar.addEventListener('click', (event) => {
        const link = event.target.closest('[data-link]');

        if (!link) {
            return;
        }

        event.preventDefault();
        location.hash = link.getAttribute('href');
    });
}

function aplicarPermissoesUI() {

    const usuario = getUsuario();
    if (!usuario) return;

    // se for admin → vê tudo
    if (usuario.nivel === 'admin') return;

    // se for usuário comum ↓↓↓

    // esconder dashboard
    const menuDashboard = document.querySelector('[data-menu="dashboard"]');
    if (menuDashboard) menuDashboard.remove();

    // esconder inventário
    const menuInventario = document.querySelector('[data-menu="inventario"]');
    if (menuInventario) menuInventario.remove();

    // esconder usuários
    const menuUsuarios = document.querySelector('[data-menu="usuarios"]');
    if (menuUsuarios) menuUsuarios.remove();

}

async function loadHeader(slot) {
    const headerHtml = await fetchText('./src/components/header.html');
    slot.innerHTML = headerHtml;
}

async function loadPage(path) {
    const mainArea = document.getElementById('main-area');
    let pagePath = './src/pages/dashboard.html';

    // 🔹 rota de detalhe do chamado
    if (path.startsWith('/chamados/')) {
        pagePath = './src/pages/chamado-detalhe.html';
    }
    else if (path.startsWith('/equipamentos/')) {
        pagePath = './src/pages/equipamento-detalhe.html';
    }
    // 🔹 rotas normais
    else {
        switch (path) {
            case '/chamados':
                pagePath = './src/pages/chamados.html';
                break;
            case '/inventario':
                pagePath = './src/pages/inventario.html';
                break;
            case '/novo-chamado':
                pagePath = './src/pages/novo-chamado.html';
                break;
            case '/tutoriais':
                pagePath = './src/pages/tutoriais.html';
                break;
            case '/usuarios':
                pagePath = './src/pages/usuarios.html';
                break;
            case '/configuracoes':
                pagePath = './src/pages/configuracoes.html';
                break;
            case '/arquivados':
                pagePath = './src/pages/arquivados.html';
                break;
            case '/novo-equipamento':
                pagePath = './src/pages/novo-equipamento.html';
                break;


            default:
                pagePath = './src/pages/dashboard.html';
        }
    }

    const html = await fetchText(pagePath);
    mainArea.innerHTML = html;
    if (path.startsWith('/chamados/')) {
        loadChamadoDetalhe();
    }

    if (path.startsWith('/equipamentos/')) {
        loadEquipamentoDetalhe();
    }

    const headerSlot = mainArea.querySelector('#header-slot');
    //if (headerSlot) await loadHeader(headerSlot);
    //updateHeaderByRoute(path);
    //initSidebarMobile();
    if (headerSlot) {
        await loadHeader(headerSlot);

        setTimeout(() => {
            initSidebarMobile();
        }, 100);
    }

    updateHeaderByRoute(path);

    // inits
    if (path === '/novo-chamado') initNovoChamado();
    if (path === '/chamados') initChamadosList();
    if (path === '/dashboard') initDashboard();
    if (path === '/arquivados') initArquivados();
    if (path === '/novo-equipamento') initNovoEquipamento();
    if (path === '/inventario') initInventario();
    if (path === '/configuracoes') initConfiguracoes();
}

function router() {

    bloquearRotasPorPermissao();

    const hash = location.hash.replace('#', '') || '/dashboard';
    // ===============================
    // 🔐 BLOQUEIO DE ROTAS POR PERMISSÃO
    // ===============================
    const usuario = getUsuario();

    if (!usuario) {
        location.href = "/index.html";
        return;
    }

    if (usuario.nivel !== 'admin') {

        if (
            hash.startsWith('/dashboard') ||
            hash.startsWith('/inventario') ||
            hash.startsWith('/usuarios') ||
            hash.startsWith('/arquivados')
        ) {
            location.hash = '/chamados';
            return;
        }

    }

    // atualizar active link
    document.querySelectorAll('[data-link]').forEach(a => {
        a.classList.toggle('bg-slate-700', a.getAttribute('href') === '#' + hash);
    });
    loadPage(hash);
}

async function initApp() {
    await loadLayout();
    // 🔥 MANTER BACKEND ACORDADO
    setInterval(() => {
        fetch(`${API_BASE}/health`).catch(() => { });
    }, 240000);

    // ===============================
    // APLICAR TEMA SALVO AO INICIAR
    // ===============================
    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "dark") {
        document.body.classList.add("dark");
    }


    // 🚫 se não existe main-area, estamos na tela de login
    const mainArea = document.getElementById('main-area');

    if (!mainArea) {
        return;
    }

    window.addEventListener('hashchange', router);
    router();
    aplicarPermissoesUI();
}

/*function initSidebarMobile() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("btn-menu-mobile");

  if (!sidebar || !toggleBtn) return;

  // 🔥 remove overlay antigo
  let overlay = document.getElementById("sidebar-overlay");
  if (overlay) overlay.remove();

  // 🔥 cria overlay
  overlay = document.createElement("div");
  overlay.id = "sidebar-overlay";
  //overlay.className = "fixed inset-0 bg-black/50 z-40 hidden";
  overlay.className = "fixed inset-0 bg-black/50 z-[998] hidden";
  document.body.appendChild(overlay);

  // 🔥 funções puras (SEM estado global)
  function openSidebar() {
    sidebar.classList.remove("translate-x-[-100%]");
    overlay.classList.remove("hidden");
  }

  function closeSidebar() {
    sidebar.classList.add("translate-x-[-100%]");
    overlay.classList.add("hidden");
  }

  function toggleSidebar() {
    const isClosed = sidebar.classList.contains("-translate-x-full");

    if (isClosed) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }

  // 🔥 limpa evento antigo corretamente
  toggleBtn.onclick = null;
  toggleBtn.addEventListener("click", toggleSidebar);

  overlay.onclick = closeSidebar;

  // 🔥 FECHAR AUTOMÁTICO AO MUDAR DE ROTA
  window.addEventListener("hashchange", () => {
    closeSidebar();
  });

  // 🔥 estado inicial SEMPRE fechado
  closeSidebar();
}*/
function initSidebarMobile() {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("btn-menu-mobile");

    if (!sidebar || !toggle) return;

    // cria overlay se não existir
    let overlay = document.getElementById("sidebar-overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "sidebar-overlay";
        document.body.appendChild(overlay);
    }

    // ABRIR / FECHAR
    toggle.onclick = () => {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    };

    // FECHAR AO CLICAR FORA
    overlay.onclick = () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    };

    // FECHAR AO CLICAR EM LINK
    sidebar.querySelectorAll("[data-link]").forEach(link => {
        link.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });
    });

    // estado inicial SEMPRE fechado
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

// Page inits
async function initNovoChamado() {


    const form = document.getElementById('form-novo-chamado');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titulo = document.getElementById('titulo-chamado').value.trim();

        if (!titulo) {
            alert('O título do chamado é obrigatório.');
            return;
        }

        // ===============================
        // VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS (FORÇADA)
        // ===============================
        const requiredFields = [
            'tipo-chamado',
            'prioridade-chamado',
            'titulo-chamado',
            'descricao-problema'
            //'nome-solicitante',
            //'telefone-contato',
            //'select-departamentos'
        ];

        let hasError = false;

        requiredFields.forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;

            if (!input.value || !input.value.trim()) {
                hasError = true;

                // 🔴 FORÇA BORDA VERMELHA
                input.style.borderColor = '#ef4444';
                input.style.borderWidth = '2px';

                // mensagem de erro
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('field-error')) {
                    const error = document.createElement('div');
                    error.className = 'field-error text-xs mt-1';
                    error.style.color = '#dc2626';
                    error.textContent = 'Preencha este campo';
                    input.after(error);
                }
            } else {
                input.style.borderColor = '';
                input.style.borderWidth = '';

                if (input.nextElementSibling?.classList.contains('field-error')) {
                    input.nextElementSibling.remove();
                }
            }

            // 🔁 REMOVE ERRO AO DIGITAR
            input.addEventListener('input', () => {
                input.style.borderColor = '';
                input.style.borderWidth = '';

                if (input.nextElementSibling?.classList.contains('field-error')) {
                    input.nextElementSibling.remove();
                }
            });
        });

        if (hasError) {
            return;
        }

        // ===============================
        // LIMPAR ERRO AO DIGITAR (CORRETO)
        // ===============================
        requiredFields.forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;

            input.addEventListener('input', () => {
                input.style.borderColor = '';
                input.style.borderWidth = '';

                if (input.nextElementSibling?.classList.contains('field-error')) {
                    input.nextElementSibling.remove();
                }
            });
        });

        const payload = {
            titulo,
            tipo: document.getElementById('tipo-chamado').value,
            prioridade: document.getElementById('prioridade-chamado').value,
            descricao: document.getElementById('descricao-problema').value,

            solicitante_nome: "Usuário Demo",

            // 🔥 ADICIONE ISSO
            telefone_contato: document.getElementById('telefone-contato')?.value || null,
            departamento_nome: document.getElementById('select-departamentos')?.selectedOptions[0]?.text || null,

            equipamento_tombamento: document.getElementById('tombamento-equip')?.value || null,

            tecnico: null,
            arquivado: false,
            created_at: new Date().toISOString()
        };

        try {
            const novoChamado = criarChamado(payload);

            if (!novoChamado) {
                alert('Erro ao criar chamado');
                return;
            }

            alert('Chamado criado com sucesso!');
            location.hash = '#/chamados';

        } catch (err) {
            console.error(err);
            alert('Erro ao criar chamado');
        }
    });
}

// ===============================
// CHAMADOS — LISTA COM PAGINAÇÃO
// ===============================
async function initChamadosList() {
    const lista = document.getElementById('lista-chamados');
    if (!lista) return;
    // ===============================
    // 🔐 ESCONDER ARQUIVADOS PARA USUÁRIO COMUM
    // ===============================
    const usuarioLogado = getUsuario();

    if (usuarioLogado && usuarioLogado.nivel !== 'admin') {
        const linkArquivados = document.querySelector('a[href="#/arquivados"]');
        if (linkArquivados) {
            linkArquivados.style.display = 'none';
        }
    }

    const btnPrev = document.getElementById('btn-prev-chamados');
    const btnNext = document.getElementById('btn-next-chamados');
    const selectLimit = document.getElementById('select-limit-chamados');

    let paginaAtual = 1;
    let limiteSalvo = localStorage.getItem('limite-chamados');
    let limite = limiteSalvo ? Number(limiteSalvo) : Number(selectLimit?.value || 10);
    let totalRegistros = 0;

    // aplicar valor salvo no select
    if (selectLimit && limiteSalvo) {
        selectLimit.value = limiteSalvo;
    }

    function carregarFiltroTecnicos() {
        const select = document.getElementById('filtro-tecnico');
        if (!select) return;

        const { analistas, tecnicos } = getUsuariosAgrupados();

        select.innerHTML = `
        <option value="">Técnicos / Analistas</option>
    `;

        if (analistas.length) {
            const groupAnalistas = document.createElement('optgroup');
            groupAnalistas.label = 'ANALISTAS';

            analistas.forEach(a => {
                const option = document.createElement('option');
                option.value = a.nome;
                option.textContent = a.nome;
                groupAnalistas.appendChild(option);
            });

            select.appendChild(groupAnalistas);
        }

        if (tecnicos.length) {
            const groupTecnicos = document.createElement('optgroup');
            groupTecnicos.label = 'TÉCNICOS';

            tecnicos.forEach(t => {
                const option = document.createElement('option');
                option.value = t.nome;
                option.textContent = t.nome;
                groupTecnicos.appendChild(option);
            });

            select.appendChild(groupTecnicos);
        }
    }

    carregarFiltroTecnicos();

    async function carregarChamados() {
        lista.innerHTML = 'Carregando...';

        const params = new URLSearchParams({
            page: paginaAtual,
            limit: limite
        });

        const search = document.getElementById('search-chamados')?.value?.trim();
        const status = document.getElementById('filter-status')?.value;
        const tipo = document.getElementById('filter-tipo')?.value;
        const tecnico = document.getElementById('filtro-tecnico')?.value;

        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (tipo) params.append('tipo', tipo);
        if (tecnico) params.append('tecnico', tecnico);

        try {
            const json = getChamados({
                page: paginaAtual,
                limit: limite,
                search,
                status,
                tipo,
                tecnico
            });

            const data = json.data;
            const total = json.total;

            lista.innerHTML = '';

            if (!data.length) {
                lista.innerHTML =
                    '<div class="p-4 bg-white rounded shadow">Nenhum chamado encontrado</div>';
                return;
            }

            data.forEach(c => {
                const el = document.createElement('div');
                el.className =
                    'bg-white p-4 rounded shadow cursor-pointer hover:bg-slate-50 transition';

                el.addEventListener('click', () => {
                    location.hash = `#/chamados/${c.id}`;
                });

                el.innerHTML = `
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <div class="font-semibold">
                SEI/${c.numero} | ${c.titulo || ''}
              </div>
              <div class="text-sm text-slate-500">
                ${c.solicitante_nome || 'Solicitante'} • ${c.departamento_nome || 'Sem setor'}
              </div>
              <div class="text-xs text-slate-400">
                ${diasDesde(c.created_at)} • ${c.tipo || 'Não informado'}
              </div>
            </div>
            <div class="text-right space-y-1">
              <span class="text-xs px-2 py-1 rounded ${getStatusClass(c.status)}">
                ${c.status}
              </span>
              <div>
                <span class="text-xs px-2 py-0.5 rounded ${getPrioridadeClass(c.prioridade)}">
                  ${c.prioridade || '—'}
                </span>
              </div>
            </div>
          </div>
        `;

                lista.appendChild(el);
            });

            // controle dos botões
            btnPrev.disabled = paginaAtual <= 1;
            btnNext.disabled = paginaAtual * limite >= totalRegistros;

        } catch (error) {
            console.error(error);
            lista.innerHTML =
                '<div class="p-4 bg-red-50 text-red-600 rounded">Erro ao carregar chamados</div>';
        }
    }

    // eventos
    if (btnPrev) {
        btnPrev.onclick = () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                carregarChamados();
            }
        };
    }

    if (btnNext) {
        btnNext.onclick = () => {
            if (paginaAtual * limite < totalRegistros) {
                paginaAtual++;
                carregarChamados();
            }
        };
    }

    if (selectLimit) {
        selectLimit.onchange = () => {
            limite = Number(selectLimit.value);
            localStorage.setItem('limite-chamados', limite);
            paginaAtual = 1;
            carregarChamados();
        };

    }

    const btnFiltrar = document.getElementById('btn-filtrar');
    if (btnFiltrar) {
        btnFiltrar.onclick = () => {
            paginaAtual = 1;
            carregarChamados();
        };
    }

    carregarChamados();
}

// ===============================
// DASHBOARD — KPIs
// ===============================
async function loadDashboardStats() {
    try {
        const data = getDashboardStats();

        const abertosEl = document.getElementById('kpi-abertos');
        const andamentoEl = document.getElementById('kpi-andamento');
        const resolvidosEl = document.getElementById('kpi-resolvidos');
        const equipamentosEl = document.getElementById('kpi-equipamentos');

        if (abertosEl) abertosEl.textContent = data.abertos ?? 0;
        if (andamentoEl) andamentoEl.textContent = data.andamento ?? 0;
        if (resolvidosEl) resolvidosEl.textContent = data.resolvidos ?? 0;
        if (equipamentosEl) equipamentosEl.textContent = data.equipamentos ?? 0;

    } catch (error) {
        console.error('Erro ao carregar KPIs do dashboard:', error);
    }
}

/// ===============================
// DASHBOARD — Últimos Chamados
// ===============================
async function loadUltimosChamados() {
    const container = document.getElementById('lista-ultimos-chamados');
    if (!container) return;

    // Estrutura fixa
    container.innerHTML = `
    <div id="ultimos-chamados-lista"></div>
  `;

    const lista = document.getElementById('ultimos-chamados-lista');
    lista.innerHTML = 'Carregando...';

    try {
        const data = getUltimosChamados();

        lista.innerHTML = '';

        if (!data.length) {
            lista.innerHTML = `
        <div class="p-4 bg-slate-50 rounded text-slate-500">
          Nenhum chamado encontrado.
        </div>
      `;
            return;
        }

        data.forEach(chamado => {
            const item = document.createElement('div');
            item.className =
                'p-4 bg-slate-50 rounded-xl mb-4 cursor-pointer hover:bg-slate-100 transition';

            item.innerHTML = `
  <div class="flex items-center justify-between gap-4">

    <!-- BLOCO TEXTO (FIXO + ELLIPSIS) -->
    <div class="min-w-0 flex-1">
      <div class="font-semibold truncate">
         SEI/${chamado.numero} | ${chamado.titulo || ''}
      </div>

      <div class="text-sm text-slate-500 truncate">
        ${chamado.solicitante_nome || 'Solicitante'}
        • ${chamado.departamento_nome || chamado.departamento || 'Sem setor'}
      </div>
    </div>

    <!-- BLOCO STATUS (NUNCA SE MOVE) -->
    <div class="flex items-center gap-4 flex-shrink-0">
      <span class="text-xs px-2 py-1 rounded ${getStatusClass(chamado.status)}">
        ${chamado.status}
      </span> 
    
      <span class="text-xs px-2 py-0.5 rounded ${getPrioridadeClass(chamado.prioridade)}">
        ${chamado.prioridade || '—'}
      </span>
    </div>

  </div>
`;


            item.addEventListener('click', () => {
                location.hash = `#/chamados/${chamado.id}`;
            });

            lista.appendChild(item);
        });

    } catch (err) {
        console.error(err);
        lista.innerHTML = `
      <div class="p-4 bg-red-50 text-red-600 rounded">
        Erro ao carregar últimos chamados.
      </div>
    `;
    }
}

// ===============================
// CHAMADOS — ARQUIVADOS (CALENDÁRIO + LISTA POR DIA/MÊS) — MOCK
// ===============================
async function initArquivados() {
    const grMeses = document.getElementById('arq-meses-grid');
    const selectAno = document.getElementById('arq-select-ano');
    const lista = document.getElementById('lista-arquivados');
    if (!grMeses || !selectAno || !lista) return;

    const NOMES_MESES = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    const hoje = new Date();
    const anoHoje = hoje.getFullYear();
    const mesHoje = hoje.getMonth();
    const diaHoje = hoje.getDate();

    let anoSelecionado = anoHoje;
    let mesMobileAtivo = mesHoje;
    let dataSelecionada = formatarDataISO(anoHoje, mesHoje, diaHoje);
    let modoVisualizacao = 'dia';
    let mesSelecionado = mesHoje;
    let diasComChamados = new Set();

    const layoutEl = document.querySelector('.arquivados-layout');
    const radiosModo = document.querySelectorAll('input[name="arq-modo"]');

    const btnPrev = document.getElementById('btn-prev-arquivados');
    const btnNext = document.getElementById('btn-next-arquivados');
    const selectLimit = document.getElementById('select-limit-arquivados');
    const labelDia = document.getElementById('arq-dia-selecionado-label');

    const btnMesPrev = document.getElementById('arq-mes-prev');
    const btnMesNext = document.getElementById('arq-mes-next');
    const labelMesMobile = document.getElementById('arq-mes-atual-label');

    let paginaAtual = 1;
    let limiteSalvo = localStorage.getItem('limite-arquivados');
    let limite = limiteSalvo ? Number(limiteSalvo) : Number(selectLimit?.value || 10);
    let totalRegistros = 0;

    if (selectLimit && limiteSalvo) {
        selectLimit.value = limiteSalvo;
    }

    // carrega (mock) os dias do ano que têm arquivados
    function carregarDiasComChamados() {
        try {
            diasComChamados = new Set(listarDiasComArquivados(anoSelecionado));
        } catch (err) {
            console.error('Erro ao carregar dias com arquivados:', err);
            diasComChamados = new Set();
        }
    }

    // ===== SELECT DE ANO (atual → +10) =====
    selectAno.innerHTML = '';
    for (let ano = anoHoje; ano <= anoHoje + 10; ano++) {
        const opt = document.createElement('option');
        opt.value = ano;
        opt.textContent = ano;
        selectAno.appendChild(opt);
    }
    selectAno.value = anoSelecionado;

    selectAno.onchange = () => {
        anoSelecionado = Number(selectAno.value);
        mesMobileAtivo = (anoSelecionado === anoHoje) ? mesHoje : 0;
        carregarDiasComChamados();
        renderCalendario();
    };

    // ===== RENDER DO CALENDÁRIO =====
    function renderCalendario() {
        grMeses.innerHTML = '';

        for (let mes = 0; mes < 12; mes++) {
            const blocoMes = document.createElement('div');
            blocoMes.className = 'arq-mes';
            blocoMes.dataset.mes = mes;

            if (mes === mesMobileAtivo) {
                blocoMes.classList.add('mes-ativo-mobile');
            }

            const titulo = document.createElement('div');
            titulo.className = 'arq-mes-titulo';
            titulo.textContent = NOMES_MESES[mes];
            blocoMes.appendChild(titulo);

            const semana = document.createElement('div');
            semana.className = 'arq-semana';
            DIAS_SEMANA.forEach(d => {
                const s = document.createElement('span');
                s.textContent = d;
                semana.appendChild(s);
            });
            blocoMes.appendChild(semana);

            const grDias = document.createElement('div');
            grDias.className = 'arq-dias';

            const primeiroDia = new Date(anoSelecionado, mes, 1).getDay();
            const totalDias = new Date(anoSelecionado, mes + 1, 0).getDate();

            for (let i = 0; i < primeiroDia; i++) {
                const vazio = document.createElement('div');
                vazio.className = 'arq-dia vazio';
                grDias.appendChild(vazio);
            }

            for (let dia = 1; dia <= totalDias; dia++) {
                const cel = document.createElement('div');
                cel.className = 'arq-dia';
                cel.textContent = dia;

                const dataISO = formatarDataISO(anoSelecionado, mes, dia);

                if (diasComChamados.has(dataISO)) {
                    cel.classList.add('tem-chamados');
                }

                if (anoSelecionado === anoHoje && mes === mesHoje && dia === diaHoje) {
                    cel.classList.add('hoje');
                }

                if (dataISO === dataSelecionada) {
                    cel.classList.add('selecionado');
                }

                cel.onclick = () => {
                    if (modoVisualizacao === 'mes') return;

                    dataSelecionada = dataISO;
                    paginaAtual = 1;
                    document.querySelectorAll('.arq-dia.selecionado')
                        .forEach(el => el.classList.remove('selecionado'));
                    cel.classList.add('selecionado');
                    carregarArquivados();
                };

                grDias.appendChild(cel);
            }

            blocoMes.appendChild(grDias);

            if (modoVisualizacao === 'mes' && mes === mesSelecionado) {
                blocoMes.classList.add('mes-selecionado');
            }

            blocoMes.onclick = () => {
                if (modoVisualizacao !== 'mes') return;

                mesSelecionado = mes;
                mesMobileAtivo = mes;
                paginaAtual = 1;

                document.querySelectorAll('.arq-mes.mes-selecionado')
                    .forEach(el => el.classList.remove('mes-selecionado'));
                blocoMes.classList.add('mes-selecionado');

                carregarArquivados();
            };

            grMeses.appendChild(blocoMes);
        }

        atualizarLabelMesMobile();
    }

    // ===== NAVEGAÇÃO DE MÊS (MOBILE) =====
    function aplicarMesAtivoMobile() {
        document.querySelectorAll('.arq-meses-grid .arq-mes').forEach(bloco => {
            bloco.classList.toggle(
                'mes-ativo-mobile',
                Number(bloco.dataset.mes) === mesMobileAtivo
            );
        });
        atualizarLabelMesMobile();
    }

    function atualizarLabelMesMobile() {
        if (labelMesMobile) {
            labelMesMobile.textContent = `${NOMES_MESES[mesMobileAtivo]} ${anoSelecionado}`;
        }
    }

    if (btnMesPrev) {
        btnMesPrev.onclick = () => {
            mesMobileAtivo = (mesMobileAtivo + 11) % 12;
            aplicarMesAtivoMobile();
        };
    }

    if (btnMesNext) {
        btnMesNext.onclick = () => {
            mesMobileAtivo = (mesMobileAtivo + 1) % 12;
            aplicarMesAtivoMobile();
        };
    }

    // ===== TROCA DE MODO (DIA / MÊS) =====
    radiosModo.forEach(radio => {
        radio.onchange = () => {
            modoVisualizacao = radio.value;
            if (layoutEl) {
                layoutEl.classList.toggle('modo-mes', modoVisualizacao === 'mes');
            }
            paginaAtual = 1;
            renderCalendario();
            carregarArquivados();
        };
    });

    // ===== CARREGAR CHAMADOS (DIA OU MÊS) — MOCK =====
    function carregarArquivados() {
        lista.innerHTML = 'Carregando...';

        const opts = { page: paginaAtual, limit: limite };

        if (modoVisualizacao === 'mes') {
            const mm = String(mesSelecionado + 1).padStart(2, '0');
            opts.mesAno = `${anoSelecionado}-${mm}`;
            if (labelDia) {
                labelDia.textContent = `Chamados de ${NOMES_MESES[mesSelecionado]} de ${anoSelecionado}`;
            }
        } else {
            opts.data = dataSelecionada;
            if (labelDia) {
                labelDia.textContent = `Chamados de ${formatarDataBR(dataSelecionada)}`;
            }
        }

        try {
            const json = listarArquivadosPorData(opts);
            const data = json.data || [];
            totalRegistros = json.total || 0;

            lista.innerHTML = '';

            if (!data.length) {
                lista.innerHTML =
                    '<div class="p-4 bg-slate-50 rounded text-slate-500">Nenhum chamado arquivado neste período.</div>';
                if (btnPrev) btnPrev.disabled = true;
                if (btnNext) btnNext.disabled = true;
                return;
            }

            data.forEach(c => {
                const el = document.createElement('div');
                el.className =
                    'bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-slate-50 transition';

                el.innerHTML = `
          <div class="font-semibold">
             SEI/${c.numero} | ${c.titulo}
          </div>
          <div class="text-sm text-slate-500">
            ${c.solicitante_nome || 'Solicitante'} • ${c.tipo || 'Não informado'}
          </div>
        `;

                el.addEventListener('click', () => {
                    location.hash = `#/chamados/${c.id}`;
                });

                lista.appendChild(el);
            });

            if (btnPrev) btnPrev.disabled = paginaAtual <= 1;
            if (btnNext) btnNext.disabled = paginaAtual * limite >= totalRegistros;

        } catch (error) {
            console.error(error);
            lista.innerHTML =
                '<div class="p-4 bg-red-50 text-red-600 rounded">Erro ao carregar arquivados</div>';
        }
    }

    // ===== PAGINAÇÃO =====
    if (btnPrev) {
        btnPrev.onclick = () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                carregarArquivados();
            }
        };
    }

    if (btnNext) {
        btnNext.onclick = () => {
            if (paginaAtual * limite < totalRegistros) {
                paginaAtual++;
                carregarArquivados();
            }
        };
    }

    if (selectLimit) {
        selectLimit.onchange = () => {
            limite = Number(selectLimit.value);
            localStorage.setItem('limite-arquivados', limite);
            paginaAtual = 1;
            carregarArquivados();
        };
    }

    // ===== HELPERS DE DATA =====
    function formatarDataISO(ano, mes, dia) {
        const mm = String(mes + 1).padStart(2, '0');
        const dd = String(dia).padStart(2, '0');
        return `${ano}-${mm}-${dd}`;
    }

    function formatarDataBR(iso) {
        const [a, m, d] = iso.split('-');
        return `${d}/${m}/${a}`;
    }

    // ===== INICIALIZAÇÃO =====
    carregarDiasComChamados();
    renderCalendario();
    carregarArquivados();
}


// ===============================
// DASHBOARD — Chamados por Tipo
// ===============================
async function loadChamadosPorTipo() {
    const container = document.getElementById('chamados-por-tipo');
    if (!container) return;

    container.innerHTML = 'Carregando...';

    try {
        const data = getChamadosPorTipo();

        container.innerHTML = '';

        if (!data.length) {
            container.innerHTML = `
        <div class="text-slate-500 text-sm">
          Nenhum dado disponível.
        </div>
      `;
            return;
        }

        /*const total = data.reduce((sum, item) => sum + item.total, 0);
    
        data.forEach(item => {
          const percent = total ? Math.round((item.total / total) * 100) : 0;*/

        const max = Math.max(...data.map(item => item.total));

        data.forEach((item, index) => {
            const percent = max ? Math.round((item.total / max) * 100) : 0;

            const bloco = document.createElement('div');
            bloco.className = 'mb-3';

            bloco.innerHTML = `
        <div class="flex justify-between text-sm mb-1">
          <span>${item.tipo || 'Não informado'}</span>
          <strong>${item.total}</strong>
        </div>
        <div class="w-full h-2 bg-slate-200 rounded overflow-hidden">
        <div class="h-full transition-all duration-500"
            style="width:${percent}%; background:${CORES_CHAMADOS[index % CORES_CHAMADOS.length]}">
        </div>
        </div>
      `;

            container.appendChild(bloco);
        });

        renderGraficoPizzaChamados(data);

    } catch (err) {
        console.error('Erro ao carregar chamados por tipo:', err);
        container.innerHTML = `
      <div class="text-red-600 text-sm">
        Erro ao carregar dados.
      </div>
    `;
    }
}

function renderGraficoPizzaChamados(data) {
    const canvas = document.getElementById('grafico-pizza-chamados');
    const legenda = document.getElementById('grafico-legenda-pizza');

    if (!canvas) return;

    const labels = data.map(item => item.tipo || 'Não informado');
    const valores = data.map(item => Number(item.total));
    // 🎨 cores modernas (padrão SaaS)
    /*const cores = [
      '#3b82f6', // azul
      '#6366f1', // indigo
      '#8b5cf6', // roxo
      '#06b6d4', // cyan
      '#10b981', // verde
      '#f59e0b', // amarelo
      '#ef4444'  // vermelho
    ];*/
    const cores = CORES_CHAMADOS;


    if (window.graficoPizzaInstance) {
        window.graficoPizzaInstance.destroy();
    }

    const ctx = canvas.getContext('2d');

    window.graficoPizzaInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: valores,
                backgroundColor: cores,
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    display: false
                }
            },
            animation: {
                duration: 900,
                easing: 'easeOutCubic'
            }
        }
    });


    if (legenda) {
        legenda.innerHTML = '';

        const total = valores.reduce((a, b) => a + b, 0);

        labels.forEach((label, index) => {
            const valor = valores[index];
            const percent = total ? Math.round((valor / total) * 100) : 0;

            const item = document.createElement('div');
            item.className = 'flex items-center justify-between';

            item.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full" 
          <span class="text-slate-600">${label}</span>
          </div>

        <div class="font-semibold text-slate-700">
          ${percent}%
        </div>
      `;

            legenda.appendChild(item);
        });
    }
}

function getStatusClass(status) {
    switch ((status || '').toLowerCase()) {
        case 'aberto':
            return 'badge-status status-aberto';
        case 'em andamento':
            return 'badge-status status-andamento';
        case 'resolvido':
            return 'badge-status status-resolvido';
        default:
            return 'badge-status';
    }
}

function diasDesde(data) {
    if (!data) return '-';

    const inicio = new Date(data.replace(' ', 'T'));
    const hoje = new Date();

    // normalizar datas (remove hora)
    inicio.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    const diffDias = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));

    if (diffDias <= 0) return 'Aberto hoje';
    if (diffDias === 1) return 'Aberto ontem';

    if (diffDias < 30) {
        return `Aberto a ${diffDias} dias`;
    }

    const meses = Math.floor(diffDias / 30);
    const diasRestantes = diffDias % 30;

    if (diasRestantes === 0) {
        return `Aberto a ${meses} mês${meses > 1 ? 'es' : ''}`;
    }

    return `Aberto a ${meses} mês${meses > 1 ? 'es' : ''} e ${diasRestantes} dia${diasRestantes > 1 ? 's' : ''}`;
}


function formatDataHora(data) {
    if (!data) return '-';

    try {
        let d;

        if (typeof data === 'string') {
            // 🔥 normaliza PostgreSQL → ISO válido
            const limpa = data
                .replace(' ', 'T')          // espaço → T
                .replace(/\.\d+/, '')       // remove microssegundos
                .replace(/\+\d+$/, 'Z');    // +00 → Z

            d = new Date(limpa);
        } else {
            d = new Date(data);
        }

        if (isNaN(d.getTime())) {
            console.warn("Data inválida:", data);
            return '-';
        }

        return d.toLocaleString('pt-BR', {
            timeZone: 'America/Fortaleza',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

    } catch (e) {
        console.error("Erro ao formatar data:", data, e);
        return '-';
    }
}


function getPrioridadeClass(prioridade) {
    switch ((prioridade || '').toLowerCase()) {
        case 'alta':
            return 'badge-prioridade prioridade-alta';
        case 'crítica':
            return 'badge-prioridade prioridade-critica';
        case 'baixa':
            return 'badge-prioridade prioridade-baixa';
        default:
            return 'badge-prioridade';
    }
}

// main.js
async function loadChamadoDetalhe() {
    const container = document.getElementById('chamado-detalhe');
    if (!container) return;

    const path = location.hash.replace('#', '');
    const id = path.split('/')[2];

    if (!id) {
        container.innerHTML = 'Chamado não encontrado.';
        return;
    }

    try {
        const c = getChamado(id);
        // ===============================
        // 🔐 PERMISSÃO: USUÁRIO COMUM NÃO GERENCIA CHAMADO
        // ===============================
        const usuarioLogado = getUsuario();

        if (usuarioLogado && usuarioLogado.nivel !== 'admin') {

            const blocoGerenciar = document.getElementById('gerenciar-chamado');

            if (blocoGerenciar) {
                blocoGerenciar.style.display = 'none';
            }

        }


        document.getElementById('detalhe-titulo').textContent = c.titulo;
        document.getElementById('detalhe-subtitulo').textContent = `Chamado SEI/${c.numero}`;
        document.getElementById('detalhe-descricao').textContent = c.descricao || '-';
        document.getElementById('detalhe-solicitante').textContent = c.solicitante_nome || '-';
        document.getElementById('detalhe-telefone').textContent = c.telefone_contato || '-';
        document.getElementById('detalhe-departamento').textContent = c.departamento_nome || '-';
        //document.getElementById('detalhe-abertura').textContent = formatDataHora(c.created_at);
        const elAbertura = document.getElementById('detalhe-abertura');
        if (elAbertura) {
            elAbertura.textContent = formatDataHora(c.created_at);
        }
        document.getElementById('detalhe-tombamento').textContent = c.equipamento_tombamento || '-';


        // ===============================
        // ANOTAÇÕES DO CHAMADO (FRONTEND)
        // ===============================

        const botaoNovaAnotacao = document.getElementById('btn-nova-anotacao');
        const formularioAnotacao = document.getElementById('form-anotacao');
        const inputAnotacao = document.getElementById('input-anotacao');
        const botaoSalvarAnotacao = document.getElementById('btn-salvar-anotacao');
        const botaoCancelarAnotacao = document.getElementById('btn-cancelar-anotacao');
        const listaAnotacoes = document.getElementById('lista-anotacoes');

        if (
            botaoNovaAnotacao &&
            formularioAnotacao &&
            inputAnotacao &&
            botaoSalvarAnotacao &&
            botaoCancelarAnotacao &&
            listaAnotacoes
        ) {

            // ===============================
            // CARREGAR ANOTAÇÕES (MOCK)
            // ===============================
            const carregarAnotacoes = () => {
                listaAnotacoes.innerHTML = '';

                try {
                    const anotacoes = getAnotacoes(id);

                    if (!anotacoes.length) {
                        listaAnotacoes.innerHTML = `
                    <div class="text-slate-500 text-sm">
                        Nenhuma anotação encontrada.
                    </div>
                `;
                        return;
                    }

                    anotacoes.forEach(anotacao => {
                        const item = criarItemAnotacao(anotacao);
                        listaAnotacoes.appendChild(item);
                    });

                } catch (err) {
                    console.error(err);
                }
            };

            // ===============================
            // CRIAR ITEM DE ANOTAÇÃO
            // ===============================
            const criarItemAnotacao = (anotacao) => {
                const item = document.createElement('div');
                item.className = 'border rounded-lg p-3 flex items-start gap-4 w-full min-w-0';

                item.innerHTML = `
            <div class="flex-1 min-w-0">
                <div
                    class="text-slate-700 w-full"
                    style="word-break: break-word; overflow-wrap: anywhere; white-space: normal;">
                    ${anotacao.texto}
                </div>

                <div class="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span class="font-semibold text-slate-700">
                        ${anotacao.autor_nome || 'Administrador'}
                    </span>

                    <span class="text-slate-400">
                        • ${formatDataHora(anotacao.created_at)}
                    </span>
                </div>
            </div>

            <button
                class="shrink-0 text-red-600 text-xs hover:underline"
                title="Excluir anotação"
            >
                Excluir
            </button>
        `;

                const botaoExcluir = item.querySelector('button');

                botaoExcluir.onclick = () => {
                    if (!confirm('Deseja excluir esta anotação?')) return;

                    try {
                        removeAnotacao(anotacao.id);
                        item.remove();
                    } catch (err) {
                        console.error(err);
                        alert('Erro ao excluir anotação');
                    }
                };

                return item;
            };

            // ===============================
            // INICIALIZAÇÃO
            // ===============================
            carregarAnotacoes();

            // ===============================
            // ABRIR FORMULÁRIO
            // ===============================
            botaoNovaAnotacao.onclick = () => {
                formularioAnotacao.classList.remove('hidden');
                inputAnotacao.focus();
            };

            // ===============================
            // CANCELAR
            // ===============================
            botaoCancelarAnotacao.onclick = () => {
                inputAnotacao.value = '';
                formularioAnotacao.classList.add('hidden');
            };

            // ===============================
            // SALVAR (MOCK)
            // ===============================
            botaoSalvarAnotacao.onclick = () => {
                const texto = inputAnotacao.value.trim();

                if (!texto) {
                    alert('Digite alguma informação antes de salvar.');
                    return;
                }

                try {
                    const novaAnotacao = addAnotacao(id, texto);

                    const item = criarItemAnotacao(novaAnotacao);
                    listaAnotacoes.prepend(item);

                    inputAnotacao.value = '';
                    formularioAnotacao.classList.add('hidden');

                } catch (err) {
                    console.error(err);
                    alert('Erro ao salvar anotação');
                }
            };
        }
        // ===============================
        // OBSERVAÇÕES DO TÉCNICO
        // ===============================
        const obsInput = document.getElementById('observacoes-tecnico');
        if (obsInput) obsInput.value = c.observacoes_tecnico || '';

        const selectStatus = document.getElementById('select-status');
        const selectPrioridade = document.getElementById('select-prioridade');
        const selectTecnico = document.getElementById('select-tecnico');
        if (selectTecnico) {

            const { analistas, tecnicos } = getUsuariosAgrupados();

            selectTecnico.innerHTML = `
            <option value="">Não atribuído</option>

            <optgroup label="ANALISTAS">
                ${analistas.map(a => `
                    <option value="${a.nome}">
                        ${a.nome}
                    </option>
                `).join('')}
            </optgroup>

            <optgroup label="TÉCNICOS">
                ${tecnicos.map(t => `
                    <option value="${t.nome}">
                        ${t.nome}
                    </option>
                `).join('')}
            </optgroup>
        `;
        }

        setTimeout(() => {
            if (selectStatus) selectStatus.value = c.status;
            if (selectPrioridade) selectPrioridade.value = c.prioridade;
            if (selectTecnico && c.tecnico_id) selectTecnico.value = String(c.tecnico_id);
        }, 0);

        const btnSalvarObs = document.getElementById('btn-salvar-observacoes');
        if (btnSalvarObs) {
            btnSalvarObs.onclick = () => {

                const atualizado = updateChamado(id, {
                    observacoes_tecnico: obsInput.value
                });

                if (!atualizado) {
                    alert('Erro ao salvar observações');
                    return;
                }

                alert('Observações salvas com sucesso');
            };
        }

        // Botões arquivar/restaurar
        const btnArquivar = document.getElementById('btn-arquivar-chamado');

        if (btnArquivar) {
            if (c.arquivado) {
                btnArquivar.textContent = 'Restaurar';
                btnArquivar.style.backgroundColor = '#16a34a';
                btnArquivar.style.color = '#ffffff';

                btnArquivar.onmouseenter = () => {
                    btnArquivar.style.backgroundColor = '#15803d';
                };

                btnArquivar.onmouseleave = () => {
                    btnArquivar.style.backgroundColor = '#16a34a';
                };

                btnArquivar.onclick = async () => {
                    if (!confirm('Deseja restaurar este chamado?')) {
                        return;
                    }

                    await fetch(`${API_BASE}/chamados/${id}/restaurar`, {
                        method: 'PATCH',
                        headers: {
                            ...getAuthHeaders()
                        }
                    });

                    alert('Chamado restaurado com sucesso');
                    location.hash = '#/chamados';
                };

            } else {
                btnArquivar.textContent = 'Arquivar';
                btnArquivar.style.backgroundColor = '#3b82f6';
                btnArquivar.style.color = '#ffffff';

                btnArquivar.onmouseenter = () => {
                    btnArquivar.style.backgroundColor = '#4338ca';
                };

                btnArquivar.onmouseleave = () => {
                    btnArquivar.style.backgroundColor = '#3b82f6';
                };

                btnArquivar.onclick = () => {

                    if (!c.arquivado) {

                        if (!confirm('Deseja arquivar este chamado?')) return;

                        const result = arquivar(id);

                        if (!result) {
                            alert('Erro ao arquivar chamado');
                            return;
                        }

                        alert('Chamado arquivado');
                        location.hash = '#/chamados';

                    } else {

                        if (!confirm('Deseja restaurar este chamado?')) return;

                        const result = restaurar(id);

                        if (!result) {
                            alert('Erro ao restaurar chamado');
                            return;
                        }

                        alert('Chamado restaurado');
                        location.hash = '#/chamados';
                    }
                };
            }
        }


        const btnApagar = document.getElementById('btn-apagar-chamado');

        if (btnApagar) {
            btnApagar.onclick = async () => {
                if (!confirm('ATENÇÃO: Esta ação não pode ser desfeita. Deseja continuar?')) {
                    return;
                }

                const sucesso = removerChamado(id);
                if (!sucesso) {
                    alert('Erro ao apagar chamado');
                    return;
                }

                alert('Chamado apagado definitivamente');
                location.hash = '#/chamados';
            };
        }

        const btnSalvar = document.getElementById('btn-salvar-status');

        btnSalvar.onclick = () => {
            btnSalvar.disabled = true;
            btnSalvar.textContent = 'Salvando...';

            const atualizado = updateChamado(id, {
                status: selectStatus.value,
                prioridade: selectPrioridade.value,
                tecnico: selectTecnico.value || null
            });

            if (!atualizado) {
                alert('Erro ao atualizar chamado');
                btnSalvar.disabled = false;
                btnSalvar.textContent = 'Salvar Alterações';
                return;
            }

            alert('Chamado atualizado com sucesso');

            btnSalvar.disabled = false;
            btnSalvar.textContent = 'Salvar Alterações';
        };



    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="text-red-600">Erro ao carregar chamado.</div>';
    }
}

document.addEventListener('DOMContentLoaded', initApp);

//-----------------------------------------------------------------------------------------------------------DIVISÃO PARA APLICAR NO GPT-------------------------------------------------------------------------

async function initNovoEquipamento() {
    const form = document.getElementById('form-novo-equipamento');
    if (!form) return;

    // carregar departamentos
    const sel = document.getElementById('select-departamentos');
    try {
        const data = listarDepartamentos();

        sel.innerHTML = '<option value="">Selecione</option>';

        data.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = d.nome;
            sel.appendChild(opt);
        });

    } catch (erro) {
        console.error(erro);
        sel.innerHTML = '<option>Erro</option>';
    }

    // regra IMPRESSORA
    const tipoSelect = document.getElementById('tipo-equipamento');
    const ipInput = document.getElementById('ip-address');
    const obsoletos = [
        'nome-equipamento',
        'processador',
        'memoria-ram',
        'memoria-interna',
        'tipo-armazenamento'
    ].map(id => document.getElementById(id));


    const ramalInput = document.getElementById('numero-ramal');

    tipoSelect.addEventListener('change', () => {
        const tipo = tipoSelect.value;

        const isImp = tipo === 'Impressora';
        const isRamal = tipo === 'Telefone Ramal';

        // ===============================
        // CAMPOS OBSOLETOS (COMPUTADOR)
        // ===============================
        obsoletos.forEach(el => {
            const desabilitar = isImp || isRamal;

            el.disabled = desabilitar;
            el.style.opacity = desabilitar ? '0.5' : '1';

            if (desabilitar) el.value = '';
        });

        // ===============================
        // IP (TODOS OS TIPOS)
        // ===============================
        if (ipInput) {
            ipInput.disabled = false;
            ipInput.style.opacity = '1';
        }

        // ===============================
        // RAMAL (SÓ TELEFONE)
        // ===============================
        if (ramalInput) {
            ramalInput.disabled = !isRamal;
            ramalInput.style.opacity = isRamal ? '1' : '0.5';

            if (!isRamal) {
                ramalInput.value = '';
            }
        }
    });

    form.querySelectorAll('input, select').forEach(el => {
        el.classList.remove('border-red-500');
    });

    // submit (mock)
    form.addEventListener('submit', async e => {
        e.preventDefault();

        const payload = {
            tipo: document.getElementById('tipo-equipamento').value,
            nome: document.getElementById('nome-equipamento').value || null,
            tombamento: document.getElementById('tombamento').value,
            processador: document.getElementById('processador')?.value || null,
            memoria_ram: document.getElementById('memoria-ram')?.value || null,
            memoria_interna: document.getElementById('memoria-interna')?.value || null,
            tipo_armazenamento: document.getElementById('tipo-armazenamento')?.value || null,
            tipo_conexao: document.getElementById('tipo-conexao').value,
            mac_address: document.getElementById('mac-address').value,
            ip: document.getElementById('ip-address')?.value || null,
            numero_ramal: document.getElementById('numero-ramal')?.value || null,
            departamento_id: document.getElementById('select-departamentos').value,
            usuario_nome: document.getElementById('usuario-nome')?.value || null
        };

        if (payload.tipo === 'Telefone Ramal' && !payload.numero_ramal) {
            alert('Informe o número do ramal');
            return;
        }

        // validação mínima
        if (
            !payload.tipo ||
            !payload.tombamento ||
            !payload.tipo_conexao ||
            !payload.mac_address ||
            !payload.departamento_id
        ) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            const novo = criarEquipamento(payload);

            if (!novo) {
                alert('Erro ao salvar equipamento');
                return;
            }

            alert('Equipamento criado com sucesso!');
            location.hash = '#/inventario';

        } catch (err) {
            console.error('Erro completo:', err);
            alert('Erro ao salvar equipamento');
        }
    });
}

async function initInventario() {
    const inputSearch = document.getElementById('search-inventario');
    const selectTipo = document.getElementById('filter-tipo-inventario');
    const selectStatus = document.getElementById('filter-status-inventario');
    const selectCondicao = document.getElementById('filter-condicao-inventario');
    const btnFiltrar = document.getElementById('btn-filtrar-inventario');
    const container = document.getElementById('inventario-container');
    const selectDepartamento = document.getElementById('filter-departamento-inventario');

    if (!container) return;

    // carregar departamentos no filtro (se ainda não carregado)
    if (selectDepartamento && !selectDepartamento.dataset.loaded) {
        try {
            const deps = listarDepartamentos();


            selectDepartamento.innerHTML = '<option value="">Todos os departamentos</option>';

            deps.forEach(dep => {
                const opt = document.createElement('option');
                opt.value = dep.id;
                opt.textContent = dep.nome;
                selectDepartamento.appendChild(opt);
            });

            selectDepartamento.dataset.loaded = 'true';

        } catch (err) {
            console.error('Erro ao carregar departamentos no filtro', err);
        }
    }

    // ===============================
    // EVENTO DO BOTÃO FILTRAR
    // ===============================
    if (btnFiltrar) {
        btnFiltrar.onclick = () => {
            filtroInventario.texto = (inputSearch.value || '').toLowerCase();
            filtroInventario.tipo = selectTipo.value;
            filtroInventario.status = selectStatus.value;
            filtroInventario.condicao = selectCondicao.value;
            filtroInventario.departamento = selectDepartamento.value;

            initInventario();
        };
    }

    container.innerHTML = 'Carregando inventário...';

    try {
        // ===============================
        // BUSCAR DEPARTAMENTOS E EQUIPAMENTOS
        // ===============================
        const departamentos = listarDepartamentos();
        const equipamentos = listarEquipamentos();

        if (!Array.isArray(departamentos)) {
            throw new Error('Resposta inválida de departamentos');
        }

        if (!Array.isArray(equipamentos)) {
            throw new Error('Resposta inválida de equipamentos');
        }

        // ===============================
        // APLICAR FILTRO GLOBAL
        // ===============================
        const equipamentosFiltrados = equipamentos.filter(equipamento => {
            const texto = (filtroInventario.texto || '').toLowerCase();

            const matchTexto =
                (equipamento.tombamento || '').toLowerCase().includes(texto) ||
                (equipamento.modelo || '').toLowerCase().includes(texto) ||
                (equipamento.usuario_nome || '').toLowerCase().includes(texto);

            const matchDepartamento =
                !filtroInventario.departamento ||
                Number(equipamento.departamento_id) === Number(filtroInventario.departamento);

            const matchTipo =
                !filtroInventario.tipo || equipamento.tipo === filtroInventario.tipo;

            const matchStatus =
                !filtroInventario.status || equipamento.status === filtroInventario.status;

            const matchCondicao =
                !filtroInventario.condicao || equipamento.condicao === filtroInventario.condicao;

            return matchTexto && matchTipo && matchStatus && matchCondicao && matchDepartamento;
        });

        // ===============================
        // MAPEAR DEPARTAMENTOS COM EQUIPAMENTOS FILTRADOS
        // ===============================
        const departamentosComEquipamentos = departamentos
            .map(dep => {
                const equipamentosDoDepartamento = equipamentosFiltrados.filter(
                    eq => Number(eq.departamento_id) === Number(dep.id)
                );

                return {
                    ...dep,
                    equipamentos: equipamentosDoDepartamento
                };
            })
            .filter(dep => dep.equipamentos.length > 0 || !temFiltroInventarioAtivo());

        container.innerHTML = '';

        // ===============================
        // NENHUM RESULTADO
        // ===============================
        if (!departamentosComEquipamentos.length) {
            container.innerHTML = `
        <div class="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <h3 class="text-lg font-semibold text-slate-700 mb-2">
            Nenhum equipamento encontrado
          </h3>
          <p class="text-sm text-slate-500">
            Tente ajustar os filtros para localizar outros equipamentos.
          </p>
        </div>
      `;
            return;
        }

        // ===============================
        // RENDERIZAR SOMENTE DEPARTAMENTOS VISÍVEIS
        // ===============================
        departamentosComEquipamentos.forEach(dep => {
            const bloco = document.createElement('section');
            bloco.id = `departamento-${dep.id}`;
            bloco.className = 'rounded-xl p-6';
            bloco.style.marginBottom = '30px';
            bloco.style.backgroundColor = '#e4ebf0';

            bloco.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-semibold">${dep.nome}</h3>
            <button
              class="text-xs text-red-600 hover:underline mt-1"
              data-departamento-id="${dep.id}"
            >
              Deletar Departamento
            </button>
          </div>

          <span class="text-sm text-slate-600" id="count-${dep.id}">
            Equipamentos: ${dep.equipamentos.length}
          </span>
        </div>

        <div class="grid grid-cols-12 gap-6">

          <!-- GRID DE EQUIPAMENTOS -->
          <div class="col-span-9 relative">
            <div
              id="grid-${dep.id}"
              class="grid grid-cols-5 gap-4"
            ></div>
            <br>

            <div 
              class="pagination-container flex justify-between items-center"
              id="pagination-${dep.id}"
            >
              <button
                id="prev-${dep.id}"
                class="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt; Anterior
              </button>

              <button
                id="next-${dep.id}"
                class="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo &gt;
              </button>
            </div>
          </div>

          <!-- GRÁFICOS -->
          <div class="col-span-3">
            <div class="w-full space-y-4">

              <div>
                <h4 class="text-sm font-medium mb-2 text-slate-700">
                  Conexões (Computadores)
                </h4>
                <div
                  id="grafico-conexao-${dep.id}"
                  class="bg-white rounded-lg p-4"
                ></div>
              </div>

              <div>
                <h4 class="text-sm font-medium mb-2 text-slate-700">
                  Tipos
                </h4>
                <div
                  id="grafico-status-${dep.id}"
                  class="bg-white rounded-lg p-4"
                ></div>
              </div>

              <div>
                <h4 class="text-sm font-medium mb-2 text-slate-700">
                  Condição
                </h4>
                <div
                  id="grafico-condicao-${dep.id}"
                  class="bg-white rounded-lg p-4"
                ></div>
              </div>

            </div>
          </div>
        </div>
      `;

            container.appendChild(bloco);

            // ===============================
            // EVENTO: DELETAR DEPARTAMENTO
            // ===============================
            const btnDeletar = bloco.querySelector(
                `button[data-departamento-id="${dep.id}"]`
            );

            btnDeletar.onclick = async () => {
                const confirmar = confirm(
                    `Deseja realmente deletar o departamento "${dep.nome}"?\n\n` +
                    'ATENÇÃO: se houver equipamentos ativos, eles precisam ser movidos antes para outro departamento.'
                );

                if (!confirmar) return;

                try {
                    const response = await fetch(
                        `${API_BASE}/departamentos/${dep.id}`,
                        {
                            method: 'DELETE',
                            headers: { ...getAuthHeaders() }
                        }
                    );

                    const resultado = await response.json();

                    if (!response.ok) {
                        alert(resultado.error || 'Não foi possível deletar o departamento.');
                        return;
                    }

                    alert('Departamento deletado com sucesso.');
                    initInventario();

                } catch (erro) {
                    console.error(erro);
                    alert('Erro ao tentar deletar o departamento.');
                }
            };

            renderizarEquipamentosDepartamento(dep.id, dep.equipamentos);
        });

        // ===============================
        // RESTAURAR SCROLL
        // ===============================
        setTimeout(() => {
            const depId = localStorage.getItem('inventario_departamento');
            const scroll = localStorage.getItem('inventario_scroll');
            const equipId = localStorage.getItem('inventario_equipamento');

            if (depId) {
                const el = document.getElementById(`departamento-${depId}`);
                if (el) {
                    el.scrollIntoView({ behavior: 'auto', block: 'start' });
                }
            } else if (scroll) {
                window.scrollTo(0, Number(scroll));
            }

            // 🎯 DESTACAR EQUIPAMENTO
            if (equipId) {
                setTimeout(() => {
                    const card = document.getElementById(`equip-${equipId}`);

                    if (card) {
                        card.classList.add('highlight-equip');

                        // remover depois de 3s
                        setTimeout(() => {
                            card.classList.remove('highlight-equip');
                        }, 3000);
                    }
                }, 200);
            }

            // limpar storage
            localStorage.removeItem('inventario_departamento');
            localStorage.removeItem('inventario_scroll');
            localStorage.removeItem('inventario_equipamento');

        }, 100);

    } catch (err) {
        console.error(err);
        container.innerHTML =
            '<div class="text-red-600">Erro ao carregar inventário</div>';
    }
}

function temFiltroInventarioAtivo() {
    return Boolean(
        (filtroInventario.texto && filtroInventario.texto.trim()) ||
        filtroInventario.tipo ||
        filtroInventario.status ||
        filtroInventario.condicao ||
        filtroInventario.departamento

    );
}

function renderizarEquipamentosDepartamento(departamentoId, equipamentosFiltrados) {
    const grid = document.getElementById(`grid-${departamentoId}`);
    const countEl = document.getElementById(`count-${departamentoId}`);
    const btnPrev = document.getElementById(`prev-${departamentoId}`);
    const btnNext = document.getElementById(`next-${departamentoId}`);

    if (!grid) return;

    let paginaAtual = 0;
    const LIMITE = 15;

    countEl.textContent = `Equipamentos: ${equipamentosFiltrados.length}`;

    function render() {
        grid.innerHTML = '';

        const inicio = paginaAtual * LIMITE;
        const fim = inicio + LIMITE;
        const slice = equipamentosFiltrados.slice(inicio, fim);

        if (!slice.length) {
            grid.innerHTML = `
        <div class="text-slate-500 text-sm col-span-5">
          Nenhum equipamento neste departamento.
        </div>
      `;
        }

        slice.forEach(equipamento => {
            const card = document.createElement('div');
            card.id = `equip-${equipamento.id}`;

            card.className =
                "bg-white rounded-lg shadow-sm p-3 flex flex-col justify-between h-28 cursor-pointer transition-transform duration-200 hover:shadow-md hover:scale-[1.03]";

            const statusClasse =
                equipamento.status === 'Ativo'
                    ? 'status-ativo'
                    : 'status-inativo';

            let tipoIcone = '';

            if (equipamento.tipo === 'Desktop') {
                tipoIcone = '<i class="fa-solid fa-desktop text-slate-600"></i>';
            } else if (equipamento.tipo === 'Notebook') {
                tipoIcone = '<i class="fa-solid fa-laptop text-slate-600"></i>';
            } else if (equipamento.tipo === 'Impressora') {
                tipoIcone = '<i class="fa-solid fa-print text-slate-600"></i>';
            } else if (equipamento.tipo === 'Telefone Ramal') {
                tipoIcone = '<i class="fa-solid fa-phone text-slate-600"></i>';
            }

            card.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="text-sm font-semibold truncate">
            ${equipamento.tipo}
          </div>

          <div class="text-base">
            ${tipoIcone}
          </div>
        </div>

        <div class="text-xs text-slate-500 leading-tight mt-1">
          Tombamento
        </div>

        <div class="text-sm font-medium truncate">
          ${equipamento.tombamento}
        </div>

        <div class="mt-2">
          <span class="status-label ${statusClasse}">
            ${equipamento.status}
          </span>
        </div>
      `;

            card.onclick = () => {
                // salva scroll atual
                localStorage.setItem('inventario_scroll', window.scrollY);
                // salva departamento atual
                localStorage.setItem('inventario_departamento', departamentoId);
                localStorage.setItem('inventario_equipamento', equipamento.id);
                location.hash = `#/equipamentos/${equipamento.id}`;
            };

            grid.appendChild(card);
        });

        const total = equipamentosFiltrados.length;
        const totalPaginas = Math.ceil(total / LIMITE);

        if (total <= LIMITE) {
            btnPrev.style.display = 'none';
            btnNext.style.display = 'none';
        } else {
            btnPrev.style.display = 'inline-flex';
            btnNext.style.display = 'inline-flex';
        }

        if (paginaAtual === 0) {
            btnPrev.style.display = 'none';
        }

        if (paginaAtual >= totalPaginas - 1) {
            btnNext.style.display = 'none';
        }

        btnPrev.disabled = paginaAtual === 0;
        btnNext.disabled = paginaAtual >= totalPaginas - 1;
    }

    btnPrev.onclick = () => {
        if (paginaAtual > 0) {
            paginaAtual--;
            render();
        }
    };

    btnNext.onclick = () => {
        const totalPaginas = Math.ceil(equipamentosFiltrados.length / LIMITE);

        if (paginaAtual < totalPaginas - 1) {
            paginaAtual++;
            render();
        }
    };

    render();

    atualizarGraficoConexao(departamentoId, equipamentosFiltrados);
    atualizarGraficoStatus(departamentoId, equipamentosFiltrados);
    atualizarGraficoCondicao(departamentoId, equipamentosFiltrados);
}


function atualizarGraficoConexao(departamentoId, equipamentos) {
    const grafico = document.getElementById(`grafico-conexao-${departamentoId}`);
    if (!grafico) return;

    let wifi = 0;
    let cabeado = 0;

    equipamentos.forEach(e => {
        const tipo = (e.tipo || '').toLowerCase();

        // 🔹 só computadores entram no cálculo
        const isComputador =
            tipo === 'desktop' || tipo === 'notebook';

        if (!isComputador) return; // ignora impressoras

        if (e.tipo_conexao === 'Wi-fi') wifi++;
        if (e.tipo_conexao === 'Cabeado') cabeado++;
    });

    const total = wifi + cabeado || 1;

    const wifiPct = Math.round((wifi / total) * 100);
    const cabPct = Math.round((cabeado / total) * 100);

    grafico.innerHTML = `
    <div class="space-y-2">
      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>Wi-Fi</span>
          <strong>${wifi}</strong>
        </div>
        <div class="w-full h-2 bg-slate-200 rounded">
          <div class="h-2 bg-indigo-600 rounded"
               style="width:${wifiPct}%"></div>
        </div>
      </div>

      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>Cabeado</span>
          <strong>${cabeado}</strong>
        </div>
        <div class="w-full h-2 bg-slate-200 rounded">
          <div class="h-2 bg-emerald-600 rounded"
               style="width:${cabPct}%"></div>
        </div>
      </div>
    </div>
  `;
}

function atualizarGraficoStatus(departamentoId, equipamentos) {
    const grafico = document.getElementById(`grafico-status-${departamentoId}`);
    if (!grafico) return;

    let computadores = 0;
    let impressoras = 0;
    let ramais = 0;

    equipamentos.forEach(e => {
        //const tipo = (e.tipo || '').toLowerCase();
        const tipo = (e.tipo || '').toLowerCase().trim();

        if (tipo === 'desktop' || tipo === 'notebook') {
            computadores++;
        }

        if (tipo === 'impressora') {
            impressoras++;
        }

        if (tipo === 'telefone ramal') {
            ramais++;
        }
    });

    const total = computadores + impressoras + ramais || 1;

    const compPct = Math.round((computadores / total) * 100);
    const impPct = Math.round((impressoras / total) * 100);
    const ramalPct = Math.round((ramais / total) * 100);

    // 👇 ADICIONA AQUI
    console.log({
        computadores,
        impressoras,
        ramais,
        total,
        compPct,
        impPct,
        ramalPct
    });

    grafico.innerHTML = `
    <div class="space-y-2">

      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>Computadores</span>
          <strong>${computadores}</strong>
        </div>
        <div class="w-full h-2 bg-slate-200 rounded">
          <div class="h-2 bg-indigo-600 rounded"
               style="width:${compPct}%"></div>
        </div>
      </div>

      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>Impressoras</span>
          <strong>${impressoras}</strong>
        </div>
        <div class="w-full h-2 bg-slate-200 rounded">
          <div class="h-2 bg-emerald-600 rounded"
               style="width:${impPct}%"></div>
        </div>
      </div>

      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>Ramais</span>
          <strong>${ramais}</strong>
        </div>
        <div class="w-full h-2 bg-slate-200 rounded">
          <div class="h-2 bg-orange-500 rounded"
               style="width:${ramalPct}%"></div>
        </div>
      </div>

    </div>
  `;
}


function atualizarGraficoCondicao(departamentoId, equipamentos) {
    const grafico = document.getElementById(`grafico-condicao-${departamentoId}`);
    if (!grafico) return;

    let operacional = 0;
    let manutencao = 0;

    equipamentos.forEach(e => {
        if (e.condicao === 'Operacional') operacional++;
        if (e.condicao === 'Manutenção') manutencao++;
    });

    const total = operacional + manutencao || 1;

    const opPct = Math.round((operacional / total) * 100);
    const manPct = Math.round((manutencao / total) * 100);

    grafico.innerHTML = `
    <div class="space-y-2">
      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>Operacional</span>
          <strong>${operacional}</strong>
        </div>
        <div class="w-full h-2 bg-slate-200 rounded">
          <div class="h-2 bg-indigo-600 rounded"
               style="width:${opPct}%"></div>
        </div>
      </div>

      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>Manutenção</span>
          <strong>${manutencao}</strong>
        </div>
        <div class="w-full h-2 bg-slate-200 rounded">
          <div class="h-2 bg-emerald-600 rounded"
               style="width:${manPct}%"></div>
        </div>
      </div>
    </div>
  `;
}

async function loadEquipamentoDetalhe() {
    const container = document.getElementById('equip-detalhe-titulo');
    if (!container) return;

    const path = location.hash.replace('#', '');
    const id = path.split('/')[2];
    if (!id) return;

    try {
        const equipamentos = listarEquipamentos();
        const equipamento = equipamentos.find(e => String(e.id) === String(id));

        if (!equipamento) {
            throw new Error('Equipamento não encontrado');
        }

        // ===============================
        // TÍTULO E SUBTÍTULO
        // ===============================
        document.getElementById('equip-detalhe-titulo').textContent =
            `Equipamento #${equipamento.id}`;

        document.getElementById('equip-detalhe-subtitulo').textContent =
            `${equipamento.tipo} • Tombamento ${equipamento.tombamento}`;


        // ===============================
        // CAMPOS PRINCIPAIS
        // ===============================
        const departamentos = listarDepartamentos();
        const departamento = departamentos.find(
            d => d.id === equipamento.departamento_id
        );
        document.getElementById('detalhe-tipo').textContent =
            equipamento.tipo || '-';

        document.getElementById('detalhe-tombamento').textContent =
            equipamento.tombamento || '-';

        document.getElementById('detalhe-departamento').textContent =
            departamento?.nome || '-';

        document.getElementById('detalhe-processador').textContent =
            equipamento.processador || '-';

        document.getElementById('detalhe-ram').textContent =
            equipamento.memoria_ram || '-';

        document.getElementById('detalhe-armazenamento').textContent =
            equipamento.memoria_interna ||
            equipamento.tipo_armazenamento ||
            '-';

        // Tipo de armazenamento (HD/SSD/NVMe)
        const elArmazenamentoTipo = document.getElementById('detalhe-armazenamento-tipo');
        if (elArmazenamentoTipo) {
            elArmazenamentoTipo.textContent = equipamento.tipo_armazenamento || '-';
        }

        // MAC Address
        const elMac = document.getElementById('detalhe-mac');
        if (elMac) {
            elMac.textContent = equipamento.mac_address || '-';
        }

        // Número do Ramal
        const elRamal = document.getElementById('detalhe-ramal');
        if (elRamal) {
            elRamal.textContent = equipamento.numero_ramal || '-';
        }

        document.getElementById('detalhe-nome-equipamento').textContent =
            equipamento.modelo || '-';

        document.getElementById('detalhe-usuario').textContent =
            equipamento.usuario_nome || '-';

        const elIp = document.getElementById('detalhe-ip');
        if (elIp) {
            elIp.textContent = equipamento.ip || '-';
        }

        // ===============================
        // ASIDE — SELECTS
        // ===============================
        const selectConexao = document.getElementById('select-conexao');
        const selectStatus = document.getElementById('select-status-equip');
        const selectCondicao = document.getElementById('select-condicao');
        const selectMover = document.getElementById('select-mover-departamento');

        if (selectConexao) {
            selectConexao.value = equipamento.tipo_conexao || 'Wi-fi';
        }

        if (selectStatus) {
            selectStatus.value = equipamento.status || 'Ativo';
        }

        if (selectCondicao) {
            selectCondicao.value = equipamento.condicao || 'Operacional';
        }

        // ===============================
        // CARREGAR DEPARTAMENTOS
        // ===============================
        try {
            const departamentos = listarDepartamentos();

            selectMover.innerHTML = '<option value="">Selecione</option>';

            departamentos.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep.id;
                option.textContent = dep.nome;

                if (dep.id === equipamento.departamento_id) {
                    option.selected = true;
                }

                selectMover.appendChild(option);
            });

        } catch (erroDepartamentos) {
            console.error('Erro ao carregar departamentos:', erroDepartamentos);
            selectMover.innerHTML =
                '<option value="">Erro ao carregar</option>';
        }



        // ===============================
        // HISTÓRICO DO EQUIPAMENTO
        // ===============================
        const historicoContainer = document.getElementById('historico-equipamento');

        if (historicoContainer) {
            try {
                // MOCK SIMPLES
                const historico = getHistoricoEquipamento(id);
                if (!historico.length) {
                    historicoContainer.innerHTML =
                        '<div class="text-sm text-slate-500">Nenhum evento registrado.</div>';
                } else {
                    historicoContainer.innerHTML = '';

                    historico.forEach(item => {
                        const linha = document.createElement('div');
                        linha.className =
                            'flex justify-between items-center text-sm gap-4';

                        linha.innerHTML = `
                    <div class="flex flex-col">
                        <span class="text-slate-700">
                            ${item.descricao}
                        </span>
                        <span class="text-xs text-slate-400">
                            ${formatDataHora(item.created_at)}
                        </span>
                    </div>

                    <button
                        class="text-red-600 hover:text-red-800 text-xs"
                        title="Excluir registro"
                    >
                        Excluir
                    </button>
                `;

                        const botaoExcluir = linha.querySelector('button');

                        botaoExcluir.onclick = () => {
                            if (!confirm('Deseja realmente excluir este registro do histórico?')) {
                                return;
                            }

                            linha.remove();
                        };

                        historicoContainer.appendChild(linha);
                    });
                }
            } catch (erroHistorico) {
                console.error('Erro ao carregar histórico:', erroHistorico);
                historicoContainer.innerHTML =
                    '<div class="text-sm text-red-600">Erro ao carregar histórico.</div>';
            }
        }

        async function excluirHistorico(historicoId, equipamentoId) {
            const confirmar = confirm(
                'Tem certeza que deseja excluir este registro do histórico?'
            );

            if (!confirmar) {
                return;
            }

            try {
                const response = await fetch(
                    `${API_BASE}/inventario/historico/${historicoId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            ...getAuthHeaders()
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Erro ao excluir histórico');
                }

                // recarrega o histórico do equipamento após exclusão
                const evento = new Event('recarregarHistorico');
                evento.equipamentoId = equipamentoId;
                document.dispatchEvent(evento);

            } catch (error) {
                console.error('Erro ao excluir histórico:', error);
                alert('Não foi possível excluir o registro do histórico.');
            }
        }

        // ===============================
        // UPLOAD DE ARQUIVO (SIMULADO)
        // ===============================
        const formUpload =
            document.getElementById('form-upload-equipamento');

        const inputArquivo =
            document.getElementById('input-arquivo-equipamento');

        const listaArquivos =
            document.getElementById('lista-arquivos-equipamento');

        if (formUpload && inputArquivo && listaArquivos) {
            formUpload.onsubmit = (evento) => {
                evento.preventDefault();

                if (!inputArquivo.files.length) {
                    alert('Selecione um arquivo');
                    return;
                }

                const arquivo = inputArquivo.files[0];
                const reader = new FileReader();

                reader.onload = function (e) {
                    const item = document.createElement('div');

                    item.className = 'flex items-center justify-between w-fit max-w-[320px] bg-white p-2 rounded-lg border';
                    const isImagem = arquivo.type.startsWith('image/');

                    item.innerHTML = `
                <div class="flex items-center gap-2">

                    ${isImagem ? `
                        <img 
                            src="${e.target.result}" 
                            class="w-24 h-16 object-cover rounded-md border"
                        />
                    ` : `
                        <div class="w-24 h-16 flex items-center justify-center bg-gray-200 rounded-md text-xs">
                            Arquivo
                        </div>
                    `}

                    <span class="text-xs truncate max-w-[120px]">
                        ${arquivo.name}
                    </span>

                </div>

                <button class="text-red-600 text-xs ml-2">
                    Excluir
                </button>
                `;
                    item.querySelector('button').onclick = () => {
                        if (!confirm('Deseja excluir este arquivo?')) return;
                        item.remove();
                    };

                    listaArquivos.innerHTML = '';
                    listaArquivos.appendChild(item);
                };

                reader.readAsDataURL(arquivo);

                inputArquivo.value = '';
                alert('Arquivo anexado (simulado)');
            };
        }

        // ===============================
        // BOTÃO SALVAR ALTERAÇÕES
        // ===============================
        const btnSalvar =
            document.getElementById('btn-salvar-equipamento');

        if (btnSalvar) {
            btnSalvar.onclick = async () => {
                btnSalvar.disabled = true;
                btnSalvar.textContent = 'Salvando...';

                const historicoAtual = getHistoricoEquipamento(id);

                // CONEXÃO
                if (equipamento.tipo_conexao !== selectConexao.value) {
                    historicoAtual.unshift({
                        descricao: `Conexão alterada de ${equipamento.tipo_conexao || '-'} para ${selectConexao.value}`,
                        created_at: new Date().toISOString()
                    });
                }

                // STATUS
                if (equipamento.status !== selectStatus.value) {
                    historicoAtual.unshift({
                        descricao: `Status alterado de ${equipamento.status || '-'} para ${selectStatus.value}`,
                        created_at: new Date().toISOString()
                    });
                }

                // CONDIÇÃO
                if (equipamento.condicao !== selectCondicao.value) {
                    historicoAtual.unshift({
                        descricao: `Condição alterada de ${equipamento.condicao || '-'} para ${selectCondicao.value}`,
                        created_at: new Date().toISOString()
                    });
                }

                // DEPARTAMENTO
                const departamentos = listarDepartamentos();

                const depAntigo = departamentos.find(d => d.id == equipamento.departamento_id);
                const depNovo = departamentos.find(d => d.id == selectMover.value);

                if (selectMover.value && equipamento.departamento_id != selectMover.value) {
                    historicoAtual.unshift({
                        descricao: `Movido do departamento ${depAntigo?.nome || '-'} para ${depNovo?.nome || '-'}`,
                        created_at: new Date().toISOString()
                    });
                }

                salvarHistoricoEquipamento(id, historicoAtual);

                try {
                    const atualizado = atualizarEquipamento(id, {
                        tipo_conexao: selectConexao.value,
                        status: selectStatus.value,
                        condicao: selectCondicao.value,
                        departamento_id:
                            selectMover.value || equipamento.departamento_id
                    });

                    salvarHistoricoEquipamento(id, historicoAtual);

                    if (!atualizado) {
                        alert('Erro ao atualizar equipamento');
                        return;
                    }

                    alert('Equipamento atualizado com sucesso');
                    loadEquipamentoDetalhe();

                } catch (erroUpdate) {
                    console.error('Erro ao salvar equipamento:', erroUpdate);
                    alert('Erro ao salvar alterações do equipamento');
                } finally {
                    btnSalvar.disabled = false;
                    btnSalvar.textContent =
                        'Salvar Alterações';
                }
            };
        }


        // ===============================
        // BOTÃO DELETAR
        // ===============================
        const btnDeletar =
            document.getElementById('btn-deletar-equipamento');

        if (btnDeletar) {
            btnDeletar.onclick = async () => {
                const confirmar = confirm(
                    'ATENÇÃO: Este equipamento será removido permanentemente do sistema.\n\nDeseja continuar?'
                );

                if (!confirmar) return;

                try {
                    const sucesso = deletarEquipamento(id);

                    if (!sucesso) {
                        alert('Erro ao deletar equipamento');
                        return;
                    }

                    alert('Equipamento deletado com sucesso');
                    location.hash = '#/inventario';

                } catch (erroDelete) {
                    console.error('Erro ao deletar equipamento:', erroDelete);
                    alert('Erro ao deletar equipamento');
                }
            };
        }

        // ===============================
        // LISTA DE ARQUIVOS (MOCK INICIAL)
        // ===============================
        if (listaArquivos) {
            listaArquivos.innerHTML = `
        <div class="text-sm text-slate-500">
            Nenhum arquivo anexado.
        </div>
    `;
        }


    } catch (erroGeral) {
        console.error('Erro ao carregar detalhes do equipamento:', erroGeral);
        alert('Erro ao carregar detalhes do equipamento');
    }
}
let historicoMemoria = {};

function getHistoricoEquipamento(equipamentoId) {
    return historicoMemoria[equipamentoId] || [];
}

function salvarHistoricoEquipamento(equipamentoId, historico) {
    historicoMemoria[equipamentoId] = historico;
}


async function initConfiguracoes() {

    const inputNome = document.getElementById('config-nome');
    const inputEmail = document.getElementById('config-email');

    if (!inputNome || !inputEmail) return;

    const user = getUsuarioLogado();

    inputNome.value = user.nome;
    inputEmail.value = user.email;

    // BLOQUEAR EDIÇÃO (DEMO)
    inputNome.disabled = true;
    inputEmail.disabled = true;
    // ===============================
    // SALVAR NOME E EMAIL
    // ===============================
    const btnSalvar = document.getElementById('btn-salvar-dados');
    const blocoCodigo = document.getElementById('email-validacao');
    const inputCodigo = document.getElementById('codigo-email');

    if (btnSalvar) {

        btnSalvar.disabled = true;
        btnSalvar.style.opacity = '0.6';
        btnSalvar.style.cursor = 'not-allowed';

        btnSalvar.title = "Função desabilitada na versão de demonstração";

        btnSalvar.onclick = (e) => {
            e.preventDefault();
            alert("Função desabilitada na versão de demonstração");
        };
    }

    const btnValidarCodigo = document.createElement('button');
    btnValidarCodigo.textContent = 'Validar código';
    btnValidarCodigo.className = 'btn-primary w-full mt-2';

    if (blocoCodigo && !document.getElementById('btn-validar-email')) {

        btnValidarCodigo.id = 'btn-validar-email';
        blocoCodigo.appendChild(btnValidarCodigo);

        btnValidarCodigo.onclick = async () => {

            const codigo = inputCodigo.value.trim();

            if (!codigo) {
                alert('Digite o código recebido');
                return;
            }

            btnValidarCodigo.disabled = true;
            btnValidarCodigo.textContent = 'Validando...';

            try {

                const response = await fetch(`${API_BASE}/usuarios/me/validar-codigo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeaders()
                    },
                    body: JSON.stringify({ codigo })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erro');
                }

                alert('Dados atualizados com sucesso');

                blocoCodigo.classList.add('hidden');
                inputCodigo.value = '';

            } catch (error) {
                alert(error.message);
            } finally {
                btnValidarCodigo.disabled = false;
                btnValidarCodigo.textContent = 'Validar código';
            }
        };
    }

    // ===============================
    // ALTERAR SENHA - ENVIAR CÓDIGO
    // ===============================
    const btnAlterarSenha = document.getElementById('btn-alterar-senha');
    const blocoSenhaValidacao = document.getElementById('senha-validacao');
    const inputSenhaAtual = document.getElementById('senha-atual');
    const inputNovaSenha = document.getElementById('nova-senha');
    const inputConfirmarSenha = document.getElementById('confirmar-senha');

    if (btnAlterarSenha) {

        btnAlterarSenha.disabled = true;
        btnAlterarSenha.style.opacity = '0.6';
        btnAlterarSenha.style.cursor = 'not-allowed';

        btnAlterarSenha.title = "Função desabilitada na versão de demonstração";

        btnAlterarSenha.onclick = (e) => {
            e.preventDefault();
            alert("Função desabilitada na versão de demonstração");
        };
    }

    // ===============================
    // VALIDAR CÓDIGO SENHA
    // ===============================
    const btnValidarSenha = document.getElementById('btn-validar-senha');
    const inputCodigoSenha = document.getElementById('codigo-senha');

    if (btnValidarSenha) {
        btnValidarSenha.onclick = async () => {

            const codigo = inputCodigoSenha.value.trim();

            if (!codigo) {
                alert('Digite o código recebido');
                return;
            }

            btnValidarSenha.disabled = true;
            btnValidarSenha.textContent = 'Validando...';

            try {

                const response = await fetch(`${API_BASE}/usuarios/me/senha/validar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeaders()
                    },
                    body: JSON.stringify({ codigo })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erro');
                }

                alert('Senha alterada com sucesso');

                blocoSenhaValidacao.classList.add('hidden');
                inputSenhaAtual.value = '';
                inputNovaSenha.value = '';
                inputConfirmarSenha.value = '';
                inputCodigoSenha.value = '';

            } catch (error) {
                alert(error.message);
            } finally {
                btnValidarSenha.disabled = false;
                btnValidarSenha.textContent = 'Validar código';
            }
        };
    }

    // ===============================
    // MOSTRAR SENHA AO SEGURAR
    // ===============================
    document.querySelectorAll('.ver-senha').forEach(icon => {

        const inputId = icon.getAttribute('data-target');
        const input = document.getElementById(inputId);

        icon.addEventListener('mousedown', () => {
            input.type = 'text';
        });

        icon.addEventListener('mouseup', () => {
            input.type = 'password';
        });

        icon.addEventListener('mouseleave', () => {
            input.type = 'password';
        });
    });

    // ===============================
    // MEDIDOR FORÇA SENHA (NÍVEL GOOGLE)
    // ===============================
    const novaSenhaInput = document.getElementById("nova-senha");
    const box = document.getElementById("forca-senha-box");

    if (novaSenhaInput) {

        novaSenhaInput.addEventListener("input", () => {

            const senha = novaSenhaInput.value;
            box.classList.remove("hidden");

            let pontos = 0;

            const regras = {
                tamanho: senha.length >= 6,
                maiuscula: /[A-Z]/.test(senha),
                minuscula: /[a-z]/.test(senha),
                numero: /\d/.test(senha),
                especial: /[@$!%*?&]/.test(senha)
            };

            // atualizar checklist visual
            for (let key in regras) {
                const el = document.getElementById("req-" + key);
                if (!el) continue;

                if (regras[key]) {
                    el.style.color = "#16a34a";
                    pontos++;
                } else {
                    el.style.color = "#64748b";
                }
            }

            const barra = document.getElementById("forca-barra");

            // força visual
            if (pontos <= 2) {
                barra.style.width = "33%";
                barra.style.background = "#dc2626"; // vermelho
            }
            else if (pontos <= 4) {
                barra.style.width = "66%";
                barra.style.background = "#f59e0b"; // amarelo
            }
            else {
                barra.style.width = "100%";
                barra.style.background = "#16a34a"; // verde
            }

            if (!senha) {
                box.classList.add("hidden");
            }

        });
    }


    // ===============================
    // LOGOUT
    // ===============================
    const btnLogout = document.getElementById('btn-logout');

    if (btnLogout) {
        btnLogout.onclick = () => {

            const confirmar = confirm('Deseja realmente sair do sistema?');

            if (!confirmar) return;

            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            window.location.href = "/demonstracao-sistema-ti/index.html";
        };
    }

    // BLOQUEAR VOLTAR SEM LOGIN
    window.addEventListener("pageshow", function () {
        const token = localStorage.getItem("token");

        if (!token && window.location.pathname.includes("index-sistema")) {
            window.location.href = "/demonstracao-sistema-ti/index.html";
        }
    });

    // ===============================
    // TOGGLE DARK MODE GLOBAL
    // ===============================
    const toggleTema = document.getElementById("toggle-tema");

    if (toggleTema) {

        // aplicar estado salvo
        const temaAtual = localStorage.getItem("tema");
        if (temaAtual === "dark") {
            toggleTema.checked = true;
        }

        toggleTema.addEventListener("change", () => {

            if (toggleTema.checked) {
                document.body.classList.add("dark");
                localStorage.setItem("tema", "dark");
            } else {
                document.body.classList.remove("dark");
                localStorage.setItem("tema", "light");
            }

        });
    }
}

// ===============================================
// 🔵 DADOS DO USUÁRIO NA SIDEBAR
// ===============================================
async function carregarUsuarioSidebar() {

    const user = getUsuarioLogado();

    // nome
    document.getElementById("userNome").textContent = user.nome;

    // email
    document.getElementById("userEmail").textContent = user.email;

    // matrícula + departamento
    document.getElementById("userExtra").textContent =
        "Matrícula: " + (user.matricula || "-") +
        " • " +
        (user.departamento || "Sem departamento");

    // iniciais
    const partes = user.nome.split(" ");
    let iniciais = partes[0][0];

    if (partes.length > 1) {
        iniciais += partes[partes.length - 1][0];
    }

    document.getElementById("userAvatar").textContent = iniciais.toUpperCase();
}


// ===============================
// DASHBOARD INIT
// ===============================
async function initDashboard() {
    await loadDashboardStats();
    await loadUltimosChamados();
    await loadChamadosPorTipo();
}

// ===============================
// HEADER DINÂMICO POR PÁGINA
// ===============================
function updateHeaderByRoute(route) {

    const titleEl = document.getElementById('page-title');
    const descEl = document.getElementById('page-description');

    // 🔥 MOBILE
    const titleMobile = document.getElementById('page-title-mobile');
    const descMobile = document.getElementById('page-description-mobile');

    const btn = document.getElementById('btn-novo-chamado');
    const btnMobile = document.getElementById('btn-novo-chamado-mobile');

    if (!titleEl || !descEl) return;

    const map = {
        '/dashboard': {
            title: 'Dashboard',
            desc: 'Visão geral do sistema de TI',
            button: {
                text: 'Novo Chamado',
                action: () => (location.hash = '#/novo-chamado')
            }
        },
        '/chamados': {
            title: 'Chamados',
            desc: 'Lista e acompanhamento dos chamados',
            button: {
                text: 'Novo Chamado',
                action: () => (location.hash = '#/novo-chamado')
            }
        },
        '/novo-chamado': {
            title: 'Novo Chamado',
            desc: 'Abertura de um novo chamado',
        },
        '/inventario': {
            title: 'Inventário',
            desc: 'Controle de equipamentos e ativos',
            button: {
                text: 'Novo Equipamento',
                action: () => (location.hash = '#/novo-equipamento')
            }
        },
        '/novo-equipamento': {
            title: 'Novo Equipamento',
            desc: 'Criação de um novo equipamento'
        },
        '/usuarios': {
            title: 'Usuários',
            desc: 'Gerenciamento de usuários do sistema'
        },
        '/tutoriais': {
            title: 'Tutoriais',
            desc: 'Guias e materiais de apoio'
        },
        '/configuracoes': {
            title: 'Configurações',
            desc: 'Parâmetros e ajustes do sistema'
        }
    };

    if (route.startsWith('/chamados/')) {
        const title = 'Detalhes do Chamado';
        const desc = 'Informações completas e gerenciamento';

        titleEl.textContent = title;
        descEl.textContent = desc;

        if (titleMobile) titleMobile.textContent = title;
        if (descMobile) descMobile.textContent = desc;

        if (btn) btn.style.display = 'none';
        if (btnMobile) btnMobile.style.display = 'none';
        return;
    }

    const conf = map[route] || map['/dashboard'];

    // 🔥 DESKTOP
    titleEl.textContent = conf.title;
    descEl.textContent = conf.desc;

    // 🔥 MOBILE (AQUI ESTAVA O ERRO)
    if (titleMobile) titleMobile.textContent = conf.title;
    if (descMobile) descMobile.textContent = conf.desc;

    // botão desktop
    if (btn) {
        if (conf.button) {
            btn.style.display = 'inline-flex';
            btn.textContent = conf.button.text;
            btn.onclick = conf.button.action;
        } else {
            btn.style.display = 'none';
        }
    }

    // botão mobile
    if (btnMobile) {
        if (conf.button) {
            //btnMobile.style.display = 'inline-flex';
            btnMobile.textContent = conf.button.text;
            btnMobile.onclick = conf.button.action;
        } else {
            btnMobile.style.display = 'none';
        }
    }
}

// ==========================================
// 🔒 BLINDAGEM ABSOLUTA DE SESSÃO
// ==========================================
(function () {

    const token = localStorage.getItem("token");
    if (!token) return;

    // primeira página após login
    if (!sessionStorage.getItem("sessao_iniciada")) {
        sessionStorage.setItem("sessao_iniciada", "1");
        sessionStorage.setItem("pagina_raiz", location.href);
    }

    const paginaRaiz = sessionStorage.getItem("pagina_raiz");

    // cria armadilha de histórico sempre
    function criarBloqueio() {
        history.pushState({ trap: true }, "", location.href);
    }

    criarBloqueio();

    let mostrando = false;

    window.addEventListener("popstate", function () {

        // só proteger quando voltar pra primeira página
        if (location.href !== paginaRaiz) return;

        if (mostrando) return;
        mostrando = true;

        const sair = confirm("Deseja sair da sua conta?");

        if (sair) {

            localStorage.removeItem("token");
            sessionStorage.clear();

            window.location.replace("index.html");
            return;

        } else {
            // recria armadilha SEMPRE
            criarBloqueio();

            setTimeout(() => {
                mostrando = false;
            }, 200);
        }

    });

})();


// executar
setTimeout(carregarUsuarioSidebar, 500);
setTimeout(carregarUsuarioSidebar, 1200);
setTimeout(carregarUsuarioSidebar, 2000); 