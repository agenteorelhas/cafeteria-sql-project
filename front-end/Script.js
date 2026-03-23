document.addEventListener('DOMContentLoaded', () => {
    // 1. PARTICULAS (TAMANHO REDUZIDO)
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 70 },
                "color": { "value": "#6F4E37" },
                "size": { "value": 3, "random": true }, // Pontos sutis
                "line_linked": { "enable": true, "distance": 150, "color": "#6F4E37", "opacity": 0.2 },
                "move": { "enable": true, "speed": 1.2 }
            }
        });
    }

    // 2. NAVEGAÇÃO DE ABAS
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    links.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            link.classList.add('active');
            const target = link.getAttribute('data-target');
            document.getElementById(target).classList.add('active');

            if (target === 'view-estoque') setTimeout(animarGauge, 100);
            if (target === 'view-logs') buscarLogs();
        };
    });

    // 3. MODAL
    const modal = document.getElementById('modal-container');
    document.getElementById('btn-novo-produto').onclick = () => modal.style.display = 'flex';
    document.getElementById('close-modal').onclick = () => modal.style.display = 'none';

    // 4. ENVIO E ATUALIZAÇÃO REATIVA
    document.getElementById('form-novo-item').onsubmit = async (e) => {
        e.preventDefault();
        const dados = {
            nome: document.getElementById('nome-item').value,
            preco: document.getElementById('preco-item').value,
            qtd: document.getElementById('qtd-item').value
        };

        try {
            const res = await fetch('http://localhost:3000/api/produtos', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dados)
            });
            if (res.ok) {
                document.getElementById('form-novo-item').reset();
                modal.style.display = 'none';
                buscarLogs(); // Atualiza logs na hora
            }
        } catch (err) { alert("Erro de conexão com o servidor Node."); }
    };
});

function animarGauge() {
    const fill = document.getElementById('gauge-fill');
    const needle = document.getElementById('gauge-needle');
    const text = document.getElementById('gauge-text');
    
    if (fill && needle) {
        const percent = 84; // Valor exemplo
        // Rotaciona fill (0 a 0.5turn) e agulha (-90deg a 90deg)
        fill.style.transform = `rotate(${(percent / 100) * 0.5}turn)`;
        needle.style.transform = `translateX(-50%) rotate(${(percent / 100) * 180 - 90}deg)`;
        
        let count = 0;
        let timer = setInterval(() => {
            if (count >= percent) clearInterval(timer);
            text.innerText = count + "%";
            count++;
        }, 15);
    }
}

async function buscarLogs() {
    const logDiv = document.getElementById('log-terminal');
    try {
        const res = await fetch('http://localhost:3000/api/logs');
        const logs = await res.json();
        logDiv.innerHTML = logs.map(l => `<code>[${new Date(l.DataHora).toLocaleTimeString()}] SQL: ${l.Descricao}</code><br>`).join('');
    } catch (err) { logDiv.innerText = "Erro ao buscar logs."; }
}
