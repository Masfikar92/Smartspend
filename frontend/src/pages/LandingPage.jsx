import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoFull from '../assets/Logo-SmartSpend-Full.svg';
import HeroImage from '../assets/elemen-landing-page.svg';
import LogoHero from '../assets/Logo-di-landing-page.svg';
import { MdMenu, MdClose } from 'react-icons/md';

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#101828' }}>
      <style>{`
        /* ── Navbar ── */
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .nav-hamburger { display: none; background: none; border: none; cursor: pointer; color: #344054; padding: 4px; }
        .mobile-menu { display: none; }

        /* ── Hero ── */
        .hero-inner { display: flex; align-items: center; justify-content: space-between; gap: 40px; }
        .hero-img { flex: 1; display: flex; justify-content: center; }

        /* ── Feature grid ── */
        .feature-grid { display: flex; flex-direction: column; gap: 16px; max-width: 600px; margin: 0 auto; }

        /* ── Section padding ── */
        .section-pad { padding: 80px 60px; }
        .hero-pad { padding: 100px 60px 60px; }
        .contact-pad { padding: 60px; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-actions { display: none; }
          .nav-hamburger { display: block !important; }

          .mobile-menu {
            display: ${menuOpen ? 'flex' : 'none'} !important;
            flex-direction: column;
            position: fixed;
            top: 64px; left: 0; right: 0;
            background: white;
            border-bottom: 1px solid #e4e7ec;
            padding: 16px 24px;
            gap: 12px;
            z-index: 99;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }

          .hero-inner { flex-direction: column; text-align: center; }
          .hero-img { order: -1; }
          .hero-img img { max-width: 260px !important; }

          .section-pad { padding: 48px 20px; }
          .hero-pad { padding: 90px 20px 48px; }
          .contact-pad { padding: 48px 20px; }

          .nav-inner { padding: 0 20px !important; }
          .about-title { font-size: 26px !important; }
          .about-h3 { font-size: 18px !important; }
          .feature-title { font-size: 26px !important; }
          .hero-logo { height: 80px !important; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .section-pad { padding: 60px 40px; }
          .hero-pad { padding: 100px 40px 60px; }
          .contact-pad { padding: 60px 40px; }
          .nav-inner { padding: 0 40px !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'white', borderBottom: '0.5px solid #e4e7ec', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }} className="nav-inner" style2={{ padding: '0 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 60px' }} className="nav-inner-wrap">
          <img src={LogoFull} alt="SmartSpend" style={{ height: '32px' }} />

          {/* Desktop nav links */}
          <div className="nav-links">
            {['hero','about','feature','contact'].map((id, i) => (
              <button key={id} onClick={() => scrollTo(id)} style={navStyle}>
                {['Home','About us','Feature','Contact us'][i]}
              </button>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="nav-actions">
            <button onClick={() => navigate('/login')} style={navStyle}>Login</button>
            <button onClick={() => navigate('/register')} style={{
              padding: '9px 20px', borderRadius: '10px', background: '#3698E3',
              color: 'white', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
            }}>Sign Up</button>
          </div>

          {/* Hamburger */}
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="mobile-menu">
        {['hero','about','feature','contact'].map((id, i) => (
          <button key={id} onClick={() => scrollTo(id)} style={{ ...navStyle, textAlign: 'left', padding: '10px 0', borderBottom: '0.5px solid #f2f4f7', fontSize: '15px' }}>
            {['Home','About us','Feature','Contact us'][i]}
          </button>
        ))}
        <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
          <button onClick={() => navigate('/login')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #d0d5dd', background: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer', color: '#344054' }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#3698E3', color: 'white', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Sign Up</button>
        </div>
      </div>

      {/* HERO */}
      <section id="hero" className="hero-pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-inner" style={{ width: '100%' }}>
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <p style={{ fontSize: '13px', color: '#54B5FF', fontWeight: '500', marginBottom: '12px' }}>
              ✦ AI-Powered Finance Assistant
            </p>
            <img src={LogoHero} alt="SmartSpend" className="hero-logo" style={{ height: '120px', marginBottom: '20px' }} />
            <p style={{ fontSize: '16px', color: '#3d4350', lineHeight: 1.7, marginBottom: '32px' }}>
              SmartSpend adalah platform asisten keuangan pribadi berbasis kecerdasan buatan (AI)
              yang dirancang khusus untuk membantu generasi muda Indonesia dalam mengelola keuangan
              secara lebih cerdas, terstruktur, dan efisien.
            </p>
            <button onClick={() => navigate('/register')} style={{
              padding: '14px 32px', borderRadius: '12px', background: '#3698E3',
              color: 'white', border: 'none', fontWeight: '700', fontSize: '16px',
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(84,181,255,0.35)'
            }}>Get Started</button>
          </div>
          <div className="hero-img">
            <img src={HeroImage} alt="SmartSpend Illustration" style={{ maxWidth: '480px', width: '100%' }} />
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="section-pad" style={{ textAlign: 'center', borderTop: '0.5px solid #e4e7ec' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e4e7ec', maxWidth: '80px' }}></div>
          <h2 className="about-title" style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>About us</h2>
          <div style={{ flex: 1, height: '1px', background: '#e4e7ec', maxWidth: '80px' }}></div>
        </div>
        <h3 className="about-h3" style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#101828' }}>
          Solusi Nyata untuk Keuangan Generasi Muda<br/>yang Lebih Terarah
        </h3>
        <p style={{ fontSize: '16px', color: '#667085', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
          SmartSpend hadir untuk menjawab kebutuhan asisten keuangan pribadi berbasis AI yang
          membantu kamu mencatat, memahami, dan merencanakan keuangan dengan cara yang lebih
          terstruktur. Dibangun oleh tim muda yang terdiri dari AI Engineer, Data Scientist, dan
          Fullstack Developer. SmartSpend dirancang bukan sekadar sebagai aplikasi pencatat
          transaksi, melainkan sebagai teman finansial yang memahami kondisimu dan memberikan
          rekomendasi yang relevan berdasarkan data nyata.
        </p>
      </section>

      {/* FEATURE */}
      <section id="feature" className="section-pad" style={{ textAlign: 'center', background: '#f5f7fa' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: '#d0d5dd', maxWidth: '80px' }}></div>
          <h2 className="feature-title" style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>Feature</h2>
          <div style={{ flex: 1, height: '1px', background: '#d0d5dd', maxWidth: '80px' }}></div>
        </div>
        <p style={{ fontSize: '16px', color: '#667085', marginBottom: '40px' }}>Semua yang Kamu Butuhkan</p>
        <div className="feature-grid">
          {[
            { title: 'Rekomendasi Budgeting', desc: 'Kendalikan keuangan Anda dengan bantuan sistem rekomendasi budgeting. SmartSpend menganalisis pola pengeluaran Anda secara real-time dan memberikan rekomendasi budgeting yang dipersonalisasi sehingga setiap rupiah digunakan secara optimal.' },
            { title: 'Target Tabungan', desc: 'Menabung akan jauh lebih konsisten ketika ada target yang jelas dan terukur. Tetapkan tujuan finansialmu, dan SmartSpend akan membantu menghitung nominal tabungan yang realistis sesuai kondisimu, lengkap dengan pemantauan progres setiap minggunya.' }
          ].map((f, i) => (
            <div key={i} style={{ background: 'linear-gradient(135deg, #54B5FF, #336D99)', borderRadius: '16px', padding: '28px 32px', textAlign: 'center' }}>
              <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-pad" style={{ textAlign: 'center', background: 'linear-gradient(180deg, #54B5FF 0%, #336D99 100%)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>Contact Us</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', marginBottom: '16px', lineHeight: 1.7 }}>
          Punya pertanyaan atau ingin tahu lebih lanjut tentang SmartSpend?<br/>
          Silakan hubungi kami, kami dengan senang hati akan membantu.
        </p>
        <p style={{ color: 'white', fontSize: '15px', fontWeight: '600' }}>
          CC26-PSU146@student.devacademy.id
        </p>
      </section>
    </div>
  );
}

const navStyle = {
  background: 'none', border: 'none',
  fontSize: '16px', color: '#344054',
  fontWeight: '500', cursor: 'pointer',
  padding: '4px 0'
};