import { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import Login        from "./pages/Login";
import LangSelect   from "./pages/LangSelect";
import Onboarding   from "./pages/Onboarding";
import Home         from "./pages/Home";
import WordQuest    from "./pages/WordQuest";
import Game         from "./pages/Game";
import Guide        from "./pages/Guide";
import Profile      from "./pages/Profile";

export const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ── helpers ──────────────────────────────────────────────
function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const INIT_USER = {
  name: "", email: "", lang: "english",
  level: "beginner", reason: "", dailyMin: 15, notifications: true,
  streak: 1, marks: 0, wordsLearned: 0, todayMarks: 0, goalMarks: 50,
  lastLogin: null, wordHistory: [],
};

export default function App() {
  const [screen, setScreen] = useState("splash");   // splash|login|lang|onboard|home|quest|game|guide|profile
  const [user,   setUser]   = useState(() => load("tv_user", INIT_USER));
  const [gameWord, setGameWord] = useState(null);

  // splash → login after 2 s
  useEffect(() => {
    const saved = load("tv_user", null);
    if (saved?.name) {
      // returning user
      setTimeout(() => setScreen("home"), 1800);
    } else {
      setTimeout(() => setScreen("login"), 1800);
    }
  }, []);

  function updateUser(patch) {
    setUser(prev => {
      const next = { ...prev, ...patch };
      save("tv_user", next);
      return next;
    });
  }

  function markWordResult(word, passed, score) {
    setUser(prev => {
      const hist = [...(prev.wordHistory || [])];
      const idx  = hist.findIndex(h => h.word === word);
      if (idx >= 0) {
        hist[idx] = { ...hist[idx], attempts: hist[idx].attempts + 1, passed: passed ? hist[idx].passed + 1 : hist[idx].passed, lastSeen: Date.now() };
      } else {
        hist.push({ word, attempts: 1, passed: passed ? 1 : 0, lastSeen: Date.now() });
      }
      const marksGain = score !== undefined ? score : (passed ? 50 : 10);
      const next = {
        ...prev,
        wordHistory: hist,
        marks: (prev.marks || 0) + marksGain,
        todayMarks: (prev.todayMarks || 0) + marksGain,
        wordsLearned: passed ? (prev.wordsLearned || 0) + 1 : (prev.wordsLearned || 0),
        xp: (prev.xp || 0) + marksGain,
      };
      save("tv_user", next);
      return next;
    });
  }

  function playWord(word) {
    setGameWord(word);
    setScreen("game");
  }

  // ─── SPLASH ──────────────────────────────────────────────
  if (screen === "splash") return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #0a0612 0%, #0d0a14 50%, #0f0818 100%)",
      position: "relative", overflow: "hidden"
    }}>
      <style>{`
        :root { --grad-gold: linear-gradient(135deg, #f5a623 0%, #ff6b1a 100%); }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes progressFill { from { width: 0; } to { width: 100%; } }
        @keyframes flicker { 0% { opacity: 0.8; transform: translateX(-50%) scale(0.98); } 100% { opacity: 1; transform: translateX(-50%) scale(1.02); } }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 20px rgba(245,166,35,0.2); } 50% { box-shadow: 0 0 50px rgba(245,166,35,0.5), 0 0 80px rgba(245,166,35,0.15); } 100% { box-shadow: 0 0 20px rgba(245,166,35,0.2); } }
        @keyframes letterReveal { from { opacity: 0; transform: translateY(8px); filter: blur(4px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        .page { animation: fadeIn 0.5s ease; position: relative; z-index: 1; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; backdrop-filter: blur(10px); color: #fff; transition: all 0.3s ease; }
        .btn { border-radius: 14px; font-weight: 800; cursor: pointer; transition: all 0.3s; width: 100%; }
        .btn-primary { background: var(--grad-gold); color: #000; border: none; box-shadow: 0 4px 15px rgba(245,166,35,0.3); }
        .btn-primary:active { transform: scale(0.98); }
      `}</style>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "url('/src/assets/tamil_bg.png')",
        backgroundSize: "cover", backgroundPosition: "center"
      }}/>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, background: "radial-gradient(circle, rgba(245,166,35,0.1), transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", textAlign: "center" }}>
        {/* Lamp */}
        <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 24px", animation: "slideUp 0.6s ease both" }}>
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 80, height: 40, background: "var(--grad-gold)", borderRadius: "10px 10px 40px 40px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}/>
            <div style={{ position: "absolute", bottom: 35, left: "50%", transform: "translateX(-50%)", width: 25, height: 45, background: "radial-gradient(ellipse at bottom, #fff, #f5a623, transparent)", borderRadius: "50% 50% 20% 20%", animation: "flicker 1.5s infinite alternate", boxShadow: "0 0 40px rgba(245,166,35,0.8)" }}/>
        </div>
        {/* Title with staggered letter reveal */}
        <div style={{ animation: "slideUp 0.8s ease 0.2s both" }}>
          <div style={{
            fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 48, fontWeight: 900,
            color: "#f5a623", textShadow: "0 0 50px rgba(245,166,35,0.4), 0 2px 10px rgba(0,0,0,0.5)",
            letterSpacing: "-0.5px"
          }}>தமிழமுது</div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", animation: "slideUp 0.8s ease 0.4s both" }}>
          Tamilamuthu • The Divine Language
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 44, width: 200, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", margin: "44px auto 0", animation: "slideUp 0.8s ease 0.6s both" }}>
          <div style={{ height: "100%", background: "var(--grad-gold)", borderRadius: 2, animation: "progressFill 1.6s ease forwards", boxShadow: "0 0 12px rgba(245,166,35,0.5)" }}/>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 14, fontWeight: 500, animation: "slideUp 0.8s ease 0.8s both" }}>
          தமிழைத் தேன் என்போம் — We call Tamil as Honey
        </div>
      </div>
    </div>
  );

  return (
    <>
      {screen === "login"   && <Login onLogin={u => { updateUser(u); setScreen("lang"); }} />}
      {screen === "lang"    && <LangSelect lang={user.lang} onSelect={l => { updateUser({ lang: l }); setScreen("onboard"); }} />}
      {screen === "onboard" && <Onboarding user={user} onDone={patch => { updateUser(patch); setScreen("home"); }} />}
      {screen === "home"    && <Home user={user} onQuest={() => setScreen("quest")} onGuide={() => setScreen("guide")} onProfile={() => setScreen("profile")} onPlay={playWord} />}
      {screen === "quest"   && <WordQuest user={user} onPlay={playWord} onBack={() => setScreen("home")} />}
      {screen === "game"    && <Game word={gameWord} user={user} onBack={() => setScreen("quest")} onResult={markWordResult} />}
      {screen === "guide"   && <Guide user={user} onBack={() => setScreen("home")} />}
      {screen === "profile" && <Profile user={user} onBack={() => setScreen("home")} onLogout={() => { save("tv_user", null); setUser(INIT_USER); setScreen("login"); }} />}
    </>
  );
}
