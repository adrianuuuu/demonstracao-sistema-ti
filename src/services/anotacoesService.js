import {
    listarAnotacoes,
    criarAnotacao,
    deletarAnotacao
} from "../../js/mock/api.js";

export function getAnotacoes(chamadoId) {
    return listarAnotacoes(chamadoId);
}

export function addAnotacao(chamadoId, texto) {
    return criarAnotacao(chamadoId, texto);
}

export function removeAnotacao(id) {
    return deletarAnotacao(id);
}