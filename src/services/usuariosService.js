import { listarDepartamentos } from "../../js/mock/api.js";

// ===============================
// MOCK USUÁRIOS (FIXO)
// ===============================
export function getUsuarios() {
    return [
        {
            id: 1,
            nome: "Analista 1",
            tipo: "analista"
        },
        {
            id: 2,
            nome: "Técnico 1",
            tipo: "tecnico"
        },
        {
            id: 3,
            nome: "Tecnico 2",
            tipo: "tecnico"
        },
        {
            id: 4,
            nome: "Tecnico 3",
            tipo: "tecnico"
        }
    ];
}

// ===============================
// AGRUPADO (IGUAL UI REAL)
// ===============================
export function getUsuariosAgrupados() {
    const usuarios = getUsuarios();

    return {
        analistas: usuarios.filter(u => u.tipo === "analista"),
        tecnicos: usuarios.filter(u => u.tipo === "tecnico")
    };
}