import { useState } from "react";

const LANGS = [
  { code: "english",   native: "English", english: "English", flag: "🌐" },
  { code: "german",    native: "Deutsch", english: "German", flag: "🇩🇪" },
  { code: "french",    native: "Français", english: "French", flag: "French" },
  { code: "spanish",   native: "Español", english: "Spanish", flag: "🇪🇸" },
  { code: "italian",   native: "Italiano", english: "Italian", flag: "🇮🇹" },
  { code: "russian",   native: "Pусский", english: "Russian", flag: "🇷🇺" },
];

export default function LangSelect({ lang: initLang, onSelect }) {
  const [selected, setSelected] = useState(initLang || "english");

  return (
    <div className="page" style={{ background: "#0a0612", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.04, backgroundImage: "url('/src/assets/tamil_bg.png')", backgroundSize: "cover", zIndex: 0, pointerEvents: "none" }}/>

      <div style={{ position: "relative", zIndex: 1, padding: "24px 20px 40px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 420, margin: "0 auto", width: "100%" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", animation: "slideUp 0.6s var(--ease-spring)" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
            <div style={{ position: "absolute", inset: -10, background: "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)", borderRadius: "50%", animation: "pulseGold 3s infinite" }} />
            <img src="/mascot.png" alt="Mascot" style={{ width: 100, height: 100, objectFit: "contain", position: "relative", zIndex: 1, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))" }} />
          </div>
          <h1 className="heading-lg" style={{ color: "#fff" }}>Language Selection</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6, fontWeight: 500, lineHeight: 1.5 }}>
            Pick a language to translate words into. <br/> You will learn Tamil using this bridge.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid-2" style={{ gap: 12 }}>
          {LANGS.map((l, i) => (
            <button key={l.code}
              onClick={() => setSelected(l.code)}
              className="card-glass hover-lift"
              style={{
                padding: "20px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.3s var(--ease-spring)",
                cursor: "pointer",
                position: "relative",
                border: selected === l.code ? "1.5px solid #f5a623" : "1px solid rgba(255,255,255,0.08)",
                background: selected === l.code ? "rgba(245,166,35,0.12)" : "rgba(255,255,255,0.03)",
                animation: `slideUp 0.5s var(--ease-spring) ${i * 0.05}s both`,
                boxShadow: selected === l.code ? "0 0 20px rgba(245,166,35,0.2)" : "none"
              }}>
              <div style={{ fontSize: 36, marginBottom: 8, filter: selected === l.code ? "none" : "grayscale(0.3)" }}>{l.flag}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: selected === l.code ? "#f5a623" : "#fff" }}>{l.native}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, fontWeight: 600 }}>{l.english}</div>
              
              {selected === l.code && (
                <div style={{ position: "absolute", top: 10, right: 10, background: "#f5a623", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#000", fontWeight: 900, animation: "scaleIn 0.3s var(--ease-spring)" }}>✓</div>
              )}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 8, animation: "slideUp 0.8s var(--ease-spring) 0.4s both" }}>
          <button className="btn btn-primary press-effect"
            onClick={() => onSelect(selected)}
            style={{ padding: "18px 0", fontSize: 16 }}>
            Confirm & Continue →
          </button>
          <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
            You can change this later in settings.
          </div>
        </div>
      </div>
    </div>
  );
}
