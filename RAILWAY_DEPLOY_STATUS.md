# Estado da implantação no Railway

Atualizado durante a implantação de teste.

| Etapa | Estado |
| --- | --- |
| Conta Railway | Conectada no navegador do administrador |
| Repositório-alvo | `graficacriativaexpress/criativaexpress` |
| Aplicativo Railway para GitHub | Acesso salvo e limitado exclusivamente a `graficacriativaexpress/criativaexpress`; retorno ao Railway em andamento |
| Serviço da aplicação | Criado a partir de `graficacriativaexpress/criativaexpress`; variáveis aplicadas e serviço online confirmado |
| Endereço temporário | Gerado para validação: `https://criativaexpress-production.up.railway.app`; o domínio existente no Vercel permanece intacto até a aprovação da nova loja |
| Carga inicial do catálogo | A chave SSH temporária foi vinculada. A primeira execução identificou timestamps ISO incompatíveis com MySQL; a correção e seu teste foram enviados ao GitHub no commit `a0a39b3`, acionando uma nova implantação antes da execução única da semente |
| Banco MySQL | Serviço online e pronto para ser referenciado internamente pela aplicação |
| Volume de fotos | Recurso `criativaexpress-volume` criado e anexado ao serviço em `/data`; alteração aplicada junto da implantação concluída |
| Compilação da nova instância | A implantação anterior concluiu sem erro; o Railway recebeu o commit `a0a39b3`, concluiu a imagem e está na etapa de containers e healthchecks antes da carga final do catálogo |
| Variáveis de produção | Dez variáveis aplicadas no serviço Railway: banco, login local, diretório de uploads e execução de produção |
| Semente de catálogo | Aguardando o término da implantação automática do commit `a0a39b3` para executar uma única vez a carga corrigida |
