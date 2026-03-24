const API = "http://localhost:3000";

// ================= UTILS =================
function getToken() { return localStorage.getItem("token"); }

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// ================= SISTEMA DE PARTÍCULAS =================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 159, 67, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        const amount = Math.floor((canvas.width * canvas.height) / 18000);
        for (let i = 0; i < amount; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    createParticles();
    animate();
}

// ================= AUTENTICAÇÃO =================
async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const msg = document.getElementById("msg");

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
      msg.innerText = data.erro || "Falha no login";
      msg.style.color = "#f87171";
    }
  } catch (err) { console.error(err); }
}

async function register() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const msg = document.getElementById("msg");

  try {
    const res = await fetch(`${API}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });
    const data = await res.json();
    msg.innerText = data.ok ? "Conta criada! Entre agora." : data.erro;
    msg.style.color = data.ok ? "#ff9f43" : "#f87171";
  } catch (err) { console.error(err); }
}

function logout() {
  localStorage.removeItem("token");
  window.location.reload();
}

// ================= DASHBOARD & PRODUTOS =================
async function loadDashboard() {
  const token = getToken();
  try {
    const res = await fetch(`${API}/api/dashboard`, { headers: { "Authorization": token } });
    const data = await res.json();
    document.getElementById("totalProdutos").innerText = data.totalProdutos ?? 0;
    document.getElementById("totalEstoque").innerText = data.totalEstoque ?? 0;
  } catch (err) { console.error(err); }
}

async function loadProdutos() {
  const token = getToken();
  try {
    const res = await fetch(`${API}/api/produtos`, { headers: { "Authorization": token } });
    const produtos = await res.json();
    const tbody = document.getElementById("lista");
    tbody.innerHTML = "";

    produtos.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="cell-nome">${p.nome || p.Nome}</td>
        <td class="cell-preco">${moneyFormatter.format(p.preco || p.Preco)}</td>
        <td class="cell-quantidade">${p.quantidade || p.Quantidade} unid.</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) { console.error(err); }
}

async function addProduto() {
  const nome = document.getElementById("nome").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const token = getToken();

  if (!nome || isNaN(preco)) return alert("Preencha corretamente!");

  try {
    const res = await fetch(`${API}/api/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({ nome, preco, quantidade })
    });
    if (res.ok) {
      document.getElementById("nome").value = "";
      document.getElementById("preco").value = "";
      document.getElementById("quantidade").value = "";
      loadProdutos();
      loadDashboard();
    }
  } catch (err) { console.error(err); }
}
