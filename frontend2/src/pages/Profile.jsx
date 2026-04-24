import { useState, useEffect } from "react";

const TV = "/mascot.png";

function StatCard({ label, value, icon, delay = 0 }) {
  return (
    <div className="card-glass hover-lift" style={{ 
      padding: "20px 16px", flex: 1, textAlign: "center", 
      animation: `slideUp 0.6s var(--ease-spring) ${delay}s both` 
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "#f5a623" }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function Profile({ user, onLogout, onBack }) {
  const [showSettings, setShowSettings] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSent, setIsSent] = useState(false);

  const stats = [
    { label: "Points", value: user.marks || 0, icon: "🎯" },
    { label: "Streak", value: user.streak || 1, icon: "🔥" },
    { label: "Words", value: user.wordsLearned || 0, icon: "📚" }
  ];

  return (
    <div className="page" style={{ background: "#0d0a14", minHeight: "100vh" }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.05, backgroundImage: "url('/src/assets/tamil_bg.png')", backgroundSize: "cover", zIndex: 0 }}/>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(13,10,20,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="back-btn" onClick={onBack}>←</button>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Profile</div>
        </div>
        <button onClick={onLogout} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "8px 16px", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>LOGOUT</button>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "24px 20px 100px", maxWidth: 450, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* User Card */}
        <div style={{ textAlign: "center", animation: "slideUp 0.6s var(--ease-spring)" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
            <div style={{ position: "absolute", inset: -8, background: "var(--grad-gold)", borderRadius: "50%", opacity: 0.2, filter: "blur(12px)" }} />
            <div className="avatar" style={{ width: 90, height: 90, fontSize: 36 }}>{user.name?.[0]?.toUpperCase() || "U"}</div>
          </div>
          <h2 className="heading-lg" style={{ color: "#fff" }}>{user.name}</h2>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginTop: 4 }}>{user.email || "Learner ID: #7712"}</div>
          
          <div className="badge badge-warning" style={{ marginTop: 12, padding: "6px 14px", fontSize: 11 }}>
             {user.level === "intermediate" ? "TAMIL SCHOLAR" : user.level === "reader" ? "FLUENT READER" : "NOBLE BEGINNER"}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: 12 }}>
          {stats.map((s, i) => <StatCard key={s.label} {...s} delay={0.1 + i * 0.1} />)}
        </div>

        {/* Settings / Actions */}
        <div style={{ animation: "slideUp 0.6s var(--ease-spring) 0.4s both" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12, paddingLeft: 4 }}>Account Settings</div>
          <div className="card-glass" style={{ width: "100%", borderRadius: 20, overflow: "hidden" }}>
             {[
               { icon: "🌍", label: "Learning Language", value: user.lang?.toUpperCase() || "ENGLISH" },
               { icon: "🎯", label: "Daily Goal", value: (user.goalMarks || 50) + " Points" },
               { icon: "🔔", label: "Reminders", value: "ON" },
               { icon: "📜", label: "Privacy Policy", value: "View" }
             ].map((item, i) => (
               <div key={i} className="hover-lift" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: i === 3 ? "none" : "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                     <span style={{ fontSize: 18 }}>{item.icon}</span>
                     <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{item.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                     <span style={{ fontSize: 13, color: "#f5a623", fontWeight: 800 }}>{item.value}</span>
                     <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 18 }}>›</span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div style={{ animation: "slideUp 0.6s var(--ease-spring) 0.5s both" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12, paddingLeft: 4 }}>Send Feedback</div>
          <div className="card-glass" style={{ padding: "20px", borderRadius: 20 }}>
             {isSent ? (
               <div style={{ textAlign: "center", padding: "20px 0", animation: "scaleIn 0.4s var(--ease-spring)" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#4ade80" }}>Feedback Received!</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Helping us perfect Tamilamuthu.</div>
               </div>
             ) : (
               <>
                 <textarea className="input" placeholder="Tell us how we can improve..." style={{ height: 100, resize: "none", marginBottom: 16, borderRadius: 16, background: "rgba(255,255,255,0.03)" }} value={feedback} onChange={e => setFeedback(e.target.value)} />
                 <button onClick={() => feedback.trim() && setIsSent(true)} className="btn btn-primary press-effect" style={{ width: "100%", padding: "14px 0", opacity: feedback.trim() ? 1 : 0.5 }} disabled={!feedback.trim()}>Send Message</button>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
