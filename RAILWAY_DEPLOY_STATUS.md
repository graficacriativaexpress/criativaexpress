# Estado da implantação no Railway

Atualizado durante a implantação de teste.

| Etapa | Estado |
| --- | --- |
| Conta Railway | Conectada no navegador do administrador |
| Repositório-alvo | `graficacriativaexpress/criativaexpress` |
| Aplicativo Railway para GitHub | Acesso salvo e limitado exclusivamente a `graficacriativaexpress/criativaexpress`; retorno ao Railway em andamento |
| Serviço da aplicação | Criado a partir de `graficacriativaexpress/criativaexpress`; variáveis aplicadas e serviço online confirmado |
| Endereço temporário | Gerado para validação: `https://criativaexpress-production.up.railway.app`; o domínio existente no Vercel permanece intacto até a aprovação da nova loja |
| Carga inicial do catálogo | A CLI foi autorizada e a URL pública do MySQL não está habilitada. A execução remota por SSH exige vincular a chave temporária do ambiente seguro à conta Railway; após essa única autorização, será executado uma vez `pnpm railway:seed` |
| Banco MySQL | Serviço online e pronto para ser referenciado internamente pela aplicação |
| Volume de fotos | Recurso `criativaexpress-volume` criado e anexado ao serviço em `/data`; alteração aplicada junto da implantação concluída |
| Compilação da nova instância | Instalação das dependências, `pnpm build` e healthcheck concluídos sem erro de compilação visível |
| Variáveis de produção | Dez variáveis aplicadas no serviço Railway: banco, login local, diretório de uploads e execução de produção |
| Semente de catálogo | Pendente após a criação do banco |
