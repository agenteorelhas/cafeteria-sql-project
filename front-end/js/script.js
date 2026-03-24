const API = "http://localhost:3000";

// ================= UI CONTROL =================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
});

function getToken() { return localStorage.getItem("token"); }

// ================= BACKGROUND PARTICLES =================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.2;
            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * 0.2 - 0.1;
            this.life = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(255, 159, 67, ${this.life})`;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }

    for (let i = 0; i < 70; i++) particles.push(new Particle());
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    };
    animate();
}

// ================= AUTHENTICATION =================
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
            location.reload();
        } else {
            msg.innerText = data.erro || "Acesso negado";
            msg.style.color = "#ff4d4d";
        }
    } catch (e) { msg.innerText = "Falha na conexão com o servidor."; }
}

function logout() { localStorage.removeItem("token"); location.reload(); }

// ================= DATA MANAGEMENT =================
async function loadDashboard() {
    try {
        const res = await fetch(`${API}/api/dashboard`, { headers: { "Authorization": getToken() }});
        if (res.status === 401) return logout();
        const data = await res.json();
        document.getElementById("totalProdutos").innerText = data.totalProdutos ?? 0;
        document.getElementById("totalEstoque").innerText = data.totalEstoque ?? 0;
    } catch (e) { console.error("Dashboard error", e); }
}

async function loadProdutos() {
    try {
        const res = await fetch(`${API}/api/produtos`, { headers: { "Authorization": getToken() }});
        const produtos = await res.json();
        const tbody = document.getElementById("lista");
        tbody.innerHTML = "";

        produtos.forEach(p => {
            const id = p.id || p.ID || p._id; // Adaptável a diferentes nomes de campo ID
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="cell-nome">${p.nome || p.Nome}</td>
                <td class="cell-preco txt-right">${moneyFormatter.format(p.preco || p.Preco)}</td>
                <td class="cell-quantidade txt-right">${p.quantidade || p.Quantidade}</td>
                <td class="txt-center">
                    <button class="btn-delete" onclick="deleteProduto('${id}')" title="Excluir">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error("Load error", e); }
}

async function addProduto() {
    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);

    if (!nome || isNaN(preco)) return alert("Dados inválidos!");

    try {
        const res = await fetch(`${API}/api/produtos`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": getToken() },
            body: JSON.stringify({ nome, preco, quantidade })
        });
        if (res.ok) {
            document.querySelectorAll(".form input").forEach(i => i.value = "");
            loadProdutos(); loadDashboard();
        }
    } catch (e) { console.error("Add error", e); }
}

async function deleteProduto(id) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
        const res = await fetch(`${API}/api/produtos/${id}`, {
            method: "DELETE",
            headers: { "Authorization": getToken() }
        });
        if (res.ok) {
            loadProdutos(); loadDashboard();
        } else {
            alert("Erro ao excluir produto.");
        }
    } catch (e) { console.error("Delete error", e); }
}
