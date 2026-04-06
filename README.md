# CSR vs SSR Performance Study

Estudo experimental comparando desempenho de **Client-Side Rendering (CSR)** e **Server-Side Rendering (SSR)**.

## Estrutura do projeto

- `apps/backend`: API Node.js/Express, SSR HTML e scripts de benchmark
- `apps/frontend`: frontend Vite com páginas CSR
- `analysis`: análise estatística em Python
- `assets`: assets estáticos
- `data/results`: outputs do benchmark (csv/json)
- `docs/paper`: artigo/arquivos LaTeX do estudo

## Pré-requisitos

- Node.js 18+
- npm 9+
- Python 3.10+

## Setup inicial

```bash
cd apps/backend
npm install

cd ../frontend
npm install

cd ../../analysis
pip install -r requirements.txt
```

## Como rodar o projeto

### 1) Gerar dados de teste

```bash
cd apps/backend
npm run generate-json
```

### 2) Subir backend + frontend

Opção recomendada (script único):

```bash
./scripts/dev.sh
```

Opção manual (terminais separados):

Terminal 1:

```bash
cd apps/backend
npm start
```

Terminal 2:

```bash
cd apps/frontend
npm run dev
```

## URLs importantes

- Backend API (JSON): `http://localhost:3001/data`
- Frontend CSR: `http://localhost:5500/json.html`
- SSR via backend: `http://localhost:3001/data?size=extra-small&format=html`

## Rodar benchmark de performance

Com backend e frontend ativos:

```bash
cd apps/backend
npm run performance
```

Saídas geradas em `data/results/`:

- `all-results.json`
- `all-results.csv`
- arquivos individuais por cenário (`{size}-{format}-minify{0|1}-gzip{0|1}-individual.json`)

## Rodar análise estatística

```bash
cd analysis
python make_tables.py ../data/results/all-results.csv [output_dir]
```

Gera tabelas descritivas + testes:

- Kruskal-Wallis
- Dunn post-hoc (Holm)
- Cliff's Delta

## Comandos úteis

Backend:

```bash
cd apps/backend
npm run generate-json
npm start
npm run performance
```

Frontend:

```bash
cd apps/frontend
npm run dev
npm run build
npm run preview
```

## Documentação complementar

- `apps/frontend/README.md`
- `apps/backend/scripts/README.md`
- `analysis/README.md`