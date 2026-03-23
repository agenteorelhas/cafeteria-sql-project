document.addEventListener('DOMContentLoaded', () => {
    // Navegação
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
            const target = 'view-' + link.getAttribute('href').replace('#', '');
            document.getElementById(target).style.display = 'block';
            if(target === 'view-estoque') animarGauges();
        };
    });

    // Modal
    const modal = document.getElementById('modal-container');
    document.getElementById('btn-novo-produto').onclick = () => modal.style.display = 'flex';
    document.getElementById('close-modal').onclick = () => modal.style.display = 'none';

    // Envio para o Servidor Node
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
            if(res.ok) { alert("Salvo no SQL!"); modal.style.display = 'none'; }
        } catch (err) { alert("Erro ao conectar no servidor."); }
    };
});

function animarGauges() {
    const fill = document.getElementById('gauge-cafe-fill');
    const needle = document.getElementById('gauge-cafe-needle');
    fill.style.transform = `rotate(0.375turn)`;
    needle.style.transform = `translateX(-50%) rotate(45deg)`;
    document.getElementById('gauge-cafe-text').innerText = "75%";
}
