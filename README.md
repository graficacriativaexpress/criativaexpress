# Catálogo de Tags para Semijoias

Um site de catálogo moderno, elegante e responsivo para vender tags e produtos para semijoias.

## 🎨 Características

- ✨ Design premium e sofisticado
- 📱 Responsivo para mobile, tablet e desktop
- 🎬 Animações suaves e transições elegantes
- 🛍️ Catálogo organizado por categorias
- 💬 Integração com WhatsApp para pedidos
- 🎯 Interface intuitiva e fácil de usar
- 🚀 Performance otimizada

## 📋 Categorias

1. **Cartão de Visita** - Cartões premium com acabamentos especiais
2. **DTF** - Transferências DTF de alta qualidade
3. **Tags Personalizadas** - Tags para semijoias com design exclusivo

## 🚀 Como Começar

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔧 Configuração

### WhatsApp

Para configurar o número de WhatsApp, edite o arquivo `src/components/ProductCard.jsx`:

```jsx
const handleWhatsApp = () => {
  const message = `...`
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/SEU_NUMERO_AQUI?text=${encodedMessage}`, '_blank')
}
```

Substitua `SEU_NUMERO_AQUI` pelo seu número com código do país (ex: 5511999999999).

### Logo da Marca

Para adicionar sua logo, substitua o ícone placeholder nos seguintes arquivos:

1. **Header** (`src/components/Header.jsx`)
2. **Hero Banner** (`src/components/HeroBanner.jsx`)
3. **Footer** (`src/components/Footer.jsx`)

### Cores e Estilos

Customize as cores no arquivo `tailwind.config.js`:

```javascript
colors: {
  primary: { ... },    // Cor principal
  accent: { ... },     // Cor de destaque
  dark: { ... },       // Cores escuras
}
```

## 📦 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Conecte o repositório no Vercel
3. Clique em "Deploy"

```bash
# Build
npm run build

# Preview local
npm run preview
```

### Outras Plataformas

O projeto é compatível com:
- Netlify
- GitHub Pages
- Railway
- Render

## 📝 Estrutura do Projeto

```
semijoias-catalog/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CategorySection.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Próximas Melhorias

- [ ] Painel administrativo para gerenciar produtos
- [ ] Banco de dados para persistir produtos
- [ ] Upload de imagens
- [ ] Autenticação de usuário
- [ ] Carrinho de compras
- [ ] Sistema de pagamento

## 📄 Licença

MIT

## 👨‍💻 Suporte

Para dúvidas ou sugestões, entre em contato via WhatsApp.
