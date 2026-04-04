# Código do Projeto - CSR vs SSR Performance Study

## Estrutura

- `back-end/`: Servidor Node.js/Express que serve dados (JSON/HTML) e implementa SSR
- `front-end/`: Frontend servido via Vite com páginas CSR
- `assets/`: Imagens e recursos estáticos
- `analysis/`: Scripts Python para análise estatística

## Início Rápido

### 1. Instalar dependências

**Backend:**
```bash
cd back-end
npm install
```

**Frontend:**
```bash
cd front-end
npm install
```

### 2. Gerar dados de teste

```bash
cd back-end
npm run generate-json
```

### 3. Iniciar servidores

**Opção A: Script automático (recomendado)**
```bash
./start-servers.sh
```

**Opção B: Manual (em terminais separados)**

Terminal 1 - Backend:
```bash
cd back-end
npm start
```

Terminal 2 - Frontend:
```bash
cd front-end
npm run dev
```

### 4. Executar testes de performance

```bash
cd back-end
npm run performance
```

## URLs

- **Backend API**: http://localhost:3000/data
- **Frontend CSR**: http://localhost:5500/json.html
- **Frontend SSR**: http://localhost:3000/data?size=extra-small&format=html

## Sobre o Vite

O frontend usa Vite para servir os arquivos HTML. Isso facilita desenvolvimento e não impacta significativamente a performance:

- **Modo dev**: Overhead mínimo (~1-2ms)
- **Modo produção**: Gera arquivos estáticos puros (não minificados para manter baseline experimental)

Veja mais detalhes em `front-end/README.md`.

## Documentação

- `back-end/scripts/README.md`: Documentação dos scripts de teste
- `front-end/README.md`: Documentação do frontend/Vite
- `analysis/README.md`: Documentação da análise estatística
