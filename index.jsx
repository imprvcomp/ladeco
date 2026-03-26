import { useState, useEffect, useRef } from "react";

const SECTIONS = ["inicio", "nosotros", "servicios", "flota", "cobertura", "testimonios", "contacto"];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Anim({ children, className = "", delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(50px)",
      transition: `opacity 0.9s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.9s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const num = parseInt(target);
    const dur = 2000;
    const step = dur / num;
    const timer = setInterval(() => {
      start++;
      setCount(start);
      if (start >= num) clearInterval(timer);
    }, Math.max(step, 15));
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const testimonials = [
  {
    name: "Carlos Méndez",
    role: "Gerente de Logística — YPF Chubut",
    text: "Hace 8 años que trabajamos con Autocam. Son de esos proveedores que no te fallan ni en el peor temporal patagónico. Siempre puntuales, siempre resolviendo.",
    avatar: "CM",
  },
  {
    name: "Laura Fernández",
    role: "Dueña — Distribuidora del Sur",
    text: "Nuestra mercadería llega siempre en condiciones y a tiempo. El trato humano que tienen marca la diferencia, te atienden como si fueras el único cliente.",
    avatar: "LF",
  },
  {
    name: "Martín Ríos",
    role: "Jefe de Compras — Constructora Patagonia",
    text: "Necesitábamos mover equipos pesados a una obra en Río Gallegos con muy poco tiempo. Autocam organizó todo en 24 horas. Impecables.",
    avatar: "MR",
  },
];

const services = [
  {
    title: "Transporte de Cargas Generales",
    desc: "Mercadería seca, palletizada y consolidada. Llegamos a cada punto de la Patagonia y el país con la responsabilidad que tu carga merece.",
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
  },
  {
    title: "Logística Petrolera",
    desc: "Transporte especializado para oil & gas en el Golfo San Jorge. Equipos, insumos y materiales con protocolos de seguridad certificados.",
    img: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&q=80",
  },
  {
    title: "Cargas Refrigeradas",
    desc: "Cadena de frío ininterrumpida. Unidades con monitoreo satelital y control de temperatura en tiempo real para que tu producto llegue perfecto.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
  },
  {
    title: "Servicio Mecánico Integral",
    desc: "Taller propio con mecánica pesada y liviana. Mantenemos nuestra flota — y la tuya — en condiciones óptimas para no parar nunca.",
    img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80",
  },
];

const routes = [
  { to: "Buenos Aires", km: "1.850" },
  { to: "Neuquén", km: "1.100" },
  { to: "Caleta Olivia", km: "75" },
  { to: "Rawson / Trelew", km: "380" },
  { to: "Río Gallegos", km: "790" },
  { to: "Ushuaia", km: "1.600" },
];

export default function AutocamFull() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("inicio");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s);
        if (el && el.getBoundingClientRect().top < 300) {
          setActiveSection(s);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const navBg = scrollY > 60;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#FAFBFE", color: "#0D1B2A", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }

        :root {
          --b9: #0A1628; --b8: #0D1B2A; --b7: #1B2D45; --b6: #1E3A5F;
          --b5: #1565C0; --b4: #1E88E5; --b3: #42A5F5; --b1: #E3F2FD; --b0: #F0F7FF;
          --w: #FFFFFF; --g1: #F5F7FA; --g2: #E8ECF1; --g4: #94A3B8;
          --g5: #64748B; --g6: #475569; --g8: #1E293B;
        }

        .bebas { font-family: 'Bebas Neue', sans-serif; }

        .nav-link {
          font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.5); text-decoration: none; cursor: pointer;
          background: none; border: none; position: relative; padding: 4px 0;
          transition: color 0.3s;
        }
        .nav-link::after {
          content:''; position:absolute; bottom:-2px; left:0; right:0;
          height:2px; background:var(--b3); transform:scaleX(0); transition:transform 0.3s;
        }
        .nav-link:hover, .nav-link.active { color: #fff; }
        .nav-link.active::after { transform: scaleX(1); }
        .scrolled .nav-link { color: var(--g5); }
        .scrolled .nav-link:hover, .scrolled .nav-link.active { color: var(--b5); }
        .scrolled .nav-link.active::after { background: var(--b5); }

        .cta {
          display:inline-flex; align-items:center; gap:10px;
          padding:16px 36px; font-family:'Bebas Neue',sans-serif;
          font-size:16px; letter-spacing:2.5px; text-transform:uppercase;
          border:none; cursor:pointer; border-radius:8px;
          transition: all 0.4s cubic-bezier(.22,1,.36,1); text-decoration:none;
        }
        .cta-p { background:var(--b5); color:#fff; box-shadow:0 4px 20px rgba(21,101,192,0.3); }
        .cta-p:hover { background:var(--b4); transform:translateY(-2px); box-shadow:0 8px 32px rgba(21,101,192,0.4); }
        .cta-o { background:transparent; color:#fff; border:1.5px solid rgba(255,255,255,0.25); }
        .cta-o:hover { border-color:var(--b3); color:var(--b3); }
        .cta-w { background:#fff; color:var(--b5); box-shadow:0 4px 20px rgba(0,0,0,0.08); }
        .cta-w:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.12); }

        .tag {
          font-family:'Bebas Neue',sans-serif; font-size:14px;
          letter-spacing:5px; text-transform:uppercase; color:var(--b5);
          display:flex; align-items:center; gap:14px; margin-bottom:14px;
        }
        .tag::before { content:''; width:36px; height:2px; background:linear-gradient(90deg,var(--b5),var(--b3)); }
        .tag-light { color: var(--b3); }
        .tag-light::before { background: linear-gradient(90deg,var(--b3),rgba(66,165,245,0.3)); }

        .img-cover {
          width:100%; height:100%; object-fit:cover;
          transition: transform 0.8s cubic-bezier(.22,1,.36,1);
        }

        .input {
          width:100%; padding:16px 20px; background:var(--g1);
          border:2px solid transparent; color:var(--b8);
          font-family:'Plus Jakarta Sans',sans-serif; font-size:15px;
          border-radius:10px; transition:all 0.3s; outline:none;
        }
        .input:focus { border-color:var(--b4); background:#fff; box-shadow:0 0 0 4px rgba(30,136,229,0.08); }
        .input::placeholder { color:var(--g4); }

        .whatsapp-btn {
          position:fixed; bottom:28px; right:28px; z-index:999;
          width:60px; height:60px; border-radius:50%;
          background:#25D366; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 4px 20px rgba(37,211,102,0.4);
          transition: all 0.3s ease;
          animation: whatsapp-pulse 2s infinite;
        }
        .whatsapp-btn:hover { transform:scale(1.1); box-shadow:0 6px 28px rgba(37,211,102,0.5); }

        @keyframes whatsapp-pulse {
          0%,100% { box-shadow:0 4px 20px rgba(37,211,102,0.4); }
          50% { box-shadow:0 4px 20px rgba(37,211,102,0.4), 0 0 0 12px rgba(37,211,102,0.1); }
        }

        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }

        .parallax-img { transition: transform 0.1s linear; }

        .hamburger { display:none; background:none; border:none; cursor:pointer; padding:8px; }
        .hamburger span { display:block; width:22px; height:2px; background:#fff; margin:5px 0; border-radius:1px; transition:0.3s; }
        .scrolled .hamburger span { background:var(--b8); }

        @media (max-width:900px) {
          .hamburger { display:block; }
          .dnav { display:none !important; }
          .dnav.open {
            display:flex !important; flex-direction:column;
            position:absolute; top:100%; left:0; right:0;
            background:var(--b9); padding:24px 32px; gap:18px !important;
            border-bottom:2px solid rgba(66,165,245,0.15);
          }
          .dnav.open .nav-link { color:rgba(255,255,255,0.7) !important; }
          .split-grid { grid-template-columns:1fr !important; }
          .hero-h1 { font-size:60px !important; }
        }
      `}</style>

      {/* WhatsApp floating */}
      <a href="https://wa.me/5492974XXXXX?text=Hola%20Autocam!%20Necesito%20cotizar%20un%20transporte" target="_blank" rel="noopener noreferrer" className="whatsapp-btn" title="Chateá por WhatsApp">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ====== NAV ====== */}
      <nav className={navBg ? "scrolled" : ""} style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        padding:"0 clamp(20px,4vw,48px)", height:72,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: navBg ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: navBg ? "blur(20px)" : "none",
        borderBottom: navBg ? "1px solid rgba(0,0,0,0.05)" : "none",
        transition:"all 0.4s",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:42, height:42,
            background:"linear-gradient(135deg,var(--b5),var(--b3))",
            borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:"#fff",
            boxShadow:"0 4px 12px rgba(21,101,192,0.25)",
          }}>AC</div>
          <div>
            <div className="bebas" style={{ fontSize:20, letterSpacing:3, lineHeight:1, color: navBg?"var(--b8)":"#fff" }}>AUTOCAM</div>
            <div style={{ fontSize:8.5, letterSpacing:2, color: navBg?"var(--g4)":"rgba(255,255,255,0.45)", textTransform:"uppercase", fontWeight:700 }}>Transportes & Servicios SRL</div>
          </div>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}><span/><span/><span/></button>
        <div className={`dnav ${menuOpen?"open":""}`} style={{ display:"flex", gap:24, alignItems:"center" }}>
          {SECTIONS.map(s => (
            <button key={s} className={`nav-link ${activeSection===s?"active":""}`}
              onClick={() => { document.getElementById(s)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); }}>
              {s}
            </button>
          ))}
          <button className="cta cta-p" style={{ padding:"10px 22px", fontSize:13 }}
            onClick={() => document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})}>
            Cotizar
          </button>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section id="inicio" style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
        {/* BG Image */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&q=85)",
          backgroundSize:"cover", backgroundPosition:"center 40%",
          filter:"brightness(0.25)",
        }}/>
        {/* Overlay gradient */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(170deg, rgba(10,22,40,0.92) 0%, rgba(27,45,69,0.85) 50%, rgba(21,101,192,0.35) 100%)",
        }}/>
        {/* Grid lines */}
        <div style={{
          position:"absolute", inset:0, opacity:0.03,
          backgroundImage:"repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 120px), repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 120px)",
        }}/>
        {/* Bottom accent */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:4, background:"linear-gradient(90deg,transparent,var(--b3),var(--b4),var(--b3),transparent)" }}/>

        <div style={{ position:"relative", zIndex:2, padding:"160px clamp(24px,5vw,48px) 80px", maxWidth:1200, width:"100%", margin:"0 auto" }}>
          <div style={{ animation:"fadeUp 1s ease forwards" }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:10,
              background:"rgba(66,165,245,0.1)", border:"1px solid rgba(66,165,245,0.2)",
              borderRadius:60, padding:"10px 22px", marginBottom:32,
            }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#4FC3F7", boxShadow:"0 0 10px rgba(79,195,247,0.6)" }}/>
              <span style={{ fontSize:12, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", color:"var(--b3)" }}>
                Hugo Manson 203 — Zona Industrial, Comodoro Rivadavia
              </span>
            </div>

            <h1 className="bebas hero-h1" style={{ fontSize:"clamp(56px,10vw,120px)", lineHeight:0.9, letterSpacing:3, maxWidth:900, color:"#fff" }}>
              TU CARGA,
              <br/>
              <span style={{ color:"var(--b3)" }}>NUESTRO</span>
              <br/>
              COMPROMISO
            </h1>

            <p style={{ maxWidth:520, fontSize:18, lineHeight:1.85, color:"rgba(255,255,255,0.6)", marginTop:32, fontWeight:400 }}>
              Más de 15 años moviendo la Patagonia. Transporte de cargas, logística petrolera 
              y servicio mecánico con la seriedad que tu negocio necesita.
            </p>

            <div style={{ display:"flex", gap:14, marginTop:44, flexWrap:"wrap" }}>
              <button className="cta cta-p" onClick={() => document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})}>
                Pedir Cotización <span style={{fontSize:18}}>→</span>
              </button>
              <a href="https://wa.me/5492974XXXXX?text=Hola%20Autocam!" target="_blank" rel="noopener noreferrer" className="cta cta-o" style={{ gap:10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Escribinos al WhatsApp
              </a>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",
            gap:1, marginTop:80, background:"rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden",
            animation:"fadeUp 1s ease 0.4s forwards", opacity:0,
          }}>
            {[
              { val:"15", suf:"+", label:"Años en la ruta" },
              { val:"200", suf:"K", label:"Km recorridos/mes" },
              { val:"48", suf:"", label:"Unidades operativas" },
              { val:"99", suf:"%", label:"Entregas a tiempo" },
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(10,22,40,0.5)", backdropFilter:"blur(12px)", padding:"32px 20px", textAlign:"center" }}>
                <div className="bebas" style={{ fontSize:48, color:"var(--b3)", lineHeight:1 }}>
                  <Counter target={s.val} suffix={s.suf} />
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:8, fontWeight:600, letterSpacing:0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== ABOUT / NOSOTROS ====== */}
      <section id="nosotros" style={{ padding:"120px clamp(24px,4vw,48px)", maxWidth:1200, margin:"0 auto" }}>
        <div className="split-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          <Anim>
            <div style={{ position:"relative" }}>
              <div style={{
                borderRadius:20, overflow:"hidden", position:"relative",
                boxShadow:"0 20px 60px rgba(0,0,0,0.1)",
              }}>
                <img src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=700&q=80"
                  alt="Equipo Autocam" style={{ width:"100%", height:420, objectFit:"cover" }}/>
              </div>
              {/* Floating card */}
              <div style={{
                position:"absolute", bottom:-28, right:-20,
                background:"var(--b5)", color:"#fff", borderRadius:14,
                padding:"20px 28px", boxShadow:"0 12px 40px rgba(21,101,192,0.3)",
                animation:"scaleIn 0.6s ease 0.5s forwards", opacity:0, transformOrigin:"bottom right",
              }}>
                <div className="bebas" style={{ fontSize:36, lineHeight:1 }}>2009</div>
                <div style={{ fontSize:12, opacity:0.75, fontWeight:600, letterSpacing:1 }}>AÑO DE FUNDACIÓN</div>
              </div>
            </div>
          </Anim>

          <Anim delay={0.15}>
            <div className="tag">Quiénes Somos</div>
            <h2 className="bebas" style={{ fontSize:"clamp(36px,4.5vw,56px)", lineHeight:0.95, letterSpacing:2 }}>
              NACIMOS EN LA <span style={{color:"var(--b5)"}}>RUTA</span>,
              <br/>CRECIMOS CON <span style={{color:"var(--b5)"}}>VOS</span>
            </h2>
            <p style={{ color:"var(--g5)", marginTop:20, lineHeight:1.85, fontSize:16 }}>
              Autocam nació en Comodoro Rivadavia con un solo camión y la convicción de que un servicio 
              serio marca la diferencia. Hoy somos una empresa consolidada que mueve cargas por toda la Patagonia 
              y el país, sin perder lo que nos trajo hasta acá: <strong>el compromiso con cada cliente.</strong>
            </p>
            <p style={{ color:"var(--g5)", marginTop:16, lineHeight:1.85, fontSize:16 }}>
              Conocemos cada kilómetro de la Ruta 3, cada desafío del clima patagónico, y cada necesidad 
              de la industria local. No somos una empresa más de transporte — somos tu socio en la ruta.
            </p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:36 }}>
              {[
                { icon:"🛡️", text:"Seguros de carga total" },
                { icon:"📡", text:"GPS satelital 24/7" },
                { icon:"🔧", text:"Taller mecánico propio" },
                { icon:"📋", text:"Habilitación CNRT" },
              ].map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:"var(--b0)", borderRadius:10 }}>
                  <span style={{ fontSize:22 }}>{f.icon}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:"var(--b8)" }}>{f.text}</span>
                </div>
              ))}
            </div>
          </Anim>
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section id="servicios" style={{ background:"var(--g1)", padding:"120px 0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 clamp(24px,4vw,48px)" }}>
          <Anim>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <div className="tag" style={{ justifyContent:"center" }}>Servicios</div>
              <h2 className="bebas" style={{ fontSize:"clamp(40px,5vw,64px)", lineHeight:0.95, letterSpacing:2 }}>
                LO QUE <span style={{color:"var(--b5)"}}>HACEMOS</span> POR VOS
              </h2>
              <p style={{ color:"var(--g5)", maxWidth:500, margin:"16px auto 0", lineHeight:1.75 }}>
                Cada servicio pensado para resolver necesidades reales de la industria patagónica.
              </p>
            </div>
          </Anim>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {services.map((s,i) => (
              <Anim key={i} delay={i * 0.1}>
                <div style={{
                  background:"#fff", borderRadius:16, overflow:"hidden",
                  border:"1px solid var(--g2)",
                  transition:"all 0.5s cubic-bezier(.22,1,.36,1)",
                  cursor:"default",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-8px)"; e.currentTarget.style.boxShadow="0 20px 60px rgba(21,101,192,0.1)"; e.currentTarget.style.borderColor="var(--b3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor="var(--g2)"; }}
                >
                  <div style={{ height:200, overflow:"hidden", position:"relative" }}>
                    <img src={s.img} alt={s.title} className="img-cover"
                      onMouseEnter={e => e.currentTarget.style.transform="scale(1.08)"}
                      onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                    />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,22,40,0.5) 0%, transparent 50%)" }}/>
                  </div>
                  <div style={{ padding:"28px 24px" }}>
                    <h3 style={{ fontSize:18, fontWeight:700, color:"var(--b8)", marginBottom:10 }}>{s.title}</h3>
                    <p style={{ fontSize:14, color:"var(--g5)", lineHeight:1.7 }}>{s.desc}</p>
                  </div>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FLEET IMAGE BAND ====== */}
      <section id="flota" style={{ position:"relative", overflow:"hidden" }}>
        <div style={{
          height:500, position:"relative",
          backgroundImage:"url(https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1600&q=85)",
          backgroundSize:"cover", backgroundPosition:"center",
          backgroundAttachment:"fixed",
        }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(170deg,rgba(10,22,40,0.9) 0%,rgba(21,101,192,0.6) 100%)" }}/>
          <div style={{ position:"relative", zIndex:2, height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Anim>
              <div style={{ textAlign:"center", padding:"0 24px" }}>
                <div className="tag tag-light" style={{ justifyContent:"center", color:"var(--b3)" }}>
                  <span style={{display:"flex",alignItems:"center",gap:14}}>
                    <span style={{width:36,height:2,background:"var(--b3)",display:"block"}}/>Nuestra Flota
                  </span>
                </div>
                <h2 className="bebas" style={{ fontSize:"clamp(44px,6vw,80px)", lineHeight:0.9, letterSpacing:3, color:"#fff" }}>
                  <span style={{color:"var(--b3)"}}>48</span> UNIDADES EN RUTA
                </h2>
                <p style={{ color:"rgba(255,255,255,0.6)", maxWidth:550, margin:"20px auto 0", fontSize:17, lineHeight:1.75 }}>
                  Flota propia con mantenimiento preventivo, GPS satelital y monitoreo las 24 horas. 
                  Cada camión es un compromiso sobre ruedas.
                </p>

                <div style={{
                  display:"flex", gap:1, justifyContent:"center", marginTop:48,
                  background:"rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden",
                  maxWidth:700, margin:"48px auto 0",
                }}>
                  {[
                    { n:"22", l:"Semi-remolques" },
                    { n:"8", l:"Portacontenedor" },
                    { n:"10", l:"Refrigerados" },
                    { n:"8", l:"Rígidos" },
                  ].map((f,i) => (
                    <div key={i} style={{ flex:1, padding:"28px 16px", textAlign:"center", background:"rgba(10,22,40,0.4)", backdropFilter:"blur(8px)" }}>
                      <div className="bebas" style={{ fontSize:36, color:"var(--b3)" }}>{f.n}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", fontWeight:600, letterSpacing:0.5, marginTop:4 }}>{f.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Anim>
          </div>
        </div>
      </section>

      {/* ====== COVERAGE ====== */}
      <section id="cobertura" style={{ padding:"120px clamp(24px,4vw,48px)", maxWidth:1200, margin:"0 auto" }}>
        <div className="split-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          <Anim>
            <div className="tag">Cobertura</div>
            <h2 className="bebas" style={{ fontSize:"clamp(38px,5vw,60px)", lineHeight:0.95, letterSpacing:2 }}>
              DESDE COMODORO <span style={{color:"var(--b5)"}}>AL PAÍS</span>
            </h2>
            <p style={{ color:"var(--g5)", marginTop:16, lineHeight:1.8, fontSize:16, maxWidth:440 }}>
              Conectamos la Patagonia con los principales centros logísticos. Cada ruta, cada kilómetro, 
              con la responsabilidad de siempre.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:36 }}>
              {routes.map((r,i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:14,
                  padding:"14px 20px", borderRadius:12,
                  background: i%2===0 ? "var(--b0)" : "#fff",
                  border:"1px solid var(--g2)",
                  transition:"all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="var(--b4)"; e.currentTarget.style.paddingLeft="28px"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--g2)"; e.currentTarget.style.paddingLeft="20px"; }}
                >
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--b5)", flexShrink:0 }}/>
                  <span style={{ flex:1, fontSize:15, fontWeight:600, color:"var(--b8)" }}>{r.to}</span>
                  <span className="bebas" style={{ fontSize:18, color:"var(--b5)", letterSpacing:1 }}>{r.km} KM</span>
                </div>
              ))}
            </div>
          </Anim>

          <Anim delay={0.15}>
            <div style={{ borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.1)", position:"relative" }}>
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80"
                alt="Ruta Patagónica" style={{ width:"100%", height:520, objectFit:"cover" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,22,40,0.6) 0%, transparent 40%)" }}/>
              <div style={{ position:"absolute", bottom:32, left:32, right:32 }}>
                <div className="bebas" style={{ fontSize:28, color:"#fff", letterSpacing:2 }}>RUTA NACIONAL 3</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)", marginTop:4 }}>La columna vertebral de nuestras operaciones</div>
              </div>
            </div>
          </Anim>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section id="testimonios" style={{
        background:"linear-gradient(170deg,var(--b9) 0%,var(--b7) 100%)",
        padding:"120px clamp(24px,4vw,48px)", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.03,
          backgroundImage:"repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 100px),repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 100px)",
        }}/>

        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>
          <Anim>
            <div className="tag tag-light" style={{ justifyContent:"center", color:"var(--b3)" }}>
              <span style={{display:"flex",alignItems:"center",gap:14}}>
                <span style={{width:36,height:2,background:"var(--b3)",display:"block"}}/>Testimonios
              </span>
            </div>
            <h2 className="bebas" style={{ fontSize:"clamp(36px,5vw,56px)", lineHeight:0.95, letterSpacing:2, color:"#fff" }}>
              LO QUE DICEN <span style={{color:"var(--b3)"}}>NUESTROS CLIENTES</span>
            </h2>
          </Anim>

          <Anim delay={0.15}>
            <div style={{ marginTop:56, position:"relative", minHeight:240 }}>
              {testimonials.map((t,i) => (
                <div key={i} style={{
                  position: i===activeTestimonial ? "relative" : "absolute",
                  top:0, left:0, right:0,
                  opacity: i===activeTestimonial ? 1 : 0,
                  transform: i===activeTestimonial ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
                  transition:"all 0.7s cubic-bezier(.22,1,.36,1)",
                  pointerEvents: i===activeTestimonial ? "auto" : "none",
                }}>
                  <div style={{ fontSize:48, color:"var(--b3)", opacity:0.3, marginBottom:8, lineHeight:1 }}>"</div>
                  <p style={{ fontSize:20, lineHeight:1.8, color:"rgba(255,255,255,0.8)", maxWidth:650, margin:"0 auto", fontWeight:300, fontStyle:"italic" }}>
                    {t.text}
                  </p>
                  <div style={{ marginTop:32, display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
                    <div style={{
                      width:52, height:52, borderRadius:"50%",
                      background:"linear-gradient(135deg,var(--b5),var(--b3))",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:"#fff",
                    }}>{t.avatar}</div>
                    <div style={{ textAlign:"left" }}>
                      <div style={{ fontWeight:700, color:"#fff", fontSize:16 }}>{t.name}</div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:40 }}>
                {testimonials.map((_,i) => (
                  <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                    width: i===activeTestimonial ? 32 : 10, height:10, borderRadius:5,
                    background: i===activeTestimonial ? "var(--b3)" : "rgba(255,255,255,0.15)",
                    border:"none", cursor:"pointer", transition:"all 0.4s",
                  }}/>
                ))}
              </div>
            </div>
          </Anim>
        </div>
      </section>

      {/* ====== CONTACT ====== */}
      <section id="contacto" style={{ padding:"120px clamp(24px,4vw,48px)", maxWidth:1200, margin:"0 auto" }}>
        <div className="split-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:64, alignItems:"start" }}>
          <Anim>
            <div className="tag">Contacto</div>
            <h2 className="bebas" style={{ fontSize:"clamp(36px,5vw,56px)", lineHeight:0.95, letterSpacing:2 }}>
              HABLEMOS DE TU <span style={{color:"var(--b5)"}}>PRÓXIMA CARGA</span>
            </h2>
            <p style={{ color:"var(--g5)", marginTop:20, lineHeight:1.8, fontSize:16, maxWidth:400 }}>
              Respondemos en menos de 2 horas. Escribinos por acá, por WhatsApp, o acercate a nuestras oficinas.
            </p>

            <div style={{ marginTop:36, display:"flex", flexDirection:"column", gap:24 }}>
              {[
                { icon:"📍", label:"Dirección", value:"Hugo Manson 203, Zona Industrial\nComodoro Rivadavia, Chubut" },
                { icon:"📞", label:"Teléfono", value:"+54 297 4XX-XXXX" },
                { icon:"✉️", label:"Email", value:"info@autocamsrl.com.ar" },
                { icon:"🕐", label:"Horario", value:"Lunes a Viernes 7:00 – 19:00" },
              ].map((c,i) => (
                <div key={i} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"var(--b0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"var(--g4)", fontWeight:700, marginBottom:4 }}>{c.label}</div>
                    <div style={{ fontSize:15, fontWeight:600, color:"var(--b8)", whiteSpace:"pre-line" }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:12, marginTop:32 }}>
              <a href="https://www.instagram.com/autocam_srl/" target="_blank" rel="noopener noreferrer"
                style={{
                  width:48, height:48, borderRadius:12,
                  background:"linear-gradient(135deg,#833AB4,#E1306C,#F77737)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 4px 12px rgba(225,48,108,0.25)", transition:"transform 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://wa.me/5492974XXXXX" target="_blank" rel="noopener noreferrer"
                style={{
                  width:48, height:48, borderRadius:12,
                  background:"#25D366",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 4px 12px rgba(37,211,102,0.25)", transition:"transform 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </Anim>

          <Anim delay={0.12}>
            <div style={{
              background:"#fff", border:"1px solid var(--g2)",
              padding:44, borderRadius:24,
              boxShadow:"0 12px 48px rgba(0,0,0,0.06)",
            }}>
              <h3 className="bebas" style={{ fontSize:28, letterSpacing:2, marginBottom:28, color:"var(--b8)" }}>Solicitar Cotización</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <input className="input" placeholder="Nombre completo"/>
                  <input className="input" placeholder="Empresa"/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <input className="input" placeholder="Email"/>
                  <input className="input" placeholder="Teléfono / WhatsApp"/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <input className="input" placeholder="Origen"/>
                  <input className="input" placeholder="Destino"/>
                </div>
                <select className="input" style={{ appearance:"none" }} defaultValue="">
                  <option value="" disabled>Tipo de carga</option>
                  <option>Carga general</option>
                  <option>Petrolera / Oil & Gas</option>
                  <option>Refrigerada</option>
                  <option>Contenedor</option>
                  <option>Mecánica / Repuestos</option>
                  <option>Otro</option>
                </select>
                <textarea className="input" rows={4} placeholder="Contanos qué necesitás mover, cuándo y cualquier detalle que nos ayude a cotizar mejor." style={{ resize:"vertical" }}/>
                <button className="cta cta-p" style={{ width:"100%", justifyContent:"center", borderRadius:12, padding:"18px 36px", marginTop:4 }}>
                  Enviar Solicitud →
                </button>
                <p style={{ fontSize:12, color:"var(--g4)", textAlign:"center", marginTop:4 }}>
                  También podés escribirnos directo al{" "}
                  <a href="https://wa.me/5492974XXXXX" target="_blank" rel="noopener noreferrer" style={{ color:"#25D366", fontWeight:700, textDecoration:"none" }}>
                    WhatsApp
                  </a>
                </p>
              </div>
            </div>
          </Anim>
        </div>
      </section>

      {/* ====== CTA BAND ====== */}
      <section style={{
        position:"relative", overflow:"hidden",
        backgroundImage:"url(https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1600&q=80)",
        backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed",
      }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(10,22,40,0.92),rgba(21,101,192,0.8))" }}/>
        <Anim>
          <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"80px 24px" }}>
            <h2 className="bebas" style={{ fontSize:"clamp(32px,4.5vw,52px)", color:"#fff", letterSpacing:3 }}>
              ¿LISTO PARA MOVER TU CARGA?
            </h2>
            <p style={{ color:"rgba(255,255,255,0.65)", fontSize:17, marginTop:12 }}>Contactanos hoy y recibí tu cotización sin compromiso.</p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:32, flexWrap:"wrap" }}>
              <button className="cta cta-w" onClick={() => document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})}>
                Pedir Cotización
              </button>
              <a href="https://wa.me/5492974XXXXX" target="_blank" rel="noopener noreferrer" className="cta cta-o" style={{gap:10}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Directo
              </a>
            </div>
          </div>
        </Anim>
      </section>

      {/* ====== FOOTER ====== */}
      <footer style={{ background:"var(--b9)", padding:"48px clamp(24px,4vw,48px) 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24, paddingBottom:28, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{
                width:38, height:38, background:"linear-gradient(135deg,var(--b5),var(--b3))",
                borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Bebas Neue',sans-serif", fontSize:17, color:"#fff",
              }}>AC</div>
              <div>
                <span className="bebas" style={{ fontSize:18, letterSpacing:3, color:"#fff" }}>AUTOCAM SRL</span>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:1 }}>Transportes & Servicios</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:20 }}>
              {SECTIONS.map(s => (
                <button key={s} onClick={() => document.getElementById(s)?.scrollIntoView({behavior:"smooth"})}
                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:1, fontWeight:600, transition:"color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.7)"}
                  onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.35)"}
                >{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, paddingTop:20 }}>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.25)" }}>© 2026 Transportes y Servicios Autocam S.R.L. — Comodoro Rivadavia, Chubut, Argentina</span>
            <a href="https://www.instagram.com/autocam_srl/" target="_blank" rel="noopener noreferrer"
              style={{ fontSize:13, color:"rgba(255,255,255,0.35)", textDecoration:"none", fontWeight:600, transition:"color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.color="var(--b3)"}
              onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.35)"}
            >@autocam_srl</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
