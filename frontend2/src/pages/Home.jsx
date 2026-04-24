import { useState, useEffect, useRef } from "react";
import { getWordsList, DETAILED_WORDS } from "../data/lexical_db.js";

const TV = "/mascot.png";

function getDailyWords(user, allWords) {
  const min = user.dailyMin || 15;
  const count = min <= 5 ? 2 : min <= 15 ? 3 : min <= 30 ? 4 : 5;
  const hist = user.wordHistory || [];
  const failedWords = hist.filter(h => h.passed / h.attempts < 0.6).map(h => h.word);
  const levelWords = allWords.map(w => w.word);
  const notSeen = levelWords.filter(w => !hist.find(h => h.word === w));
  const rec = [...new Set([...failedWords, ...notSeen])].slice(0, count);
  return rec.length > 0 ? rec : levelWords.slice(0, count);
}

const GUIDE_TIPS = [
  "\"யாதுமூர் ஆகிப் பகைவர்க்கும் உதவுக.\" — கற்க!",
  "கற்றாலும் கல்லாரேன் — Keep learning. Even I never stop!",
  "\"செய்யத் தகாத அவை செய்யாமை\" — Choose your words well.",
  "\"அன்பு சிறப்பந்தாக்கும்\" — Love Tamil, love learning!",
];

function CircularProgress({ value, size = 72, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="url(#goldGrad)" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)" }} />
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5a623" />
            <stop offset="100%" stopColor="#ff6b1a" />
          </linearGradient>
        </defs>
      </svg>
      <span className="progress-text" style={{ fontSize: size < 60 ? 14 : 18 }}>{value}%</span>
    </div>
  );
}

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const step = (timestamp) => {
      if (!ref.current) ref.current = timestamp;
      const progress = Math.min((timestamp - ref.current) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    ref.current = null;
    requestAnimationFrame(step);
  }, [value, duration]);
  return <>{display}</>;
}

export default function Home({ user, onQuest, onGuide, onProfile, onPlay }) {
  const [activeNav, setActiveNav] = useState("home");
  const [allWords, setAllWords] = useState([]);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    getWordsList().then(d => setAllWords(d.words || [])).catch(() => {});
    const t = setInterval(() => setTip(x => (x + 1) % GUIDE_TIPS.length), 8000);
    return () => clearInterval(t);
  }, []);

  const recommended = getDailyWords(user, allWords);
  const prog = Math.min(100, Math.round(((user.todayMarks || 0) / (user.goalMarks || 50)) * 100));

  return (
    <div className="page" style={{ background: "#0d0a14", minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.04, backgroundImage: "url('/src/assets/tamil_bg.png')", backgroundSize: "cover", zIndex: 0, pointerEvents: "none" }}/>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(13,10,20,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ animation: "slideRight 0.5s ease both" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.5px" }}>Hello,</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Inter','Outfit',sans-serif" }}>{user.name} 👋</div>
          </div>
          <div style={{ display: "flex", gap: 6, animation: "slideUp 0.4s ease 0.2s both" }}>
            {[["🔥", user.streak || 1], ["🎯", user.marks || 0], ["📚", user.wordsLearned || 0]].map(([icon, val], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 10px", borderRadius: 10, fontSize: 12, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 3 }}>
                {icon} <AnimatedNumber value={val} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Today's Goal — Circular Progress */}
        <div className="card card-hover" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, animation: "slideUp 0.5s ease both" }}>
          <CircularProgress value={prog} size={68} strokeWidth={5} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Today's Goal</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500, lineHeight: 1.4 }}>
              {prog >= 100 ? "🎉 Goal reached! Keep going!" : `${user.todayMarks || 0}/${user.goalMarks || 50} points`}
            </div>
            <div className="progress-track" style={{ height: 4, marginTop: 8 }}><div className="progress-fill" style={{ width: `${prog}%` }}/></div>
          </div>
        </div>

        {/* Mascot Guide Tip */}
        <div className="card-glass" style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px", borderRadius: 16, animation: "slideUp 0.5s ease 0.1s both" }}>
          <img src={TV} alt="TV" style={{ width: 52, height: 52, objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#f5a623", textTransform: "uppercase", marginBottom: 3, letterSpacing: "0.5px" }}>Thiruvalluvar says</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, fontWeight: 500 }}>{GUIDE_TIPS[tip]}</div>
          </div>
        </div>

        {/* Featured Word Card */}
        <div className="card-gradient-border" style={{ animation: "slideUp 0.5s ease 0.2s both" }}>
           <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/src/assets/tamil_bg.png')", backgroundSize: "cover", opacity: 0.06, pointerEvents: "none" }}/>
           <div style={{ position: "relative", padding: "22px 20px" }}>
              <div style={{ fontSize: 10, color: "#f5a623", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>Today's Featured Word</div>

              {recommended.length > 0 && (() => {
                const word = recommended[0];
                const detailed = DETAILED_WORDS[word];
                return (
                  <div onClick={() => onPlay(word)} style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", fontFamily: "'Noto Sans Tamil', sans-serif", lineHeight: 1.1 }}>{word}</div>
                            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: 2 }}>{detailed?.core_english_meaning || "View Meanings"}</div>
                        </div>
                        <button className="press-effect" style={{ width: 48, height: 48, borderRadius: 14, background: "var(--grad-gold)", border: "none", color: "#000", fontSize: 20, cursor: "pointer", boxShadow: "0 4px 16px rgba(245,166,35,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
                    </div>
                    {detailed && (
                      <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 12, borderLeft: "3px solid #f5a623" }}>
                        <div style={{ fontSize: 13, fontFamily: "'Noto Sans Tamil', sans-serif", color: "rgba(255,255,255,0.7)", fontStyle: "italic", lineHeight: 1.5 }}>
                          "{detailed.thirukkural}"
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
           </div>
        </div>

        {/* Discover More */}
        <div style={{ animation: "slideUp 0.5s ease 0.3s both" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 800, marginBottom: 10, paddingLeft: 4, letterSpacing: "1px", textTransform: "uppercase" }}>Discover More</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            {recommended.slice(1).map((w, i) => (
              <button key={w} onClick={() => onPlay(w)} className="hover-lift press-effect" style={{ padding: "12px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, fontFamily: "'Noto Sans Tamil',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", cursor: "pointer", animation: `slideRight 0.4s ease ${0.1 * i}s both` }}>
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, animation: "slideUp 0.5s ease 0.4s both" }}>
            <button onClick={onQuest} className="card card-hover press-effect" style={{ padding: "20px 16px", textAlign: "center", border: "none", cursor: "pointer" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🎮</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Word Quest</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, fontWeight: 500 }}>Challenge yourself</div>
            </button>
            <button onClick={onGuide} className="card card-hover press-effect" style={{ padding: "20px 16px", textAlign: "center", border: "none", cursor: "pointer" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🧙</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>AI Guide</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, fontWeight: 500 }}>Ask Thiruvalluvar</div>
            </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {[["🏠","Home",() => setActiveNav("home")],["🎮","Quest",onQuest],["🧙","Guide",onGuide],["👤","Me",onProfile]].map(([icon,label,fn]) => (
          <button key={label} className={`nav-item ${activeNav === label.toLowerCase() ? "active" : ""}`}
            onClick={() => { setActiveNav(label.toLowerCase()); fn && fn(); }}>
            <span className="nav-icon" style={{ fontSize: 20 }}>{icon}</span>
            <span className="nav-label" style={{ fontSize: 10, marginTop: 2 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
