"""
Statistical analysis functions for performance metrics.
Includes Kruskal-Wallis test, Dunn's post-hoc test, and Cliff's Delta effect size.
"""

import numpy as np
from scipy import stats
from scipy.stats import kruskal, mannwhitneyu
import pandas as pd
from itertools import combinations
from statsmodels.stats.multitest import multipletests


def kruskal_wallis_test(groups):
    """
    Perform Kruskal-Wallis H-test for independent samples.
    
    Args:
        groups: List of arrays, each containing observations for one group
        
    Returns:
        statistic: Kruskal-Wallis H-statistic
        pvalue: p-value of the test
    """
    groups_clean = [g[~np.isnan(g)] for g in groups if len(g[~np.isnan(g)]) > 0]
    if len(groups_clean) < 2:
        return np.nan, np.nan
    
    # Verificar se todos os valores são idênticos
    all_values = np.concatenate(groups_clean)
    if len(np.unique(all_values)) <= 1:
        # Todos os valores são iguais, não há variação
        return 0.0, 1.0  # Estatística = 0, p-value = 1 (não há diferença)
    
    try:
        statistic, pvalue = kruskal(*groups_clean)
        return statistic, pvalue
    except ValueError as e:
        # Se der erro (ex: todos valores iguais), retorna valores padrão
        if "All numbers are identical" in str(e):
            return 0.0, 1.0
        raise


def dunn_test(groups, group_names, alpha=0.05, method="holm"):
    """
    Perform Dunn's post-hoc test with multiple comparison correction.
    
    Args:
        groups: List of arrays, each containing observations for one group
        group_names: List of group names (same length as groups)
        alpha: Significance level (default 0.05)
        method: Correction method ('holm', 'bonferroni', 'fdr_bh', etc.)
        
    Returns:
        DataFrame with columns: group1, group2, statistic, pvalue, pvalue_adjusted, significant
    """
    results = []
    
    for (i, group1), (j, group2) in combinations(enumerate(groups), 2):
        # Remove NaN values
        g1_clean = group1[~np.isnan(group1)]
        g2_clean = group2[~np.isnan(group2)]
        
        if len(g1_clean) == 0 or len(g2_clean) == 0:
            continue
            
        # Mann-Whitney U test (used in Dunn's test)
        statistic, pvalue = mannwhitneyu(g1_clean, g2_clean, alternative="two-sided")
        
        results.append({
            "group1": group_names[i],
            "group2": group_names[j],
            "statistic": statistic,
            "pvalue": pvalue,
        })
    
    if not results:
        return pd.DataFrame()
    
    df = pd.DataFrame(results)
    
    # Apply multiple comparison correction
    if method:
        _, p_adjusted, _, _ = multipletests(
            df["pvalue"], alpha=alpha, method=method
        )
        df["pvalue_adjusted"] = p_adjusted
        df["significant"] = p_adjusted < alpha
    else:
        df["pvalue_adjusted"] = df["pvalue"]
        df["significant"] = df["pvalue"] < alpha
    
    return df


def cliffs_delta(x, y):
    """
    Calculate Cliff's Delta effect size.
    
    Cliff's Delta is a non-parametric effect size measure that quantifies
    the probability that a value from one group is greater than a value
    from another group.
    
    Args:
        x: First group (array-like)
        y: Second group (array-like)
        
    Returns:
        delta: Cliff's Delta value (ranges from -1 to 1)
        interpretation: String describing the effect size
    """
    x = np.array(x)
    y = np.array(y)
    
    # Remove NaN values
    x = x[~np.isnan(x)]
    y = y[~np.isnan(y)]
    
    if len(x) == 0 or len(y) == 0:
        return np.nan, "insufficient data"
    
    # Count how many times x[i] > y[j]
    n_x = len(x)
    n_y = len(y)
    
    count = 0
    for xi in x:
        for yj in y:
            if xi > yj:
                count += 1
            elif xi == yj:
                count += 0.5
    
    delta = (2 * count / (n_x * n_y)) - 1
    
    # Interpret effect size
    abs_delta = abs(delta)
    if abs_delta < 0.147:
        interpretation = "negligible"
    elif abs_delta < 0.33:
        interpretation = "small"
    elif abs_delta < 0.474:
        interpretation = "medium"
    else:
        interpretation = "large"
    
    return delta, interpretation


def cliffs_delta_bootstrap(x, y, n_bootstrap=1000, confidence=0.95):
    """
    Calculate Cliff's Delta with bootstrap confidence interval.
    
    Args:
        x: First group (array-like)
        y: Second group (array-like)
        n_bootstrap: Number of bootstrap samples
        confidence: Confidence level (default 0.95)
        
    Returns:
        delta: Cliff's Delta value
        ci_lower: Lower bound of confidence interval
        ci_upper: Upper bound of confidence interval
        interpretation: String describing the effect size
    """
    delta, interpretation = cliffs_delta(x, y)
    
    if np.isnan(delta):
        return delta, np.nan, np.nan, interpretation
    
    # Bootstrap sampling
    n_x = len(x)
    n_y = len(y)
    bootstrap_deltas = []
    
    np.random.seed(42)  # For reproducibility
    for _ in range(n_bootstrap):
        x_boot = np.random.choice(x, size=n_x, replace=True)
        y_boot = np.random.choice(y, size=n_y, replace=True)
        delta_boot, _ = cliffs_delta(x_boot, y_boot)
        if not np.isnan(delta_boot):
            bootstrap_deltas.append(delta_boot)
    
    if len(bootstrap_deltas) == 0:
        return delta, np.nan, np.nan, interpretation
    
    alpha = 1 - confidence
    ci_lower = np.percentile(bootstrap_deltas, (alpha / 2) * 100)
    ci_upper = np.percentile(bootstrap_deltas, (1 - alpha / 2) * 100)
    
    return delta, ci_lower, ci_upper, interpretation


def pairwise_cliffs_delta(groups, group_names):
    """
    Calculate Cliff's Delta for all pairwise comparisons.
    
    Args:
        groups: List of arrays, each containing observations for one group
        group_names: List of group names (same length as groups)
        
    Returns:
        DataFrame with columns: group1, group2, delta, interpretation, ci_lower, ci_upper
    """
    results = []
    
    for (i, group1), (j, group2) in combinations(enumerate(groups), 2):
        delta, ci_lower, ci_upper, interpretation = cliffs_delta_bootstrap(
            group1, group2
        )
        
        results.append({
            "group1": group_names[i],
            "group2": group_names[j],
            "delta": delta,
            "interpretation": interpretation,
            "ci_lower": ci_lower,
            "ci_upper": ci_upper,
        })
    
    return pd.DataFrame(results)


def calculate_summary_statistics(groups, group_names):
    """
    Calculate summary statistics (mean, median, IQR) for each group.
    
    Args:
        groups: List of arrays, each containing observations for one group
        group_names: List of group names (same length as groups)
        
    Returns:
        DataFrame with summary statistics
    """
    results = []
    
    for name, group in zip(group_names, groups):
        group_clean = group[~np.isnan(group)]
        if len(group_clean) == 0:
            continue
            
        q25, q50, q75 = np.percentile(group_clean, [25, 50, 75])
        
        results.append({
            "group": name,
            "mean": np.mean(group_clean),
            "median": q50,
            "std": np.std(group_clean),
            "q25": q25,
            "q75": q75,
            "iqr": q75 - q25,
            "min": np.min(group_clean),
            "max": np.max(group_clean),
            "n": len(group_clean),
        })
    
    return pd.DataFrame(results)

