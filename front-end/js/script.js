const API = "http://localhost:3000";
let gaugeChart;

// ================= NAVEGAÇÃO E SIDEBAR =================
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const navBtn = document.getElementById(`nav-${id}`);
    if(navBtn) navBtn.classList.add('active');
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('collapsed'); }

// ================= LOGIN & REGISTER (SEU BACKEND) =================
async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
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
            document.getElementById("msg").innerText = data.erro || "Erro ao logar";
        }
    } catch (err) {
        document.getElementById("msg").innerText = "Erro ao conectar com o servidor";
    }
}

async function register() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    try {
        const res = await fetch(API + "/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });
        const data = await res.json();
        document.getElementById("msg").innerText = data.ok ? "Conta criada! Faça login." : (data.erro || "Erro ao registrar");
    } catch (err) {
        document.getElementById("msg").innerText = "Erro ao conectar";
    }
}

function logout() {
    localStorage.removeItem("token");
    location.reload();
}

// ================= CARREGAMENTO DE DADOS =================
async function loadDashboard() {
    const token = localStorage.getItem("token");
    if (!token) return logout();

    try {
        const res = await fetch(API + "/api/dashboard", { headers: { Authorization: token } });
        const data = await res.json();

        document.getElementById("totalProdutos").innerText = data.totalProdutos ?? 0;
        document.getElementById("totalEstoque").innerText = data.totalEstoque ?? 0;
        updateGauge(data.totalEstoque ?? 0);
    } catch (err) {
        console.error("Erro dashboard:", err);
    }
}

async function loadProdutos() {
    const token = localStorage.getItem("token");
    if (!token) return logout();

    try {
        const res = await fetch(API + "/api/produtos", { headers: { Authorization: token } });
        const produtos = await res.json();
        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        produtos.forEach(p => {
            // Seu mapeamento de campos (Flexibilidade entre Nome/nome)
            const nome = p.Nome ?? p.nome ?? "Sem nome";
            const preco = p.Preco ?? p.preco ?? 0;
            const quantidade = p.Quantidade ?? p.quantidade ?? 0;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${nome}</td>
                <td class="txt-right">R$ ${Number(preco).toFixed(2)}</td>
                <td class="txt-right">${quantidade}</td>
            `;
            lista.appendChild(tr);
        });
    } catch (err) {
        console.error("Erro produtos:", err);
    }
}

async function addProduto() {
    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const quantidade = document.getElementById("quantidade").value;
    const token = localStorage.getItem("token");

    try {
        await fetch(API + "/api/produtos", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify({ nome, preco, quantidade })
        });
        loadProdutos();
        loadDashboard();
        document.getElementById("nome").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("quantidade").value = "";
    } catch (err) { console.error(err); }
}

// ================= VISUAL: GRÁFICO E PARTÍCULAS =================
function updateGauge(value) {
    const canvas = document.getElementById('gaugeChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (gaugeChart) {
        gaugeChart.data.datasets[0].data = [value, Math.max(0, 1000 - value)];
        gaugeChart.update();
        return;
    }
    gaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, 1000 - value],
                backgroundColor: ['#ff9f43', 'rgba(255, 255, 255, 0.05)'],
                borderWidth: 0, circumference: 180, rotation: 270, borderRadius: 8
            }]
        },
        options: { cutout: '80%', aspectRatio: 1.8, plugins: { legend: { display: false } } }
    });
}

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
            this.size = Math.random() * 2.8 + 1.2; // Tamanho maior solicitado
            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * 0.2 - 0.1;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
        }
        draw() {
            ctx.fillStyle = "rgba(255, 159, 67, 0.3)";
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

window.onload = () => {
    initParticles();
    const token = localStorage.getItem("token");
    if (token) {
        document.getElementById("authScreen").classList.add("hidden");
        document.getElementById("appScreen").classList.remove("hidden");
        loadDashboard();
        loadProdutos();
    }
};
