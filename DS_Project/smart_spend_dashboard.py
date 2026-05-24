import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')
 
# ─── Page Config ────────────────────────────────────────────────────
st.set_page_config(
    page_title="Smart Spend – Explanatory Analysis",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="collapsed"
)
 
# ─── Custom CSS ─────────────────────────────────────────────────────
st.markdown("""
<style>
    .stApp { background-color: #0d1117; color: #e6edf3; }
    h1, h2, h3, h4 { color: #e6edf3 !important; }
    [data-testid="stSidebar"] { background-color: #161b22; }
 
    .section-card {
        background: #161b22;
        border: 1px solid #30363d;
        border-radius: 12px;
        padding: 24px 28px;
        margin-bottom: 24px;
    }
    .question-badge {
        display: inline-block;
        background: linear-gradient(90deg, #1f6feb, #388bfd);
        color: white;
        font-size: 13px;
        font-weight: 700;
        padding: 4px 14px;
        border-radius: 20px;
        margin-bottom: 10px;
    }
    .question-badge-2 {
        display: inline-block;
        background: linear-gradient(90deg, #e3b341, #d29922);
        color: #0d1117;
        font-size: 13px;
        font-weight: 700;
        padding: 4px 14px;
        border-radius: 20px;
        margin-bottom: 10px;
    }
    .question-text {
        font-size: 17px;
        font-weight: 600;
        color: #e6edf3;
        margin-bottom: 6px;
        line-height: 1.5;
    }
    .insight-box {
        background: #0d2137;
        border-left: 4px solid #1f6feb;
        border-radius: 0 8px 8px 0;
        padding: 14px 18px;
        margin-top: 16px;
        color: #cdd9e5;
        font-size: 14px;
        line-height: 1.7;
    }
    .insight-box-2 {
        background: #2d1f0a;
        border-left: 4px solid #e3b341;
        border-radius: 0 8px 8px 0;
        padding: 14px 18px;
        margin-top: 16px;
        color: #cdd9e5;
        font-size: 14px;
        line-height: 1.7;
    }
    .stat-chip {
        display: inline-block;
        background: #1f2937;
        border: 1px solid #30363d;
        border-radius: 8px;
        padding: 10px 20px;
        margin: 6px 8px 6px 0;
        text-align: center;
    }
    .stat-chip .val { font-size: 20px; font-weight: 700; color: #58a6ff; }
    .stat-chip .lbl { font-size: 11px; color: #8b949e; margin-top: 2px; }
    .kesimpulan-box {
        background: linear-gradient(135deg, #0f2d1a 0%, #0a1f12 100%);
        border: 1px solid #2ea043;
        border-radius: 12px;
        padding: 20px 24px;
        margin-top: 24px;
        color: #cdd9e5;
        font-size: 14px;
        line-height: 1.8;
    }
    hr { border-color: #30363d !important; }
</style>
""", unsafe_allow_html=True)
 
# ─── Load & Clean Data ───────────────────────────────────────────────
@st.cache_data(show_spinner="Memuat dataset Smart Spend...")
def load_data():
    url = "https://drive.google.com/uc?export=download&id=1n7t9XudgUGaJkETkJaSJAPSvvRE7VMOF"
    df = pd.read_csv(url)
    df.drop_duplicates(inplace=True)
    missing_values = df.isnull().sum()
    less = missing_values[missing_values < 2000].index
    numeric_features = df[less].select_dtypes(include=['number']).columns
    df[numeric_features] = df[numeric_features].fillna(df[numeric_features].median())
    categorical_features = df[less].select_dtypes(include=['object']).columns
    for col in categorical_features:
        df[col] = df[col].fillna(df[col].mode()[0])
    if 'id' in df.columns:
        df.drop('id', axis=1, inplace=True)
    return df
 
df = load_data()
 
# ─── Matplotlib dark theme ───────────────────────────────────────────
plt.rcParams.update({
    'figure.facecolor':  '#0d1117',
    'axes.facecolor':    '#161b22',
    'axes.edgecolor':    '#30363d',
    'axes.labelcolor':   '#e6edf3',
    'xtick.color':       '#8b949e',
    'ytick.color':       '#8b949e',
    'text.color':        '#e6edf3',
    'grid.color':        '#30363d',
    'grid.linestyle':    '--',
    'grid.alpha':        0.5,
    'legend.facecolor':  '#161b22',
    'legend.edgecolor':  '#30363d',
})
 
