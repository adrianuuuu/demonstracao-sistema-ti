import { login } from "./mock/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const botaoLogin = document.getElementById("btnLogin");

    if (!botaoLogin) return;

    botaoLogin.addEventListener("click", () => {

        const loginInput = document.getElementById("usuario").value.trim();
        const senhaInput = document.getElementById("senha").value.trim();

        if (!loginInput || !senhaInput) {
            alert("Informe usuário e senha.");
            return;
        }

        const resultado = login(loginInput, senhaInput);

        if (resultado.success) {

            // 🔐 simulação de sessão
            localStorage.setItem("usuario", JSON.stringify({
                nome: "Administrador",
                nivel: "admin"
            }));

            window.location.href = "index-sistema.html#/dashboard";
        } else {
            alert("Usuário ou senha incorretos.");
        }

    });
});


// =====================================
// 🔒 BLOQUEAR VOLTAR SE JÁ LOGADO
// =====================================

(function protegerLogin() {

    const usuario = localStorage.getItem("usuario");

    if (usuario) {
        window.location.replace("index-sistema.html");
        return;
    }

})();