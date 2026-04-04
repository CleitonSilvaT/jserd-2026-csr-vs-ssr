# Scripts de Teste de Performance

## Estrutura

- `constants.mjs`: Configuração dos experimentos (tamanhos, formatos, fatores)
- `performance-test.mjs`: Script principal que executa os testes Lighthouse
- `generateReport.mjs`: Gera CSV com os resultados
- `lighthouse.mjs`: Wrapper para execução do Lighthouse
- `generateJson.mjs`: Gera dados de teste (JSON files)

## Configuração

Edite `constants.mjs` para ajustar:
- `SIZES`: Tamanhos de dados a testar
- `FORMATS`: Tipos de renderização (json=CSR, html=SSR)
- `MINIFY_OPTIONS`: Minificação de JSON (0=pretty, 1=minified)
- `GZIP_OPTIONS`: Compressão gzip (0=off, 1=on)
- `NUM_EXECUTIONS`: Número de iterações por cenário

## Execução

### 1. Gerar dados de teste

```bash
npm run generate-json
```

### 2. Iniciar servidores

**Backend (porta 3000):**
```bash
npm start
```

**Frontend (porta 5500) - em outro terminal:**
```bash
cd ../front-end
npm install  # primeira vez apenas
npm run dev
```

### 3. Executar testes de performance

```bash
npm run performance
```

**Nota:** Certifique-se de que ambos os servidores (backend na porta 3000 e frontend na porta 5500) estão rodando antes de executar os testes.

## Outputs

Os resultados são salvos em `./results/`:

- `all-results.json`: Todos os resultados individuais consolidados
- `{size}-{format}-minify{0|1}-gzip{0|1}-individual.json`: Resultados individuais por cenário
- `all-results.csv`: CSV com todos os resultados (para análise Python)

## Matriz Experimental

O script testa todas as combinações de:
- **Sizes**: extra-small, small, medium, large, extra-large
- **Formats**: json (CSR), html (SSR)
- **Minify**: 0 (pretty JSON), 1 (minified JSON) - apenas para format=json
- **Gzip**: 0 (sem compressão), 1 (com gzip)

Total de cenários: 5 sizes × 2 formats × 2 minify (apenas JSON) × 2 gzip = ~30 cenários
(HTML não usa minify, então são menos combinações)

## Métricas Coletadas

- **Lighthouse**: LCP, FCP, SI, TTI, CLS, FID, Performance Score
- **Sistema**: Heap usage, CPU usage, RSS memory

Todas as métricas são coletadas usando `numericValue` do Lighthouse para garantir precisão.