# ─── HEADER ─────────────────────────────────────────────────────────
st.markdown("""
<div style="text-align:center; padding: 30px 0 8px 0;">
    <h1 style="font-size:40px; font-weight:800;
        background: linear-gradient(90deg, #1f6feb, #58a6ff, #2ea043);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        💰 Smart Spend
    </h1>
    <p style="color:#8b949e; font-size:15px; margin-top:4px;">
        Visualisasi & Explanatory Data Analysis — Pertanyaan Bisnis
    </p>
</div>
<hr>
""", unsafe_allow_html=True)
 
 
# ═══════════════════════════════════════════════════════════════════════
# PERTANYAAN 1
# ═══════════════════════════════════════════════════════════════════════
st.markdown("""
<div class="section-card">
    <div class="question-badge">Pertanyaan Bisnis 1</div>
    <div class="question-text">
        Apakah orang yang bekerja sebagai PNS/ASN memiliki rata-rata tabungan bulanan lebih tinggi
        dibandingkan Buruh/Pekerja Harian?
    </div>
</div>
""", unsafe_allow_html=True)
 
kelompok = ['PNS/ASN', 'Buruh/Pekerja Harian']
df_p1 = df[df['status_pekerjaan'].isin(kelompok)]
 
# Ringkasan statistik
ringkasan_p1 = df_p1.groupby('status_pekerjaan')['tabungan_bulanan'].agg(
    Jumlah_Responden='count',
    Rata_rata='mean',
    Median='median',
    Std_Deviasi='std'
).round(0)
 
# Stat chips
pns_mean  = ringkasan_p1.loc['PNS/ASN', 'Rata_rata']
buruh_mean = ringkasan_p1.loc['Buruh/Pekerja Harian', 'Rata_rata']
selisih = pns_mean - buruh_mean
 
st.markdown(f"""
<div style="margin-bottom:16px;">
    <div class="stat-chip">
        <div class="val">Rp {pns_mean/1e6:.2f}jt</div>
        <div class="lbl">Rata-rata Tabungan PNS/ASN</div>
    </div>
    <div class="stat-chip">
        <div class="val">Rp {buruh_mean/1e6:.2f}jt</div>
        <div class="lbl">Rata-rata Tabungan Buruh</div>
    </div>
    <div class="stat-chip">
        <div class="val" style="color:#2ea043;">Rp {selisih/1e6:.2f}jt</div>
        <div class="lbl">Selisih</div>
    </div>
</div>
""", unsafe_allow_html=True)
 
# Tabel ringkasan
tbl = ringkasan_p1.copy()
tbl['Rata_rata']   = tbl['Rata_rata'].apply(lambda x: f"Rp {x:,.0f}")
tbl['Median']      = tbl['Median'].apply(lambda x: f"Rp {x:,.0f}")
tbl['Std_Deviasi'] = tbl['Std_Deviasi'].apply(lambda x: f"Rp {x:,.0f}")
tbl.index.name = 'Status Pekerjaan'
st.dataframe(tbl, use_container_width=True)
 
# Grafik P1
fig1, axes = plt.subplots(1, 2, figsize=(13, 5))
fig1.patch.set_facecolor('#0d1117')
fig1.suptitle('Perbandingan Tabungan Bulanan: PNS/ASN vs Buruh/Pekerja Harian',
               fontsize=13, fontweight='bold', color='#e6edf3', y=1.01)
 
# --- Bar chart ---
rata_rata = df_p1.groupby('status_pekerjaan')['tabungan_bulanan'].mean()
colors_bar = ['#1f6feb', '#e3b341']
bars = axes[0].bar(rata_rata.index, rata_rata.values,
                   color=colors_bar, width=0.45, edgecolor='#0d1117', linewidth=1.5)
axes[0].set_title('Rata-rata Tabungan Bulanan', fontsize=11, fontweight='bold')
axes[0].set_ylabel('Tabungan Bulanan (Rp)')
axes[0].set_xlabel('Status Pekerjaan')
axes[0].set_ylim(0, rata_rata.max() * 1.35)
axes[0].yaxis.set_major_formatter(
    mticker.FuncFormatter(lambda x, _: f'Rp {x/1e6:.1f}jt'))
axes[0].grid(axis='y')
axes[0].spines['top'].set_visible(False)
axes[0].spines['right'].set_visible(False)
for bar in bars:
    h = bar.get_height()
    axes[0].text(bar.get_x() + bar.get_width() / 2,
                 h + rata_rata.max() * 0.03,
                 f'Rp {h:,.0f}', ha='center', va='bottom',
                 fontsize=9, fontweight='bold', color='#e6edf3')
 
