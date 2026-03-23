document.addEventListener('DOMContentLoaded', () => {
    // 1. Navegação
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            link.classList.add('active');
            const target = link.getAttribute('data-target');
            document.getElementById(target).classList.add('active');

            if (target === 'view-estoque') setTimeout(animarGauge, 100);
            if (target === 'view-logs') buscarLogs();
        });
    });

    // 2. Modal
    const modal = document.getElementById('modal-container');
    document.getElementById('btn-novo-produto').onclick = () => modal.style.display = 'flex';
    document.getElementById('close-modal').onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    // 3. Envio e Atualização
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
                buscarLogs(); // Atualiza aba de logs instantaneamente
            }
        } catch (err) { alert("Certifique-se que o servidor Node.js está rodando!"); }
    };
});

async function buscarLogs() {
    const logDiv = document.getElementById('log-terminal');
    try {
        const res = await fetch('http://localhost:3000/api/logs');
        const logs = await res.json();
        logDiv.innerHTML = logs.map(l => `<code>[${new Date(l.DataHora).toLocaleTimeString()}] SQL: ${l.Descricao}</code><br>`).join('');
    } catch (err) { logDiv.innerText = "Erro ao conectar com a API de logs."; }
}

function animarGauge() {
    const fill = document.getElementById('gauge-fill');
    const needle = document.getElementById('gauge-needle');
    if (fill && needle) {
        fill.style.transform = `rotate(0.42turn)`;
        needle.style.transform = `translateX(-50%) rotate(61deg)`;
        document.getElementById('gauge-text').innerText = "84%";
    }
}

// Partículas
if(window.particlesJS) {
    particlesJS('particles-js', { "particles": { "number": { "value": 50 }, "color": { "value": "#6F4E37" }, "move": { "speed": 1.5 } } });
}
