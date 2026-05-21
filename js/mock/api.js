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
        { id: 1, nome: "TI" },
        { id: 2, nome: "Financeiro" },
        { id: 3, nome: "Recursos Humanos" }

    ],

    equipamentos: [
        {
            id: 1,
            tipo: "Desktop",
            modelo: "Dell Optiplex",
            tombamento: "255975",
            status: "Ativo",
            condicao: "Operacional",
            tipo_conexao: "Cabeado",
            memoria_ram: "16GB",
            memoria_interna: "512GB",
            tipo_armazenamento: "SSD NvME",
            processador: "i5-14500T",
            mac_address: "D0-94-66-E7-B4-72",
            usuario_nome: "Isabel",
            departamento_id: 1
        }
    ],

    chamados: [
        {
            id: 1,
            numero: "20260101001",
            titulo: "Computador não liga",
            status: "Aberto",
            prioridade: "Alta",
            tipo: "Hardware",
            solicitante_nome: "João Silva",
            tecnico: "Técnico 1",
            arquivado: false
        },
        {
            id: 2,
            numero: "20260101002",
            titulo: "Sistema lento",
            status: "Em Andamento",
            prioridade: "Média",
            tipo: "Software",
            solicitante_nome: "Maria Souza",
            tecnico: "Técnico 2",
            arquivado: false
        },
        {
            id: 3,
            numero: "20260101003",
            titulo: "Sem internet",
            status: "Resolvido",
            prioridade: "Alta",
            tipo: "Rede",
            solicitante_nome: "Carlos Lima",
            tecnico: "Técnico 3",
            arquivado: false
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
        email: "emailFiciticio@email.com",
        matricula: "50505",
        departamento: "Tecnologia da Informação"
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