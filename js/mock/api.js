// ===============================
// BANCO MOCK (DADOS FICTÍCIOS)
// ===============================
const DB_INICIAL = {
    usuarios: [
        {
            id: 1,
            nome: "Administrador",
            login: "programador",
            nivel: "admin"
        }
    ],

    departamentos: [
        { id: 1, nome: "Setor de TI" },
        { id: 2, nome: "Setor Financeiro" },
        { id: 3, nome: "Recursos Humanos" }
        

    ],

    equipamentos: [
        {
            id: 1,
            tipo: "Desktop",
            modelo: "Dell Optiplex",
            tombamento: "255975",
            status: "Ativo",
            condicao: "Manutenção",
            tipo_conexao: "Wi-fi",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i5-14500T",
            mac_address: "D0-94-66-E7-B4-72",
            usuario_nome: "Isabel",
            departamento_id: 1
        },
            {
            id: 2,
            tipo: "Impressora",
            modelo: "HP LaserJet",
            tombamento: "255976",
            status: "Ativo",
            condicao: "Manutenção",
            tipo_conexao: "Wi-fi",
            memoria_ram: "8GB",
            memoria_interna: "256GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i3-12100T",
            mac_address: "D0-94-66-E7-B4-73",
            usuario_nome: "Carlos",
            departamento_id: 1
        },
        {
            id: 3,
            tipo: "Notebook",
            modelo: "Dell Inspiron",
            tombamento: "255976",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: " Wi-fi",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i7-14700T",
            mac_address: "D0-94-66-E7-B4-73",
            usuario_nome: "Carlos",
            departamento_id: 1
        },
        {
            id: 3,
            tipo: "Desktop",
            modelo: "HP EliteDesk",
            tombamento: "255977",
            status: "Inativo",
            condicao: "Manutenção",
            tipo_conexao: "Cabeado",
            memoria_ram: "8GB",
            memoria_interna: "256GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i3-12100T",
            mac_address: "D0-94-66-E7-B4-74",
            usuario_nome: "Ana",
            departamento_id: 1
        },

        {
            id: 4,
            tipo: "Notebook",
            modelo: "Lenovo ThinkPad",
            tombamento: "255978",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-Fi",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i7-14700T",
            mac_address: "D0-94-66-E7-B4-75",
            usuario_nome: "Pedro",
            departamento_id: 1
        },
        {
            id: 5,
            tipo: "Desktop",
            modelo: "HP EliteDesk",
            tombamento: "255979",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Cabeado",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i5-14500T",
            mac_address: "D0-94-66-E7-B4-76",
            usuario_nome: "Fernanda",
            departamento_id: 1
        },

        {
            id: 6,
            tipo: "Desktop",
            modelo: "Dell Inspiron",
            tombamento: "255980",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-Fi",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i7-14700T",
            mac_address: "D0-94-66-E7-B4-77",
            usuario_nome: "Lucas",
            departamento_id: 1
        },
            {
            id: 7,
            tipo: "Notebook",
            modelo: "Lenovo ThinkPad",
            tombamento: "255981",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: " Wi-fi",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i7-14700T",
            mac_address: "D0-94-66-E7-B4-78",
            usuario_nome: "Juliana",
            departamento_id: 2
        },

            {
            id: 7,
            tipo: "Impressora",
            modelo: "HP LaserJet",
            tombamento: "255976",
            status: "Ativo",
            condicao: "Manutenção",
            tipo_conexao: "Wi-fi",
            memoria_ram: "8GB",
            memoria_interna: "256GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i3-12100T",
            mac_address: "D0-94-66-E7-B4-73",
            usuario_nome: "Carlos",
            departamento_id: 2
        },

            {
            id: 8,
            tipo: "Desktop",
            modelo: "HP EliteDesk",
            tombamento: "255982",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Cabeado",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i5-14500T",
            mac_address: "D0-94-66-E7-B4-79",
            usuario_nome: "Roberto",
            departamento_id: 2
        },
            {
            id: 9,
            tipo: "Notebook",
            modelo: "Lenovo ThinkPad",
            tombamento: "255983",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-fi",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i7-14700T",
            mac_address: "D0-94-66-E7-B4-80",
            usuario_nome: "Camila",
            departamento_id: 2
        },  
            {
            id: 10,
            tipo: "Desktop",
            modelo: "Dell Inspiron",
            tombamento: "255984",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Cabeado",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i5-14500T",
            mac_address: "D0-94-66-E7-B4-81",
            usuario_nome: "Ana Paula",
            departamento_id: 2
        },
            {
            id: 11,
            tipo: "Notebook",
            modelo: "Dell Inspiron",
            tombamento: "255985",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-fi",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i7-14700T",
            mac_address: "D0-94-66-E7-B4-82",
            usuario_nome: "Felix",
            departamento_id: 2
        },
            {
            id: 12,
            tipo: "Desktop",
            modelo: "HP EliteDesk",
            tombamento: "255986",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Cabeado",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i5-14500T",
            mac_address: "D0-94-66-E7-B4-83",
            usuario_nome: "Francisca",
            departamento_id: 2
        }, 
            {
            id: 13,
            tipo: "Notebook",
            modelo: "Dell Inspiron",
            tombamento: "255987",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-fi",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i7-14700T",
            mac_address: "D0-94-66-E7-B4-84",
            usuario_nome: "Otávio",
            departamento_id: 2
        },
            {
            id: 14,
            tipo: "Telefone Ramal",
            modelo: "Samsung Galaxy S21",
            tombamento: "255988",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Sem Fio",
            memoria_ram: "8GB",
            memoria_interna: "128GB",
            tipo_armazenamento: "SSD NvME",
            processador: "Snapdragon 888",
            mac_address: "D0-94-66-E7-B4-85",
            usuario_nome: "Luiza",
            departamento_id: 2
        },
            {
            id: 15,
            tipo: "Telefone Ramal",
            modelo: "Samsung Galaxy S21",
            tombamento: "255989",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-fi",
            memoria_ram: "8GB",
            memoria_interna: "128GB",
            tipo_armazenamento: "SSD NvME",
            processador: "Snapdragon 888",
            mac_address: "D0-94-66-E7-B4-86",
            usuario_nome: "André",
            departamento_id: 1
        }, 
            {
            id: 16,
            tipo: "Telefone Ramal",
            modelo: "Samsung Galaxy S21",
            tombamento: "255990",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-fi",
            memoria_ram: "8GB",
            memoria_interna: "128GB",
            tipo_armazenamento: "SSD NvME",
            processador: "Snapdragon 888",
            mac_address: "D0-94-66-E7-B4-87",
            usuario_nome: "Ana Luisa",
            departamento_id: 3
        },
                {
            id: 17,
            tipo: "Desktop",
            modelo: "Samsung Galaxy S21",
            tombamento: "255991",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-fi",
            memoria_ram: "8GB",
            memoria_interna: "128GB",
            tipo_armazenamento: "SSD NvME",
            processador: "Snapdragon 888",
            mac_address: "D0-94-66-E7-B4-88",
            usuario_nome: "Ana Vitoria",
            departamento_id: 3
        },
        {
            id: 18,
            tipo: "Desktop",
            modelo: "Samsung Galaxy S21",
            tombamento: "255992",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-fi",
            memoria_ram: "8GB",
            memoria_interna: "128GB",
            tipo_armazenamento: "SSD NvME",
            processador: "Snapdragon 888",
            mac_address: "D0-94-66-E7-B4-89",
            usuario_nome: "Diego",
            departamento_id: 3
        },
            {
            id: 19,
            tipo: "Desktop",
            modelo: "Samsung Galaxy S21",
            tombamento: "255993",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-fi",
            memoria_ram: "8GB",
            memoria_interna: "128GB",
            tipo_armazenamento: "SSD NvME",
            processador: "Snapdragon 888",
            mac_address: "D0-94-66-E7-B4-90",
            usuario_nome: "Marcelo",
            departamento_id: 3
        },

            {
            id: 20,
            tipo: "Impressora",
            modelo: "HP LaserJet",
            tombamento: "255994",
            status: "Ativo",
            condicao: "Manutenção",
            tipo_conexao: "Wi-fi",
            memoria_ram: "8GB",
            memoria_interna: "256GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i3-12100T",
            mac_address: "D0-94-66-E7-B4-91",
            usuario_nome: "Antonio",
            departamento_id: 3
            },


            {
            id: 20,
            tipo: "Desktop",
            modelo: "Samsung Galaxy S21",
            tombamento: "255994",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Wi-fi",
            memoria_ram: "8GB",
            memoria_interna: "128GB",
            tipo_armazenamento: "SSD NvME",
            processador: "Snapdragon 888",
            mac_address: "D0-94-66-E7-B4-91",
            usuario_nome: "David",
            departamento_id: 3
        }
    ],

    chamados: [
    {
        id: 1,
        numero: "20260101001",
        titulo: "Computador não liga",
        descricao: "O computador não liga ao pressionar o botão de energia. Não apresenta sinais de funcionamento.",

        status: "Aberto",
        prioridade: "Alta",
        tipo: "Hardware",

        solicitante_nome: "João Silva",
        telefone_contato: "85999999901",

        departamento_id: 1,
        departamento_nome: "Setor de TI",

        equipamento_tombamento: "255975",

        tecnico: "Analista 1",

        created_at: new Date().toISOString(),

        arquivado: false
    },
    {
        id: 2,
        numero: "20260101002",
        titulo: "Sistema lento",
        descricao: "O sistema apresenta lentidão ao abrir aplicações e executar tarefas básicas do dia a dia.",

        status: "Em Andamento",
        prioridade: "Média",
        tipo: "Software",

        solicitante_nome: "Maria Souza",
        telefone_contato: "85999999902",

        departamento_id: 2,
        departamento_nome: "Setor Financeiro",

        equipamento_tombamento: "255984",

        tecnico: "Técnico 1",

        created_at: new Date().toISOString(),

        arquivado: false
    },
    {
        id: 3,
        numero: "20260101003",
        titulo: "Sem internet",
        descricao: "O equipamento não consegue acessar a rede. Sem conexão com a internet via Wi-Fi ou cabo.",

        status: "Resolvido",
        prioridade: "Alta",
        tipo: "Rede",

        solicitante_nome: "Carlos Lima",
        telefone_contato: "85999999903",

        departamento_id: 1,
        departamento_nome: "Recursos Humanos",

        equipamento_tombamento: "255980",

        tecnico: "Tecnico 2",

        created_at: new Date().toISOString(),

        arquivado: false
    },
{
        id: 4,
        numero: "20260101004",
        titulo: "Impressora não funciona",
        descricao: "A impressora não está respondendo aos comandos de impressão enviados pelo sistema.",

        status: "Aberto",
        prioridade: "Baixa",
        tipo: "Hardware",

        solicitante_nome: "Ana Paula",
        telefone_contato: "85999999904",

        departamento_id: 2,
        departamento_nome: "Setor Financeiro",

        equipamento_tombamento: "255976",

        tecnico: "Tecnico 3",

        created_at: new Date().toISOString(),

        arquivado: false
    },

    // ===== CHAMADOS ARQUIVADOS DE EXEMPLO (datas variadas) =====
    {
        id: 101,
        numero: "20260105001",
        titulo: "PC não liga",
        descricao: "Equipamento sem energia após queda de luz.",
        status: "Resolvido",
        prioridade: "Alta",
        tipo: "Hardware",
        solicitante_nome: "Daniele",
        telefone_contato: "85999990001",
        departamento_id: 1,
        departamento_nome: "Setor de TI",
        equipamento_tombamento: "255975",
        tecnico: "Técnico 1",
        created_at: "2026-01-05T10:00:00.000Z",
        arquivado: true
    },
    {
        id: 102,
        numero: "20260105002",
        titulo: "Troca de toner",
        descricao: "Impressora solicitando substituição de toner.",
        status: "Resolvido",
        prioridade: "Baixa",
        tipo: "Impressora",
        solicitante_nome: "Marcelo",
        telefone_contato: "85999990002",
        departamento_id: 3,
        departamento_nome: "Recursos Humanos",
        equipamento_tombamento: "255994",
        tecnico: "Técnico 2",
        created_at: "2026-01-05T14:30:00.000Z",
        arquivado: true
    },
    {
        id: 103,
        numero: "20260320001",
        titulo: "Sistema travando",
        descricao: "Aplicação fecha sozinha durante o uso.",
        status: "Resolvido",
        prioridade: "Média",
        tipo: "Software",
        solicitante_nome: "Camila",
        telefone_contato: "85999990003",
        departamento_id: 2,
        departamento_nome: "Setor Financeiro",
        equipamento_tombamento: "255983",
        tecnico: "Analista 1",
        created_at: "2026-03-20T09:15:00.000Z",
        arquivado: true
    },
    {
        id: 104,
        numero: "20260610001",
        titulo: "Sem acesso à rede",
        descricao: "Computador não conecta ao Wi-Fi corporativo.",
        status: "Resolvido",
        prioridade: "Alta",
        tipo: "Rede",
        solicitante_nome: "Diego",
        telefone_contato: "85999990004",
        departamento_id: 3,
        departamento_nome: "Recursos Humanos",
        equipamento_tombamento: "255992",
        tecnico: "Técnico 3",
        created_at: "2026-06-10T11:00:00.000Z",
        arquivado: true
    },
    {
        id: 105,
        numero: "20260610002",
        titulo: "Configuração de e-mail",
        descricao: "Necessário configurar conta de e-mail no Outlook.",
        status: "Resolvido",
        prioridade: "Baixa",
        tipo: "Software",
        solicitante_nome: "Francisca",
        telefone_contato: "85999990005",
        departamento_id: 2,
        departamento_nome: "Setor Financeiro",
        equipamento_tombamento: "255986",
        tecnico: "Técnico 1",
        created_at: "2026-06-10T16:45:00.000Z",
        arquivado: true
    },
    {
        id: 106,
        numero: "20260625001",
        titulo: "Mouse com defeito",
        descricao: "Mouse não responde aos cliques.",
        status: "Resolvido",
        prioridade: "Baixa",
        tipo: "Hardware",
        solicitante_nome: "André",
        telefone_contato: "85999990006",
        departamento_id: 1,
        departamento_nome: "Setor de TI",
        equipamento_tombamento: "255989",
        tecnico: "Técnico 2",
        created_at: "2026-06-25T08:20:00.000Z",
        arquivado: true
    }
],

    anotacoes: [
        {
            id: 1,
            chamado_id: 1,
            texto: "Primeira anotação do sistema",
            autor_nome: "Administrador",
            created_at: new Date().toISOString()
        }
    ]
};

