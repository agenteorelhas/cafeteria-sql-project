const API = "http://localhost:3000";
let gaugeChart;

// ================= MOTOR DE PARTÍCULAS (TEIA ÂMBAR) =================
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
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
        }
        draw() {
            ctx.fillStyle = "rgba(255, 235, 190, 0.4)";
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }

    particles = Array.from({ length: 80 }, () => new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
                if (dist < 110) {
                    ctx.strokeStyle = `rgba(255, 235, 190, ${(1 - dist/110) * 0.12})`;
                    ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    };
    animate();
}

// ================= VELOCÍMETRO =================
function updateGauge(value) {
    const ctx = document.getElementById('gaugeChart').getContext('2d');
    if (gaugeChart) {
        gaugeChart.data.datasets[0].data = [value, 1000 - value];
        gaugeChart.update();
        return;
    }
    gaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, 1000 - value],
                backgroundColor: ['#ff9f43', 'rgba(255, 255, 255, 0.05)'],
                borderWidth: 0, circumference: 180, rotation: 270, borderRadius: 10
            }]
        },
        options: { cutout: '85%', aspectRatio: 1.8, plugins: { legend: { display: false } } }
    });
}

// ================= API E LOGIN =================
async function loadDashboard() {
    try {
        const res = await fetch(`${API}/api/dashboard`, { headers: { "Authorization": localStorage.getItem("token") }});
        const data = await res.json();
        document.getElementById("totalProdutos").innerText = data.totalProdutos ?? 0;
        document.getElementById("totalEstoque").innerText = data.totalEstoque ?? 0;
        updateGauge(data.totalEstoque ?? 0);
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
                <td class="txt-center"><button onclick="deleteProduto('${p.id || p._id}')">🗑️</button></td>
            </tr>
        `).join('');
    } catch (e) { console.error(e); }
}

window.onload = () => {
    initParticles();
    if (localStorage.getItem("token")) {
        document.getElementById("authScreen").classList.add("hidden");
        document.getElementById("appScreen").classList.remove("hidden");
        loadDashboard(); loadProdutos();
    }
};

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('collapsed'); }
function logout() { localStorage.removeItem("token"); location.reload(); }
