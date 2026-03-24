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

// ================= MOTOR DE PARTÍCULAS (TEIA ÂMBAR CLARO) =================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const connectionDistance = 120; // Distância máxima para ligar os pontos

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
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
        }
        draw() {
            ctx.fillStyle = "rgba(255, 235, 190, 0.4)"; // Cor Âmbar Claro
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    particles = Array.from({ length: 85 }, () => new Particle());

    function drawLines() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    // Quanto mais perto, mais opaca é a linha
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(255, 235, 190, ${opacity * 0.15})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    };
    animate();
}

// ================= AUTENTICAÇÃO E CRUD =================
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
        if (data.token) { localStorage.setItem("token", data.token); location.reload(); }
        else { msg.innerText = data.erro || "Falha"; msg.style.color = "#ff4d4d"; }
    } catch (e) { msg.innerText = "Erro no servidor"; }
}

function logout() { localStorage.removeItem("token"); location.reload(); }

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
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${p.nome || p.Nome}</td><td class="cell-preco txt-right">${moneyFormatter.format(p.preco || p.Preco)}</td><td class="txt-right">${p.quantidade || p.Quantidade}</td><td class="txt-center"><button class="btn-delete" onclick="deleteProduto('${p.id || p._id}')">🗑️</button></td>`;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function addProduto() {
    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);
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
    if (!confirm("Excluir?")) return;
    try {
        await fetch(`${API}/api/produtos/${id}`, { method: "DELETE", headers: { "Authorization": getToken() } });
        loadProdutos(); loadDashboard();
    } catch (e) { console.error(e); }
}
