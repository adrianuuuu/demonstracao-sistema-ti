// src/services/dashboardService.js

import {
    listarChamados,
    listarEquipamentos
} from "../../js/mock/api.js";

// ===============================
// MOCK DASHBOARD STATS
// ===============================
export function getDashboardStats() {
    const chamados = listarChamados();
    const equipamentos = listarEquipamentos();

    const abertos = chamados.filter(c => c.status === "Aberto").length;
    const andamento = chamados.filter(c => c.status === "Em Andamento").length;
    const resolvidos = chamados.filter(c => c.status === "Resolvido").length;

    return {
        abertos,
        andamento,
        resolvidos,
        equipamentos: equipamentos.length
    };
}

// ===============================
// MOCK ÚLTIMOS CHAMADOS
// ===============================
export function getUltimosChamados() {
    const chamados = listarChamados();

    return chamados
        .slice(-5) // últimos 5
        .reverse()
        .map(c => ({
            id: c.id,
            numero: c.numero,
            titulo: c.titulo,
            status: c.status,
            prioridade: c.prioridade,
            solicitante_nome: c.solicitante_nome,
            departamento_nome: c.departamento_nome || c.departamento || 'Sem setor'
        }));
}

// ===============================
// MOCK CHAMADOS POR TIPO
// ===============================
export function getChamadosPorTipo() {
    const chamados = listarChamados();

    const mapa = {};

    chamados.forEach(c => {
        const tipo = c.tipo || "Outros";

        if (!mapa[tipo]) {
            mapa[tipo] = 0;
        }

        mapa[tipo]++;
    });

    return Object.keys(mapa).map(tipo => ({
        tipo,
        total: mapa[tipo]
    }));
}