const API = "http://localhost:3000";
let gaugeChart;

// MOTOR DE PARTÍCULAS
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1.0;
            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * 0.2 - 0.1;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
        }
        draw() {
            ctx.fillStyle = "rgba(255, 235, 190, 0.35)";
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }

    particles = Array.from({ length: 50 }, () => new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    };
    animate();
}

// CARREGAR DADOS
async function loadDashboard() {
    try {
        const res = await fetch(`${API}/api/dashboard`, { headers: { "Authorization": localStorage.getItem("token") }});
        const data = await res.json();
        document.getElementById("totalProdutos").innerText = data.totalProdutos || 0;
        document.getElementById("totalEstoque").innerText = data.totalEstoque || 0;
        updateGauge(data.totalEstoque || 0);
    } catch (e) { console.error(e); }
}

async function loadProdutos() {
    try {
        const res = await fetch(`${API}/api/produtos`, { headers: { "Authorization": localStorage.getItem("token") }});
        const produtos = await res.json();
        const tbody = document.getElementById("lista");
        tbody.innerHTML = produtos.map(p => `
            <tr>
                <td>${p.nome}</td>
                <td class="txt-right">R$ ${Number(p.preco).toFixed(2)}</td>
                <td class="txt-right">${p.quantidade}</td>
                <td class="txt-center"><button onclick="deleteProduto('${p._id}')">🗑️</button></td>
            </tr>
        `).join('');
    } catch (e) { console.error(e); }
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById(`nav-${id}`).classList.add('active');
    if (id === 'produtos') loadProdutos();
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('collapsed'); }

window.onload = () => {
    initParticles();
    if (localStorage.getItem("token")) {
        document.getElementById("authScreen").classList.add("hidden");
        document.getElementById("appScreen").classList.remove("hidden");
        loadDashboard();
        loadProdutos();
    }
};
