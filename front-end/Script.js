document.addEventListener('DOMContentLoaded', () => {

    // PARTICULAS
    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60 },
                color: { value: "#6F4E37" },
                size: { value: 3 },
                move: { speed: 1 }
            }
        });
    }

    // NAVEGAÇÃO
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            links.forEach(l => l.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            link.classList.add('active');
            const target = link.dataset.target;
            document.getElementById(target).classList.add('active');

            if (target === 'view-logs') carregarLogs();
            if (target === 'view-produtos') carregarProdutos();
            if (target === 'view-estoque') setTimeout(animarGauge, 100);
        });
    });

    carregarProdutos();
});

// ========================
// LOGS
// ========================
async function carregarLogs() {
    try {
        const res = await fetch('http://localhost:3000/api/logs');
        const logs = await res.json();

        const terminal = document.getElementById('log-terminal');
        terminal.innerHTML = '';

        logs.forEach(log => {
            const linha = document.createElement('code');
            linha.textContent = `[${new Date(log.DataHora).toLocaleString()}] ${log.Descricao}`;
            terminal.appendChild(linha);
            terminal.appendChild(document.createElement('br'));
        });

    } catch (err) {
        console.error(err);
    }
}

// ========================
// PRODUTOS
// ========================
async function carregarProdutos() {
    try {
        const res = await fetch('http://localhost:3000/api/produtos');
        const produtos = await res.json();

        const tabela = document.getElementById('lista-produtos');
        tabela.innerHTML = '';

        produtos.forEach(p => {
            tabela.innerHTML += `
                <tr>
                    <td>#${p.ID}</td>
                    <td>${p.Nome}</td>
                    <td>R$ ${p.Preco}</td>
                    <td>${p.Quantidade}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
    }
}

// ========================
// GAUGE
// ========================
function animarGauge() {
    const fill = document.getElementById('gauge-fill');
    const needle = document.getElementById('gauge-needle');
    const text = document.getElementById('gauge-text');

    const percent = 84;

    fill.style.transform = `rotate(${(percent / 100) * 0.5}turn)`;
    needle.style.transform = `translateX(-50%) rotate(${(percent / 100) * 180 - 90}deg)`;

    let count = 0;
    let timer = setInterval(() => {
        if (count >= percent) {
            clearInterval(timer);
        }
        text.innerText = count + "%";
        count++;
    }, 15);
}
