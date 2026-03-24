/**
 * ☕ Café SaaS - Logic & API Integration
 * Configurações de API e manipulação de DOM
 */

const API = "http://localhost:3000";

// ================= UTILS =================

/**
 * Recupera o token de autenticação do armazenamento local
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Formata números para o padrão de moeda Brasileira (BRL)
 */
const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// ================= AUTHENTICATION =================

async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const msgElement = document.getElementById("msg");

  // Feedback visual de carregamento
  msgElement.innerText = "Autenticando...";
  msgElement.style.color = "var(--muted)";

  if (!email || !senha) {
    msgElement.innerText = "Preencha todos os campos.";
    msgElement.style.color = "#f87171"; // Vermelho neon sutil
    return;
  }

  try {
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      
      // Transição de telas
      document.getElementById("authScreen").classList.add("hidden");
      document.getElementById("appScreen").classList.remove("hidden");
      
      // Inicializa dados
      loadDashboard();
      loadProdutos();
    } else {
      msgElement.innerText = data.erro || "Credenciais inválidas";
      msgElement.style.color = "#f87171";
    }
  } catch (err) {
    msgElement.innerText = "Erro ao conectar com o servidor";
    msgElement.style.color = "#f87171";
    console.error("Login Error:", err);
  }
}

async function register() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const msgElement = document.getElementById("msg");

  msgElement.innerText = "Criando conta...";
  msgElement.style.color = "var(--muted)";

  try {
    const res = await fetch(`${API}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    
    if (data.ok) {
      msgElement.innerText = "Conta criada! Faça login acima.";
      msgElement.style.color = "var(--neon-orange)"; // Laranja neon
    } else {
      msgElement.innerText = data.erro || "Erro ao registrar";
      msgElement.style.color = "#f87171";
    }
  } catch (err) {
    msgElement.innerText = "Erro na conexão com o servidor.";
    msgElement.style.color = "#f87171";
    console.error("Register Error:", err);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.reload(); // Recarrega para limpar o estado da aplicação
}

// ================= DASHBOARD =================

async function loadDashboard() {
  const token = getToken();
  if (!token) return logout();

  try {
    const res = await fetch(`${API}/api/dashboard`, { 
      headers: { "Authorization": token } 
    });
    
    if (res.status === 401) return logout();
    
    const data = await res.json();

    // Atualiza os contadores com fallback para zero
    document.getElementById("totalProdutos").innerText = data.totalProdutos ?? 0;
    document.getElementById("totalEstoque").innerText = data.totalEstoque ?? 0;
    
  } catch (err) {
    console.error("Erro ao carregar dashboard:", err);
  }
}

// ================= PRODUTOS =================

async function loadProdutos() {
  const token = getToken();
  if (!token) return logout();

  try {
    const res = await fetch(`${API}/api/produtos`, { 
      headers: { "Authorization": token } 
    });
    
    if (res.status === 401) return logout();
    
    const produtos = await res.json();
    const tbody = document.getElementById("lista");
    
    tbody.innerHTML = ""; // Limpa a tabela antes de renderizar

    produtos.forEach(p => {
      // Normalização de propriedades (Backend PascalCase vs camelCase)
      const nome = p.Nome ?? p.nome ?? "Sem nome";
      const precoRaw = p.Preco ?? p.preco ?? 0;
      const quantidade = p.Quantidade ?? p.quantidade ?? 0;

      // Garante que o preço seja um número antes de formatar
      const preco = parseFloat(precoRaw);

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="cell-nome">${nome}</td>
        <td class="cell-preco">${moneyFormatter.format(preco)}</td>
        <td class="cell-quantidade">${quantidade} unid.</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar lista de produtos:", err);
  }
}

async function addProduto() {
  const nomeInput = document.getElementById("nome");
  const precoInput = document.getElementById("preco");
  const qtdInput = document.getElementById("quantidade");
  
  const token = getToken();
  if (!token) return logout();

  const produto = {
    nome: nomeInput.value,
    preco: parseFloat(precoInput.value),
    quantidade: parseInt(qtdInput.value)
  };

  // Validação básica frontend
  if (!produto.nome || isNaN(produto.preco) || isNaN(produto.quantidade)) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  try {
    const res = await fetch(`${API}/api/produtos`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": token 
      },
      body: JSON.stringify(produto)
    });

    if (res.ok) {
      // Limpa os campos
      nomeInput.value = "";
      precoInput.value = "";
      qtdInput.value = "";

      // Atualiza a interface
      await loadProdutos();
      await loadDashboard();
    } else {
      const errorData = await res.json();
      alert("Erro ao adicionar: " + (errorData.erro || "Verifique os dados."));
    }
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    alert("Falha na comunicação com o servidor.");
  }
}
