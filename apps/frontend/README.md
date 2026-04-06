# Frontend - Servidor Vite

Frontend servido via Vite para facilitar desenvolvimento e testes.

## Impacto na Performance

**Modo desenvolvimento (`npm run dev`):**
- Vite adiciona overhead mínimo (~1-2ms por request)
- Não afeta métricas de performance do experimento significativamente
- Headers HTTP e conteúdo são idênticos aos arquivos estáticos

**Modo produção (`npm run build`):**
- Gera arquivos estáticos puros (sem transformações)
- Configurado para **não minificar** (mantém baseline do experimento)
- Performance idêntica a servir arquivos estáticos diretamente

## Instalação

```bash
npm install
```

## Uso

### Desenvolvimento

```bash
npm run dev
```

Servidor roda em `http://localhost:5500`

Acesse:
- `http://localhost:5500/json.html` - Página CSR
- `http://localhost:5500/html.html` - Página SSR (se aplicável)
- `http://localhost:5500/index.html` - Página inicial

### Build para Produção

```bash
npm run build
```

Gera arquivos estáticos em `dist/` (não minificados, mantendo baseline experimental).

### Preview do Build

```bash
npm run preview
```

## Estrutura

- `json.html` - Página de Client-Side Rendering (CSR)
- `html.html` - Página de Server-Side Rendering (SSR)
- `index.html` - Página inicial
- `main.css` - Estilos (se aplicável)

Assets (imagens) são servidos de `../../assets/` via configuração do Vite.

## Notas

- Vite está configurado para **não minificar** em produção para manter a baseline do experimento
- Assets são servidos do diretório `../../assets/` (avatar.png, imagens de posts, etc.)
- CORS está habilitado para permitir requisições do backend