export function getUsuarioLogado() {
    return {
        nome: "Administrador",
        email: "emailficiticio@email.com",
        matricula: "0001",
        departamento: "Setor de TI"
    };
}

// ===============================
// RESET AUTOMÁTICO
// ===============================
function resetarSistema() {
    localStorage.setItem("db_mock", JSON.stringify(DB_INICIAL));
}

// 🔥 EXECUTA SEMPRE AO CARREGAR
resetarSistema();

// ===============================
// HELPERS
// ===============================
function getDB() {
    return JSON.parse(localStorage.getItem("db_mock"));
}

function setDB(data) {
    localStorage.setItem("db_mock", JSON.stringify(data));
}

// ===============================
// AUTH FAKE
// ===============================
export function login(login, senha) {
    if (login === "programador" && senha === "@123") {
        localStorage.setItem("auth", JSON.stringify({
            nome: "Administrador",
            nivel: "admin"
        }));

        return { success: true };
    }

    return { error: "Credenciais inválidas" };
}

// ===============================
// CHAMADOS
// ===============================
export function listarChamados() {
    const db = getDB();
    return db.chamados;
}

export function criarChamado(data) {
    const db = getDB();

    const novo = {
        id: Date.now(),
        numero: Date.now().toString(),
        ...data,
        status: "Aberto"
    };

    db.chamados.push(novo);
    setDB(db);

    return novo;
}

