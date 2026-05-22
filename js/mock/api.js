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
        },
        {
            id: 4,
            numero: "20260101004",
            titulo: "Impressora não funciona",
            status: "Aberto",
            prioridade: "Baixa",
            tipo: "Hardware",
            solicitante_nome: "Ana Paula",
            tecnico: "Técnico 1",
            arquivado: false
        },
         
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