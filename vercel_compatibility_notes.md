# Avaliação de compatibilidade com Vercel

## Fonte oficial consultada

- [Using Express.js with Vercel](https://vercel.com/kb/guide/using-express-with-vercel), documentação oficial do Vercel, consultada em 12 de agosto de 2026.

## Pontos relevantes da documentação

O Vercel executa aplicações Express como funções serverless e orienta expor o aplicativo por um arquivo de função em `/api` com reescritas em `vercel.json`. O ambiente não mantém um processo de servidor permanentemente ativo; por isso, conexões de banco precisam ser compatíveis com o modelo serverless e utilizar pool de conexões quando necessário.

## Impacto neste projeto

O projeto atual inicia seu próprio servidor HTTP Express (`server/_core/index.ts`), depende de OAuth do Manus e de variáveis/serviços gerenciados pelo Manus para autenticação, armazenamento e banco. Para funcionar no Vercel sem quebrar o painel administrativo, seria necessário adaptar o servidor para função serverless e substituir ou reconfigurar autenticação, armazenamento e variáveis de produção em um provedor externo compatível.