export function getChamadoById(id) {
    const db = getDB();
    return db.chamados.find(c => String(c.id) === String(id));
}

export function atualizarChamado(id, dados) {
    const db = getDB();

    const index = db.chamados.findIndex(c => String(c.id) === String(id));

    if (index === -1) return null;

    db.chamados[index] = {
        ...db.chamados[index],
        ...dados
    };

    setDB(db);

    return db.chamados[index];
}

export function arquivarChamado(id) {
    const db = getDB();

    const chamado = db.chamados.find(c => String(c.id) === String(id));
    if (!chamado) return null;

    chamado.arquivado = true;

    setDB(db);

    return chamado;
}

export function restaurarChamado(id) {
    const db = getDB();

    const chamado = db.chamados.find(c => String(c.id) === String(id));
    if (!chamado) return null;

    chamado.arquivado = false;

    setDB(db);

    return chamado;
}

export function deletarChamado(id) {
    const db = getDB();

    db.chamados = db.chamados.filter(c => String(c.id) !== String(id));

    setDB(db);

    return true;
}

export function listarAnotacoes(chamadoId) {
    const db = getDB();
    return db.anotacoes.filter(a => String(a.chamado_id) === String(chamadoId));
}

export function criarAnotacao(chamadoId, texto) {
    const db = getDB();

    const nova = {
        id: Date.now(),
        chamado_id: Number(chamadoId),
        texto,
        autor_nome: "Administrador",
        created_at: new Date().toISOString()
    };

    db.anotacoes.push(nova);
    setDB(db);

    return nova;
}

