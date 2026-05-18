
// ═══════════════════════════════════════════════════════════════
// PALETTE
// ═══════════════════════════════════════════════════════════════
const T = {
  bg:"#0e0e0e", sidebar:"#111", panel:"#161616", card:"#1a1a1a",
  border:"#252525", border2:"#2a2a2a",
  orange:"#f97316", orangeD:"#7c3a10",
  green:"#22c55e",  greenD:"#14532d",
  red:"#ef4444",    redD:"#450a0a",
  yellow:"#eab308", yellowD:"#422006",
  purple:"#a855f7", purpleD:"#3b0764",
  cyan:"#06b6d4",   cyanD:"#164e63",
  text:"#f1f5f9",   muted:"#64748b", muted2:"#94a3b8",
};

const GRADES = ["Prospecto","Soldado","Capitaine","Sous-Chef","El Jefe"];
const GRADE_COLORS = {
  "El Jefe":T.orange,"Sous-Chef":T.yellow,"Capitaine":T.purple,
  "Soldado":T.cyan,"Prospecto":T.muted2
};

// ═══════════════════════════════════════════════════════════════
// SEUL COMPTE PAR DÉFAUT : l'admin fondateur
// Les autres membres seront créés via les inscriptions
// ═══════════════════════════════════════════════════════════════
const INIT_ACCOUNTS = [
  {
    id: 1,
    username: "juangarcia9",
    password: "abdelm14",
    nomRP: "Juan Garcia",
    prenomRP: "Juan",
    grade: "El Jefe",
    init: "JG",
    color: "#b45309",
    isAdmin: true,
    online: true,
    banned: false,
    approved: true,
    perms: { members:true, armes:true, outils:true, compta:true, radio:true, rapports:true, clips:true },
  },
];

const INIT_PENDING: any[]  = [];
const INIT_WEAPONS: any[]  = [];
const INIT_TOOLS: any[]    = [];
const INIT_COTAS: any[]    = [];
const INIT_COMPTA: any[]   = [];
const INIT_RAPPORTS: any[] = [];
const INIT_CLIPS: any[]    = [];

const TOOL_TYPES = [
  "Hack ATM","Disqueuse","Disqueuse Pro",
  "Kit Drogue","Kit Drogue Premium",
  "Outils Braquage","Matériel Divers",
];
const COTA_TYPES = ["Drogue","ATM","Bijouterie","Banque","Centenaire","Épicerie"];
const COTA_PTS   = { Drogue:150, ATM:120, Bijouterie:200, Banque:180, Centenaire:100, "Épicerie":80 };

const fmt   = n => (n ?? 0).toLocaleString("fr-FR");
const nowStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} `
       + `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};
const todayStr = () => new Date().toISOString().split("T")[0];

function useTime() {
  const [t,setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

// ═══════════════════════════════════════════════════════════════
// UI ATOMS
// ═══════════════════════════════════════════════════════════════
function Av({ init, color="#374151", size=36, online, square }) {
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{
        width:size, height:size,
        borderRadius: square ? Math.max(6, size*0.22) : "50%",
        background:color, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:size*0.32, fontWeight:800, color:"#fff", fontFamily:"monospace",
        userSelect:"none",
      }}>{init}</div>
      {online !== undefined && (
        <div style={{
          position:"absolute", bottom:-2, right:-2,
          width:9, height:9, borderRadius:"50%",
          background: online ? T.green : "#444",
          border: "2px solid "+T.sidebar,
        }}/>
      )}
    </div>
  );
}

function Tag({ text, color=T.orange, bg, style={} }) {
  return (
    <span style={{
      background: bg || color+"22", color,
      fontSize:11, padding:"2px 9px", borderRadius:20,
      fontWeight:600, whiteSpace:"nowrap",
      border:`1px solid ${color}44`, ...style,
    }}>{text}</span>
  );
}

function Btn({ children, onClick, color=T.orange, small, outline, disabled, full, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? "transparent" : disabled ? "#1f1f1f" : color,
      color: disabled ? "#444" : outline ? color : "#fff",
      border: outline ? `1px solid ${color}` : "none",
      borderRadius:8,
      padding: small ? "6px 14px" : "10px 20px",
      fontWeight:700, fontSize: small ? 12 : 13,
      cursor: disabled ? "not-allowed" : "pointer",
      width: full ? "100%" : "auto",
      whiteSpace:"nowrap", opacity: disabled ? 0.5 : 1, ...style,
    }}>{children}</button>
  );
}

function Field({ label, children, style={} }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, ...style }}>
      <div style={{ color:T.muted, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" }}>{label}</div>
      {children}
    </div>
  );
}

function Inp({ value, onChange, placeholder, type="text", style={} }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
      background:"#0f0f0f", border:`1px solid ${T.border2}`, color:T.text,
      borderRadius:8, padding:"10px 14px", fontSize:13, width:"100%",
      boxSizing:"border-box", outline:"none", ...style,
    }}/>
  );
}

function Sel({ value, onChange, children, style={} }) {
  return (
    <select value={value} onChange={onChange} style={{
      background:"#0f0f0f", border:`1px solid ${T.border2}`, color:T.text,
      borderRadius:8, padding:"10px 14px", fontSize:13, width:"100%",
      boxSizing:"border-box", outline:"none", cursor:"pointer", ...style,
    }}>{children}</select>
  );
}

function Panel({ children, style={} }) {
  return (
    <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:12, padding:20, ...style }}>
      {children}
    </div>
  );
}

