# Estado da implantação no Railway

Atualizado durante a implantação de teste.

| Etapa | Estado |
| --- | --- |
| Conta Railway | Conectada no navegador do administrador |
| Repositório-alvo | `graficacriativaexpress/criativaexpress` |
| Aplicativo Railway para GitHub | Acesso salvo e limitado exclusivamente a `graficacriativaexpress/criativaexpress`; retorno ao Railway em andamento |
| Serviço da aplicação | Criado a partir de `graficacriativaexpress/criativaexpress`; variáveis aplicadas e serviço online confirmado |
| Endereço temporário | Gerado para validação: `https://criativaexpress-production.up.railway.app`; o domínio existente no Vercel permanece intacto até a aprovação da nova loja |
| Carga inicial do catálogo | Concluída no serviço Railway após as correções cobertas por testes: `26` produtos e `24` imagens reais foram inseridos no MySQL |
| Banco MySQL | Serviço online e pronto para ser referenciado internamente pela aplicação |
| Volume de fotos | Recurso `criativaexpress-volume` criado e anexado ao serviço em `/data`; alteração aplicada junto da implantação concluída |
| Compilação da nova instância | A implantação anterior concluiu sem erro; o Railway recebeu o commit `19218bb`, concluiu a imagem e está na etapa de containers e healthchecks antes da carga final do catálogo |
| Variáveis de produção | Dez variáveis aplicadas no serviço Railway: banco, login local, diretório de uploads e execução de produção |
| Semente de catálogo | Concluída uma única vez por conexão SSH interna, sem exposição pública do banco |
