"""
IntelliFutsal -- squad structure analysis on the 12 REAL players (no augmentation).

Reproduces every number and figure in Section VI of the manuscript.
k=5 matches the five physical conditions of the deployed platform
(app/domain/constants.py :: PhysicalCondition).

Usage:  python3 clustering_real_squad.py
"""
import pandas as pd, numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import (silhouette_score, davies_bouldin_score,
                             calinski_harabasz_score, adjusted_rand_score,
                             normalized_mutual_info_score)
from scipy.cluster.hierarchy import linkage, dendrogram
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, "figures")
os.makedirs(OUT, exist_ok=True)
K    = 5                      # = len(PhysicalCondition) in the deployed platform

df   = pd.read_csv(os.path.join(HERE, "USBFutsal.csv"), sep=";", header=1,
                   encoding="utf-8-sig")
meta = df[["PLAYER_ID", "POSITION"]].copy()
X    = df.drop(columns=["PLAYER_ID", "FULL_NAME", "POSITION"]).select_dtypes("number")
pos  = meta.POSITION.values
Xs   = StandardScaler().fit_transform(X)
print(f"n = {len(X)}  features = {len(X.columns)}\n")

# ---------------------------------------------------------------- PCA
pca = PCA(); Z = pca.fit_transform(Xs); evr = pca.explained_variance_ratio_
print("== PCA ==")
for i in range(3):
    print(f"   PC{i+1}: {evr[i]*100:5.2f}%  (cum {evr[:i+1].sum()*100:5.2f}%)")
print("\n== PC1/PC2 loadings ==")
print(pd.DataFrame(pca.components_[:2].T, index=X.columns,
                   columns=["PC1", "PC2"]).round(3).to_string())

# ---------------------------------------------------------------- k sweep
print("\n== Partition quality (Ward | K-Means) ==")
print(f"{'k':>2} {'sil_W':>7} {'DBI_W':>7} {'ARI_W':>7} {'sil_KM':>7} {'DBI_KM':>7}")
res = {}
for k in range(2, 7):
    lw = AgglomerativeClustering(n_clusters=k, linkage="ward").fit_predict(Xs)
    lk = KMeans(n_clusters=k, random_state=42, n_init=50).fit_predict(Xs)
    res[k] = lw
    print(f"{k:>2} {silhouette_score(Xs,lw):7.4f} {davies_bouldin_score(Xs,lw):7.4f} "
          f"{adjusted_rand_score(pos,lw):7.4f} {silhouette_score(Xs,lk):7.4f} "
          f"{davies_bouldin_score(Xs,lk):7.4f}")

lab = res[K]
print(f"\n== Adopted k={K} ==")
print(f"   silhouette {silhouette_score(Xs,lab):.4f} | DBI {davies_bouldin_score(Xs,lab):.4f} "
      f"| CHI {calinski_harabasz_score(Xs,lab):.2f}")
print(f"   ARI {adjusted_rand_score(pos,lab):.4f} | NMI {normalized_mutual_info_score(pos,lab):.4f}")

print(f"\n== Group profiles, real units (k={K}) ==")
prof = X.copy(); prof["c"] = lab
print(prof.groupby("c").mean().round(2).to_string())
print("\nsquad mean:"); print(X.mean().round(2).to_string())

print(f"\n== Contingency cluster x position (k={K}) ==")
print(pd.crosstab(pd.Series(lab, name="cluster"), pd.Series(pos, name="position")).to_string())

print(f"\n== Composition (k={K}) ==")
for c in range(K):
    m = lab == c
    print(f"   C{c} (n={m.sum()}): " +
          ", ".join(f"P{i:02d}[{p[:4]}]" for i, p in zip(meta.PLAYER_ID[m], meta.POSITION[m])))

# ---------------------------------------------------------------- figures
L = linkage(Xs, method="ward")
plt.figure(figsize=(7, 4.2))
dendrogram(L, labels=[f"P{i:02d} ({p[:4]})" for i, p in zip(meta.PLAYER_ID, meta.POSITION)],
           leaf_rotation=90, color_threshold=L[-(K-1), 2])
plt.ylabel("Ward linkage distance"); plt.tight_layout()
plt.savefig(f"{OUT}/real-dendrogram.png", dpi=400, bbox_inches="tight"); plt.close()

plt.figure(figsize=(5.2, 4.2))
MARK = {"WINGER": "o", "PIVOT": "s", "GOALKEEPER": "^", "FIXO": "D"}
COL  = plt.cm.Set2(np.linspace(0, 1, K))
for c in range(K):
    for p, mk in MARK.items():
        m = (lab == c) & (pos == p)
        if m.sum():
            plt.scatter(Z[m, 0], Z[m, 1], marker=mk, s=95, color=COL[c],
                        edgecolor="k", linewidth=.6, label=f"C{c} / {p.capitalize()}")
for i in range(len(Z)):
    plt.annotate(f"P{meta.PLAYER_ID[i]:02d}", (Z[i, 0], Z[i, 1]), fontsize=6,
                 xytext=(4, 3), textcoords="offset points")
plt.xlabel(f"PC$_1$ ({evr[0]*100:.1f}% var.)"); plt.ylabel(f"PC$_2$ ({evr[1]*100:.1f}% var.)")
plt.legend(fontsize=5.2, loc="best", framealpha=.9); plt.grid(alpha=.3)
plt.tight_layout(); plt.savefig(f"{OUT}/real-pca.png", dpi=400, bbox_inches="tight"); plt.close()

fig, ax = plt.subplots(1, 3, figsize=(9.6, 2.7))
ks  = list(range(2, 7))
sse = [KMeans(n_clusters=k, random_state=42, n_init=50).fit(Xs).inertia_ for k in ks]
ax[0].plot(ks, sse, "o-", color="#2b6cb0"); ax[0].set_ylabel("SSE (inertia)")
ax[0].set_title("(a) Elbow", fontsize=9)
ax[1].plot(ks, [silhouette_score(Xs, res[k]) for k in ks], "o-", color="#2f855a")
ax[1].set_ylabel("Mean silhouette"); ax[1].set_ylim(0, 0.6)
ax[1].set_title("(b) Internal validity", fontsize=9)
ax[2].plot(ks, [adjusted_rand_score(pos, res[k]) for k in ks], "s-", color="#c05621")
ax[2].axhline(0, ls=":", lw=.9, color="#999"); ax[2].set_ylim(-0.05, 1.0)
ax[2].set_ylabel("ARI vs. coach position"); ax[2].set_title("(c) External validity", fontsize=9)
ax[2].text(4.0, 0.62, "chance agreement\n$\\rightarrow$ role not encoded", fontsize=6,
           ha="center", color="#c05621", style="italic")
for a in ax:
    a.set_xlabel("Number of clusters $k$"); a.grid(alpha=.3); a.set_xticks(ks)
    a.axvline(K, ls="--", lw=.8, color="gray")
plt.tight_layout(); plt.savefig(f"{OUT}/real-kselection.png", dpi=400,
                                bbox_inches="tight", facecolor="white"); plt.close()
print(f"\n[figures written to {OUT}]")
