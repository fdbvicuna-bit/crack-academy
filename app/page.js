'use client'
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://emouhqttufruchsjsfot.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb3VocXR0dWZydWNoc2pzZm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDMyNTMsImV4cCI6MjA5MTYxOTI1M30.JdqrcWKZzsATUv7jfb7Q6m-HorZb5evMZGWGDICj9wo'
)

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  green: "#00C49A", blue: "#4D8EFF", orange: "#FF7043",
  yellow: "#FFB300", text: "#1C2340", sub: "#8892A4",
  bg: "#F2F5FA", card: "#FFFFFF",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatPesos(n) { return `$${Number(n).toLocaleString("es-CL")}`; }
const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const MAMA_WHATSAPP = "56912345678";

const CHALLENGES_EDAD = {
  pequeno: {
    label: "5-8 años",
    Lunes:    [{ id:1,  emoji:"⚽", title:"Toque de balón",    desc:"50 toques sin que caiga",              puntos:300 },
               { id:2,  emoji:"🏃", title:"Carrera con balón", desc:"Corre de un extremo al otro 3 veces",  puntos:250 }],
    Martes:   [{ id:3,  emoji:"🎯", title:"Tiro al arco",      desc:"Mete 5 de 8 tiros al arco",            puntos:350 },
               { id:4,  emoji:"🦵", title:"Pase con papá/mamá",desc:"Haz 20 pases seguidos sin perderla",   puntos:300 }],
    Miércoles:[{ id:5,  emoji:"⚡", title:"Velocidad",          desc:"Sprint de 10m con balón x3",           puntos:300 },
               { id:6,  emoji:"🌀", title:"Dribbling básico",   desc:"Driblea alrededor de 3 conos",         puntos:250 }],
    Jueves:   [{ id:7,  emoji:"🎪", title:"Malabarismo",        desc:"Mantén el balón en el aire 10 seg",    puntos:400 },
               { id:8,  emoji:"🤸", title:"Coordinación",       desc:"Salta la cuerda 20 veces seguidas",    puntos:250 }],
    Viernes:  [{ id:9,  emoji:"🏆", title:"Mini circuito",      desc:"Toque + dribbling + disparo x3",       puntos:500 }],
    Sábado:   [{ id:10, emoji:"⭐", title:"Juego libre",        desc:"Juega 30 min con balón y diviértete",  puntos:400 }],
    Domingo:  [{ id:11, emoji:"😴", title:"Descanso activo",    desc:"Estira 10 min con ayuda de un adulto", puntos:150 }],
  },
  mediano: {
    label: "9-11 años",
    Lunes:    [{ id:1,  emoji:"⚽", title:"Toque de balón",     desc:"100 toques sin que caiga",              puntos:500 },
               { id:2,  emoji:"🏃", title:"Carrera con balón",  desc:"Driblea de un extremo al otro 5 veces", puntos:400 }],
    Martes:   [{ id:3,  emoji:"🎯", title:"Tiro al arco",       desc:"Mete 7 de 10 tiros al arco",            puntos:600 },
               { id:4,  emoji:"🦵", title:"Control de pecho",   desc:"Recibe con el pecho 10 veces",          puntos:450 }],
    Miércoles:[{ id:5,  emoji:"🎩", title:"Sombrero",            desc:"Haz el caño a un adulto 3 veces",       puntos:700 },
               { id:6,  emoji:"⚡", title:"Velocidad",           desc:"Sprint 20m con balón en -5 seg",        puntos:600 }],
    Jueves:   [{ id:7,  emoji:"🎪", title:"Malabarismo",         desc:"Mantén el balón en el aire 30 seg",     puntos:800 },
               { id:8,  emoji:"🤸", title:"Agilidad",            desc:"Slalom entre 6 conos sin tirar ninguno",puntos:500 }],
    Viernes:  [{ id:9,  emoji:"🏆", title:"El desafío del crack",desc:"Toque + dribbling + disparo x5",        puntos:900 },
               { id:10, emoji:"🥅", title:"Penales",             desc:"Convierte 4 de 5 penales",              puntos:600 }],
    Sábado:   [{ id:11, emoji:"⭐", title:"Día de partido",      desc:"Juega un partido con todo tu esfuerzo", puntos:1500}],
    Domingo:  [{ id:12, emoji:"📺", title:"Estudio táctico",     desc:"Ve un partido y explica 2 jugadas",     puntos:300 }],
  },
  grande: {
    label: "12+ años",
    Lunes:    [{ id:1,  emoji:"⚽", title:"Toque de balón",     desc:"200 toques sin que caiga",               puntos:700 },
               { id:2,  emoji:"🏃", title:"Circuito físico",    desc:"Dribbling + sprint + vuelta x5",         puntos:600 }],
    Martes:   [{ id:3,  emoji:"🎯", title:"Tiro de larga dist.", desc:"5 goles desde 20 metros",               puntos:800 },
               { id:4,  emoji:"🦵", title:"Control avanzado",   desc:"Control orientado: 15 balones seguidos", puntos:650 }],
    Miércoles:[{ id:5,  emoji:"🧠", title:"Táctica",            desc:"Explica 3 sistemas de juego diferentes", puntos:500 },
               { id:6,  emoji:"⚡", title:"Explosividad",        desc:"4x20m sprint con cambio de ritmo",       puntos:700 }],
    Jueves:   [{ id:7,  emoji:"🎪", title:"Freestyle",          desc:"Encadena 5 trucos distintos",            puntos:1000}],
    Viernes:  [{ id:8,  emoji:"🏆", title:"Partido 1v1",        desc:"Juega 1v1 contra un adulto 10 min",      puntos:1200}],
    Sábado:   [{ id:9,  emoji:"⭐", title:"Partido oficial",    desc:"Partido completo de 90 min",             puntos:2000}],
    Domingo:  [{ id:10, emoji:"💪", title:"Físico + estiramiento",desc:"30 min de rutina física completa",     puntos:500 }],
  },
};

