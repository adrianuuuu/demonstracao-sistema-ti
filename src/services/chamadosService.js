import { listarChamados } from "../../js/mock/api.js";
import { getChamadoById } from "../../js/mock/api.js";

export function getChamado(id) {
    return getChamadoById(id);
}

import { atualizarChamado } from "../../js/mock/api.js";

export function updateChamado(id, dados) {
    return atualizarChamado(id, dados);
}

import { arquivarChamado, restaurarChamado } from "../../js/mock/api.js";

export function arquivar(id) {
    return arquivarChamado(id);
}

export function restaurar(id) {
    return restaurarChamado(id);
}

import { deletarChamado } from "../../js/mock/api.js";

export function removerChamado(id) {
    return deletarChamado(id);
}

// ===============================
// LISTAR CHAMADOS (COM PAGINAÇÃO)
// ===============================
export function getChamados({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    tipo = "",
    tecnico = "",
    arquivado = false
} = {}) {

    let chamados = listarChamados();

    // 🔥 FILTRO PRINCIPAL (ESSA LINHA RESOLVE TUDO)
    chamados = chamados.filter(c => c.arquivado === arquivado);

    // 🔍 BUSCA
    if (search) {
        chamados = chamados.filter(c =>
            c.numero.includes(search) ||
            c.titulo.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (status) {
        chamados = chamados.filter(c => c.status === status);
    }

    if (tipo) {
        chamados = chamados.filter(c => c.tipo === tipo);
    }

    if (tecnico) {
        chamados = chamados.filter(c => c.tecnico === tecnico);
    }

    const total = chamados.length;

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        data: chamados.slice(start, end),
        total
    };
}