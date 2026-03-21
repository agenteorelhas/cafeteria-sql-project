// 1. Inicialização do Particles.js
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": ["#6F4E37", "#D2B48C", "#3C2A21"] },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.4 },
            "size": { "value": 3 },
            "line_linked": { "enable": true, "distance": 150, "color": "#6F4E37", "opacity": 0.3, "width": 1 },
            "move": { "enable": true, "speed": 1.2 }
        },
        "interactivity": { "events": { "onhover": { "enable": true, "mode": "grab" } } },
        "retina_detect": true
    });
}

// 2. Navegação e Dados
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            views.forEach(v => v.style.display = 'none');
            const targetId = 'view-' + link.getAttribute('href').replace('#', '');
            const targetView = document.getElementById(targetId);
            
            if (targetView) {
                targetView.style.display = 'block';
                if (targetId === 'view-estoque') {
                    // Reset para re-animar
                    document.getElementById('gauge-cafe-fill').style.transform = `rotate(0turn)`;
                    document.getElementById('gauge-cafe-needle').style.transform = `translateX(-50%) rotate(-90deg)`;
                    setTimeout(animarGauge, 200);
                }
            }
        });
    });

    // Mock Tabela
    const tbody = document.getElementById('lista-produtos');
    if (tbody) {
        const produtos = [
            { id: "#101", nome: "Café Arábica", preco: "R$ 65,00", status: "Em estoque" },
            { id: "#102", nome: "Moedor Titan", preco: "R$ 450,00", status: "Crítico" }
        ];
        tbody.innerHTML = produtos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.preco}</td>
                <td><span style="color: ${p.status === 'Crítico' ? '#ff5555' : '#50fa7b'}">${p.status}</span></td>
            </tr>
        `).join('');
    }
});

function animarGauge() {
    const fill = document.getElementById('gauge-cafe-fill');
    const needle = document.getElementById('gauge-cafe-needle');
    const text = document.getElementById('gauge-cafe-text');
    
    if (!fill || !needle) return;

    const valor = 75; // Porcentagem alvo
    const fillRot = (valor / 100) * 0.5;
    const needleRot = (valor / 100) * 180 - 90;

    fill.style.transform = `rotate(${fillRot}turn)`;
    needle.style.transform = `translateX(-50%) rotate(${needleRot}deg)`;

    let cont = 0;
    const taxa = setInterval(() => {
        if (cont >= valor) clearInterval(taxa);
        else { cont++; text.innerText = cont + "%"; }
    }, 20);
}
