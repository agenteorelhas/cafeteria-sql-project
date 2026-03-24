const API = "http://localhost:3000";

// ================= UI CONTROLS =================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('collapsed');
}

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
});

function getToken() { return localStorage.getItem("token"); }

// ================= MOTOR DE PARTÍCULAS (ÂMBAR CLARO) =================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.3;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
        }
        draw() {
            // COR: Âmbar Claro / Creme (255, 235, 190)
            ctx.fillStyle = `rgba(255, 235, 190, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    particles = Array.from({ length: 80 }, () => new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    };
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
            location.reload();
        } else {
            msg.innerText = data.erro || "Falha no login";
            msg.style.color = "#ff4d4d";
        }
    } catch (e) { msg.innerText = "Erro ao conectar ao servidor."; }
}

function logout() {
    localStorage.removeItem("token");
    location.reload();
}

// ================= CRUD PRODUTOS =================
async function loadDashboard() {
    try {
        const res = await fetch(`${API}/api/dashboard`, { headers: { "Authorization": getToken() }});
        const data = await res.json();
        document.getElementById("totalProdutos").innerText = data.totalProdutos ?? 0;
        document.getElementById("totalEstoque").innerText = data.totalEstoque ?? 0;
    } catch (e) { console.error(e); }
}

async function loadProdutos() {
    try {
        const res = await fetch(`${API}/api/produtos`, { headers: { "Authorization": getToken() }});
        const produtos = await res.json();
        const tbody = document.getElementById("lista");
        tbody.innerHTML = "";

        produtos.forEach(p => {
            const id = p.id || p._id || p.ID;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.nome || p.Nome}</td>
                <td class="cell-preco txt-right">${moneyFormatter.format(p.preco || p.Preco)}</td>
                <td class="txt-right">${p.quantidade || p.Quantidade}</td>
                <td class="txt-center">
                    <button class="btn-delete" onclick="deleteProduto('${id}')">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function addProduto() {
    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);

    if (!nome || isNaN(preco)) return alert("Dados inválidos");

    try {
        await fetch(`${API}/api/produtos`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": getToken() },
            body: JSON.stringify({ nome, preco, quantidade })
        });
        document.querySelectorAll(".form input").forEach(i => i.value = "");
        loadProdutos(); loadDashboard();
    } catch (e) { console.error(e); }
}

async function deleteProduto(id) {
    if (!confirm("Excluir item?")) return;
    try {
        await fetch(`${API}/api/produtos/${id}`, {
            method: "DELETE",
            headers: { "Authorization": getToken() }
        });
        loadProdutos(); loadDashboard();
    } catch (e) { console.error(e); }
}
