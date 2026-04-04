#!/usr/bin/env python3
"""
Generate line plots (median + IQR band) for CSR vs SSR performance comparison.
6 conditions x 5 dataset sizes per metric.
X axis = dataset sizes, one line per condition.
"""

import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path

DATA_PATH = Path('../back-end/results/all-results.json')
OUT_DIR = Path('../Article_JSERD/img')

with open(DATA_PATH) as f:
    raw = json.load(f)

sizes      = ['extra-small', 'small', 'medium', 'large', 'extra-large']
size_labels = ['XS', 'S', 'M', 'L', 'XL']
x = np.arange(len(sizes))

conditions = [
    ('json', 0, 0, 'CSR'),
    ('json', 1, 0, 'CSR+Min'),
    ('json', 0, 1, 'CSR+Gzip'),
    ('json', 1, 1, 'CSR+Min+Gzip'),
    ('html', 0, 0, 'SSR'),
    ('html', 0, 1, 'SSR+Gzip'),
]

# Color + linestyle + marker — each combination is unique
STYLES = [
    ('#0072B2', '-',   'o',  'CSR'),           # solid blue, circle
    ('#56B4E9', '--',  's',  'CSR+Min'),        # dashed sky-blue, square
    ('#009E73', ':',   '^',  'CSR+Gzip'),       # dotted green, triangle
    ('#F0E442', '-.',  'D',  'CSR+Min+Gzip'),   # dash-dot yellow, diamond
    ('#D55E00', '-',   'o',  'SSR'),            # solid vermillion, circle
    ('#CC79A7', '--',  's',  'SSR+Gzip'),       # dashed purple, square
]

METRICS = [
    # (field, ylabel, scale_to_unit, use_log, out_filename)
    ('lcp',        'LCP (s)',            1 / 1000,  True,  'lcp.png'),
    ('fcp',        'FCP (s)',            1 / 1000,  True,  'fcp.png'),
    ('si',         'SI (s)',             1 / 1000,  True,  'si.png'),
    ('tti',        'TTI (s)',            1 / 1000,  True,  'tti.png'),
    ('score',      'Performance Score',  1,         False, 'score.png'),
    ('jsHeapUsed', 'JS Heap Used (MB)',  1 / 1024,  False, 'jsheap.png'),
]


def get_values(field, fmt, size, minify, gzip, scale):
    return np.array([
        r[field] * scale
        for r in raw
        if (r['format'] == fmt
            and r['size'] == size
            and r['minify'] == minify
            and r['gzip'] == gzip)
    ])


for field, ylabel, scale, use_log, fname in METRICS:
    fig, ax = plt.subplots(figsize=(10, 5))

    for ci, (fmt, minify, gzip, label) in enumerate(conditions):
        color, ls, marker, _ = STYLES[ci]

        medians = []
        q1s, q3s = [], []
        for sz in sizes:
            vals = get_values(field, fmt, sz, minify, gzip, scale)
            medians.append(np.median(vals))
            q1s.append(np.percentile(vals, 25))
            q3s.append(np.percentile(vals, 75))

        medians = np.array(medians)
        q1s     = np.array(q1s)
        q3s     = np.array(q3s)

        ax.plot(x, medians, color=color, linestyle=ls, marker=marker,
                linewidth=2.0, markersize=7, label=label, zorder=3)
        ax.fill_between(x, q1s, q3s, color=color, alpha=0.12, zorder=2)

    ax.set_xticks(x)
    ax.set_xticklabels(size_labels, fontsize=12)
    ax.set_xlabel('Dataset Size', fontsize=13)
    ax.set_ylabel(ylabel, fontsize=13)
    ax.set_xlim(-0.25, len(sizes) - 0.75)

    if use_log:
        ax.set_yscale('log')

    ax.grid(axis='y', linestyle='--', alpha=0.4, linewidth=0.7)
    ax.grid(axis='x', linestyle=':', alpha=0.3, linewidth=0.6)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    ax.legend(fontsize=9, ncol=2, framealpha=0.85,
              loc='upper left' if field != 'score' else 'lower left')

    plt.tight_layout()
    out_path = OUT_DIR / fname
    plt.savefig(out_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f'Saved: {out_path}')

print('All plots generated.')