# --- Boxplot ---
data_pns   = df_p1[df_p1['status_pekerjaan'] == 'PNS/ASN']['tabungan_bulanan']
data_buruh = df_p1[df_p1['status_pekerjaan'] == 'Buruh/Pekerja Harian']['tabungan_bulanan']
bp = axes[1].boxplot(
    [data_pns, data_buruh],
    labels=['PNS/ASN', 'Buruh/Pekerja Harian'],
    patch_artist=True,
    medianprops=dict(color='#f78166', linewidth=2.5),
    whiskerprops=dict(color='#8b949e', linewidth=1.3),
    capprops=dict(color='#8b949e', linewidth=1.3),
    flierprops=dict(marker='o', markerfacecolor='#8b949e', markersize=3, alpha=0.5),
    boxprops=dict(linewidth=1.3)
)
for patch, color in zip(bp['boxes'], ['#1f4f8f', '#7d5a10']):
    patch.set_facecolor(color)
    patch.set_alpha(0.85)
axes[1].set_title('Distribusi Tabungan Bulanan', fontsize=11, fontweight='bold')
axes[1].set_ylabel('Tabungan Bulanan (Rp)')
axes[1].yaxis.set_major_formatter(
    mticker.FuncFormatter(lambda x, _: f'Rp {x/1e6:.1f}jt'))
axes[1].grid(axis='y')
axes[1].spines['top'].set_visible(False)
axes[1].spines['right'].set_visible(False)
 
plt.tight_layout()
st.pyplot(fig1)
plt.close(fig1)
 
st.markdown("""
<div class="insight-box">
    📌 <b>Insight Pertanyaan 1:</b><br>
    • PNS/ASN memiliki rata-rata tabungan bulanan yang <b>lebih tinggi secara signifikan</b>
      dibandingkan Buruh/Pekerja Harian.<br>
    • Distribusi tabungan PNS/ASN lebih tersebar ke atas (boxplot lebih tinggi),
      sementara Buruh/Pekerja Harian cenderung lebih rendah dan seragam.<br>
    • Hal ini menunjukkan bahwa <b>jenis pekerjaan berpengaruh signifikan terhadap
      kemampuan menabung</b> seseorang.<br>
    • Rekomendasi: tambahkan fitur target tabungan yang disesuaikan berdasarkan jenis pekerjaan pengguna.
</div>
""", unsafe_allow_html=True)
 
st.markdown("<br>", unsafe_allow_html=True)
 
 
# ═══════════════════════════════════════════════════════════════════════
# PERTANYAAN 2
# ═══════════════════════════════════════════════════════════════════════
st.markdown("""
<div class="section-card">
    <div class="question-badge-2">Pertanyaan Bisnis 2</div>
    <div class="question-text">
        Bagaimana pola distribusi rasio tabungan (rasio_tabungan_persen) berdasarkan status pekerjaan,
        dan kelompok pekerjaan mana yang paling rendah rasio tabungannya?
    </div>
</div>
""", unsafe_allow_html=True)
 
# Ringkasan P2
ringkasan_p2 = df.groupby('status_pekerjaan')['rasio_tabungan_persen'].agg(
    Jumlah_Responden='count',
    Rata_rata='mean',
    Median='median',
    Std_Deviasi='std'
).round(2).sort_values('Rata_rata')
 
# Stat chips untuk P2
terendah = ringkasan_p2.index[0]
tertinggi = ringkasan_p2.index[-1]
terendah_val = ringkasan_p2.loc[terendah, 'Rata_rata']
tertinggi_val = ringkasan_p2.loc[tertinggi, 'Rata_rata']
 
st.markdown(f"""
<div style="margin-bottom:16px;">
    <div class="stat-chip">
        <div class="val" style="color:#f78166;">{terendah_val:.1f}%</div>
        <div class="lbl">Rasio Terendah {terendah}</div>
    </div>
    <div class="stat-chip">
        <div class="val" style="color:#2ea043;">{tertinggi_val:.1f}%</div>
        <div class="lbl">Rasio Tertinggi {tertinggi}</div>
    </div>
</div>
""", unsafe_allow_html=True)
 
# Tabel ringkasan P2
tbl2 = ringkasan_p2.copy()
tbl2.index.name = 'Status Pekerjaan'
tbl2.columns = ['Jumlah Responden', 'Rata-rata (%)', 'Median (%)', 'Std Deviasi (%)']
st.dataframe(tbl2, use_container_width=True)
 
# Grafik P2
order = ringkasan_p2.index.tolist()
palette_p2 = ['#f78166', '#e3b341', '#d2a8ff', '#58a6ff', '#56d364', '#1f6feb']
 
fig2, axes = plt.subplots(1, 2, figsize=(13, 5))
fig2.patch.set_facecolor('#0d1117')
fig2.suptitle('Pola Rasio Tabungan Berdasarkan Status Pekerjaan',
               fontsize=13, fontweight='bold', color='#e6edf3', y=1.01)
 
