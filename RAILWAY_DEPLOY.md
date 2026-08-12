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

Depois de criar o banco, execute uma única vez `pnpm railway:seed` com as mesmas variáveis. A semente restaura os 24 kits, as composições e as configurações, além de copiar a logo e as fotos existentes para o volume Railway. Assim, os ativos são servidos por `/uploads` e não dependem do armazenamento legado do Manus. Novas imagens enviadas pelo painel também são gravadas no volume do Railway.

## Limite do plano gratuito

O plano Railway Free deve ser tratado como teste. Acompanhe o consumo de crédito no painel; se o serviço ou MySQL pararem por limite de crédito, faça upgrade antes de divulgar o endereço final.

## Acompanhamento do crédito e contingência

Enquanto a conta estiver no Trial, confira pelo menos uma vez por semana o indicador de dias/crédito restante e a área de uso no painel do Railway. Após o Trial, o plano Free oferece `$1` de crédito mensal; esse valor não acumula. Antes de uma campanha, nova carga de fotos ou divulgação ampla do catálogo, confira novamente o consumo.

Considere mudar para o plano **Hobby** quando ocorrer qualquer um dos seguintes gatilhos: crédito Free restante abaixo de `$0,50`, consumo recorrente superior a aproximadamente 70% do crédito mensal, aviso de suspensão por limite, necessidade de mais armazenamento de volume ou intenção de divulgar o domínio definitivo com previsibilidade maior.

Na referência oficial consultada em agosto de 2026, o Hobby custa **US$ 5/mês** e inclui **US$ 5 de uso de recursos** no ciclo; caso o uso ultrapasse esse crédito, o valor adicional é cobrado pela diferença. A atualização é feita no painel do Railway e preserva o projeto, o MySQL e o volume, portanto não exige migrar o código nem as fotos. Confirme preços e condições no momento da decisão em [Railway Pricing Plans](https://docs.railway.com/pricing/plans).

Antes de qualquer alteração de plano ou manutenção importante, mantenha o repositório GitHub atualizado e exporte um backup do MySQL. Para este catálogo, o repositório já contém a semente dos 24 kits; as fotos novas adicionadas posteriormente devem ser preservadas também pelo volume e pelo backup do banco.
