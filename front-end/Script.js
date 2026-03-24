const API = "http://localhost:3000";

// ================= LOGIN =================
async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch(API + "/api/login", {
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
    document.getElementById("msg").innerText = data.erro;
  }
}

// ================= REGISTER =================
async function register() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch(API + "/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();

  if (data.ok) {
    document.getElementById("msg").innerText = "Conta criada! Faça login.";
  } else {
    document.getElementById("msg").innerText = data.erro;
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

  const res = await fetch(API + "/api/dashboard", {
    headers: { Authorization: token }
  });

  const data = await res.json();

  document.getElementById("totalProdutos").innerText = data.totalProdutos || 0;
  document.getElementById("totalEstoque").innerText = data.totalEstoque || 0;
}

// ================= PRODUTOS =================
async function loadProdutos() {
  const token = getToken();

  const res = await fetch(API + "/api/produtos", {
    headers: { Authorization: token }
  });

  const produtos = await res.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  produtos.forEach(p => {
    const li = document.createElement("li");
    li.innerText = `${p.nome} - R$${p.preco} (${p.quantidade})`;
    lista.appendChild(li);
  });
}

async function addProduto() {
  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const quantidade = document.getElementById("quantidade").value;

  const token = getToken();

  await fetch(API + "/api/produtos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ nome, preco, quantidade })
  });

  loadProdutos();
  loadDashboard();
}

// ================= INIT =================
if (window.location.pathname.includes("dashboard")) {
  loadDashboard();
  loadProdutos();
}
