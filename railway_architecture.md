# Arquitetura proposta para Railway Free

## Objetivo

Executar a loja da Criativa Express com o menor número possível de serviços pagos, preservando o catálogo, as imagens, o painel administrativo e os pedidos pelo WhatsApp.

## Configuração proposta

| Camada | Solução | Persistência | Observação |
|---|---|---|---|
| Aplicação pública e painel | Serviço Node/Express no Railway | Serviço em execução | É implantado a partir da branch `main` do GitHub. |
| Catálogo e configurações | SQLite em volume do Railway | Volume anexado | Substitui o banco MySQL exclusivo do Manus e evita uma segunda conta de banco no início. |
| Fotos dos kits | Diretório de uploads no mesmo volume | Volume anexado | As fotos atuais serão migradas e os novos uploads do painel serão gravados de forma persistente. |
| Acesso administrativo | Credencial própria definida no Railway | Variáveis de ambiente | Substitui o login OAuth do Manus, que não funciona fora da plataforma original. |
| Pedidos | Link para WhatsApp | Não aplicável | Mantém o número e a mensagem formatada já configurados. |

## Custos e limites

O serviço e o volume consomem os créditos do Railway. A arquitetura mantém o consumo baixo ao evitar banco e armazenamento de imagens pagos separados, mas o crédito gratuito de US$ 1 não garante funcionamento contínuo por todo o mês. Durante o teste de 30 dias da conta, há US$ 5 de crédito; depois, o consumo será acompanhado pelo painel do Railway.

## Consequência importante

O painel administrativo continuará editável, porém o acesso será protegido por uma senha administrativa própria, configurada como segredo no Railway. Nenhuma senha previamente usada pelo proprietário será reutilizada.
