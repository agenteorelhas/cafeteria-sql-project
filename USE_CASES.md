##📖 Casos de Uso (Business Scenarios)
Nesta seção, demonstramos como a arquitetura do banco de dados resolve situações cotidianas de uma cafeteria real.

* **1. Gestão de Insumos e Ficha Técnica* 📝
* **Cenário*: A cafeteria vende um "Cappuccino GG". O gestor precisa saber se há leite e café em grãos suficientes para o dia.
* **Problema*: Como garantir que a venda de um item composto (produto final) reflita a baixa de múltiplos insumos (matéria-prima)?
* **Solução*: O projeto utiliza uma tabela de Ficha Técnica (N:N). Ao registrar a venda de 1 Cappuccino, a sp_registrar_venda consulta a composição e abate proporcionalmente 200ml de leite e 20g de café da tabela ingredientes.
* **Benefício*: Controle de estoque ultra-preciso, evitando quebras de produção.
---
* **2. Auditoria de Preços e Inflação* 📝
* **Cenário*: Devido ao aumento no preço do café verde, o gerente alterou o preço do Espresso três vezes no último mês.
* **Problema*: O dono da cafeteria quer auditar quem alterou os preços e quando essas mudanças ocorreram para conferir a margem de lucro.
* **Solução*: A Trigger tr_auditoria_preco captura o valor antigo, o valor novo e o timestamp da alteração, salvando tudo na tabela log_precos.
* **Benefício*: Transparência total e segurança contra alterações não autorizadas ou erros humanos.
---
* **3. Programa de Fidelidade e Retenção* 📝
* **Cenário*: O marketing quer dar um brinde para os 3 clientes que mais gastaram no último trimestre.
* **Problema*: Os dados de clientes e pedidos estão espalhados.
* **Solução*: Através de um JOIN entre clientes, pedidos e itens_pedido, uma query analítica agrupa o faturamento por cliente_id.
* **Benefício*: Identificação imediata dos clientes VIP (LTV - Lifetime Value), permitindo ações de marketing baseadas em dados.
---
* **4. Ciclo de Vida do Produto (Soft Delete)*
* **Cenário*: Um "Muffin de Sazonal" sairá do cardápio para dar lugar a um novo sabor.
* **Problema*: Se deletarmos o Muffin do banco, todos os registros de vendas passadas dele (pedidos de meses atrás) podem sumir ou gerar erros de relatório.
* **Solução*: Implementação de Soft Delete via coluna ativo. O produto é marcado como FALSE.
* **Benefício*: O produto não aparece mais no PDV (Ponto de Venda), mas os relatórios financeiros de meses anteriores continuam exibindo as vendas dele normalmente, preservando a contabilidade.