const PREMIOS_DEFAULT = [
  { emoji:"🍕", nombre:"Pizza a elección",           precio:5000,  categoria:"Comida" },
  { emoji:"🍔", nombre:"Hamburguesa + papas",         precio:4500,  categoria:"Comida" },
  { emoji:"🎮", nombre:"1 hora extra de videojuegos", precio:3000,  categoria:"Tiempo libre" },
  { emoji:"🎬", nombre:"Película a elección",         precio:2000,  categoria:"Tiempo libre" },
  { emoji:"🛒", nombre:"Ir al mall",                  precio:2500,  categoria:"Salida" },
  { emoji:"⚽", nombre:"Pelota nueva de fútbol",      precio:15000, categoria:"Fútbol" },
  { emoji:"🧤", nombre:"Guantes de arquero",          precio:12000, categoria:"Fútbol" },
  { emoji:"🏟️", nombre:"Ver partido en estadio",      precio:20000, categoria:"Fútbol" },
  { emoji:"🍦", nombre:"Helado a elección",           precio:1500,  categoria:"Comida" },
  { emoji:"😴", nombre:"No hacer cama un día",        precio:1000,  categoria:"Tiempo libre" },
];

function getGrupoEdad(edad) {
  if (edad <= 8)  return "pequeno";
  if (edad <= 11) return "mediano";
  return "grande";
}

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
function Pill({ children, onClick, color, outline, full, small, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? C.card : color, color: outline ? color : "#fff",
      border: outline ? `1.5px solid ${color}` : "none", borderRadius: 100,
      padding: small ? "8px 18px" : "13px 28px", fontWeight: 800,
      fontSize: small ? 13 : 15, cursor: disabled ? "default" : "pointer",
      fontFamily: "inherit", boxShadow: outline || disabled ? "none" : `0 4px 14px ${color}40`,
      width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.15s",
    }}
      onMouseDown={e => !disabled && (e.currentTarget.style.opacity="0.8")}
      onMouseUp={e => !disabled && (e.currentTarget.style.opacity="1")}
    >{children}</button>
  );
}

function Field({ label, type="text", value, onChange, placeholder, icon }) {
  return (
    <div style={{ marginBottom: 13 }}>
      {label && <p style={{ margin:"0 0 5px 3px", fontSize:11, fontWeight:800, color:C.sub, letterSpacing:0.5 }}>{label}</p>}
      <div style={{ position:"relative" }}>
        {icon && <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:17 }}>{icon}</span>}
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{
          width:"100%", padding: icon ? "12px 14px 12px 40px" : "12px 15px",
          border:"1.5px solid #E8EDF5", borderRadius:13, fontSize:15,
          fontFamily:"inherit", color:C.text, background:C.card,
          outline:"none", boxSizing:"border-box",
        }}
          onFocus={e=>e.target.style.borderColor=C.blue}
          onBlur={e=>e.target.style.borderColor="#E8EDF5"}
        />
      </div>
    </div>
  );
}

function Modal({ children }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(28,35,64,0.45)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.card, borderRadius:28, padding:"34px 26px", textAlign:"center", maxWidth:320, width:"100%", boxShadow:"0 28px 60px rgba(28,35,64,0.18)" }}>
        {children}
      </div>
    </div>
  );
}

function Logo({ size=42, white=false }) {
  const small = size <= 40;
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:2, lineHeight:1 }}>
      <span style={{ fontWeight:900, fontSize: small ? 18 : 26, color: white ? "#fff" : C.blue, letterSpacing:-0.5, fontFamily:"inherit" }}>Crack</span>
      <span style={{ fontWeight:800, fontSize: small ? 18 : 26, color: white ? "rgba(255,255,255,0.75)" : C.orange, letterSpacing:-0.5, fontFamily:"inherit" }}>Academy</span>
    </div>
  );
}

