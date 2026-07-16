# Squad structure analysis

Reproduces every analytical result reported in the manuscript
*IntelliFutsal* (IEEE Latin America Transactions submission):
PCA variance decomposition, Ward-linkage clustering, internal validity
indices (silhouette, Davies–Bouldin, Calinski–Harabasz), and the external
comparison against coach-assigned positions (ARI, NMI) — all computed on
the 12 real, anonymized player records in `USBFutsal.csv`. No data
augmentation is used at any point in this analysis.

## Usage

```bash
pip install pandas numpy scikit-learn scipy matplotlib
python3 clustering_real_squad.py
```

Prints the metric tables to stdout and writes the manuscript figures
(dendrogram, PCA projection, k-selection panel) to `figures/`.

## Data

`USBFutsal.csv` contains the anonymized squad records (P01–P12): age,
weight, height, BMI, four jump tests, 30 m sprint and 1000 m run times,
and the coach-assigned position. Collection was approved by the Ethics
Committee of Universidad de San Buenaventura Cali (Ing6-I-2026).
