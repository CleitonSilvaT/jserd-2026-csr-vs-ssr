# Análise Estatística - Scripts Python

Este diretório contém scripts Python para análise estatística dos resultados experimentais.

## Instalação

```bash
pip install -r requirements.txt
```

## Estrutura

- `stats.py`: Funções estatísticas (Kruskal-Wallis, Dunn test, Cliff's Delta)
- `make_tables.py`: Script principal para gerar tabelas e análises
- `requirements.txt`: Dependências Python

## Uso

### Gerar todas as tabelas a partir de um CSV

```bash
python make_tables.py ../data/results/all-results.csv [output_dir]
```

O script irá:

1. Ler o CSV com os resultados experimentais
2. Gerar tabelas de estatísticas descritivas (média, mediana, IQR)
3. Executar testes de Kruskal-Wallis
4. Executar testes de Dunn (post-hoc)
5. Calcular Cliff's Delta para todas as comparações pairwise
6. Exportar tudo em CSV e LaTeX

### Outputs Gerados

Para cada métrica (LCP, FCP, SI, TTI, CLS, FID, performanceScore, JSHeapUsedSize):

- `summary_{metric}.csv` e `summary_{metric}.tex`: Estatísticas descritivas
- `kruskal_wallis_{metric}.csv`: Resultados do teste Kruskal-Wallis
- `dunn_{metric}.csv`: Resultados do teste de Dunn (post-hoc)
- `cliffs_delta_{metric}.csv`: Effect sizes (Cliff's Delta)

## Funções Estatísticas

### Kruskal-Wallis Test

Teste não-paramétrico para comparar múltiplos grupos independentes.

### Dunn's Test

Teste post-hoc após Kruskal-Wallis com correção de múltiplas comparações (Holm).

### Cliff's Delta

Medida de effect size não-paramétrica que quantifica a probabilidade de que um valor de um grupo seja maior que um valor de outro grupo.

- **Negligible**: |δ| < 0.147
- **Small**: 0.147 ≤ |δ| < 0.33
- **Medium**: 0.33 ≤ |δ| < 0.474
- **Large**: |δ| ≥ 0.474

## Exemplo de Uso Programático

```python
from stats import kruskal_wallis_test, dunn_test, cliffs_delta
import pandas as pd

# Carregar dados
df = pd.read_csv("results.csv")

# Separar grupos
group1 = df[(df["format"] == "json") & (df["minify"] == 0)]["LCP"].values
group2 = df[(df["format"] == "json") & (df["minify"] == 1)]["LCP"].values

# Kruskal-Wallis
stat, pval = kruskal_wallis_test([group1, group2])

# Cliff's Delta
delta, interpretation = cliffs_delta(group1, group2)
```

## Notas

- Todos os testes são não-paramétricos (não assumem distribuição normal)
- Correção de múltiplas comparações aplicada via método de Holm
- Cliff's Delta calculado com bootstrap para intervalos de confiança (1000 iterações, 95% CI)