export function deletarAnotacao(id) {
    const db = getDB();

    db.anotacoes = db.anotacoes.filter(a => String(a.id) !== String(id));

    setDB(db);
}

// ===============================
// EQUIPAMENTOS
// ===============================
export function listarEquipamentos() {
    const db = getDB();
    return db.equipamentos;
}

export function criarEquipamento(data) {
    const db = getDB();

    const novo = {
        id: Date.now(),
        status: "Ativo",
        condicao: "Operacional",
        ...data
    };

    db.equipamentos.push(novo);
    setDB(db);

    return novo;
}

// ===============================
// ATUALIZAR EQUIPAMENTO
// ===============================
export function atualizarEquipamento(id, dados) {
    const db = getDB();

    const index = db.equipamentos.findIndex(e => String(e.id) === String(id));

    if (index === -1) return null;

    db.equipamentos[index] = {
        ...db.equipamentos[index],
        ...dados
    };

    setDB(db);

    return db.equipamentos[index];
}

// ===============================
// DELETAR EQUIPAMENTO
// ===============================
export function deletarEquipamento(id) {
    const db = getDB();

    db.equipamentos = db.equipamentos.filter(
        e => String(e.id) !== String(id)
    );

    setDB(db);

    return true;
}

// ===============================
// DEPARTAMENTOS
// ===============================
export function listarDepartamentos() {
    const db = getDB();
    return db.departamentos;
}

