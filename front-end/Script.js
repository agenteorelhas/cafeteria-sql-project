async function carregarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/produtos'); // Rota do seu back-end
        const produtos = await response.json();
        
        const tbody = document.querySelector('#tabela-produtos tbody');
        tbody.innerHTML = produtos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td>${p.ativo ? '✅' : '❌'}</td>
                <td><button onclick="editar(${p.id})">Editar</button></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}