# --- Horizontal bar ---
rata2 = df.groupby('status_pekerjaan')['rasio_tabungan_persen'].mean().reindex(order)
colors_p2 = palette_p2[:len(order)]
hbars = axes[0].barh(list(order), rata2.values,
                     color=colors_p2, edgecolor='#0d1117', linewidth=1.2)
axes[0].set_title('Rata-rata Rasio Tabungan (%)', fontsize=11, fontweight='bold')
axes[0].set_xlabel('Rasio Tabungan (%)')
axes[0].grid(axis='x')
axes[0].spines['top'].set_visible(False)
axes[0].spines['right'].set_visible(False)
for bar, val in zip(hbars, rata2.values):
    axes[0].text(val + 0.15, bar.get_y() + bar.get_height() / 2,
                 f'{val:.1f}%', va='center', fontsize=9,
                 fontweight='bold', color='#e6edf3')
 
# --- Boxplot horizontal ---
data_groups = [df[df['status_pekerjaan'] == sp]['rasio_tabungan_persen'].dropna()
               for sp in order]
bp2 = axes[1].boxplot(
    data_groups,
    labels=list(order),
    patch_artist=True,
    vert=False,
    medianprops=dict(color='#f78166', linewidth=2),
    whiskerprops=dict(color='#8b949e', linewidth=1.2),
    capprops=dict(color='#8b949e', linewidth=1.2),
    flierprops=dict(marker='o', markerfacecolor='#8b949e', markersize=3, alpha=0.4),
)
for patch, c in zip(bp2['boxes'], colors_p2):
    patch.set_facecolor(c)
    patch.set_alpha(0.7)
axes[1].set_title('Distribusi Rasio Tabungan (%)', fontsize=11, fontweight='bold')
axes[1].set_xlabel('Rasio Tabungan (%)')
axes[1].grid(axis='x')
axes[1].spines['top'].set_visible(False)
axes[1].spines['right'].set_visible(False)
 
plt.tight_layout()
st.pyplot(fig2)
plt.close(fig2)
 
st.markdown(f"""
<div class="insight-box-2">
    📌 <b>Insight Pertanyaan 2:</b><br>
    • <b>{terendah}</b> memiliki rasio tabungan paling rendah ({terendah_val:.1f}%)
      mencerminkan pendapatan yang terbatas atau tidak ada sama sekali.<br>
    • <b>{tertinggi}</b> memiliki rasio tabungan tertinggi ({tertinggi_val:.1f}%),
      mencerminkan stabilitas pendapatan dan kemungkinan adanya tunjangan.<br>
    • <b>Buruh/Pekerja Harian</b> menunjukkan rasio tabungan rendah dengan distribusi sempit
      konsisten dalam ketidakmampuan menabung secara signifikan.<br>
    • <b>Wiraswasta</b> memiliki variasi paling tinggi (boxplot lebar),
      menandakan kondisi keuangan yang sangat beragam tergantung skala usahanya.<br>
    • Insight ini berguna untuk sistem rekomendasi: pengguna dengan rasio tabungan rendah
      perlu mendapat rekomendasi peningkatan tabungan yang lebih agresif.
</div>
""", unsafe_allow_html=True)
 
 
# ═══════════════════════════════════════════════════════════════════════
# KESIMPULAN
# ═══════════════════════════════════════════════════════════════════════
st.markdown("<br>", unsafe_allow_html=True)
st.markdown("""
<div class="kesimpulan-box">
    <b style="font-size:16px;">✅ Kesimpulan Explanatory Analysis</b><br><br>
    <b>Pertanyaan 1</b> Jenis pekerjaan sangat memengaruhi kemampuan menabung.
    PNS/ASN lebih unggul karena memiliki pendapatan tetap yang cenderung lebih besar
    dibandingkan Buruh/Pekerja Harian.<br><br>
    <b>Pertanyaan 2</b> Rasio tabungan bervariasi signifikan antar jenis pekerjaan.
    PNS/ASN berada di posisi tertinggi, sementara kelompok tanpa penghasilan tetap
    berada di posisi terendah. Variasi ini menjadi sinyal penting untuk personalisasi
    rekomendasi budgeting di platform Smart Spend.
</div>
""", unsafe_allow_html=True)
 
st.markdown("""
<div style="text-align:center; color:#8b949e; font-size:12px; padding: 24px 0 8px 0;">
    💰 Smart Spend · Capstone Project Data Science · 2026
</div>
""", unsafe_allow_html=True)