export function listarChamadosComFiltros({
    search = "",
    status = "",
    tipo = "",
    tecnico = "",
    page = 1,
    limit = 10,
    arquivado = false
}) {
    let chamados = getDB().chamados;

    // filtro arquivado
    chamados = chamados.filter(c => c.arquivado === arquivado);

    // busca
    if (search) {
        chamados = chamados.filter(c =>
            c.numero.includes(search) ||
            c.titulo.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (status) chamados = chamados.filter(c => c.status === status);
    if (tipo) chamados = chamados.filter(c => c.tipo === tipo);
    if (tecnico) chamados = chamados.filter(c => c.tecnico === tecnico);

    const total = chamados.length;

    const inicio = (page - 1) * limit;
    const fim = inicio + limit;

    const data = chamados.slice(inicio, fim);

    return {
        data,
        total
    };
}

// ===============================
// ARQUIVADOS — FILTRO POR DIA OU MÊS (MOCK)
// data  = 'YYYY-MM-DD'  → filtra um dia
// mesAno = 'YYYY-MM'    → filtra um mês inteiro
// ===============================
export function listarArquivadosPorData({
    page = 1,
    limit = 10,
    data = "",
    mesAno = ""
} = {}) {
    let chamados = getDB().chamados.filter(c => c.arquivado === true);

    const extrairDiaISO = (iso) => {
        const d = new Date(iso);
        const ano = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };

    if (mesAno) {
        chamados = chamados.filter(c => extrairDiaISO(c.created_at).startsWith(mesAno));
    } else if (data) {
        chamados = chamados.filter(c => extrairDiaISO(c.created_at) === data);
    }

    // ordena cronologicamente (mais antigo primeiro)
    chamados.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const total = chamados.length;
    const inicio = (page - 1) * limit;
    const fim = inicio + limit;

    return {
        data: chamados.slice(inicio, fim),
        total
    };
}


// ===============================
// ARQUIVADOS — DIAS DO ANO QUE POSSUEM ARQUIVADOS (MOCK)
// retorna ['YYYY-MM-DD', ...]
// ===============================
export function listarDiasComArquivados(ano) {
    const chamados = getDB().chamados.filter(c => c.arquivado === true);

    const dias = chamados
        .map(c => {
            const d = new Date(c.created_at);
            const a = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const dia = String(d.getDate()).padStart(2, '0');
            return `${a}-${m}-${dia}`;
        })
        .filter(iso => iso.startsWith(String(ano)));

    return [...new Set(dias)];
}