# Implantação de teste no Railway

## Serviços necessários

1. Um serviço **MySQL** com volume persistente no mesmo projeto Railway.
2. Um serviço da aplicação criado a partir de `graficacriativaexpress/criativaexpress`.
3. Um volume na aplicação montado em `/data` para que novas fotos do painel sejam gravadas em `/data/uploads`.

## Variáveis da aplicação

| Variável | Valor no Railway |
| --- | --- |
| `DATABASE_URL` | Referência à URL do serviço MySQL Railway, como `${{MySQL.MYSQL_URL}}` |
| `DEPLOYMENT_TARGET` | `railway` |
| `RAILWAY_AUTH_MODE` | `local` |
| `VITE_AUTH_MODE` | `local` |
| `RAILWAY_ADMIN_EMAIL` | E-mail exclusivo da administração da loja |
| `RAILWAY_ADMIN_PASSWORD` | Senha forte definida pela administração |
| `RAILWAY_AUTH_SECRET` | Texto aleatório com pelo menos 32 caracteres |
| `UPLOADS_DIR` | `/data/uploads` |
| `RAILWAY_LEGACY_IMAGE_ORIGIN` | `https://3000-i62srvd2zg8wd4nncf93a-f7ce7945.us2.manus.computer` |

Depois de criar o banco, execute uma única vez `pnpm railway:seed` com as mesmas variáveis. A semente restaura os 24 kits, as composições e as configurações. As imagens existentes continuam referenciando o armazenamento legado do Manus; novas imagens enviadas pelo painel vão para o volume do Railway.

## Limite do plano gratuito

O plano Railway Free deve ser tratado como teste. Acompanhe o consumo de crédito no painel; se o serviço ou MySQL pararem por limite de crédito, faça upgrade antes de divulgar o endereço final.
