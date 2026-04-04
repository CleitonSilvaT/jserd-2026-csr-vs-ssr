# Plano de Extensão JSERD - Material Novo

## Título Sugerido (diferente do SBQS)

**Opções:**
1. "Optimizing Web Rendering Performance: A Comparative Analysis of Minification, Compression, and Rendering Strategies"
2. "Beyond Rendering Approaches: Evaluating Performance Optimization Techniques in Web Applications"
3. "Performance Optimization in Web Applications: Effects of Minification, Compression, and Rendering Strategies"

## Material Novo (≥30% requerido)

### 1. Nova Seção: "Performance Optimization Techniques" (Seção 4.X)

**Conteúdo:**
- Introdução às técnicas de otimização: minificação e compressão
- Justificativa para incluir esses fatores no estudo
- Hipóteses específicas:
  - H1: Minificação de JSON reduz o tamanho do payload e melhora FCP/SI
  - H2: Compressão gzip reduz significativamente o tempo de transferência
  - H3: Combinação de minificação + gzip tem efeito sinérgico
- Descrição técnica da implementação:
  - Como a minificação foi aplicada (JSON.stringify sem espaços)
  - Como a compressão gzip foi implementada (zlib no Node.js)
  - Headers HTTP relevantes (Content-Encoding, Content-Type)

**Tamanho estimado:** ~800-1000 palavras

### 2. Nova Seção: "Effect Size Analysis" (Seção 5.X ou 6.X)

**Conteúdo:**
- Introdução ao Cliff's Delta como medida de effect size não-paramétrica
- Justificativa: p-values não indicam magnitude do efeito
- Metodologia:
  - Cálculo de Cliff's Delta para comparações pairwise
  - Interpretação (negligible/small/medium/large)
  - Intervalos de confiança via bootstrap
- Resultados:
  - Tabelas de effect sizes por métrica
  - Comparação com resultados de significância estatística
  - Discussão sobre quando diferenças são estatisticamente significativas mas praticamente irrelevantes

**Tamanho estimado:** ~600-800 palavras

### 3. Novos Resultados Experimentais

**Tabelas novas:**
- Tabela comparando CSR baseline vs CSR minificado vs CSR+gzip vs CSR minificado+gzip
- Tabela comparando SSR baseline vs SSR+gzip
- Tabelas de effect size (Cliff's Delta) para todas as comparações
- Tabelas de p-values ajustados (Dunn test com correção Holm)

**Figuras novas:**
- Gráficos comparando payload size (minificado vs não-minificado)
- Gráficos comparando tempos de transferência (com/sem gzip)
- Gráficos de effect sizes por métrica

**Tamanho estimado:** ~400-600 palavras (texto) + tabelas/figuras

### 4. Seção Atualizada: "Threats to Validity" (Seção 7)

**Adições:**
- Discussão sobre trade-offs: compressão reduz transferência mas aumenta CPU no servidor
- Limitação: minificação só aplicada a JSON (não HTML/CSS)
- Limitação: testes apenas em ambiente controlado (sem variação de rede)
- Validade externa: resultados podem variar com diferentes tipos de dados (não apenas galeria de fotos)

**Tamanho estimado:** ~200-300 palavras adicionais

### 5. Seção Atualizada: "Related Work" (Seção 3)

**Adições:**
- Trabalhos sobre minificação e compressão em web applications
- Estudos comparando diferentes técnicas de otimização
- Trabalhos sobre effect size em estudos de performance

**Tamanho estimado:** ~300-400 palavras adicionais

### 6. Seção Atualizada: "Discussion" (Seção 6)

**Adições:**
- Discussão sobre quando usar minificação vs compressão vs ambos
- Análise de trade-offs (CPU vs bandwidth)
- Recomendações práticas baseadas em effect sizes
- Comparação com resultados anteriores (baseline CSR vs SSR)

**Tamanho estimado:** ~400-500 palavras adicionais

### 7. Seção Atualizada: "Materials and Methods" (Seção 4)

**Adições:**
- Descrição detalhada da matriz experimental expandida
- Descrição dos novos fatores (minify, gzip)
- Metodologia estatística expandida (Cliff's Delta, Dunn test)
- Descrição dos scripts Python para análise

**Tamanho estimado:** ~300-400 palavras adicionais

## Total Estimado de Material Novo

- **Texto novo:** ~3000-4000 palavras
- **Tabelas novas:** ~5-7 tabelas
- **Figuras novas:** ~3-5 figuras
- **Referências novas:** ~5-8 referências

**Percentual estimado:** ~35-45% de material novo (bem acima do mínimo de 30%)

## Cover Letter Checklist

### Estrutura Sugerida:

1. **Abertura**
   - Agradecimento pelo convite
   - Referência ao paper original (SBQS 2025)

2. **Extensões Principais**
   - ✅ **Novos fatores experimentais:**
     - Minificação de JSON
     - Compressão gzip
     - Matriz experimental expandida (de 2 para 8+ cenários)
   
   - ✅ **Análise estatística expandida:**
     - Adição de Cliff's Delta para effect size
     - Dunn's post-hoc test com correção Holm
     - Análise mais robusta e interpretável
   
   - ✅ **Novos resultados:**
     - Comparação de técnicas de otimização
     - Análise de trade-offs (CPU vs bandwidth)
     - Recomendações práticas baseadas em effect sizes
   
   - ✅ **Metodologia expandida:**
     - Scripts Python para análise automatizada
     - Pipeline reprodutível para geração de tabelas
     - Análise estatística mais rigorosa

3. **Relevância para JSERD**
   - Contribuição para engenharia de software (decisões arquiteturais)
   - Metodologia reprodutível e extensível
   - Resultados práticos para desenvolvedores
   - Análise estatística robusta

4. **Estrutura do Paper**
   - Lista de seções novas/expandidas
   - Referência a tabelas e figuras novas
   - Percentual de material novo (~35-45%)

5. **Conclusão**
   - Confirmação de submissão até o deadline
   - Disponibilidade para revisões

## Pontos-Chave para Destacar

1. **Não é apenas mais dados:** Novos fatores experimentais (minify, gzip) mudam completamente a análise
2. **Análise estatística mais robusta:** Effect sizes complementam p-values
3. **Relevância prática:** Resultados ajudam desenvolvedores a tomar decisões informadas
4. **Reprodutibilidade:** Código e scripts disponíveis publicamente
5. **Extensão significativa:** ~35-45% de material novo, bem acima do mínimo

## Próximos Passos

1. ✅ Implementação técnica completa (backend, scripts, análise)
2. ⏳ Executar experimentos com novos fatores
3. ⏳ Gerar tabelas e figuras usando scripts Python
4. ⏳ Escrever seções novas do paper
5. ⏳ Atualizar seções existentes
6. ⏳ Revisar e ajustar baseado em resultados
7. ⏳ Preparar cover letter final
8. ⏳ Submeter até 2 de março de 2026