function AvatarNino({ edad, size=48 }) {
  const grupo = getGrupoEdad(edad);
  const colors = { pequeno:["#FFE0B2","#FF7043"], mediano:["#DBEAFE","#4D8EFF"], grande:["#D1FAE5","#00C49A"] };
  const [bg, fg] = colors[grupo];
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.28, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.5, flexShrink:0, border:`2px solid ${fg}33` }}>
      ⚽
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:40 }}>
      <div style={{ width:32, height:32, border:`3px solid ${C.bg}`, borderTop:`3px solid ${C.blue}`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────
function Welcome({ onLogin, onRegister }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28 }}>
      <div style={{ textAlign:"center", maxWidth:340, width:"100%" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><Logo size={76}/></div>
        <p style={{ color:C.sub, fontSize:14, margin:"6px 0 10px" }}>La app de entrenamiento de tu hijo ⚽</p>
        <div style={{ margin:"24px 0 20px", display:"flex", justifyContent:"center" }}>
          <svg width="110" height="100" viewBox="0 0 110 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="38" cy="28" r="18" fill="#DBEAFE"/>
            <circle cx="38" cy="28" r="13" fill="#4D8EFF"/>
            <circle cx="38" cy="22" r="5" fill="#fff" opacity="0.9"/>
            <rect x="18" y="50" width="40" height="34" rx="14" fill="#4D8EFF"/>
            <rect x="22" y="50" width="32" height="20" rx="10" fill="#DBEAFE"/>
            <circle cx="76" cy="36" r="13" fill="#FFE0B2"/>
            <circle cx="76" cy="36" r="9" fill="#FF7043"/>
            <circle cx="76" cy="31" r="3.5" fill="#fff" opacity="0.9"/>
            <rect x="60" y="56" width="30" height="26" rx="12" fill="#FF7043"/>
            <rect x="63" y="56" width="24" height="16" rx="8" fill="#FFE0B2"/>
            <circle cx="55" cy="72" r="8" fill="#FFB300" opacity="0.25"/>
            <circle cx="55" cy="72" r="5" fill="#FFB300" opacity="0.5"/>
            <circle cx="90" cy="30" r="4" fill="#FFD700" opacity="0.7"/>
            <circle cx="18" cy="45" r="3" fill="#4D8EFF" opacity="0.4"/>
            <circle cx="95" cy="55" r="2.5" fill="#FF7043" opacity="0.4"/>
          </svg>
        </div>
        <p style={{ color:C.sub, fontSize:14, margin:"0 0 32px", lineHeight:1.5 }}>Mamá crea los perfiles y gestiona los desafíos. Los niños entrenan y ganan premios.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Pill onClick={onRegister} color={C.blue} full>Registrarme como mamá / papá</Pill>
          <Pill onClick={onLogin} color={C.blue} outline full>Ya tengo cuenta</Pill>
        </div>
      </div>
    </div>
  );
}

function Register({ onBack, onSuccess }) {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim() || !usuario.trim() || !clave.trim()) { setError("Completa todos los campos"); return; }
    if (clave.length < 4) { setError("La clave debe tener al menos 4 caracteres"); return; }
    setLoading(true); setError("");
    try {
      // Check if usuario exists
      const { data: existing } = await supabase.from('cuentas').select('id').eq('usuario', usuario.trim().toLowerCase()).single();
      if (existing) { setError("Ese usuario ya existe"); setLoading(false); return; }

      const { data, error: err } = await supabase.from('cuentas')
        .insert([{ nombre: nombre.trim(), usuario: usuario.trim().toLowerCase(), clave }])
        .select().single();
      if (err) throw err;

      // Insert default premios
      const premiosConCuenta = PREMIOS_DEFAULT.map(p => ({ ...p, cuenta_id: data.id }));
      await supabase.from('premios').insert(premiosConCuenta);

      const premios = PREMIOS_DEFAULT.map((p,i) => ({ ...p, id: i+1 }));
      onSuccess({ ...data, ninos: [], premios });
    } catch(e) {
      setError("Error al crear cuenta. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <div style={{ background:C.card, padding:"20px 18px 16px", boxShadow:"0 1px 10px rgba(0,0,0,0.07)", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:C.bg, border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:18 }}>←</button>
        <h2 style={{ margin:0, fontSize:18, fontWeight:900 }}>Crear cuenta</h2>
      </div>
      <div style={{ padding:"32px 20px", maxWidth:430, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:52, marginBottom:8 }}>👩</div>
          <p style={{ color:C.sub, fontSize:14, margin:0 }}>Crea tu cuenta para gestionar los perfiles de tus hijos</p>
        </div>
        <Field label="TU NOMBRE" value={nombre} onChange={setNombre} placeholder="ej: María" icon="👩"/>
        <Field label="USUARIO" value={usuario} onChange={setUsuario} placeholder="ej: mama123" icon="👤"/>
        <Field label="CONTRASEÑA" type="password" value={clave} onChange={setClave} placeholder="Mínimo 4 caracteres" icon="🔒"/>
        {error && <div style={{ background:"#FFF0F0", border:"1.5px solid #FFCCCC", borderRadius:12, padding:"10px 14px", marginBottom:14 }}><p style={{ margin:0, color:"#D32F2F", fontSize:13, fontWeight:700 }}>⚠️ {error}</p></div>}
        <div style={{ marginTop:8 }}><Pill onClick={handleRegister} color={C.blue} full disabled={loading}>{loading ? "Creando..." : "Crear cuenta ✓"}</Pill></div>
      </div>
    </div>
  );
}

function Login({ onBack, onSuccess }) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !clave.trim()) { setError("Completa todos los campos"); return; }
    setLoading(true); setError("");
    try {
      const { data: cuenta, error: err } = await supabase.from('cuentas')
        .select('*').eq('usuario', usuario.trim().toLowerCase()).eq('clave', clave).single();
      if (err || !cuenta) { setError("Usuario o contraseña incorrectos"); setLoading(false); return; }

      // Load ninos and premios
      const { data: ninos } = await supabase.from('ninos').select('*').eq('cuenta_id', cuenta.id);
      const { data: premios } = await supabase.from('premios').select('*').eq('cuenta_id', cuenta.id);
      onSuccess({ ...cuenta, ninos: ninos || [], premios: premios || [] });
    } catch(e) {
      setError("Error al ingresar. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <div style={{ background:C.card, padding:"20px 18px 16px", boxShadow:"0 1px 10px rgba(0,0,0,0.07)", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:C.bg, border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:18 }}>←</button>
        <h2 style={{ margin:0, fontSize:18, fontWeight:900 }}>Ingresar</h2>
      </div>
      <div style={{ padding:"40px 20px", maxWidth:430, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <Logo size={56}/>
          <h2 style={{ margin:"12px 0 4px", fontSize:22, fontWeight:900 }}>¡Hola de nuevo!</h2>
          <p style={{ margin:0, color:C.sub, fontSize:14 }}>Ingresa para gestionar a tus hijos</p>
        </div>
        <Field label="USUARIO" value={usuario} onChange={setUsuario} placeholder="Tu usuario" icon="👤"/>
        <Field label="CONTRASEÑA" type="password" value={clave} onChange={setClave} placeholder="Tu contraseña" icon="🔒"/>
        {error && <div style={{ background:"#FFF0F0", border:"1.5px solid #FFCCCC", borderRadius:12, padding:"10px 14px", marginBottom:14 }}><p style={{ margin:0, color:"#D32F2F", fontSize:13, fontWeight:700 }}>⚠️ {error}</p></div>}
        <div style={{ marginTop:8 }}><Pill onClick={handleLogin} color={C.blue} full disabled={loading}>{loading ? "Ingresando..." : "Ingresar →"}</Pill></div>
      </div>
    </div>
  );
}

function PanelMama({ cuenta, onLogout, onSelectNino, onUpdateCuenta }) {
  const [vistaAgregar, setVistaAgregar] = useState(false);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [error, setError] = useState("");
  const [vistaTab, setVistaTab] = useState("hijos");
  const [nuevoEmoji, setNuevoEmoji] = useState("🎁");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevaCat, setNuevaCat] = useState("");
  const [loading, setLoading] = useState(false);

  const agregarNino = async () => {
    if (!nombre.trim() || !edad) { setError("Completa nombre y edad"); return; }
    const e = parseInt(edad);
    if (e < 4 || e > 18) { setError("Edad entre 4 y 18 años"); return; }
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('ninos')
        .insert([{ cuenta_id: cuenta.id, nombre: nombre.trim(), edad: e, puntos: 0, completados: {}, historial: [] }])
        .select().single();
      if (err) throw err;
      const updated = { ...cuenta, ninos: [...cuenta.ninos, data] };
      onUpdateCuenta(updated);
      setNombre(""); setEdad(""); setError(""); setVistaAgregar(false);
    } catch(e) { setError("Error al agregar. Intenta de nuevo."); }
    setLoading(false);
  };

  const eliminarNino = async (id) => {
    await supabase.from('ninos').delete().eq('id', id);
    onUpdateCuenta({ ...cuenta, ninos: cuenta.ninos.filter(n => n.id !== id) });
  };

  const agregarPremio = async () => {
    if (!nuevoNombre.trim() || !nuevoPrecio) return;
    try {
      const { data } = await supabase.from('premios')
        .insert([{ cuenta_id: cuenta.id, emoji: nuevoEmoji, nombre: nuevoNombre.trim(), precio: parseInt(nuevoPrecio), categoria: nuevaCat || "Otro" }])
        .select().single();
      onUpdateCuenta({ ...cuenta, premios: [...cuenta.premios, data] });
      setNuevoNombre(""); setNuevoPrecio(""); setNuevaCat(""); setNuevoEmoji("🎁");
    } catch(e) {}
  };

  const eliminarPremio = async (id) => {
    await supabase.from('premios').delete().eq('id', id);
    onUpdateCuenta({ ...cuenta, premios: cuenta.premios.filter(p => p.id !== id) });
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <div style={{ background:"linear-gradient(135deg, #FF7043, #FF5722)", padding:"20px 18px 18px", boxShadow:"0 4px 16px #FF704350" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", maxWidth:430, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Logo size={38} white/>
            <div>
              <p style={{ margin:0, fontSize:10, color:"rgba(255,255,255,0.75)", fontWeight:800, letterSpacing:1 }}>PANEL DE MAMÁ 👩</p>
              <p style={{ margin:0, fontSize:16, fontWeight:900, color:"#fff" }}>Hola, {cuenta.nombre}</p>
            </div>
          </div>
          <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:34, height:34, cursor:"pointer", fontSize:16, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>🚪</button>
        </div>
      </div>

      <div style={{ maxWidth:430, margin:"0 auto", paddingBottom:88 }}>
        {vistaTab === "hijos" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
              <div>
                <h2 style={{ margin:0, fontSize:20, fontWeight:900 }}>Mis hijos</h2>
                <p style={{ margin:0, color:C.sub, fontSize:13 }}>{cuenta.ninos.length} perfil{cuenta.ninos.length !== 1 ? "es" : ""} creado{cuenta.ninos.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setVistaAgregar(true)} style={{ background:C.blue, color:"#fff", border:"none", borderRadius:100, padding:"9px 18px", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 4px 14px ${C.blue}40` }}>+ Agregar</button>
            </div>

            {vistaAgregar && (
              <div style={{ background:C.card, border:`1.5px solid ${C.blue}33`, borderRadius:20, padding:"20px 16px", marginBottom:18, boxShadow:`0 4px 16px ${C.blue}15` }}>
                <p style={{ margin:"0 0 14px", fontWeight:800, fontSize:15 }}>Nuevo perfil</p>
                <Field label="NOMBRE DEL NIÑO" value={nombre} onChange={setNombre} placeholder="ej: Matías" icon="👦"/>
                <Field label="EDAD" type="number" value={edad} onChange={setEdad} placeholder="ej: 9" icon="🎂"/>
                {edad && parseInt(edad) >= 4 && (
                  <div style={{ background:C.bg, borderRadius:12, padding:"10px 14px", marginBottom:12 }}>
                    <p style={{ margin:0, fontSize:12, color:C.sub, fontWeight:700 }}>
                      📋 Recibirá desafíos para <strong style={{ color:C.blue }}>{CHALLENGES_EDAD[getGrupoEdad(parseInt(edad))]?.label}</strong>
                    </p>
                  </div>
                )}
                {error && <p style={{ color:"#D32F2F", fontSize:13, margin:"0 0 10px", fontWeight:700 }}>⚠️ {error}</p>}
                <div style={{ display:"flex", gap:10 }}>
                  <Pill onClick={() => { setVistaAgregar(false); setError(""); }} color={C.sub} outline small>Cancelar</Pill>
                  <Pill onClick={agregarNino} color={C.blue} small disabled={loading}>{loading ? "..." : "Crear perfil ✓"}</Pill>
                </div>
              </div>
            )}

            {cuenta.ninos.length === 0 ? (
              <div style={{ textAlign:"center", padding:"50px 20px", color:C.sub }}>
                <div style={{ fontSize:52, marginBottom:12 }}>👦</div>
                <p style={{ fontWeight:700, color:C.text, margin:"0 0 4px" }}>Aún no hay perfiles</p>
                <p style={{ fontSize:13, margin:0 }}>Agrega a tu primer hijo para comenzar</p>
              </div>
            ) : cuenta.ninos.map(n => {
              const grupo = getGrupoEdad(n.edad);
              const colores = { pequeno: C.orange, mediano: C.blue, grande: C.green };
              const color = colores[grupo];
              return (
                <div key={n.id} style={{ background:C.card, border:"1.5px solid #E8EDF5", borderRadius:20, padding:"16px 16px", marginBottom:12, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <AvatarNino edad={n.edad} size={52}/>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <p style={{ margin:0, fontWeight:900, fontSize:17 }}>{n.nombre}</p>
                        <span style={{ background:`${color}20`, color, borderRadius:100, padding:"2px 10px", fontSize:11, fontWeight:800 }}>{n.edad} años</span>
                      </div>
                      <p style={{ margin:"0 0 4px", color:C.sub, fontSize:12 }}>{CHALLENGES_EDAD[grupo]?.label}</p>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:13 }}>💰</span>
                        <span style={{ fontWeight:800, fontSize:14, color:C.yellow }}>{formatPesos(n.puntos)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:14 }}>
                    <button onClick={() => onSelectNino(n)} style={{ flex:1, background:`${color}15`, color, border:`1.5px solid ${color}40`, borderRadius:100, padding:"9px", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>⚽ Ver desafíos</button>
                    <button onClick={() => eliminarNino(n.id)} style={{ background:"#FFF0F0", border:"1.5px solid #FFCCCC", borderRadius:100, padding:"9px 14px", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit", color:"#D32F2F" }}>🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {vistaTab === "premios" && (
          <div style={{ padding:"18px 16px" }}>
            <h2 style={{ margin:"0 0 2px", fontSize:20 }}>🎁 Premios</h2>
            <p style={{ color:C.sub, fontSize:13, margin:"0 0 20px" }}>Aplican para todos tus hijos</p>
            <div style={{ background:C.card, border:"1.5px solid #E8EDF5", borderRadius:20, padding:"18px 16px", marginBottom:20 }}>
              <p style={{ margin:"0 0 14px", fontSize:13, fontWeight:800 }}>➕ Agregar premio</p>
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                <input value={nuevoEmoji} onChange={e=>setNuevoEmoji(e.target.value)} style={{ width:52, border:"1.5px solid #E8EDF5", borderRadius:12, padding:"10px 6px", fontSize:20, textAlign:"center", fontFamily:"inherit", outline:"none" }}/>
                <input value={nuevoNombre} onChange={e=>setNuevoNombre(e.target.value)} placeholder="Nombre del premio" style={{ flex:1, border:"1.5px solid #E8EDF5", borderRadius:12, padding:"10px 14px", fontSize:14, fontFamily:"inherit", outline:"none", color:C.text }}/>
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                <input value={nuevoPrecio} onChange={e=>setNuevoPrecio(e.target.value)} placeholder="Precio $" type="number" style={{ flex:1, border:"1.5px solid #E8EDF5", borderRadius:12, padding:"10px 14px", fontSize:14, fontFamily:"inherit", outline:"none", color:C.text }}/>
                <input value={nuevaCat} onChange={e=>setNuevaCat(e.target.value)} placeholder="Categoría" style={{ flex:1, border:"1.5px solid #E8EDF5", borderRadius:12, padding:"10px 14px", fontSize:14, fontFamily:"inherit", outline:"none", color:C.text }}/>
              </div>
              <Pill onClick={agregarPremio} color={C.orange} full>Agregar</Pill>
            </div>
            {cuenta.premios.map(p => (
              <div key={p.id} style={{ background:C.card, border:"1.5px solid #E8EDF5", borderRadius:16, padding:"13px 15px", display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                <span style={{ fontSize:26 }}>{p.emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontWeight:700, fontSize:14 }}>{p.nombre}</p>
                  <p style={{ margin:"1px 0 0", color:C.sub, fontSize:11 }}>{p.categoria} · {formatPesos(p.precio)}</p>
                </div>
                <button onClick={() => eliminarPremio(p.id)} style={{ background:"#FFF0F0", border:"1.5px solid #FFCCCC", borderRadius:10, width:32, height:32, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>🗑️</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50, background:"rgba(255,255,255,0.92)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderTop:"1px solid #E8EDF5", display:"flex" }}>
        {[
          { id:"hijos",  label:"Mis hijos", svgA:<svg viewBox="0 0 24 24" fill={C.orange} width="22" height="22"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, svgI:<svg viewBox="0 0 24 24" fill="none" stroke="#B0BAC9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
          { id:"premios",label:"Premios",   svgA:<svg viewBox="0 0 24 24" fill={C.orange} width="22" height="22"><path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>, svgI:<svg viewBox="0 0 24 24" fill="none" stroke="#B0BAC9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg> },
        ].map(tab => {
          const active = vistaTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setVistaTab(tab.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", padding:"10px 4px 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ transform: active ? "scale(1.1)" : "scale(1)", transition:"transform 0.18s" }}>{active ? tab.svgA : tab.svgI}</div>
              <span style={{ fontSize:10, fontWeight: active ? 800 : 600, color: active ? C.orange : "#B0BAC9" }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VistaNino({ nino: ninoInicial, cuenta, onBack, onUpdateNino }) {
  const [nino, setNino] = useState(ninoInicial);
  const [vista, setVista] = useState("inicio");
  const [diaActual, setDiaActual] = useState("Lunes");
  const [confirmar, setConfirmar] = useState(null);
  const [premioCanjear, setPremioCanjear] = useState(null);
  const [celebrar, setCelebrar] = useState(false);
  const [canjeExitoso, setCanjeExitoso] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const map = [6,0,1,2,3,4,5];
    setDiaActual(dias[map[new Date().getDay()]]);
  }, []);

  const grupo = getGrupoEdad(nino.edad);
  const challenges = CHALLENGES_EDAD[grupo] || {};
  const challengesHoy = challenges[diaActual] || [];
  const completadosHoy = challengesHoy.filter(c => nino.completados[`${diaActual}-${c.id}`]).length;
  const progreso = challengesHoy.length ? Math.round((completadosHoy / challengesHoy.length) * 100) : 0;
  const grupoColor = { pequeno: C.orange, mediano: C.blue, grande: C.green }[grupo];

  const saveNino = async (updated) => {
    setSaving(true);
    await supabase.from('ninos').update({
      puntos: updated.puntos,
      completados: updated.completados,
      historial: updated.historial,
    }).eq('id', updated.id);
    setNino(updated);
    onUpdateNino(updated);
    setSaving(false);
  };

  const aprobarDesafio = async (d) => {
    const key = `${diaActual}-${d.id}`;
    if (nino.completados[key]) return;
    const updated = {
      ...nino,
      puntos: nino.puntos + d.puntos,
      completados: { ...nino.completados, [key]: true },
      historial: [{ desc:`✅ ${d.title} — +${formatPesos(d.puntos)}`, ts: new Date().toLocaleTimeString("es-CL") }, ...nino.historial],
    };
    await saveNino(updated);
    setCelebrar(true);
    setTimeout(() => setCelebrar(false), 2000);
  };

  const canjearPremio = async (p) => {
    if (nino.puntos < p.precio) return;
    const msg = encodeURIComponent(`🏆 ¡${nino.nombre} canjeó un premio!\n\n🎁 Premio: ${p.emoji} ${p.nombre}\n💰 Costo: ${formatPesos(p.precio)}\n\n¡Felicítalo, se lo ganó con sus desafíos de fútbol! ⚽`);
    const updated = {
      ...nino,
      puntos: nino.puntos - p.precio,
      historial: [{ desc:`🎁 Canjeó: ${p.nombre} — -${formatPesos(p.precio)}`, ts: new Date().toLocaleTimeString("es-CL") }, ...nino.historial],
    };
    await saveNino(updated);
    setCanjeExitoso(p);
    setPremioCanjear(null);
    setTimeout(() => window.open(`https://wa.me/${MAMA_WHATSAPP}?text=${msg}`, "_blank"), 800);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      {celebrar && (
        <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
          <span style={{ fontSize:96, animation:"popUp 2s ease-out forwards" }}>🎉</span>
        </div>
      )}
      {canjeExitoso && (
        <Modal>
          <div style={{ fontSize:64 }}>{canjeExitoso.emoji}</div>
          <h2 style={{ color:C.green, margin:"10px 0 4px", fontSize:22 }}>¡Premio canjeado!</h2>
          <p style={{ fontWeight:700, margin:"0 0 6px" }}>{canjeExitoso.nombre}</p>
          <p style={{ color:C.sub, fontSize:13, margin:"0 0 24px" }}>📱 Enviando WhatsApp a mamá...</p>
          <Pill onClick={() => setCanjeExitoso(null)} color={C.green}>¡Genial! 🎉</Pill>
        </Modal>
      )}
      {confirmar && (
        <Modal>
          <div style={{ fontSize:50, marginBottom:10 }}>{confirmar.emoji}</div>
          <h3 style={{ margin:"0 0 6px", fontSize:19 }}>{confirmar.title}</h3>
          <p style={{ color:C.sub, fontSize:13, margin:"0 0 10px" }}>{confirmar.desc}</p>
          <div style={{ background:"#FFFBEB", border:"1.5px solid #FFE082", borderRadius:14, padding:"8px 20px", display:"inline-block", marginBottom:16 }}>
            <span style={{ fontWeight:900, fontSize:22, color:C.yellow }}>+{formatPesos(confirmar.puntos)}</span>
          </div>
          <p style={{ color:C.sub, fontSize:13, margin:"0 0 20px" }}>👀 ¿Mamá/papá confirma que lo completó?</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <Pill onClick={() => setConfirmar(null)} color={C.blue} outline small>Cancelar</Pill>
            <Pill onClick={() => { aprobarDesafio(confirmar); setConfirmar(null); }} color={C.green} small disabled={saving}>✅ Aprobar</Pill>
          </div>
        </Modal>
      )}
      {premioCanjear && (
        <Modal>
          <div style={{ fontSize:54, marginBottom:10 }}>{premioCanjear.emoji}</div>
          <h3 style={{ margin:"0 0 6px", fontSize:19 }}>{premioCanjear.nombre}</h3>
          <div style={{ background:"#FFFBEB", border:"1.5px solid #FFE082", borderRadius:14, padding:"6px 20px", display:"inline-block", margin:"6px 0 12px" }}>
            <span style={{ fontWeight:900, fontSize:20, color:C.yellow }}>{formatPesos(premioCanjear.precio)}</span>
          </div>
          <p style={{ color:C.sub, fontSize:13, margin:"0 0 20px" }}>📱 Se enviará WhatsApp a mamá</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <Pill onClick={() => setPremioCanjear(null)} color={C.orange} outline small>Cancelar</Pill>
            <Pill onClick={() => canjearPremio(premioCanjear)} color={C.orange} small disabled={saving}>Canjear 🎁</Pill>
          </div>
        </Modal>
      )}

      <div style={{ maxWidth:430, margin:"0 auto", paddingBottom:88 }}>
        <div style={{ background:C.card, padding:"18px 18px 14px", boxShadow:"0 1px 10px rgba(0,0,0,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={onBack} style={{ background:C.bg, border:"none", borderRadius:10, width:34, height:34, cursor:"pointer", fontSize:17, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
              <AvatarNino edad={nino.edad} size={38}/>
              <div>
                <p style={{ margin:0, fontSize:10, color:C.sub, fontWeight:800, letterSpacing:1 }}>PERFIL · {nino.edad} AÑOS</p>
                <p style={{ margin:0, fontSize:16, fontWeight:900, color:C.text }}>{nino.nombre}</p>
              </div>
            </div>
            <div style={{ background:"#FFFBEB", border:"1.5px solid #FFE082", borderRadius:100, padding:"7px 14px", display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:14 }}>💰</span>
              <span style={{ fontWeight:900, fontSize:15, color:C.yellow }}>{formatPesos(nino.puntos)}</span>
            </div>
          </div>
        </div>

        {vista === "inicio" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ background:`linear-gradient(135deg, ${grupoColor}, ${C.blue})`, borderRadius:22, padding:"22px 22px 20px", marginBottom:20, boxShadow:`0 8px 28px ${grupoColor}50`, color:"#fff" }}>
              <p style={{ margin:"0 0 2px", fontSize:11, fontWeight:800, opacity:0.8, letterSpacing:0.8 }}>PROGRESO DE HOY · {diaActual.toUpperCase()}</p>
              <h2 style={{ margin:"0 0 16px", fontSize:22, fontWeight:900 }}>
                {completadosHoy === challengesHoy.length && challengesHoy.length > 0 ? "¡Crack del día! 🏆" : `¡Vamos ${nino.nombre}! 🔥`}
              </h2>
              <div style={{ background:"rgba(255,255,255,0.3)", borderRadius:100, height:9, overflow:"hidden", marginBottom:8 }}>
                <div style={{ height:"100%", width:`${progreso}%`, background:"#fff", borderRadius:100, transition:"width 0.5s" }} />
              </div>
              <p style={{ margin:0, fontSize:13, opacity:0.9 }}>{completadosHoy} de {challengesHoy.length} completados</p>
            </div>

            <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
              {dias.map(d => (
                <button key={d} onClick={() => setDiaActual(d)} style={{
                  background: diaActual===d ? grupoColor : C.bg, color: diaActual===d ? "#fff" : C.sub,
                  border:"none", borderRadius:100, padding:"6px 13px", fontSize:12, fontWeight:800,
                  cursor:"pointer", fontFamily:"inherit", boxShadow: diaActual===d ? `0 3px 10px ${grupoColor}44` : "none",
                }}>{d.slice(0,3)}</button>
              ))}
            </div>

            <p style={{ margin:"0 0 12px 2px", fontSize:11, fontWeight:800, color:C.sub, letterSpacing:0.8 }}>DESAFÍOS — {diaActual.toUpperCase()}</p>
            {(challenges[diaActual] || []).map(c => {
              const done = nino.completados[`${diaActual}-${c.id}`];
              return (
                <div key={c.id} onClick={() => !done && setConfirmar(c)} style={{
                  background: done ? "#F0FDF9" : C.card, border:`1.5px solid ${done ? "#99F6D0" : "#E8EDF5"}`,
                  borderRadius:18, padding:"14px 16px", display:"flex", alignItems:"center", gap:14,
                  marginBottom:10, cursor: done ? "default" : "pointer",
                  boxShadow: done ? "none" : "0 2px 10px rgba(28,35,64,0.05)",
                }}>
                  <div style={{ width:46, height:46, borderRadius:14, background: done ? "#D1FAF0" : C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>
                    {done ? "✅" : c.emoji}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:0, fontWeight:800, fontSize:15, color: done ? C.green : C.text }}>{c.title}</p>
                    <p style={{ margin:"2px 0 0", color:C.sub, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.desc}</p>
                  </div>
                  <div style={{ background: done ? "#D1FAF0" : "#FFFBEB", border:`1px solid ${done ? "#99F6D0" : "#FFE082"}`, borderRadius:100, padding:"4px 13px", flexShrink:0 }}>
                    <span style={{ fontWeight:900, fontSize:13, color: done ? C.green : C.yellow }}>{done ? "✓ listo" : `+${formatPesos(c.puntos)}`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {vista === "tienda" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <h2 style={{ margin:"0 0 4px", fontSize:20 }}>🎁 Tienda de Premios</h2>
              <p style={{ color:C.sub, fontSize:13, margin:"0 0 12px" }}>Canjea tus puntos</p>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FFFBEB", border:"1.5px solid #FFE082", borderRadius:100, padding:"8px 20px" }}>
                <span>💰</span>
                <span style={{ fontWeight:900, fontSize:16, color:C.yellow }}>{formatPesos(nino.puntos)} disponibles</span>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {cuenta.premios.map(p => {
                const puedo = nino.puntos >= p.precio;
                return (
                  <div key={p.id} onClick={() => puedo && setPremioCanjear(p)} style={{
                    background:C.card, border:`1.5px solid ${puedo ? "#FFCCBC" : "#E8EDF5"}`,
                    borderRadius:20, padding:"18px 14px", textAlign:"center",
                    cursor: puedo ? "pointer" : "default",
                    boxShadow: puedo ? `0 4px 16px ${C.orange}18` : "0 2px 6px rgba(0,0,0,0.04)",
                    opacity: puedo ? 1 : 0.5, position:"relative",
                  }}>
                    {!puedo && <div style={{ position:"absolute", top:10, right:12, fontSize:13 }}>🔒</div>}
                    <div style={{ fontSize:38, marginBottom:8 }}>{p.emoji}</div>
                    <p style={{ margin:"0 0 2px", fontWeight:800, fontSize:13, color:C.text, lineHeight:1.3 }}>{p.nombre}</p>
                    <p style={{ margin:"0 0 10px", color:C.sub, fontSize:11 }}>{p.categoria}</p>
                    <div style={{ background: puedo ? "#FFF3E0" : C.bg, border:`1px solid ${puedo ? "#FFCCBC" : "#E8EDF5"}`, borderRadius:100, padding:"4px 12px", display:"inline-block" }}>
                      <span style={{ fontWeight:900, fontSize:13, color: puedo ? C.orange : C.sub }}>{formatPesos(p.precio)}</span>
                    </div>
                    {puedo && <p style={{ margin:"8px 0 0", color:C.green, fontSize:11, fontWeight:800 }}>¡Disponible! ✓</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {vista === "historial" && (
          <div style={{ padding:"18px 16px" }}>
            <h2 style={{ margin:"0 0 2px", fontSize:20 }}>📜 Historial de {nino.nombre}</h2>
            <p style={{ color:C.sub, fontSize:13, marginBottom:20 }}>Logros y canjes</p>
            {nino.historial.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:C.sub }}>
                <div style={{ fontSize:52, marginBottom:12 }}>⚽</div>
                <p style={{ fontWeight:700, color:C.text, margin:"0 0 4px" }}>Aún no hay actividad</p>
                <p style={{ fontSize:13, margin:0 }}>¡Completa el primer desafío!</p>
              </div>
            ) : nino.historial.map((h,i) => (
              <div key={i} style={{ background:C.card, border:"1.5px solid #E8EDF5", borderRadius:14, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:14, color:C.text, fontWeight:600 }}>{h.desc}</span>
                <span style={{ color:C.sub, fontSize:11, whiteSpace:"nowrap", marginLeft:12 }}>{h.ts}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50, background:"rgba(255,255,255,0.92)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderTop:"1px solid #E8EDF5", display:"flex" }}>
        {[
          { id:"inicio",    label:"Inicio",  svgA:<svg viewBox="0 0 24 24" fill={grupoColor} width="22" height="22"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H15v-5h-6v5H4a1 1 0 01-1-1V9.5z"/></svg>, svgI:<svg viewBox="0 0 24 24" fill="none" stroke="#B0BAC9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H15v-5h-6v5H4a1 1 0 01-1-1V9.5z"/></svg> },
          { id:"tienda",    label:"Tienda",  svgA:<svg viewBox="0 0 24 24" fill={grupoColor} width="22" height="22"><path d="M20 7H4l1.5 9h13L20 7zM4 7l1-3h14l1 3M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"/></svg>, svgI:<svg viewBox="0 0 24 24" fill="none" stroke="#B0BAC9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M20 7H4l1.5 9h13L20 7zM4 7l1-3h14l1 3M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"/></svg> },
          { id:"historial", label:"Logros",  svgA:<svg viewBox="0 0 24 24" fill={grupoColor} width="22" height="22"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>, svgI:<svg viewBox="0 0 24 24" fill="none" stroke="#B0BAC9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg> },
        ].map(tab => {
          const active = vista===tab.id;
          return (
            <button key={tab.id} onClick={() => setVista(tab.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", padding:"10px 4px 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ transform: active ? "scale(1.1)" : "scale(1)", transition:"transform 0.18s" }}>{active ? tab.svgA : tab.svgI}</div>
              <span style={{ fontSize:10, fontWeight: active ? 800 : 600, color: active ? grupoColor : "#B0BAC9" }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Root() {
  const [screen, setScreen] = useState("welcome");
  const [currentCuenta, setCurrentCuenta] = useState(null);
  const [ninoSeleccionado, setNinoSeleccionado] = useState(null);

  const handleLogin = (cuenta) => { setCurrentCuenta(cuenta); setScreen("panel"); };
  const handleLogout = () => { setCurrentCuenta(null); setNinoSeleccionado(null); setScreen("welcome"); };

  const updateCuenta = (updated) => setCurrentCuenta(updated);

  const updateNino = (updatedNino) => {
    const updatedCuenta = { ...currentCuenta, ninos: currentCuenta.ninos.map(n => n.id === updatedNino.id ? updatedNino : n) };
    setCurrentCuenta(updatedCuenta);
    setNinoSeleccionado(updatedNino);
  };

  return (
    <div style={{ fontFamily:"'Nunito','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes popUp { 0%{transform:scale(0.3) translateY(50px);opacity:0} 40%{transform:scale(1.25) translateY(-10px);opacity:1} 70%{transform:scale(1);opacity:1} 100%{transform:scale(1.4) translateY(-30px);opacity:0} }
        @keyframes spin { to { transform: rotate(360deg); } }
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        body{margin:0}
        input::placeholder{color:#B0BAC9}
        input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
      `}</style>
      {screen==="welcome"  && <Welcome onLogin={()=>setScreen("login")} onRegister={()=>setScreen("register")}/>}
      {screen==="register" && <Register onBack={()=>setScreen("welcome")} onSuccess={handleLogin}/>}
      {screen==="login"    && <Login onBack={()=>setScreen("welcome")} onSuccess={handleLogin}/>}
      {screen==="panel"    && currentCuenta && <PanelMama cuenta={currentCuenta} onLogout={handleLogout} onSelectNino={(n) => { setNinoSeleccionado(n); setScreen("nino"); }} onUpdateCuenta={updateCuenta}/>}
      {screen==="nino"     && ninoSeleccionado && <VistaNino nino={ninoSeleccionado} cuenta={currentCuenta} onBack={() => setScreen("panel")} onUpdateNino={updateNino}/>}
    </div>
  );
}
