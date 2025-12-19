-- Criando perfis de acesso
CREATE ROLE 'gerente';
CREATE ROLE 'atendente';

-- Permissões do Atendente (Só vende e consulta produtos)
GRANT SELECT, INSERT ON cafeteria.pedidos TO 'atendente';
GRANT SELECT ON cafeteria.produtos TO 'atendente';

-- Permissões do Gerente (Tudo, menos deletar o banco)
GRANT ALL PRIVILEGES ON cafeteria.* TO 'gerente';
