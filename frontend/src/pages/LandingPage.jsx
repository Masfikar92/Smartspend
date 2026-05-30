import { useNavigate } from 'react-router-dom';
import LogoFull from '../assets/Logo-SmartSpend-Full.svg';
import HeroImage from '../assets/elemen-landing-page.svg';
import LogoHero from '../assets/Logo-di-landing-page.svg';

export default function LandingPage() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#101828' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'white', borderBottom: '0.5px solid #e4e7ec',
        padding: '0 60px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <img src={LogoFull} alt="SmartSpend" style={{ height: '32px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button onClick={() => scrollTo('hero')} style={navStyle}>Home</button>
          <button onClick={() => scrollTo('about')} style={navStyle}>About us</button>
          <button onClick={() => scrollTo('feature')} style={navStyle}>Feature</button>
          <button onClick={() => scrollTo('contact')} style={navStyle}>Contact us</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/login')} style={navStyle}>Login</button>
          <button onClick={() => navigate('/register')} style={{
            padding: '9px 20px', borderRadius: '10px',
            background: '#3698E3',
            color: 'white', border: 'none', fontWeight: '600',
            fontSize: '14px', cursor: 'pointer'
          }}>Sign Up</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{
        minHeight: '100vh', padding: '100px 60px 60px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '40px'
      }}>
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <p style={{ fontSize: '13px', color: '#54B5FF', fontWeight: '500', marginBottom: '12px' }}>
            ✦ AI-Powered Finance Assistant
          </p>
          <img src={LogoHero} alt="SmartSpend" style={{ height: '120px', marginBottom: '20px' }} />
          <p style={{ fontSize: '16px', color: '#3d4350', lineHeight: 1.7, marginBottom: '32px' }}>
            SmartSpend adalah platform asisten keuangan pribadi berbasis kecerdasan buatan (AI)
            yang dirancang khusus untuk membantu generasi muda Indonesia dalam mengelola keuangan
            secara lebih cerdas, terstruktur, dan efisien.
          </p>
          <button onClick={() => navigate('/register')} style={{
            padding: '14px 32px', borderRadius: '12px',
            background: '#3698E3',
            color: 'white', border: 'none', fontWeight: '700',
            fontSize: '16px', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(84,181,255,0.35)'
          }}>Get Started</button>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img src={HeroImage} alt="SmartSpend Illustration" style={{ maxWidth: '480px', width: '100%' }} />
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" style={{
        padding: '80px 60px', textAlign: 'center',
        borderTop: '0.5px solid #e4e7ec'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e4e7ec', maxWidth: '80px' }}></div>
          <h2 style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>About us</h2>
          <div style={{ flex: 1, height: '1px', background: '#e4e7ec', maxWidth: '80px' }}></div>
        </div>

        <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#101828' }}>
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
      <section id="feature" style={{
        padding: '80px 60px', textAlign: 'center',
        background: '#f5f7fa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: '#d0d5dd', maxWidth: '80px' }}></div>
          <h2 style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>Feature</h2>
          <div style={{ flex: 1, height: '1px', background: '#d0d5dd', maxWidth: '80px' }}></div>
        </div>
        <p style={{ fontSize: '16px', color: '#667085', marginBottom: '40px' }}>Semua yang Kamu Butuhkan</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
          {[
            {
              title: 'Rekomendasi Budgeting',
              desc: 'Kendalikan keuangan Anda dengan bantuan sistem rekomendasi budgeting. SmartSpend menganalisis pola pengeluaran Anda secara real-time dan memberikan rekomendasi budgeting yang dipersonalisasi sehingga setiap rupiah digunakan secara optimal.'
            },
            {
              title: 'Target Tabungan',
              desc: 'Menabung akan jauh lebih konsisten ketika ada target yang jelas dan terukur. Tetapkan tujuan finansialmu, dan SmartSpend akan membantu menghitung nominal tabungan yang realistis sesuai kondisimu, lengkap dengan pemantauan progres setiap minggunya.'
            }
          ].map((f, i) => (
            <div key={i} style={{
              background: 'linear-gradient(135deg, #54B5FF, #336D99)',
              borderRadius: '16px', padding: '28px 32px', textAlign: 'center'
            }}>
              <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{
        padding: '60px', textAlign: 'center',
        background: 'linear-gradient(180deg, #54B5FF 0%, #336D99 100%)'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>Contact Us</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', marginBottom: '16px', lineHeight: 1.7 }}>
          Punya pertanyaan atau ingin tahu lebih lanjut tentang SmartSpend?<br/>
          Silakan hubungi kami, kami dengan senang hati akan membantu.
        </p>
        <p style={{
          color: 'white', fontSize: '15px', fontWeight: '600'
        }}>
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