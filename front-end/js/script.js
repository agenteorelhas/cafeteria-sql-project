const API = "http://localhost:3000";
let gaugeChart;

// ================= VISUAL: PARTÍCULAS (CONEXÕES MELHORADAS) =================
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
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
        }
        draw() {
            ctx.fillStyle = "rgba(255, 159, 67, 0.25)";
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    particles = Array.from({ length: 65 }, () => new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });

        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
                if (dist < 130) {
                    ctx.strokeStyle = `rgba(255, 159, 67, ${(1 - dist/130) * 0.15})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    };
    animate();
}

// ================= VISUAL: GRÁFICO (REPOSICIONADO) =================
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
                borderWidth: 0, circumference: 180, rotation: 270, borderRadius: 6
            }]
        },
        options: { cutout: '88%', aspectRatio: 1.8, plugins: { legend: { display: false } } }
    });
}

// ================= MANTIDA LÓGICA DE BACKEND INTACTA =================
async function loadDashboard() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(API + "/api/dashboard", { headers: { Authorization: token } });
        const data = await res.json();
        document.getElementById("totalProdutos").innerText = data.totalProdutos ?? 0;
        document.getElementById("totalEstoque").innerText = data.totalEstoque ?? 0;
        updateGauge(data.totalEstoque ?? 0);
    } catch (err) { console.error(err); }
}

async function loadProdutos() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(API + "/api/produtos", { headers: { Authorization: token } });
        const produtos = await res.json();
        const lista = document.getElementById("lista");
        lista.innerHTML = produtos.map(p => `
            <tr>
                <td>${p.Nome ?? p.nome ?? "Sem nome"}</td>
                <td class="txt-right">R$ ${Number(p.Preco ?? p.preco ?? 0).toFixed(2)}</td>
                <td class="txt-right">${p.Quantidade ?? p.quantidade ?? 0}</td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

// Funções de login/register/logout continuam exatamente as mesmas...
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('collapsed'); }

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById(`nav-${id}`).classList.add('active');
}

window.onload = () => {
    initParticles();
    if (localStorage.getItem("token")) {
        document.getElementById("authScreen").classList.add("hidden");
        document.getElementById("appScreen").classList.remove("hidden");
        loadDashboard(); loadProdutos();
    }
};
