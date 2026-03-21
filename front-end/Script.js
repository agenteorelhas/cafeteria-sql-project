const produtos = [
    { id: 1, nome: "Espresso Tradicional", preco: 6.50, status: "Ativo" },
    { id: 2, nome: "Cappuccino Italiano", preco: 12.00, status: "Ativo" },
    { id: 3, nome: "Latte Macchiato", preco: 14.50, status: "Alerta" },
    { id: 4, nome: "Mocha", preco: 16.00, status: "Inativo" }
];

const lista = document.getElementById('lista-produtos');
const busca = document.getElementById('input-busca');

function render(itens) {
    lista.innerHTML = itens.map(p => `
        <tr>
            <td>#${p.id}</td>
            <td><strong>${p.nome}</strong></td>
            <td>R$ ${p.preco.toFixed(2)}</td>
            <td><span style="color: ${p.status === 'Inativo' ? 'var(--danger)' : 'var(--success)'}">${p.status}</span></td>
            <td>
                <button class="btn-action edit" onclick="alert('Simulando UPDATE no banco para ID ${p.id}')">Preço</button>
                <button class="btn-action delete" onclick="confirm('Executar Soft Delete?')">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Filtro de Busca
busca.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo) || p.id.toString().includes(termo));
    render(filtrados);
});

// Controle de menu ativo
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.sidebar a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', () => render(produtos));
