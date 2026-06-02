Quando o sensor de umidade chegar, basta:

Adicionar a coluna na tabela do Supabase
Em db.ts, setar humidity: "nome_da_coluna"
Em monitoring-service.ts, remover a função mockHumidity e ler row[columns.humidity] diretamente 
-- --