function Empty({ icon="📭", text }) {
  return (
    <div style={{ textAlign:"center", padding:"40px 20px", color:T.muted }}>
      <div style={{ fontSize:40, marginBottom:12 }}>{icon}</div>
      <div style={{ fontSize:14 }}>{text}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════
function LoginPage({ accounts, setAccounts, pendingAccounts, setPendingAccounts, recrutementOuvert, onLogin }) {
  const [mode,setMode]   = useState("login");
  const [form,setForm]   = useState({ username:"", password:"", nomRP:"", prenomRP:"" });
  const [error,setError] = useState("");
  const [ok,setOk]       = useState("");

  const doLogin = () => {
    const acc = accounts.find(a => a.username === form.username && a.password === form.password);
    if (!acc)         { setError("Identifiant ou mot de passe incorrect."); return; }
    if (acc.banned)   { setError("Votre compte a été banni de l'organisation."); return; }
    if (!acc.approved){ setError("Votre demande est en attente de validation par un administrateur."); return; }
    setError(""); onLogin(acc);
  };

  const doRegister = () => {
    if (!form.username||!form.password||!form.nomRP||!form.prenomRP) { setError("Tous les champs sont obligatoires."); return; }
    if (accounts.find(a=>a.username===form.username) || pendingAccounts.find(a=>a.username===form.username)) {
      setError("Cet identifiant est déjà utilisé."); return;
    }
    setPendingAccounts(p => [...p, {
      id: Date.now(),
      username: form.username,
      password: form.password,
      nomRP:    `${form.prenomRP} ${form.nomRP}`,
      prenomRP: form.prenomRP,
      date:     nowStr(),
    }]);
    setOk("Demande envoyée ! Un admin va valider votre compte.");
    setError(""); setForm({ username:"", password:"", nomRP:"", prenomRP:"" });
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#0e0e0e 0%,#1a0a00 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Segoe UI',sans-serif",
    }}>
      <div style={{
        background:"#111", border:`1px solid ${T.border}`, borderRadius:20,
        padding:"40px 36px", width:400,
        boxShadow:"0 25px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{
            width:72, height:72, borderRadius:18,
            background:"#1f1400", border:`2px solid ${T.orange}55`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:38, margin:"0 auto 14px",
            boxShadow:`0 0 30px ${T.orange}22`,
          }}>🦂</div>
          <div style={{ color:"#fff", fontWeight:900, fontSize:22, fontFamily:"Impact,sans-serif", letterSpacing:3 }}>LOS MALDITAS</div>
          <div style={{ color:T.orange, fontWeight:900, fontSize:30, fontFamily:"Impact,sans-serif", lineHeight:1 }}>14</div>
          <div style={{ color:T.muted, fontSize:12, marginTop:6 }}>Espace de gestion sécurisé</div>
        </div>

        {/* Tab switch */}
        {recrutementOuvert && (
          <div style={{ display:"flex", gap:4, marginBottom:24, background:"#0f0f0f", borderRadius:8, padding:4 }}>
            {[["login","Se connecter"],["register","S'inscrire"]].map(([id,label]) => (
              <button key={id} onClick={() => { setMode(id); setError(""); setOk(""); }} style={{
                flex:1, padding:"8px", borderRadius:6, border:"none",
                background: mode===id ? T.orange : "transparent",
                color: mode===id ? "#fff" : T.muted,
                fontWeight:700, fontSize:13, cursor:"pointer",
              }}>{label}</button>
            ))}
          </div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="Identifiant">
              <Inp value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} placeholder="Votre identifiant"/>
            </Field>
            <Field label="Mot de passe">
              <Inp type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="••••••••"/>
            </Field>
            {error && <div style={{ color:T.red, fontSize:13, background:T.redD+"44", borderRadius:8, padding:"8px 12px" }}>{error}</div>}
            <Btn onClick={doLogin} color={T.orange} full>🔐 Se connecter</Btn>
          </div>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Field label="Prénom RP"><Inp value={form.prenomRP} onChange={e=>setForm(p=>({...p,prenomRP:e.target.value}))} placeholder="Ex: Carlos"/></Field>
              <Field label="Nom RP"><Inp value={form.nomRP} onChange={e=>setForm(p=>({...p,nomRP:e.target.value}))} placeholder="Ex: Reyes"/></Field>
            </div>
            <Field label="Identifiant"><Inp value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} placeholder="Votre identifiant"/></Field>
            <Field label="Mot de passe"><Inp type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="Choisissez un mot de passe"/></Field>
            {error && <div style={{ color:T.red, fontSize:13, background:T.redD+"44", borderRadius:8, padding:"8px 12px" }}>{error}</div>}
            {ok    && <div style={{ color:T.green, fontSize:13, background:T.greenD+"44", borderRadius:8, padding:"8px 12px" }}>{ok}</div>}
            <Btn onClick={doRegister} color={T.orange} full>📩 Envoyer la demande</Btn>
          </div>
        )}

        {/* Recrutement fermé */}
        {!recrutementOuvert && (
          <div style={{ marginTop:20, background:"#1a1a1a", borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
            <div style={{ fontSize:16, marginBottom:4 }}>🔴 <span style={{ color:T.red, fontWeight:700 }}>Recrutement fermé</span></div>
            <div style={{ color:T.muted, fontSize:12 }}>Les inscriptions sont désactivées.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════
// Navigation : adminOnly = caché aux joueurs normaux
const NAV = [
  { id:"accueil",      label:"Accueil",           icon:"🏠", adminOnly:false },
  { id:"cotas",        label:"Cotas",             icon:"◎",  adminOnly:false },
  { id:"classement",   label:"Classement",        icon:"🏆", adminOnly:false },
  { id:"clips",        label:"Dépôt Clips",       icon:"▶",  adminOnly:false },
  { id:"rapport",      label:"Rapport Incident",  icon:"⚠",  adminOnly:false },
  { id:"radio",        label:"Radio",             icon:"📻", adminOnly:false },
  { id:"outilage",     label:"Outilage",          icon:"🔧", adminOnly:false },
  { id:"attribution",  label:"Attribution Armes", icon:"🔫", adminOnly:false },
  { id:"coffre",       label:"Coffre Personnel",  icon:"🔒", adminOnly:false },
  // ── Admin seulement ──
  { id:"comptabilite", label:"Comptabilité",      icon:"💰", adminOnly:true  },
  { id:"permissions",  label:"Permissions Admin", icon:"🛡",  adminOnly:true  },
];

function Sidebar({ page, setPage, me, pendingCount, unreadRapports, isAdmin }) {
  return (
    <div style={{ width:222, minHeight:"100vh", background:T.sidebar, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:"20px 16px 16px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ width:64, height:64, borderRadius:14, background:"#1f1400", border:`2px solid ${T.orange}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, marginBottom:10, boxShadow:`0 0 20px ${T.orange}11` }}>🦂</div>
        <div style={{ color:"#fff", fontWeight:900, fontSize:14, fontFamily:"Impact,sans-serif", letterSpacing:2 }}>LOS MALDITAS</div>
        <div style={{ color:T.orange, fontWeight:900, fontSize:20, fontFamily:"Impact,sans-serif", lineHeight:1 }}>14</div>
        <div style={{ marginTop:8, display:"inline-flex", alignItems:"center", gap:6, background:T.greenD, borderRadius:20, padding:"3px 10px" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:T.green }}/>
          <span style={{ color:T.green, fontSize:11, fontWeight:700 }}>ONLINE</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding:"10px 8px 4px", flex:1, overflowY:"auto" }}>
        <div style={{ color:"#2a2a2a", fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", padding:"0 6px 6px" }}>NAVIGATION</div>
        {NAV.filter(n => !n.adminOnly || isAdmin).map(n => {
          const on = page === n.id;
          const badge = n.id==="rapport" ? unreadRapports : n.id==="permissions" ? pendingCount : 0;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
              background: on ? T.orange+"22" : "transparent",
              border:"none",
              borderLeft: on ? `3px solid ${T.orange}` : "3px solid transparent",
              borderRadius: on ? "0 8px 8px 0" : 0,
              color: on ? T.orange : T.muted2,
              fontSize:13, cursor:"pointer", textAlign:"left", width:"100%",
              fontWeight: on ? 700 : 400, marginBottom:1,
            }}>
              <span style={{ fontSize:15 }}>{n.icon}</span>
              <span style={{ flex:1 }}>{n.label}</span>
              {badge > 0
                ? <span style={{ background:T.red, color:"#fff", fontSize:10, width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{badge}</span>
                : on && <div style={{ width:6, height:6, borderRadius:"50%", background:T.orange }}/>
              }
            </button>
          );
        })}
      </div>

      {/* Profile */}
      <div style={{ padding:"12px 14px", borderTop:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10 }}>
        <Av init={me.init} color={me.color} size={32} square online={me.online}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:T.text, fontWeight:700, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{me.nomRP}</div>
          <div style={{ color:T.orange, fontSize:11 }}>{me.grade}</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════════════════════
function TopBar({ me, fondsOrg, onLogout }) {
  const t = useTime();
  const days   = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
  const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  const time   = `${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}:${String(t.getSeconds()).padStart(2,"0")}`;
  return (
    <div style={{ height:56, background:"#0e0e0e", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 24px", gap:14, flexShrink:0 }}>
      <div style={{ flex:1 }}>
        <div style={{ color:"#fff", fontWeight:900, fontSize:15 }}>LOS MALDITAS <span style={{ color:T.orange }}>14</span></div>
        <div style={{ color:T.muted, fontSize:11 }}>{days[t.getDay()]} {t.getDate()} {months[t.getMonth()]} {t.getFullYear()}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, background:T.greenD+"88", border:`1px solid ${T.green}33`, borderRadius:8, padding:"6px 14px" }}>
        <span style={{ color:T.green }}>$</span>
        <div>
          <div style={{ color:T.muted, fontSize:10 }}>Fonds Org.</div>
          <div style={{ color:T.green, fontWeight:800, fontSize:14 }}>{fmt(fondsOrg)} $</div>
        </div>
      </div>
      <div style={{ background:"#111", border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 14px", textAlign:"center" }}>
        <div style={{ color:T.muted, fontSize:10 }}>Heure</div>
        <div style={{ color:"#fff", fontWeight:700, fontSize:14, fontFamily:"monospace" }}>{time}</div>
      </div>
      <Av init={me.init} color={me.color} size={34} square online/>
      <div>
        <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{me.nomRP}</div>
        <div style={{ color:T.orange, fontSize:11 }}>{me.grade}</div>
      </div>
      <button onClick={onLogout} style={{ background:T.redD, color:T.red, border:"none", borderRadius:8, padding:"8px 12px", cursor:"pointer", fontSize:12, fontWeight:700 }}>🚪 Quitter</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE ACCUEIL
// ═══════════════════════════════════════════════════════════════
function PageAccueil({ accounts, weapons, tools, cotas, compta, radio }) {
  const t = useTime();
  const time = `${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}:${String(t.getSeconds()).padStart(2,"0")}`;
  const fondsOrg  = compta.reduce((a,c) => a + (c.type==="credit" ? c.montant : -c.montant), 0);
  const gains     = compta.filter(c=>c.type==="credit").reduce((a,c)=>a+c.montant,0);
  const depenses  = compta.filter(c=>c.type==="debit").reduce((a,c)=>a+c.montant,0);
  const membres   = accounts.filter(a=>a.approved&&!a.banned);
  const admins    = membres.filter(a=>a.isAdmin).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Hero */}
      <div style={{ borderRadius:16, overflow:"hidden", border:`1px solid ${T.border}`, display:"flex", minHeight:240 }}>
        <div style={{ flex:1, background:"linear-gradient(135deg,#1a0800,#0e0e0e)", padding:"28px 32px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ background:T.greenD, border:`1px solid ${T.green}44`, borderRadius:20, padding:"4px 14px", display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:T.green }}/><span style={{ color:T.green, fontSize:12, fontWeight:700 }}>SYSTÈME EN LIGNE</span>
            </div>
            <div style={{ background:"#1a1200", border:`1px solid ${T.yellow}44`, borderRadius:20, padding:"4px 14px", display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:12 }}>🛡</span><span style={{ color:T.yellow, fontSize:12, fontWeight:700 }}>ACCÈS SÉCURISÉ</span>
            </div>
          </div>
          <div>
            <div style={{ color:T.orange, fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>Organisation Criminelle</div>
            <div style={{ color:"#fff", fontWeight:900, fontSize:48, fontFamily:"Impact,sans-serif", letterSpacing:2, lineHeight:1 }}>LOS MALDITAS</div>
            <div style={{ color:T.orange, fontWeight:900, fontSize:60, fontFamily:"Impact,sans-serif", lineHeight:0.9 }}>XIV</div>
          </div>
          <div style={{ display:"flex", gap:14, marginTop:14, flexWrap:"wrap" }}>
            {[
              { icon:"👥", val:membres.length, label:"Membres" },
              { icon:"🔫", val:weapons.length, label:"Armes" },
              { icon:"$",  val:fondsOrg>=0?`${(fondsOrg/1000000).toFixed(2)}M $`:"—", label:"Fonds Org." },
              { icon:"📻", val:radio, label:"Fréquence" },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:"#ffffff08", borderRadius:8, padding:"8px 14px" }}>
                <span style={{ fontSize:14 }}>{s.icon}</span>
                <div>
                  <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>{s.val}</div>
                  <div style={{ color:T.muted, fontSize:10, textTransform:"uppercase", letterSpacing:1 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ width:260, background:"linear-gradient(135deg,#1a0f00,#0e0e0e)", display:"flex", flexDirection:"column", alignItems:"flex-end", padding:"24px", justifyContent:"space-between", borderLeft:`1px solid ${T.border}` }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#fff", fontWeight:900, fontSize:30, fontFamily:"monospace" }}>{time}</div>
            <div style={{ color:T.muted, fontSize:11 }}>{t.getDate()} mai {t.getFullYear()}</div>
          </div>
          <div style={{ fontSize:68, filter:"drop-shadow(0 0 30px #f9731644)" }}>🤠</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
        {[
          { icon:"👥", val:membres.length,   label:"Membres actifs",       sub:`${admins} admins`,    sc:T.orange },
          { icon:"🔫", val:weapons.length,   label:"Armes attribuées",     sub:`${weapons.length} enreg.`, sc:T.orange },
          { icon:"🔧", val:tools.length,     label:"Outils actifs",        sub:`${tools.length} distribués`, sc:T.purple },
          { icon:"📻", val:radio,            label:"Fréquence radio",      sub:"MHz · Canal Actif",   sc:T.cyan },
          { icon:"$",  val:fondsOrg>=0?`${(fondsOrg/1000000).toFixed(2)}M $`:"-"+fmt(Math.abs(fondsOrg))+" $",
            label:"Fonds organisation", sub:`Gains: ${fmt(gains)} $`, sc: fondsOrg>=0 ? T.green : T.red },
        ].map((s,i) => (
          <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"#252525", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:12 }}>{s.icon}</div>
            <div style={{ color:T.text, fontWeight:900, fontSize:22, lineHeight:1 }}>{s.val}</div>
            <div style={{ color:T.muted, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginTop:4 }}>{s.label}</div>
            <div style={{ color:s.sc, fontSize:12, marginTop:6, fontWeight:600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Panel>
          <div style={{ color:T.text, fontWeight:700, fontSize:15, marginBottom:14 }}>📈 Activité Comptable</div>
          {compta.length === 0
            ? <Empty icon="💰" text="Aucune transaction enregistrée."/>
            : <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ background:T.greenD+"44", border:`1px solid ${T.green}33`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ color:T.muted, fontSize:10, textTransform:"uppercase" }}>GAINS</div>
                  <div style={{ color:T.green, fontWeight:900, fontSize:20 }}>+{fmt(gains)} $</div>
                </div>
                <div style={{ background:T.redD+"44", border:`1px solid ${T.red}33`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ color:T.muted, fontSize:10, textTransform:"uppercase" }}>DÉPENSES</div>
                  <div style={{ color:T.red, fontWeight:900, fontSize:20 }}>-{fmt(depenses)} $</div>
                </div>
              </div>
          }
        </Panel>
        <Panel>
          <div style={{ color:T.text, fontWeight:700, fontSize:15, marginBottom:14 }}>👥 Membres</div>
          {membres.length === 0
            ? <Empty icon="👥" text="Aucun membre pour l'instant."/>
            : membres.map(m => (
                <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderTop:`1px solid ${T.border}` }}>
                  <Av init={m.init} color={m.color} size={28} square online={m.online}/>
                  <div style={{ flex:1 }}>
                    <div style={{ color:T.text, fontWeight:600, fontSize:13 }}>{m.nomRP}</div>
                    <div style={{ color:T.muted, fontSize:11 }}>{m.grade}</div>
                  </div>
                  {m.isAdmin && <Tag text="Admin" color={T.orange}/>}
                  <div style={{ width:8, height:8, borderRadius:"50%", background:m.online?T.green:"#444" }}/>
                </div>
              ))
          }
        </Panel>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE CLASSEMENT
// ═══════════════════════════════════════════════════════════════
function PageClassement({ accounts, cotas }) {
  const [tab,setTab] = useState("semaine");
  const t = useTime();

  const membres = accounts.filter(a=>a.approved&&!a.banned);
  const players = membres.map(a => {
    const myCot = cotas.filter(c=>c.joueur===a.nomRP);
    const pts   = myCot.reduce((s,c)=>s+(c.status==="validée"?c.pts:0),0);
    const nb    = myCot.filter(c=>c.status==="validée").length;
    return { ...a, pts, nb };
  }).sort((a,b) => b.pts - a.pts);

  const totalPts = players.reduce((s,p)=>s+p.pts,0);
  const avg      = players.length ? Math.round(totalPts/players.length) : 0;
  const aboveAvg = players.filter(p=>p.pts>avg).length;
  const leader   = players[0];

  const [p1,p2,p3] = [players[0],players[1],players[2]];

  const gradeDist = GRADES.map(g => ({
    grade:g, count: membres.filter(m=>m.grade===g).length,
  }));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ color:T.text, fontWeight:900, fontSize:24 }}>Classement Cotas</div>
          <div style={{ color:T.muted, fontSize:13 }}>Points hebdomadaires · Reset chaque lundi</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ background:"#1a1200", border:`1px solid ${T.yellow}44`, borderRadius:10, padding:"8px 16px", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:T.yellow }}>📅</span>
            <span style={{ color:T.yellow, fontWeight:700, fontSize:13 }}>S20 · {t.getDate()} Mai {t.getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* 4 stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { icon:"📊", label:"MOYENNE GROUPE", val:avg,                  sub:"pts / membre",        color:T.yellow },
          { icon:"↑",  label:"AU-DESSUS MOY.", val:aboveAvg,             sub:"membres actifs",      color:T.green  },
          { icon:"🔥", label:"LEADER",          val:leader?.prenomRP||"—",sub:`${leader?.pts||0} pts`, color:T.orange },
          { icon:"#",  label:"TOTAL POINTS",    val:totalPts,             sub:"groupe cette semaine", color:T.cyan   },
        ].map((s,i) => (
          <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ width:36,height:36,borderRadius:8,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",color:s.color,fontSize:16,fontWeight:700,marginBottom:10 }}>{s.icon}</div>
            <div style={{ color:T.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:2 }}>{s.label}</div>
            <div style={{ color:s.color,fontWeight:900,fontSize:22,lineHeight:1 }}>{s.val}</div>
            <div style={{ color:T.muted,fontSize:12,marginTop:4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Podium */}
      <Panel style={{ background:"linear-gradient(135deg,#1a1200,#111)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:24 }}>
          <span style={{ fontSize:20 }}>🏆</span>
          <div style={{ color:T.text,fontWeight:700,fontSize:16 }}>Podium de la Semaine</div>
        </div>
        {players.length === 0
          ? <Empty icon="🏆" text="Aucun joueur au classement pour l'instant."/>
          : (
            <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"center",gap:0 }}>
              {/* 2nd */}
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",width:180 }}>
                {p2 ? <>
                  <Av init={p2.init} color={p2.color} size={56} square/>
                  <div style={{ color:T.text,fontWeight:700,fontSize:14,marginTop:8 }}>{p2.prenomRP}</div>
                  <div style={{ color:T.muted,fontSize:12 }}>{p2.grade}</div>
                  <div style={{ color:T.muted2,fontWeight:900,fontSize:20,marginTop:4 }}>{p2.pts}</div>
                  <div style={{ color:T.muted,fontSize:12 }}>{p2.nb} cota{p2.nb>1?"s":""}</div>
                  <div style={{ background:"#1a1a1a",border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 20px",marginTop:10,width:"100%",boxSizing:"border-box",textAlign:"center" }}>
                    <div style={{ fontSize:20,marginBottom:4 }}>⏱</div>
                    <div style={{ color:T.muted,fontWeight:800,fontSize:14 }}>#2</div>
                  </div>
                </> : <div style={{ color:T.muted,fontSize:12,padding:20 }}>—</div>}
              </div>
              {/* 1st */}
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",width:200,marginBottom:-10 }}>
                {p1 ? <>
                  <div style={{ position:"relative" }}>
                    <div style={{ position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",fontSize:26 }}>👑</div>
                    <Av init={p1.init} color={p1.color} size={70} square/>
                  </div>
                  <div style={{ color:T.text,fontWeight:800,fontSize:16,marginTop:14 }}>{p1.prenomRP}</div>
                  <div style={{ color:T.orange,fontSize:12,fontWeight:600 }}>{p1.grade}</div>
                  <div style={{ color:T.yellow,fontWeight:900,fontSize:28,marginTop:4 }}>{p1.pts}</div>
                  <div style={{ color:T.muted,fontSize:12 }}>{p1.nb} cotas validés</div>
                  <div style={{ background:"linear-gradient(135deg,#2a1f00,#1a1200)",border:`1px solid ${T.yellow}44`,borderRadius:10,padding:"20px",marginTop:10,width:"100%",boxSizing:"border-box",textAlign:"center" }}>
                    <div style={{ fontSize:26,marginBottom:4,color:T.yellow }}>🏆</div>
                    <div style={{ color:T.yellow,fontWeight:800,fontSize:16 }}>#1</div>
                  </div>
                </> : <div style={{ color:T.muted,fontSize:12,padding:20 }}>—</div>}
              </div>
              {/* 3rd */}
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",width:180 }}>
                {p3 ? <>
                  <Av init={p3.init} color={p3.color} size={56} square/>
                  <div style={{ color:T.text,fontWeight:700,fontSize:14,marginTop:8 }}>{p3.prenomRP}</div>
                  <div style={{ color:T.muted,fontSize:12 }}>{p3.grade}</div>
                  <div style={{ color:T.muted2,fontWeight:900,fontSize:20,marginTop:4 }}>{p3.pts}</div>
                  <div style={{ color:T.muted,fontSize:12 }}>{p3.nb} cota{p3.nb>1?"s":""}</div>
                  <div style={{ background:"#1a1a1a",border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 20px",marginTop:10,width:"100%",boxSizing:"border-box",textAlign:"center" }}>
                    <div style={{ fontSize:20,marginBottom:4 }}>💡</div>
                    <div style={{ color:T.muted,fontWeight:800,fontSize:14 }}>#3</div>
                  </div>
                </> : null}
              </div>
            </div>
          )
        }
      </Panel>

      {/* Tabs */}
      <div style={{ display:"flex",gap:4 }}>
        {[["semaine","🗓 Cette Semaine"],["systeme","◎ Système de Points"]].map(([id,label]) => (
          <button key={id} onClick={()=>setTab(id)} style={{ padding:"9px 18px",borderRadius:8,border:`1px solid ${tab===id?T.orange:T.border}`,background:tab===id?T.orange+"22":"transparent",color:tab===id?T.orange:T.muted,fontWeight:700,fontSize:13,cursor:"pointer" }}>{label}</button>
        ))}
      </div>

      {tab==="semaine" && (
        <Panel>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
            <div style={{ color:T.text,fontWeight:700,fontSize:14 }}>Classement · {t.getDate()} Mai {t.getFullYear()}</div>
            {avg>0 && <Tag text={`📊 Moyenne groupe : ${avg} pts`} color={T.yellow}/>}
          </div>
          {players.length===0
            ? <Empty icon="🏆" text="Aucune donnée de classement."/>
            : players.map((p,i) => {
                const barW = p.pts>0 ? Math.min(100,Math.round(p.pts/(players[0]?.pts||1)*100)) : 0;
                const isAbove = p.pts > avg && avg > 0;
                return (
                  <div key={p.id} style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderTop:`1px solid ${T.border}` }}>
                    <div style={{ width:28,textAlign:"center" }}>
                      {i===0?<span style={{ color:T.yellow,fontSize:18 }}>🏆</span>:<span style={{ color:T.muted,fontWeight:700 }}>{i+1}</span>}
                    </div>
                    <Av init={p.init} color={p.color} size={34} square online={p.online}/>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <span style={{ color:T.text,fontWeight:700,fontSize:14 }}>{p.nomRP}</span>
                        {isAbove && <Tag text="↑ au-dessus" color={T.green} style={{ fontSize:10 }}/>}
                      </div>
                      <div style={{ color:GRADE_COLORS[p.grade]||T.muted,fontSize:12 }}>{p.grade}</div>
                      <div style={{ marginTop:6,height:6,background:"#1a1a1a",borderRadius:4,overflow:"hidden" }}>
                        <div style={{ width:`${barW}%`,height:"100%",background:i===0?`linear-gradient(90deg,${T.yellow},${T.orange})`:T.orange+"88",borderRadius:4,transition:"width 0.5s" }}/>
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:T.yellow,fontWeight:900,fontSize:18 }}>{p.pts}</div>
                      <div style={{ color:T.muted,fontSize:12 }}>{p.nb} cotas</div>
                    </div>
                  </div>
                );
              })
          }
        </Panel>
      )}

      {tab==="systeme" && (
        <Panel>
          <div style={{ color:T.text,fontWeight:700,fontSize:15,marginBottom:16 }}>Système de Points</div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20 }}>
            {COTA_TYPES.map((ct,i) => (
              <div key={i} style={{ background:"#0f0f0f",border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <span style={{ color:T.text,fontWeight:600,fontSize:13 }}>{ct}</span>
                <Tag text={`+${COTA_PTS[ct]} pts`} color={T.yellow}/>
              </div>
            ))}
          </div>
          {/* Grade distribution */}
          <div style={{ background:"#0f0f0f",border:`1px solid ${T.border}`,borderRadius:10,padding:"16px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
              <div style={{ width:32,height:32,borderRadius:8,background:T.purple+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>📊</div>
              <div>
                <div style={{ color:T.text,fontWeight:700,fontSize:14 }}>Répartition des Grades</div>
                <div style={{ color:T.muted,fontSize:12 }}>{membres.length} membres au total</div>
              </div>
            </div>
            {gradeDist.map(g => {
              const pct = membres.length ? Math.round(g.count/membres.length*100) : 0;
              return (
                <div key={g.grade} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                    <span style={{ color:GRADE_COLORS[g.grade]||T.muted,fontWeight:600,fontSize:13 }}>{g.grade}</span>
                    <span style={{ color:T.muted,fontSize:12 }}>{g.count} · {pct}%</span>
                  </div>
                  <div style={{ height:6,background:"#1a1a1a",borderRadius:4,overflow:"hidden" }}>
                    <div style={{ width:`${pct}%`,height:"100%",background:GRADE_COLORS[g.grade]||T.muted,borderRadius:4 }}/>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop:14,borderTop:`1px solid ${T.border}`,paddingTop:12 }}>
              <div style={{ color:T.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8 }}>HIÉRARCHIE ADMIN</div>
              {membres.filter(m=>m.isAdmin).map(m => (
                <div key={m.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 0" }}>
                  <Av init={m.init} color={m.color} size={28} square/>
                  <span style={{ color:T.text,fontSize:13,flex:1 }}>{m.nomRP}</span>
                  <Tag text="Admin" color={T.orange}/>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE COTAS
// ═══════════════════════════════════════════════════════════════
function PageCotas({ cotas, setCotas, me }) {
  const [tab,setTab]   = useState("soumettre");
  const [form,setForm] = useState({ type:"", montant:"", materiel:"", desc:"", proof:null });
  const [ok,setOk]     = useState(false);
  const fileRef = useRef();

  const valides  = cotas.filter(c=>c.status==="validée").length;
  const attente  = cotas.filter(c=>c.status==="en attente").length;
  const rejetes  = cotas.filter(c=>c.status==="rejetée").length;
  const totalVal = cotas.filter(c=>c.status==="validée").reduce((a,c)=>a+c.montant,0);

  const submit = () => {
    if (!form.type||!form.montant||!form.desc) return;
    const pts = COTA_PTS[form.type]||100;
    const doSave = (dataUrl) => {
      setCotas(p => [{
        id:Date.now(), joueur:me.nomRP, init:me.init, grade:me.grade,
        type:form.type, montant:Number(form.montant),
        matériel:form.materiel||"—", img:"#1a2a1a",
        proofDataUrl: dataUrl||null,
        status:"en attente", desc:form.desc, proof:form.proof||"", date:nowStr(), pts,
      }, ...p]);
      setOk(true); setForm({ type:"", montant:"", materiel:"", desc:"", proof:null, file:null });
      setTimeout(()=>setOk(false),2000);
    };
    if (form.file) {
      const reader = new FileReader();
      reader.onload = e => doSave(e.target.result);
      reader.readAsDataURL(form.file);
    } else {
      doSave(null);
    }
  };

  const decide = (id,status) => setCotas(p=>p.map(c=>c.id===id?{...c,status}:c));
  const del    = (id)         => setCotas(p=>p.filter(c=>c.id!==id));

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between" }}>
        <div>
          <div style={{ color:T.text,fontWeight:900,fontSize:24 }}>Cotas</div>
          <div style={{ color:T.muted,fontSize:13 }}>Soumission et gestion des cotas d'organisation</div>
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <Tag text={`✓ ${valides} validées`}    color={T.green}/>
          <Tag text={`⏳ ${attente} en attente`} color={T.yellow}/>
          <Tag text={`✕ ${rejetes} rejetées`}   color={T.red}/>
        </div>
      </div>

      <div style={{ display:"flex",gap:4 }}>
        <button onClick={()=>setTab("soumettre")} style={{ padding:"9px 18px",borderRadius:8,border:`1px solid ${tab==="soumettre"?T.border2:T.border}`,background:tab==="soumettre"?"#1f1f1f":"transparent",color:tab==="soumettre"?T.text:T.muted,fontWeight:600,fontSize:13,cursor:"pointer" }}>◎ Soumettre un Cota</button>
        {me.isAdmin && <button onClick={()=>setTab("admin")} style={{ padding:"9px 18px",borderRadius:8,border:`1px solid ${tab==="admin"?T.orange:T.border}`,background:tab==="admin"?T.orange+"22":"transparent",color:tab==="admin"?T.orange:T.muted,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
          🛡 Vue Admin {attente>0&&<span style={{ background:T.orange,color:"#fff",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700 }}>{attente}</span>}
        </button>}
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12 }}>
        {[
          { icon:"✓",label:"VALIDÉES",    val:valides,           color:T.green,  bg:T.greenD  },
          { icon:"⏳",label:"EN ATTENTE", val:attente,           color:T.yellow, bg:T.yellowD },
          { icon:"✕",label:"REJETÉES",    val:rejetes,           color:T.red,    bg:T.redD    },
          { icon:"$",label:"TOTAL VALIDÉ",val:`${fmt(totalVal)} $`,color:T.green,bg:T.greenD  },
        ].map((s,i) => (
          <div key={i} style={{ background:s.bg+"44",border:`1px solid ${s.color}33`,borderRadius:12,padding:"16px 18px",display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:36,height:36,borderRadius:8,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",color:s.color,fontSize:16,fontWeight:700 }}>{s.icon}</div>
            <div>
              <div style={{ color:T.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1 }}>{s.label}</div>
              <div style={{ color:T.text,fontWeight:900,fontSize:22 }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {tab==="soumettre" && (
        <Panel>
          <div style={{ color:T.text,fontWeight:700,fontSize:15,marginBottom:16 }}>Soumettre un Cota</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Field label="Type"><Sel value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}><option value="">— Sélectionner —</option>{COTA_TYPES.map(ct=><option key={ct}>{ct}</option>)}</Sel></Field>
            <Field label="Montant ($)"><Inp type="number" value={form.montant} onChange={e=>setForm(p=>({...p,montant:e.target.value}))} placeholder="Ex: 85000"/></Field>
            <Field label="Matériel utilisé"><Inp value={form.materiel} onChange={e=>setForm(p=>({...p,materiel:e.target.value}))} placeholder="Ex: Kit Drogue x2"/></Field>
            <Field label="Preuve photo / vidéo">
              <div onClick={()=>fileRef.current.click()} style={{ background:"#0f0f0f",border:`1px dashed ${form.proof?T.green:T.border2}`,borderRadius:8,padding:"10px 14px",cursor:"pointer",color:form.proof?T.green:T.muted,fontSize:13 }}>
                {form.proof ? "✓ "+form.proof : "📎 Ajouter une preuve"}
                <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={e=>{const f=e.target.files[0]; if(f) setForm(p=>({...p,proof:f.name,file:f}));}}/>
              </div>
            </Field>
            <Field label="Description" style={{ gridColumn:"1/-1" }}>
              <textarea value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} placeholder="Décrivez le cota : lieu, déroulement, résultat…" style={{ background:"#0f0f0f",border:`1px solid ${T.border2}`,color:T.text,borderRadius:8,padding:"10px 14px",fontSize:13,resize:"vertical",minHeight:80,width:"100%",boxSizing:"border-box" }}/>
            </Field>
          </div>
          <div style={{ marginTop:14,display:"flex",gap:10,alignItems:"center" }}>
            <Btn onClick={submit} disabled={!form.type||!form.montant||!form.desc} color={ok?T.green:T.orange}>{ok?"✓ Soumis !":"📤 Soumettre"}</Btn>
            {(!form.type||!form.montant||!form.desc) && <span style={{ color:T.muted,fontSize:12 }}>Remplissez tous les champs obligatoires</span>}
          </div>
        </Panel>
      )}

      {/* Grid cotas */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
        {cotas.filter(c => tab==="admin" || c.joueur===me.nomRP).length === 0
          ? <div style={{ gridColumn:"1/-1" }}><Empty icon="📋" text={tab==="admin"?"Aucun cota soumis par les membres.":"Vous n'avez pas encore soumis de cota."}/></div>
          : cotas.filter(c => tab==="admin" || c.joueur===me.nomRP).map(c => {
              const col = c.status==="validée"?T.green:c.status==="rejetée"?T.red:T.yellow;
              return (
                <div key={c.id} style={{ background:T.card,borderRadius:14,overflow:"hidden",border:`1px solid ${T.border}` }}>
                  <div style={{ height:110, background:c.img, position:"relative", display:"flex", alignItems:"flex-end",
                    backgroundImage: c.proofDataUrl ? `url(${c.proofDataUrl})` : undefined,
                    backgroundSize:"cover", backgroundPosition:"center" }}>
                    <div style={{ position:"absolute",top:10,left:10 }}><span style={{ background:col,color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,textTransform:"uppercase" }}>{c.status}</span></div>
                    <div style={{ position:"absolute",top:10,right:10 }}><Tag text={c.type} color={T.orange}/></div>
                    <div style={{ padding:"8px 14px",background:"linear-gradient(transparent,#000a)", width:"100%" }}><div style={{ color:T.green,fontWeight:900,fontSize:16 }}>+{fmt(c.montant)} $</div></div>
                  </div>
                  <div style={{ padding:"12px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                      <Av init={c.init} size={28} color={GRADE_COLORS[c.grade]||"#374151"} square/>
                      <div><div style={{ color:T.text,fontWeight:700,fontSize:13 }}>{c.joueur}</div><div style={{ color:T.muted,fontSize:11 }}>{c.grade}</div></div>
                      <div style={{ marginLeft:"auto",color:T.muted,fontSize:10 }}>🕐 {c.date}</div>
                    </div>
                    {c.desc && <div style={{ color:T.muted,fontSize:12,marginBottom:8 }}>💬 {c.desc}</div>}
                    {c.proof && <div style={{ color:"#444",fontSize:11,marginBottom:8 }}>📎 {c.proof}</div>}
                    <div style={{ display:"flex",gap:6,marginTop:6,flexWrap:"wrap" }}>
                      {tab==="admin"&&c.status==="en attente"&&<>
                        <Btn onClick={()=>decide(c.id,"validée")} color={T.green} small>✓ Valider</Btn>
                        <Btn onClick={()=>decide(c.id,"rejetée")} color={T.red} outline small>✕ Rejeter</Btn>
                      </>}
                      {(me.isAdmin||c.joueur===me.nomRP) && <Btn onClick={()=>del(c.id)} color={T.red} small>🗑</Btn>}
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE CLIPS
// ═══════════════════════════════════════════════════════════════
function PageClips({ clips, setClips, me }) {
  const [titre,setTitre] = useState("");
  const [file,setFile]   = useState(null);
  const fileRef = useRef();

  const deposit = () => {
    if (!titre||!file) return;
    const ext  = file.name.split(".").pop().toUpperCase();
    const type = ["MP4","MOV","AVI"].includes(ext) ? "VIDEO" : "IMAGE";
    setClips(p => [{
      id:Date.now(), titre, auteur:me.nomRP,
      size: (file.size/1024/1024).toFixed(1)+" MB",
      type, img:"#0a1a2a",
    }, ...p]);
    setTitre(""); setFile(null);
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div>
        <div style={{ color:T.text,fontWeight:900,fontSize:24 }}>Dépôt Clips & Preuves</div>
        <div style={{ color:T.muted,fontSize:13 }}>Upload de preuves, clips et documents de cotas</div>
      </div>
      <Panel>
        <Field label="Titre du clip / preuve">
          <Inp value={titre} onChange={e=>setTitre(e.target.value)} placeholder="Ex: Cota #150 - Braquage Banque"/>
        </Field>
        <div onClick={()=>fileRef.current.click()} style={{ marginTop:12,border:`1px dashed ${file?T.green:T.border2}`,borderRadius:12,padding:"36px",textAlign:"center",cursor:"pointer",background:"#0f0f0f" }}>
          <div style={{ fontSize:36,marginBottom:8 }}>☁️</div>
          <div style={{ color:T.muted2,fontSize:14 }}>Glisser-déposer ou cliquer pour uploader</div>
          <div style={{ color:T.muted,fontSize:12,marginTop:4 }}>Vidéo, Image, Preuve — Max 500 MB</div>
          {file && <div style={{ color:T.green,fontWeight:600,marginTop:8 }}>✓ {file.name}</div>}
          <input ref={fileRef} type="file" style={{ display:"none" }} onChange={e=>setFile(e.target.files[0]||null)}/>
        </div>
        <div style={{ marginTop:14 }}>
          <Btn onClick={deposit} disabled={!titre||!file} color={T.cyan}>☁ Déposer le Clip</Btn>
        </div>
      </Panel>

      <div>
        <div style={{ color:T.text,fontWeight:700,fontSize:16,marginBottom:16 }}>Clips Déposés ({clips.length})</div>
        {clips.length===0
          ? <Empty icon="🎬" text="Aucun clip déposé pour l'instant."/>
          : <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
              {clips.map(cl => (
                <div key={cl.id} style={{ background:T.card,borderRadius:12,overflow:"hidden",border:`1px solid ${T.border}` }}>
                  <div style={{ height:120,background:cl.img,position:"relative",display:"flex",alignItems:"flex-start",justifyContent:"flex-end",padding:10 }}>
                    <Tag text={cl.type} color={cl.type==="VIDEO"?T.cyan:T.orange}/>
                  </div>
                  <div style={{ padding:"12px 14px" }}>
                    <div style={{ color:T.text,fontWeight:700,fontSize:13,marginBottom:4 }}>{cl.titre}</div>
                    <div style={{ color:T.muted,fontSize:12 }}>{cl.auteur} · {cl.size}</div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE RAPPORT
// ═══════════════════════════════════════════════════════════════
function PageRapport({ rapports, setRapports, me }) {
  const [desc,setDesc] = useState("");
  const submit = () => {
    if (desc.trim().length<10) return;
    setRapports(p=>[{ id:Date.now(),auteur:me.nomRP,init:me.init,date:nowStr(),texte:desc,lu:false },...p]);
    setDesc("");
  };
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div>
        <div style={{ color:T.text,fontWeight:900,fontSize:24 }}>Rapport d'Incident</div>
        <div style={{ color:T.muted,fontSize:13 }}>Signalement confidentiel — Visible uniquement par les admins</div>
      </div>
      <Panel>
        <div style={{ color:T.text,fontWeight:700,fontSize:15,marginBottom:14 }}>🚨 Soumettre un Rapport</div>
        <Field label="Description de l'incident">
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} maxLength={500} placeholder="Décrivez l'incident en détail : lieu, heure, personnes impliquées, déroulement…" style={{ background:"#0f0f0f",border:`1px solid ${T.border2}`,color:T.text,borderRadius:8,padding:"14px",fontSize:13,resize:"vertical",minHeight:140,width:"100%",boxSizing:"border-box" }}/>
          <div style={{ display:"flex",justifyContent:"space-between" }}>
            <div style={{ color:T.muted,fontSize:12 }}>Rapport confidentiel — lecture admin uniquement</div>
            <div style={{ color:T.muted,fontSize:12 }}>{desc.length}/500</div>
          </div>
        </Field>
        <div style={{ marginTop:12 }}>
          <Btn onClick={submit} disabled={desc.trim().length<10} color={T.orange}>📤 Soumettre le Rapport</Btn>
        </div>
      </Panel>
      <div>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
          <div style={{ color:T.text,fontWeight:700,fontSize:16 }}>Rapports</div>
          {me.isAdmin && <Tag text="Vue Admin" color={T.orange}/>}
        </div>
        {(me.isAdmin ? rapports : rapports.filter(r=>r.auteur===me.nomRP)).length === 0
          ? <Empty icon="📋" text="Aucun rapport."/>
          : (me.isAdmin ? rapports : rapports.filter(r=>r.auteur===me.nomRP)).map(r=>(
              <div key={r.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px",marginBottom:10,display:"flex",gap:14 }}>
                <div style={{ width:36,height:36,borderRadius:8,background:"#7c3a10",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>⚠</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:T.text,fontWeight:700,fontSize:13 }}>{r.auteur}</div>
                  <div style={{ color:T.muted,fontSize:11,marginBottom:8 }}>{r.date}</div>
                  <div style={{ color:T.muted2,fontSize:13,lineHeight:1.6 }}>{r.texte}</div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,flexShrink:0 }}>
                  <Tag text={r.lu?"Lu":"Incident"} color={r.lu?T.muted:T.red}/>
                  {me.isAdmin&&!r.lu&&<button onClick={()=>setRapports(p=>p.map(x=>x.id===r.id?{...x,lu:true}:x))} style={{ background:"transparent",border:`1px solid ${T.green}`,color:T.green,borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer" }}>✓ Marquer lu</button>}
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE RADIO
// ═══════════════════════════════════════════════════════════════
function PageRadio({ radio, setRadio, me }) {
  const [editing,setEditing] = useState(false);
  const [tmp,setTmp]         = useState("");
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div>
        <div style={{ color:T.text,fontWeight:900,fontSize:24 }}>Radio Organisation</div>
        <div style={{ color:T.muted,fontSize:13 }}>Canal de communication sécurisé — Los Malditas 14</div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 380px",gap:16 }}>
        <Panel style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300 }}>
          <div style={{ width:100,height:100,borderRadius:"50%",background:`radial-gradient(circle,${T.cyanD},#0a0a0a)`,border:`2px solid ${T.cyan}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:20,boxShadow:`0 0 40px ${T.cyan}33` }}>📻</div>
          <div style={{ color:T.muted,fontSize:12,textTransform:"uppercase",letterSpacing:2,marginBottom:8 }}>FRÉQUENCE ACTIVE</div>
          <div style={{ color:T.cyan,fontWeight:900,fontSize:52,fontFamily:"monospace" }}>{radio}</div>
          <div style={{ color:T.muted,fontSize:16,marginBottom:16 }}>MHz</div>
          <div style={{ background:T.greenD,borderRadius:20,padding:"5px 16px",display:"flex",alignItems:"center",gap:6,marginBottom:20 }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:T.green }}/><span style={{ color:T.green,fontWeight:700,fontSize:12 }}>CANAL ACTIF</span>
          </div>
          <div style={{ width:"100%",height:60,display:"flex",alignItems:"center",gap:1 }}>
            {Array.from({length:60}).map((_,i)=>(
              <div key={i} style={{ flex:1,height:`${20+Math.sin(i*0.3)*40+Math.cos(i*0.7)*20}%`,minHeight:4,background:`linear-gradient(to top,${T.purple},${T.cyan})`,borderRadius:2,opacity:0.8 }}/>
            ))}
          </div>
        </Panel>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <Panel>
            <div style={{ color:T.text,fontWeight:700,fontSize:15,marginBottom:14 }}>Informations Canal</div>
            {[
              { icon:"📻",label:"Fréquence principale",val:`${radio} MHz`,color:T.cyan },
              { icon:"🛡", label:"Fréquence secours",   val:"152.400 MHz", color:T.purple },
              { icon:"🔒",label:"Cryptage",             val:"AES-256 actif",color:T.green },
              { icon:"📍",label:"Portée estimée",       val:"Toute la map", color:T.orange },
            ].map((r,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderTop:`1px solid ${T.border}` }}>
                <div style={{ width:32,height:32,borderRadius:8,background:"#1f1f1f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>{r.icon}</div>
                <div><div style={{ color:T.muted,fontSize:11 }}>{r.label}</div><div style={{ color:r.color,fontWeight:700,fontSize:13 }}>{r.val}</div></div>
              </div>
            ))}
          </Panel>
          {me.isAdmin && (
            <Panel>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
                <span style={{ color:T.orange }}>🛡</span>
                <div style={{ color:T.text,fontWeight:700,fontSize:14 }}>Modifier Fréquence</div>
                <Tag text="Admin" color={T.orange}/>
              </div>
              {!editing
                ? <Btn onClick={()=>{setEditing(true);setTmp(radio);}} color="#1f1f1f" outline>✏ Changer la fréquence</Btn>
                : <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                    <Inp value={tmp} onChange={e=>setTmp(e.target.value)} placeholder="Ex: 147.850"/>
                    <div style={{ display:"flex",gap:8 }}>
                      <Btn onClick={()=>{setRadio(tmp);setEditing(false);}} color={T.green} small>✓ Confirmer</Btn>
                      <Btn onClick={()=>setEditing(false)} color={T.muted} outline small>Annuler</Btn>
                    </div>
                  </div>
              }
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE OUTILAGE
// ═══════════════════════════════════════════════════════════════
function PageOutilage({ tools, setTools, accounts, me }) {
  const [showForm,setShowForm] = useState(false);
  const [form,setForm]         = useState({ name:"", joueur:"", qte:1 });
  const iconMap  = { "Hack ATM":"💻","Disqueuse":"🔧","Disqueuse Pro":"🔧","Kit Drogue":"🌿","Kit Drogue Premium":"🌿","Outils Braquage":"🔑","Matériel Divers":"📦" };
  const colorMap = { "Hack ATM":T.cyan,"Disqueuse":T.purple,"Disqueuse Pro":T.purple,"Kit Drogue":T.green,"Kit Drogue Premium":T.green,"Outils Braquage":T.orange,"Matériel Divers":T.yellow };

  const membres = accounts.filter(a=>a.approved&&!a.banned);

  const add = () => {
    if (!form.name||!form.joueur) return;
    setTools(p=>[...p,{ id:Date.now(),name:form.name,icon:iconMap[form.name]||"📦",color:colorMap[form.name]||T.yellow,joueur:form.joueur,date:todayStr(),qte:Number(form.qte) }]);
    setForm({ name:"",joueur:"",qte:1 }); setShowForm(false);
  };

  const typeBase = ["Hack ATM","Disqueuse","Kit Drogue","Outils Braquage","Matériel Divers"];

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ color:T.text,fontWeight:900,fontSize:24 }}>Outilage</div>
          <div style={{ color:T.muted,fontSize:13 }}>Distribution et gestion des équipements spéciaux</div>
        </div>
        {me.isAdmin && <Btn onClick={()=>setShowForm(p=>!p)} color={T.purple}>+ Distribuer Outil</Btn>}
      </div>

      {showForm && (
        <Panel>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
            <Field label="Type d'outil"><Sel value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}><option value="">—</option>{TOOL_TYPES.map(t=><option key={t}>{t}</option>)}</Sel></Field>
            <Field label="Joueur"><Sel value={form.joueur} onChange={e=>setForm(p=>({...p,joueur:e.target.value}))}><option value="">—</option>{membres.map(a=><option key={a.id}>{a.nomRP}</option>)}</Sel></Field>
            <Field label="Quantité"><Inp type="number" value={form.qte} onChange={e=>setForm(p=>({...p,qte:e.target.value}))}/></Field>
          </div>
          <div style={{ marginTop:12,display:"flex",gap:8 }}>
            <Btn onClick={add} disabled={!form.name||!form.joueur} color={T.purple}>✓ Distribuer</Btn>
            <Btn onClick={()=>setShowForm(false)} color={T.muted} outline>Annuler</Btn>
          </div>
        </Panel>
      )}

      <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12 }}>
        {typeBase.map(n => {
          const cnt = tools.filter(t=>t.name.startsWith(n.split(" ")[0])).reduce((a,t)=>a+t.qte,0);
          return (
            <div key={n} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px",textAlign:"center" }}>
              <div style={{ width:40,height:40,borderRadius:10,background:(colorMap[n]||T.yellow)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,margin:"0 auto 8px" }}>{iconMap[n]||"📦"}</div>
              <div style={{ color:T.text,fontWeight:900,fontSize:22 }}>{cnt}</div>
              <div style={{ color:T.muted,fontSize:11 }}>{n}</div>
            </div>
          );
        })}
      </div>

      {tools.length===0
        ? <Empty icon="🔧" text="Aucun outil distribué pour l'instant."/>
        : <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
            {tools.map(t=>(
              <div key={t.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px",position:"relative" }}>
                {me.isAdmin && <button onClick={()=>setTools(p=>p.filter(x=>x.id!==t.id))} style={{ position:"absolute",top:10,right:10,background:T.redD,color:T.red,border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:14 }}>🗑️</button>}
                <div style={{ position:"absolute",top:12,right:me.isAdmin?46:12,color:T.red,fontWeight:800,fontSize:14 }}>x{t.qte}</div>
                <div style={{ width:48,height:48,borderRadius:12,background:t.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:12 }}>{t.icon}</div>
                <div style={{ color:T.text,fontWeight:700,fontSize:14,marginBottom:8 }}>{t.name}</div>
                <div style={{ color:T.muted,fontSize:12 }}>👤 {t.joueur}</div>
                <div style={{ color:T.muted,fontSize:12,marginTop:4 }}>📅 {t.date}</div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE ATTRIBUTION ARMES
// ═══════════════════════════════════════════════════════════════
function PageAttribution({ weapons, setWeapons, accounts, me }) {
  const [showForm,setShowForm] = useState(false);
  const [form,setForm]         = useState({ name:"", serie:"", joueur:"" });
  const membres = accounts.filter(a=>a.approved&&!a.banned);

  const add = () => {
    if (!form.name||!form.serie||!form.joueur) return;
    setWeapons(p=>[...p,{ id:Date.now(),name:form.name,serie:form.serie,joueur:form.joueur,date:todayStr() }]);
    setForm({ name:"",serie:"",joueur:"" }); setShowForm(false);
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ color:T.text,fontWeight:900,fontSize:24 }}>Attribution Armes</div>
          <div style={{ color:T.muted,fontSize:13 }}>Gestion et traçabilité des armes de l'organisation</div>
        </div>
        {me.isAdmin && <Btn onClick={()=>setShowForm(p=>!p)} color={T.orange}>+ Attribuer Arme</Btn>}
      </div>

      {showForm && (
        <Panel>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
            <Field label="Nom de l'arme"><Inp value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Ex: Pistolet MK2"/></Field>
            <Field label="Numéro de série"><Inp value={form.serie} onChange={e=>setForm(p=>({...p,serie:e.target.value}))} placeholder="Ex: LM14-MK2-00001"/></Field>
            <Field label="Joueur"><Sel value={form.joueur} onChange={e=>setForm(p=>({...p,joueur:e.target.value}))}><option value="">—</option>{membres.map(a=><option key={a.id}>{a.nomRP}</option>)}</Sel></Field>
          </div>
          <div style={{ marginTop:12,display:"flex",gap:8 }}>
            <Btn onClick={add} disabled={!form.name||!form.serie||!form.joueur} color={T.orange}>✓ Attribuer</Btn>
            <Btn onClick={()=>setShowForm(false)} color={T.muted} outline>Annuler</Btn>
          </div>
        </Panel>
      )}

      {weapons.length===0
        ? <Empty icon="🔫" text="Aucune arme attribuée pour l'instant."/>
        : <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
            {weapons.map(w=>(
              <div key={w.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"20px",position:"relative" }}>
                {me.isAdmin && <button onClick={()=>setWeapons(p=>p.filter(x=>x.id!==w.id))} style={{ position:"absolute",top:12,right:12,background:T.redD,color:T.red,border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:14 }}>🗑️</button>}
                <div style={{ width:48,height:48,borderRadius:12,background:"#7c3a1088",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14 }}>🎯</div>
                <div style={{ color:T.text,fontWeight:700,fontSize:15,marginBottom:8 }}>{w.name}</div>
                <div style={{ color:T.muted,fontSize:12,marginBottom:2 }}>Série</div>
                <div style={{ color:T.yellow,fontWeight:700,fontSize:13,fontFamily:"monospace",marginBottom:10 }}>{w.serie}</div>
                <div style={{ color:T.muted,fontSize:12 }}>Joueur</div>
                <div style={{ color:T.text,fontWeight:600,fontSize:13,marginBottom:4 }}>{w.joueur}</div>
                <div style={{ color:T.muted,fontSize:12 }}>Date · {w.date}</div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE COMPTABILITÉ
// ═══════════════════════════════════════════════════════════════
function PageCompta({ compta, setCompta, fondsOrg, setFondsOrg, me }) {
  const [showForm,setShowForm] = useState(false);
  const [form,setForm]         = useState({ type:"credit", motif:"", montant:"", par:me.nomRP });

  const gains    = compta.filter(c=>c.type==="credit").reduce((a,c)=>a+c.montant,0);
  const retraits = compta.filter(c=>c.type==="debit").reduce((a,c)=>a+c.montant,0);

  const add = () => {
    if (!form.motif||!form.montant) return;
    const d = new Date();
    const entry = {
      id:Date.now(), type:form.type, motif:form.motif,
      montant:Number(form.montant), par:form.par,
      date:todayStr(),
      heure:`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`,
    };
    setCompta(p=>[entry,...p]);
    // FIX CORRECT : credit = ajoute, debit = soustrait
    setFondsOrg(p => form.type==="credit" ? p + Number(form.montant) : p - Number(form.montant));
    setForm({ type:"credit",motif:"",montant:"",par:me.nomRP }); setShowForm(false);
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ color:T.text,fontWeight:900,fontSize:24 }}>Comptabilité</div>
          <div style={{ color:T.muted,fontSize:13 }}>Gestion financière de l'organisation — Admin uniquement</div>
        </div>
        {me.isAdmin && <Btn onClick={()=>setShowForm(p=>!p)} color={T.orange}>+ Nouvelle Transaction</Btn>}
      </div>

      {showForm && (
        <Panel>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12 }}>
            <Field label="Type">
              <Sel value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                <option value="credit">+ Dépôt / Gain</option>
                <option value="debit">- Retrait / Dépense</option>
              </Sel>
            </Field>
            <Field label="Montant ($)"><Inp type="number" value={form.montant} onChange={e=>setForm(p=>({...p,montant:e.target.value}))} placeholder="Ex: 500000"/></Field>
            <Field label="Responsable"><Inp value={form.par} onChange={e=>setForm(p=>({...p,par:e.target.value}))}/></Field>
            <Field label="Motif"><Inp value={form.motif} onChange={e=>setForm(p=>({...p,motif:e.target.value}))} placeholder="Ex: Braquage banque"/></Field>
          </div>
          <div style={{ marginTop:12,display:"flex",gap:8 }}>
            <Btn onClick={add} disabled={!form.motif||!form.montant} color={T.orange}>✓ Enregistrer</Btn>
            <Btn onClick={()=>setShowForm(false)} color={T.muted} outline>Annuler</Btn>
          </div>
        </Panel>
      )}

      <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:16 }}>
        <Panel style={{ background:"linear-gradient(135deg,#0a2a0a,#111)" }}>
          <div style={{ color:T.muted,fontSize:13,marginBottom:4 }}>Fonds Total Organisation</div>
          <div style={{ color:fondsOrg>=0?T.green:T.red,fontWeight:900,fontSize:36 }}>{fondsOrg>=0?"+":""}{fmt(fondsOrg)} $</div>
          <div style={{ color:fondsOrg>=0?T.green:T.red,fontSize:12,marginTop:6 }}>{fondsOrg>=0?"📈 Solde positif":"📉 Solde négatif"}</div>
        </Panel>
        <Panel>
          <div style={{ color:T.muted,fontSize:13,marginBottom:4 }}>Total Gains</div>
          <div style={{ color:T.green,fontWeight:900,fontSize:24 }}>+{fmt(gains)} $</div>
          <div style={{ color:T.muted,fontSize:11,marginTop:4 }}>{compta.filter(c=>c.type==="credit").length} dépôts</div>
        </Panel>
        <Panel>
          <div style={{ color:T.muted,fontSize:13,marginBottom:4 }}>Total Retraits</div>
          <div style={{ color:T.red,fontWeight:900,fontSize:24 }}>-{fmt(retraits)} $</div>
          <div style={{ color:T.muted,fontSize:11,marginTop:4 }}>{compta.filter(c=>c.type==="debit").length} retraits</div>
        </Panel>
      </div>

      <Panel>
        <div style={{ color:T.text,fontWeight:700,fontSize:16,marginBottom:16 }}>Historique des Transactions</div>
        {compta.length===0
          ? <Empty icon="💰" text="Aucune transaction enregistrée."/>
          : compta.map(c=>(
              <div key={c.id} style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderTop:`1px solid ${T.border}` }}>
                <div style={{ width:36,height:36,borderRadius:"50%",background:c.type==="credit"?T.greenD:T.redD,display:"flex",alignItems:"center",justifyContent:"center",color:c.type==="credit"?T.green:T.red,fontSize:16,flexShrink:0,fontWeight:700 }}>{c.type==="credit"?"↑":"↓"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:T.text,fontWeight:600,fontSize:13 }}>{c.motif}</div>
                  <div style={{ display:"flex",gap:12,marginTop:2 }}>
                    <span style={{ color:T.muted,fontSize:12 }}>👤 {c.par}</span>
                    <span style={{ color:T.muted,fontSize:12 }}>📅 {c.date}</span>
                    <span style={{ color:T.muted,fontSize:12 }}>🕐 {c.heure}</span>
                  </div>
                </div>
                <div style={{ color:c.type==="credit"?T.green:T.red,fontWeight:800,fontSize:16,fontFamily:"monospace" }}>
                  {c.type==="credit"?"+":"-"}{fmt(c.montant)} $
                </div>
              </div>
            ))
        }
      </Panel>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE COFFRE PERSONNEL
// ═══════════════════════════════════════════════════════════════
function PageCoffre({ weapons, tools, accounts, me }) {
  const [sel,setSel] = useState(me.nomRP);
  const display  = me.isAdmin ? sel : me.nomRP;
  const m        = accounts.find(a=>a.nomRP===display)||me;
  const myW      = weapons.filter(w=>w.joueur===display);
  const myT      = tools.filter(t=>t.joueur===display);
  const membres  = accounts.filter(a=>a.approved&&!a.banned);

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ color:T.text,fontWeight:900,fontSize:24 }}>Coffre Personnel</div>
          <div style={{ color:T.muted,fontSize:13 }}>Inventaire sécurisé — visible uniquement par vous et l'admin</div>
        </div>
        {me.isAdmin && (
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ color:T.muted,fontSize:13 }}>JOUEUR :</div>
            <Sel value={sel} onChange={e=>setSel(e.target.value)} style={{ width:"auto",padding:"8px 14px" }}>
              {membres.map(a=><option key={a.id}>{a.nomRP}</option>)}
            </Sel>
          </div>
        )}
      </div>

      <Panel style={{ display:"flex",alignItems:"center",gap:14 }}>
        <Av init={m.init} color={m.color} size={52} square online={m.online}/>
        <div style={{ flex:1 }}>
          <div style={{ color:T.text,fontWeight:800,fontSize:18 }}>{m.nomRP}</div>
          <div style={{ color:T.muted,fontSize:13 }}>{myW.length} arme(s) — {myT.length} outil(s)</div>
        </div>
        <div style={{ background:T.greenD,borderRadius:20,padding:"5px 14px",display:"flex",alignItems:"center",gap:6 }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:T.green }}/><span style={{ color:T.green,fontWeight:700,fontSize:12 }}>Coffre Actif</span>
        </div>
      </Panel>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <Panel>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
            <div style={{ width:28,height:28,borderRadius:6,background:"#7c3a1066",display:"flex",alignItems:"center",justifyContent:"center" }}>🎯</div>
            <div style={{ color:T.text,fontWeight:700,fontSize:15 }}>Armes ({myW.length})</div>
          </div>
          {myW.length===0
            ? <Empty icon="🔫" text="Aucune arme dans ce coffre."/>
            : myW.map(w=>(
                <div key={w.id} style={{ background:"#0f0f0f",border:`1px solid ${T.border}`,borderRadius:10,padding:"14px",marginBottom:8 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:36,height:36,borderRadius:8,background:"#7c3a1044",display:"flex",alignItems:"center",justifyContent:"center" }}>🎯</div>
                    <div>
                      <div style={{ color:T.text,fontWeight:700,fontSize:13 }}>{w.name}</div>
                      <div style={{ color:T.yellow,fontWeight:700,fontSize:12,fontFamily:"monospace" }}>{w.serie}</div>
                      <div style={{ color:T.muted,fontSize:11 }}>{w.date}</div>
                    </div>
                  </div>
                </div>
              ))
          }
        </Panel>
        <Panel>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
            <div style={{ width:28,height:28,borderRadius:6,background:T.purpleD,display:"flex",alignItems:"center",justifyContent:"center" }}>🔧</div>
            <div style={{ color:T.text,fontWeight:700,fontSize:15 }}>Outils ({myT.length})</div>
          </div>
          {myT.length===0
            ? <Empty icon="🔧" text="Aucun outil dans ce coffre."/>
            : myT.map(t=>(
                <div key={t.id} style={{ background:"#0f0f0f",border:`1px solid ${T.border}`,borderRadius:10,padding:"14px",marginBottom:8 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:36,height:36,borderRadius:8,background:t.color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{t.icon}</div>
                    <div>
                      <div style={{ color:T.text,fontWeight:700,fontSize:13 }}>{t.name}</div>
                      <div style={{ color:t.color,fontWeight:700,fontSize:12 }}>x{t.qte}</div>
                      <div style={{ color:T.muted,fontSize:11 }}>{t.date}</div>
                    </div>
                  </div>
                </div>
              ))
          }
        </Panel>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE PERMISSIONS ADMIN
// ═══════════════════════════════════════════════════════════════
const PERM_LIST = [
  { id:"members",  label:"Gérer Membres",      icon:"👥", color:T.orange },
  { id:"armes",    label:"Gérer Armes",         icon:"🎯", color:T.red    },
  { id:"outils",   label:"Gérer Outils",        icon:"🔧", color:T.purple },
  { id:"compta",   label:"Gérer Comptabilité",  icon:"💰", color:T.green  },
  { id:"radio",    label:"Gérer Radio",         icon:"📻", color:T.cyan   },
  { id:"rapports", label:"Voir Rapports",       icon:"📋", color:T.orange },
  { id:"clips",    label:"Gérer Clips",         icon:"▶",  color:T.red    },
];

function PagePermissions({ accounts, setAccounts, pendingAccounts, setPendingAccounts, recrutementOuvert, setRecrutementOuvert }) {
  const [tab,setTab]           = useState("membres");
  const [sel,setSel]           = useState(null);
  const [localPerms,setLocalPerms] = useState({});
  const [saved,setSaved]       = useState(false);

  const membres = accounts.filter(a=>a.approved&&!a.banned);
  const bannis  = accounts.filter(a=>a.banned);
  const selFull = accounts.find(a=>a.id===sel);

  const selectMember = a => { setSel(a.id); setLocalPerms(a.perms||{}); setSaved(false); };

  const toggleAdmin = id => setAccounts(p=>p.map(a=>a.id===id
    ? { ...a, isAdmin:!a.isAdmin, perms:!a.isAdmin ? Object.fromEntries(PERM_LIST.map(pp=>[pp.id,true])) : Object.fromEntries(PERM_LIST.map(pp=>[pp.id,false])) }
    : a
  ));

  const gradeUp   = id => setAccounts(p=>p.map(a=>{ if(a.id!==id) return a; const i=GRADES.indexOf(a.grade); return i<GRADES.length-1?{...a,grade:GRADES[i+1]}:a; }));
  const gradeDown = id => setAccounts(p=>p.map(a=>{ if(a.id!==id) return a; const i=GRADES.indexOf(a.grade); return i>0?{...a,grade:GRADES[i-1]}:a; }));

  const savePerms = () => {
    setAccounts(p=>p.map(a=>a.id===sel?{...a,perms:localPerms}:a));
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  const approveReq = req => {
    const init = ((req.prenomRP||"?")[0]+(req.nomRP||"?")[0]).toUpperCase();
    const colors = ["#b45309","#15803d","#7e22ce","#0e7490","#9f1239","#4338ca","#be185d","#0f766e"];
    const newAcc = {
      id:Date.now(), username:req.username, password:req.password,
      nomRP:req.nomRP, prenomRP:req.prenomRP||req.nomRP,
      grade:"Prospecto", init, color:colors[Math.floor(Math.random()*colors.length)],
      isAdmin:false, online:false, banned:false, approved:true,
      perms:{},
    };
    setAccounts(p=>[...p,newAcc]);
    setPendingAccounts(p=>p.filter(x=>x.id!==req.id));
  };
  const rejectReq  = id => setPendingAccounts(p=>p.filter(x=>x.id!==id));
  const banAcc     = id => setAccounts(p=>p.map(a=>a.id===id?{...a,banned:true,isAdmin:false}:a));
  const unbanAcc   = id => setAccounts(p=>p.map(a=>a.id===id?{...a,banned:false}:a));
  const deleteAcc  = id => setAccounts(p=>p.filter(a=>a.id!==id));

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ color:T.text,fontWeight:900,fontSize:24 }}>Permissions Admin</div>
          <div style={{ color:T.muted,fontSize:13 }}>Gestion des accès, rôles et membres</div>
        </div>
        <button onClick={()=>setRecrutementOuvert(p=>!p)} style={{ background:recrutementOuvert?T.greenD:T.redD,color:recrutementOuvert?T.green:T.red,border:`1px solid ${recrutementOuvert?T.green:T.red}44`,borderRadius:8,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13 }}>
          {recrutementOuvert?"🟢 Recrutement ouvert":"🔴 Recrutement fermé"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
        {[
          ["membres",  `👥 Membres (${membres.length})`],
          ["demandes", `📬 Demandes${pendingAccounts.length>0?" ("+pendingAccounts.length+")":""}`],
          ["bans",     `🚫 Bannis (${bannis.length})`],
        ].map(([id,label]) => (
          <button key={id} onClick={()=>setTab(id)} style={{ padding:"9px 18px",borderRadius:8,border:`1px solid ${tab===id?T.orange:T.border}`,background:tab===id?T.orange+"22":"transparent",color:tab===id?T.orange:T.muted,fontWeight:700,fontSize:13,cursor:"pointer" }}>{label}</button>
        ))}
      </div>

      {/* DEMANDES */}
      {tab==="demandes" && (
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {pendingAccounts.length===0
            ? <Panel><Empty icon="📬" text="Aucune demande d'accès en attente."/></Panel>
            : pendingAccounts.map(req=>(
                <Panel key={req.id} style={{ display:"flex",alignItems:"center",gap:16 }}>
                  <Av init={((req.prenomRP||"?")[0]+(req.nomRP||"?")[0]).toUpperCase()} color="#374151" size={44} square/>
                  <div style={{ flex:1 }}>
                    <div style={{ color:T.text,fontWeight:700,fontSize:15 }}>{req.nomRP}</div>
                    <div style={{ color:T.muted,fontSize:12 }}>@{req.username} · {req.date}</div>
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    <Btn onClick={()=>approveReq(req)} color={T.green} small>✓ Accepter</Btn>
                    <Btn onClick={()=>rejectReq(req.id)} color={T.red} outline small>✕ Refuser</Btn>
                  </div>
                </Panel>
              ))
          }
        </div>
      )}

      {/* BANNIS */}
      {tab==="bans" && (
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {bannis.length===0
            ? <Panel><Empty icon="🚫" text="Aucun compte banni."/></Panel>
            : bannis.map(a=>(
                <Panel key={a.id} style={{ display:"flex",alignItems:"center",gap:16 }}>
                  <Av init={a.init} color="#555" size={44} square/>
                  <div style={{ flex:1 }}>
                    <div style={{ color:T.muted,fontWeight:700,fontSize:15 }}>{a.nomRP}</div>
                    <div style={{ color:T.muted,fontSize:12 }}>@{a.username} · {a.grade}</div>
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    <Btn onClick={()=>unbanAcc(a.id)} color={T.green} small>♻ Réintégrer</Btn>
                    <Btn onClick={()=>deleteAcc(a.id)} color={T.red} small>🗑 Supprimer définitivement</Btn>
                  </div>
                </Panel>
              ))
          }
        </div>
      )}

      {/* MEMBRES */}
      {tab==="membres" && (
        <div style={{ display:"grid",gridTemplateColumns:"260px 1fr",gap:16 }}>
          <Panel style={{ padding:14 }}>
            <div style={{ color:T.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10 }}>MEMBRES</div>
            {membres.length===0
              ? <div style={{ color:T.muted,fontSize:13,textAlign:"center",padding:20 }}>Aucun membre.</div>
              : membres.map(a=>(
                  <button key={a.id} onClick={()=>selectMember(a)} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:sel===a.id?T.orange+"22":"transparent",border:`1px solid ${sel===a.id?T.orange:T.border}`,borderRadius:10,cursor:"pointer",width:"100%",textAlign:"left",marginBottom:6 }}>
                    <Av init={a.init} color={a.color} size={34} square online={a.online}/>
                    <div style={{ flex:1 }}>
                      <div style={{ color:T.text,fontWeight:700,fontSize:13 }}>{a.nomRP}</div>
                      <div style={{ color:GRADE_COLORS[a.grade]||T.muted,fontSize:11 }}>{a.grade}</div>
                    </div>
                    {a.isAdmin && <span style={{ color:T.orange,fontSize:14 }}>🛡</span>}
                  </button>
                ))
            }
          </Panel>

          <div>
            {!selFull
              ? <Panel><div style={{ color:T.muted,textAlign:"center",padding:50,fontSize:14 }}>← Sélectionnez un membre</div></Panel>
              : (
                <Panel>
                  {/* Header */}
                  <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${T.border}` }}>
                    <Av init={selFull.init} color={selFull.color} size={52} square/>
                    <div style={{ flex:1 }}>
                      <div style={{ color:T.text,fontWeight:800,fontSize:18 }}>{selFull.nomRP}</div>
                      <div style={{ color:T.muted,fontSize:13 }}>@{selFull.username}</div>
                    </div>
                    <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                      <Btn onClick={()=>toggleAdmin(selFull.id)} color={selFull.isAdmin?T.red:T.orange} small>{selFull.isAdmin?"❌ Retirer Admin":"⭐ Nommer Admin"}</Btn>
                      <Btn onClick={()=>banAcc(selFull.id)} color={T.red} outline small>🚫 Bannir</Btn>
                      <Btn onClick={()=>{ deleteAcc(selFull.id); setSel(null); }} color={T.red} small>🗑 Supprimer</Btn>
                    </div>
                  </div>

                  {/* Grade */}
                  <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:18,background:"#0f0f0f",borderRadius:10,padding:"12px 16px" }}>
                    <div style={{ color:T.muted,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1 }}>Grade :</div>
                    <div style={{ flex:1 }}>
                      <span style={{ padding:"4px 16px",borderRadius:20,background:(GRADE_COLORS[selFull.grade]||T.muted)+"22",color:GRADE_COLORS[selFull.grade]||T.muted,fontWeight:700,fontSize:14,border:`1px solid ${(GRADE_COLORS[selFull.grade]||T.muted)}44` }}>{selFull.grade}</span>
                    </div>
                    <div style={{ display:"flex",gap:8 }}>
                      <Btn onClick={()=>gradeDown(selFull.id)} color={T.red} small outline disabled={GRADES.indexOf(selFull.grade)===0}>▼ Rétrograder</Btn>
                      <Btn onClick={()=>gradeUp(selFull.id)}   color={T.green} small disabled={GRADES.indexOf(selFull.grade)===GRADES.length-1}>▲ Promouvoir</Btn>
                    </div>
                  </div>

                  {selFull.isAdmin && (
                    <div style={{ background:T.orange+"11",border:`1px solid ${T.orange}33`,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
                      <span style={{ color:T.orange }}>🛡</span>
                      <span style={{ color:T.orange,fontWeight:700,fontSize:13 }}>Administrateur — Toutes permissions actives</span>
                    </div>
                  )}

                  <div style={{ color:T.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>PERMISSIONS INDIVIDUELLES</div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
                    {PERM_LIST.map(p => {
                      const on = selFull.isAdmin || !!localPerms[p.id];
                      return (
                        <button key={p.id} onClick={()=>!selFull.isAdmin&&setLocalPerms(prev=>({...prev,[p.id]:!prev[p.id]}))} style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:on?p.color+"11":"#0f0f0f",border:`1px solid ${on?p.color+"44":T.border}`,borderRadius:10,cursor:selFull.isAdmin?"default":"pointer",textAlign:"left" }}>
                          <div style={{ width:32,height:32,borderRadius:8,background:on?p.color+"22":"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{p.icon}</div>
                          <span style={{ color:on?p.color:T.muted,fontWeight:600,fontSize:13,flex:1 }}>{p.label}</span>
                          <div style={{ width:20,height:20,borderRadius:"50%",background:on?p.color:"#1a1a1a",border:`1px solid ${on?p.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff" }}>{on?"●":""}</div>
                        </button>
                      );
                    })}
                  </div>
                  <Btn onClick={savePerms} color={saved?T.green:T.orange}>{saved?"✓ Sauvegardé !":"💾 Sauvegarder les permissions"}</Btn>
                </Panel>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [loggedIn,setLoggedIn]     = useState(false);
  const [me,setMe]                 = useState(null);
  const [page,setPage]             = useState("accueil");

  const [accounts,setAccounts]             = useState(INIT_ACCOUNTS);
  const [pendingAccounts,setPendingAccounts] = useState(INIT_PENDING);
  const [recrutementOuvert,setRecrutementOuvert] = useState(true);

  const [weapons, setWeapons]   = useState(INIT_WEAPONS);
  const [tools,   setTools]     = useState(INIT_TOOLS);
  const [cotas,   setCotas]     = useState(INIT_COTAS);
  const [compta,  setCompta]    = useState(INIT_COMPTA);
  const [rapports,setRapports]  = useState(INIT_RAPPORTS);
  const [clips,   setClips]     = useState(INIT_CLIPS);
  const [fondsOrg,setFondsOrg]  = useState(0);
  const [radio,   setRadio]     = useState("147.850");

  // Always sync me with latest account data
  const meSync = me ? (accounts.find(a=>a.id===me.id)||me) : me;

  const handleLogin  = acc => { setMe(acc); setLoggedIn(true); };
  const handleLogout = ()  => { setMe(null); setLoggedIn(false); setPage("accueil"); };

  const unreadRapports = rapports.filter(r=>!r.lu).length;

  if (!loggedIn) return (
    <LoginPage
      accounts={accounts} setAccounts={setAccounts}
      pendingAccounts={pendingAccounts} setPendingAccounts={setPendingAccounts}
      recrutementOuvert={recrutementOuvert}
      onLogin={handleLogin}
    />
  );

  const renderPage = () => {
    switch (page) {
      case "accueil":      return <PageAccueil accounts={accounts} weapons={weapons} tools={tools} cotas={cotas} compta={compta} radio={radio}/>;
      case "cotas":        return <PageCotas cotas={cotas} setCotas={setCotas} me={meSync}/>;
      case "classement":   return <PageClassement accounts={accounts} cotas={cotas}/>;
      case "clips":        return <PageClips clips={clips} setClips={setClips} me={meSync}/>;
      case "rapport":      return <PageRapport rapports={rapports} setRapports={setRapports} me={meSync}/>;
      case "radio":        return <PageRadio radio={radio} setRadio={setRadio} me={meSync}/>;
      case "outilage":     return <PageOutilage tools={tools} setTools={setTools} accounts={accounts} me={meSync}/>;
      case "attribution":  return <PageAttribution weapons={weapons} setWeapons={setWeapons} accounts={accounts} me={meSync}/>;
      case "comptabilite": return <PageCompta compta={compta} setCompta={setCompta} fondsOrg={fondsOrg} setFondsOrg={setFondsOrg} me={meSync}/>;
      case "coffre":       return <PageCoffre weapons={weapons} tools={tools} accounts={accounts} me={meSync}/>;
      case "permissions":  return <PagePermissions accounts={accounts} setAccounts={setAccounts} pendingAccounts={pendingAccounts} setPendingAccounts={setPendingAccounts} recrutementOuvert={recrutementOuvert} setRecrutementOuvert={setRecrutementOuvert}/>;
      default: return null;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.bg, color:"#fff", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <Sidebar page={page} setPage={setPage} me={meSync} pendingCount={pendingAccounts.length} unreadRapports={unreadRapports} isAdmin={meSync?.isAdmin||false}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <TopBar me={meSync} fondsOrg={fondsOrg} onLogout={handleLogout}/>
        <div style={{ flex:1, padding:"24px", overflowY:"auto" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
