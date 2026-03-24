const API = "http://localhost:3000";

// ================= LOGIN =================
async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      document.getElementById("authScreen").classList.add("hidden");
      document.getElementById("appScreen").classList.remove("hidden");
      loadDashboard();
      loadProdutos();
    } else {
      document.getElementById("msg").innerText = data.erro || "Erro ao logar";
    }
  } catch (err) {
    document.getElementById("msg").innerText = "Erro ao conectar com o servidor";
    console.error(err);
  }
}

// ================= REGISTER =================
async function register() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch(`${API}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });
    const data = await res.json();
    document.getElementById("msg").innerText = data.ok
      ? "Conta criada! Faça login."
      : data.erro || "Erro ao registrar";
  } catch (err) {
    document.getElementById("msg").innerText = "Erro ao conectar com o servidor";
    console.error(err);
  }
}

// ================= AUTH =================
function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// ================= DASHBOARD =================
async function loadDashboard() {
  const token = getToken();
  if (!token) return logout();

  try {
    const res = await fetch(`${API}/api/dashboard`, { headers: { Authorization: token } });
    const data = await res.json();
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
    const res = await fetch(`${API}/api/produtos`, { headers: { Authorization: token } });
    const produtos = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    produtos.forEach(p => {
      const nome = p.Nome ?? p.nome ?? "Sem nome";
      const preco = p.Preco ?? p.preco ?? 0;
      const quantidade = p.Quantidade ?? p.quantidade ?? 0;

      const li = document.createElement("li");
      li.innerText = `${nome} - R$${preco} (${quantidade})`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

async function addProduto() {
  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const quantidade = document.getElementById("quantidade").value;
  const token = getToken();
  if (!token) return logout();

  try {
    await fetch(`${API}/api/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ nome, preco, quantidade })
    });

    loadProdutos();
    loadDashboard();

    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("quantidade").value = "";
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
  }
}
