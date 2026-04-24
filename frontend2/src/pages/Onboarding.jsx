import { useState } from "react";

const TV = "/src/assets/thiruvalluvar_face.png";

const STEPS = [
  {
    key: "reason",
    question: "What brings you to Tamil?",
    tamizh: "ஏன் தமிழ் கற்கிறீர்கள்?",
    icon: "🎯",
    opts: [
      { val: "roots",    icon: "🌿", label: "My Roots",    sub: "Heritage & Family" },
      { val: "career",   icon: "💼", label: "Work",        sub: "Professional growth" },
      { val: "travel",   icon: "✈️", label: "Travel",      sub: "Explore Tamil Nadu" },
      { val: "fun",      icon: "🎉", label: "Pure Interest", sub: "For the love of it" },
      { val: "study",    icon: "📚", label: "Academics",    sub: "Literature & History" },
      { val: "brain",    icon: "🧠", label: "Brain Power",  sub: "Cognitive training" },
    ]
  },
  {
    key: "level",
    question: "Current Tamil proficiency?",
    tamizh: "உங்கள் தமிழ் நிலை என்ன?",
    icon: "📊",
    opts: [
      { val: "beginner",  icon: "🌱", label: "Beginner",     sub: "No prior knowledge" },
      { val: "basic",     icon: "📖", label: "Basic",        sub: "Greetings & numbers" },
      { val: "reader",    icon: "📝", label: "Reader",       sub: "Can identify script" },
      { val: "intermediate", icon: "💬", label: "Speaker",    sub: "Can hold conversations" },
    ]
  },
  {
    key: "dailyMin",
    question: "Daily practice goal?",
    tamizh: "தினசரி எவ்வளவு நேரம் படிப்பீர்கள்?",
    icon: "⏰",
    opts: [
      { val: 5,   icon: "🌙", label: "5 mins",   sub: "Casual progress" },
      { val: 15,  icon: "⭐", label: "15 mins",  sub: "Steady growth" },
      { val: 30,  icon: "🔥", label: "30 mins",  sub: "Serous learner" },
      { val: 45,  icon: "💥", label: "45 mins",  sub: "Intensive training" },
    ]
  },
  {
    key: "notifications",
    question: "Stay consistent with reminders?",
    tamizh: "தினசரி நினைவூட்டல் வேண்டுமா?",
    icon: "🔔",
    opts: [
      { val: true,  icon: "🔔", label: "Yes, remind me", sub: "Daily notifications" },
      { val: false, icon: "🔕", label: "No, I'll manage", sub: "Manual practice" },
    ]
  },
];

const GUIDE_MESSAGES = [
  "அன்புடையோர்! Every master was once a beginner. Tell me your purpose.",
  "நல்லது! Every journey begins with a single step. What is your level?",
  "Time is the most valuable currency. How much will you invest?",
  "தொடர்ந்து கற்கலாம்! Consistent practice is the secret to mastery. 🪔",
];

export default function Onboarding({ user, onDone }) {
  const [step, setStep] = useState(0);
  const [ans,  setAns]  = useState({});

  const cur = STEPS[step];

  function pick(val) {
    const updated = { ...ans, [cur.key]: val };
    setAns(updated);
    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      const min = updated.dailyMin || 15;
      const goalXP = min <= 5 ? 30 : min <= 15 ? 50 : min <= 30 ? 100 : 150;
      setTimeout(() => onDone({ ...updated, goalXP, streak: 1, xp: 0 }), 300);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="page" style={{ background: "#0d0a14", minHeight: "100vh" }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.05, backgroundImage: "url('/src/assets/tamil_bg.png')", backgroundSize: "cover", zIndex: 0, pointerEvents: "none" }}/>

      <div style={{ position: "relative", zIndex: 1, padding: "24px 20px 40px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 420, margin: "0 auto", width: "100%" }}>
        
        {/* Progress System */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>STEP {step + 1} / {STEPS.length}</span>
            <div style={{ display: "flex", gap: 6 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{ 
                  width: i === step ? 20 : 6, 
                  height: 6, 
                  borderRadius: 3, 
                  background: i <= step ? "var(--grad-gold)" : "rgba(255,255,255,0.1)", 
                  transition: "all 0.4s var(--ease-spring)" 
                }}/>
              ))}
            </div>
          </div>
          <div className="progress-track" style={{ height: 4 }}>
            <div className="progress-fill" style={{ width: `${progress}%` }}/>
          </div>
        </div>

        {/* Guide Panel */}
        <div className="card-glass" style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px", borderRadius: 18, animation: "slideDown 0.6s var(--ease-spring)" }}>
          <div style={{ position: "relative" }}>
             <div style={{ position: "absolute", inset: -4, background: "rgba(245,166,35,0.2)", borderRadius: 10, filter: "blur(8px)" }} />
             <img src={TV} alt="Thiruvalluvar" style={{ width: 56, height: 64, objectFit: "cover", borderRadius: 8, position: "relative", zIndex: 1, border: "1.5px solid rgba(245,166,35,0.3)" }} onError={e => e.target.style.display="none"}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#f5a623", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Thiruvalluvar</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, fontWeight: 500 }}>{GUIDE_MESSAGES[step]}</div>
          </div>
        </div>

        {/* Question Header */}
        <div style={{ textAlign: "center", margin: "10px 0", animation: "scaleIn 0.5s var(--ease-spring)" }}>
          <div style={{ fontSize: 14, fontFamily: "'Noto Sans Tamil', sans-serif", color: "#f5a623", fontWeight: 600, opacity: 0.8, marginBottom: 4 }}>{cur.tamizh}</div>
          <h2 className="heading-lg" style={{ color: "#fff" }}>{cur.question}</h2>
        </div>

        {/* Options Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cur.opts.map((o, i) => {
            const isSelected = ans[cur.key] === o.val;
            return (
              <button key={String(o.val)} onClick={() => pick(o.val)}
                className="card-glass hover-lift press-effect"
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                  background: isSelected ? "rgba(245,166,35,0.12)" : "rgba(255,255,255,0.03)",
                  border: isSelected ? "2.5px solid #f5a623" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, cursor: "pointer", textAlign: "left", transition: "all 0.3s ease",
                  animation: `slideUp 0.5s var(--ease-spring) ${i * 0.05}s both`,
                  boxShadow: isSelected ? "0 0 24px rgba(245,166,35,0.2)" : "none"
                }}>
                <span style={{ fontSize: 28, filter: isSelected ? "none" : "grayscale(0.4)" }}>{o.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: isSelected ? "#f5a623" : "#fff" }}>{o.label}</div>
                  {o.sub && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2, fontWeight: 500 }}>{o.sub}</div>}
                </div>
                {isSelected && <span style={{ color: "#f5a623", fontSize: 20, fontWeight: 900, animation: "scaleIn 0.3s cubic-bezier(.16,1,.3,1)" }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
