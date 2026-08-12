# Comparação de hospedagem — fontes oficiais

Consultado em 12 de agosto de 2026 para a loja full-stack Criativa Express.

## Railway

| Item | Informação oficial |
|---|---|
| Servidor Express | A documentação apresenta implantação direta de aplicações Express por GitHub, CLI ou Dockerfile. |
| Plano sem custo | O teste gratuito oferece US$ 5 em créditos por 30 dias. O plano Free oferece US$ 1 por mês em créditos, com até 1 vCPU e 0,5 GB por serviço. |
| Plano Hobby | US$ 5 por mês, com US$ 5 de créditos incluídos. |
| Banco e fotos | A página de preços apresenta cobrança por uso para recursos; Object Storage é cobrado por GB/mês e serviços/banco devem receber variáveis de ambiente. |

Fontes: [Railway Pricing](https://railway.com/pricing) e [Deploy an Express App](https://docs.railway.com/guides/express).

## Render

| Item | Informação oficial |
|---|---|
| Servidor Express | O serviço web suporta aplicativos Node.js e servidores de longa duração. |
| Plano sem custo | Serviço web gratuito pode hibernar após 15 minutos sem tráfego e demora cerca de um minuto para iniciar novamente. |
| Persistência | O sistema de arquivos é efêmero; arquivos locais são perdidos em reinícios, hibernações e deploys. Discos persistentes não estão disponíveis para serviço web gratuito. |
| Banco gratuito | Postgres gratuito tem 1 GB, expira após 30 dias e é apagado após período de carência se não for atualizado. |
| Produção | A própria documentação recomenda não usar instâncias gratuitas para aplicações de produção. O plano Starter de serviço web custa US$ 7/mês, conforme a tabela de preços. |

Fontes: [Render Free](https://render.com/docs/free) e [Render Pricing](https://render.com/pricing).

## Conclusão técnica preliminar

Para preservar a arquitetura Express atual sem grande reescrita, Railway é mais compatível que Vercel. Para uma loja pública, nenhum caminho realmente gratuito é recomendado: créditos gratuitos podem acabar, serviços podem suspender/hibernar e os dados/fotos exigem armazenamento persistente. A migração ainda exige substituir o OAuth, banco e armazenamento específicos do Manus por serviços externos e realizar uma migração de dados validada.

## Alternativas de custo ainda menor

| Caminho | Condição oficial relevante | Impacto prático |
|---|---|---|
| Cloudflare Workers + D1 + R2 | Workers Free inclui 100.000 requisições/dia e 10 ms de CPU por invocação; D1 Free inclui 5 GB, 5 milhões de leituras/dia e 100 mil escritas/dia; R2 oferece 10 GB de armazenamento e franquias mensais de operações. | Pode custar US$ 0 para catálogo pequeno, mas obriga reescrever o servidor Express atual para arquitetura serverless e migrar MySQL para SQLite/D1. |
| Oracle Cloud Always Free | A conta Free Tier mantém serviços Always Free por tempo ilimitado dentro de limites e exige cartão para verificação. A conta pode suspender recursos ociosos após 30 dias. | Pode hospedar Node, banco e fotos por US$ 0, mas transforma a manutenção em administração de servidor: segurança, backups, atualizações e monitoramento ficam por nossa conta. |
| Koyeb Free | A pesquisa oficial indica uma instância gratuita limitada, banco gratuito de uso muito restrito e armazenamento local efêmero. | Não é apropriado para o painel com dados e fotos persistentes. |

Fontes: [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/), [R2 Pricing](https://developers.cloudflare.com/r2/pricing/) e [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/).

## Recomendação atual

O caminho mais barato em dinheiro é Cloudflare (potencialmente US$ 0), porém cobra uma reescrita significativa. O caminho mais simples para preservar o código Express é Railway, com a possibilidade de começar no plano gratuito/US$ 1 em créditos e migrar ao Hobby quando a demanda exigir. Oracle Always Free é uma opção sem mensalidade, mas não é recomendada para quem não quer cuidar de servidor, segurança e backups manualmente.

## Supabase como camada de dados externa

O plano Free do Supabase disponibiliza banco PostgreSQL de 500 MB, 1 GB de armazenamento de arquivos, 5 GB de saída de dados, 50.000 usuários ativos por mês e autenticação incluída. Projetos gratuitos são pausados após uma semana de inatividade. Isso oferece banco, fotos e login sem custo inicial, mas exige migrar o esquema atual de MySQL e substituir o OAuth específico do Manus; além disso, uma loja sem visitas por sete dias pode precisar ser retomada antes do próximo acesso. Fonte: [Supabase Pricing](https://supabase.com/pricing).
