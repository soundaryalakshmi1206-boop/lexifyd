import { useState, useEffect } from "react";

const THIRUVALLUVAR = "/mascot.png";

const KURAL_QUOTES = [
  { tamil: "கற்றாரைக் கற்றார் காமுறுவர்", english: "The learned will love the learned." },
  { tamil: "கல்வி கண்ணுடையார் என்பவர்", english: "The educated are said to have eyes." },
  { tamil: "யாதும் ஊரே யாவரும் கேளிர்", english: "Every land is my home, everyone my kin." },
];

function getPasswordStrength(pass) {
  if (!pass) return "";
  if (pass.length < 6) return "weak";
  if (pass.length < 10 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return "medium";
  if (pass.length >= 10 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) return "strong";
  if (pass.length >= 8) return "medium";
  return "weak";
}

export default function Login({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [mascotVisible, setMascotVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setMascotVisible(true), 300);
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % KURAL_QUOTES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const strength = tab === "signup" ? getPasswordStrength(pass) : "";
  const strengthLabels = { weak: "Weak", medium: "Good", strong: "Strong" };

  function validateField(field) {
    const errors = { ...fieldErrors };
    if (field === "email" && email && !/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email";
    else delete errors.email;
    if (field === "pass" && tab === "signup" && pass && pass.length < 6) errors.pass = "At least 6 characters";
    else delete errors.pass;
    if (field === "name" && tab === "signup" && name !== undefined && !name.trim()) errors.name = "Name is required";
    else delete errors.name;
    setFieldErrors(errors);
  }

  function validate() {
    if (!email.trim()) { setErr("Enter your email address"); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErr("Enter a valid email"); return false; }
    if (tab !== "forgot" && !pass.trim()) { setErr("Enter your password"); return false; }
    if (tab === "signup" && !name.trim()) { setErr("Enter your name"); return false; }
    if (tab === "signup" && pass.length < 6) { setErr("Password must be at least 6 characters"); return false; }
    return true;
  }

  function handleSubmit() {
    setErr("");
    if (!validate()) return;
    if (tab === "forgot") {
      setMsg("✅ Reset link sent to " + email);
      setTimeout(() => { setMsg(""); setTab("login"); }, 3000);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let users = JSON.parse(localStorage.getItem("lexifyd_users") || "{}");

      if (tab === "signup") {
        if (users[email]) { setErr("Email already registered. Please log in."); return; }
        users[email] = { name: name.trim(), pass };
        localStorage.setItem("lexifyd_users", JSON.stringify(users));
        onLogin({ name: name.trim(), email });
      } else {
        if (!users[email]) { setErr("Account not found. Please sign up."); return; }
        if (users[email].pass !== pass) { setErr("Incorrect password."); return; }
        onLogin({ name: users[email].name, email });
      }
    }, 1000);
  }

  function handleGoogle() {
    const names = ["Tamil Learner", "அன்பன்", "Karthik", "Priya", "Vijay"];
    const fake = names[Math.floor(Math.random() * names.length)];
    onLogin({ name: fake, email: fake.toLowerCase().replace(" ", "") + "@gmail.com" });
  }

  const quote = KURAL_QUOTES[quoteIdx];

  return (
    <div className="page" style={{ background: "linear-gradient(160deg, #0a0612 0%, #0d0a14 50%, #0f0818 100%)", minHeight: "100vh" }}>
      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.06, backgroundImage: "url('/src/assets/tamil_bg.png')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0, pointerEvents: "none" }}/>
      <div style={{ position: "fixed", top: "-30%", right: "-20%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }}/>
      <div style={{ position: "fixed", bottom: "-20%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }}/>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px 40px", gap: 16, maxWidth: 420, margin: "0 auto" }}>

        {/* Mascot + Branding */}
        <div style={{ textAlign: "center", marginBottom: 4, animation: mascotVisible ? "slideUp 0.6s cubic-bezier(.16,1,.3,1) both" : "none", opacity: mascotVisible ? 1 : 0 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ position: "absolute", inset: -16, background: "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)", borderRadius: "50%", animation: "pulseGold 3s infinite" }} />
            <img src={THIRUVALLUVAR} alt="Thiruvalluvar" style={{ width: 80, height: 80, objectFit: "contain", position: "relative", zIndex: 1, filter: "drop-shadow(0px 8px 20px rgba(0,0,0,0.6))", animation: "float 4s ease-in-out infinite" }} />
          </div>
          <div style={{ fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 34, fontWeight: 900, color: "#f5a623", textShadow: "0 0 40px rgba(245,166,35,0.3)", marginTop: 12 }}>தமிழமுது</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700, marginTop: 4, letterSpacing: "2px", textTransform: "uppercase" }}>Tamilamuthu • Divine Language</div>
        </div>

        {/* Rotating Kural Quote */}
        <div className="card-glass" style={{ padding: "14px 18px", width: "100%", textAlign: "center", animation: "fadeIn 0.5s ease" }}>
          <div style={{ fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 14, color: "rgba(245,166,35,0.8)", fontWeight: 600, lineHeight: 1.5, fontStyle: "italic" }}>
            "{quote.tamil}"
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6, fontWeight: 500 }}>
            — {quote.english}
          </div>
        </div>

        {/* Google Auth */}
        <button onClick={handleGoogle} className="btn-google hover-lift press-effect" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", padding: "14px 0", fontSize: 15, fontWeight: 700, borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "'Inter','Outfit',sans-serif" }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </button>

        <div className="divider" style={{ width: "100%" }}><span>or use secure login</span></div>

        {/* Tab Switcher */}
        {tab !== "forgot" && (
          <div className="mode-toggle" style={{ width: "100%" }}>
            <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setErr(""); setFieldErrors({}); }}>Log In</button>
            <button className={tab === "signup" ? "active" : ""} onClick={() => { setTab("signup"); setErr(""); setFieldErrors({}); }}>Sign Up</button>
          </div>
        )}
        {tab === "forgot" && (
          <button onClick={() => { setTab("login"); setErr(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }}>
            ← Back to login
          </button>
        )}

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", animation: "slideUp 0.3s ease both" }}>
          {tab === "signup" && (
            <div>
              <div className="input-icon">
                <span className="icon">👤</span>
                <input className="input" placeholder="Full name" value={name} onChange={e => { setName(e.target.value); setErr(""); }} onBlur={() => validateField("name")} />
              </div>
              {fieldErrors.name && <div style={{ fontSize: 11, color: "#f87171", marginTop: 4, paddingLeft: 4, fontWeight: 600 }}>{fieldErrors.name}</div>}
            </div>
          )}
          <div>
            <div className="input-icon">
              <span className="icon">✉️</span>
              <input className="input" type="email" placeholder="Email address" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} onBlur={() => validateField("email")} />
            </div>
            {fieldErrors.email && <div style={{ fontSize: 11, color: "#f87171", marginTop: 4, paddingLeft: 4, fontWeight: 600 }}>{fieldErrors.email}</div>}
          </div>
          {tab !== "forgot" && (
            <div>
              <div className="input-icon" style={{ position: "relative" }}>
                <span className="icon">🔒</span>
                <input className="input" type={showPass ? "text" : "password"} placeholder="Password" value={pass}
                  onChange={e => { setPass(e.target.value); setErr(""); }} onBlur={() => validateField("pass")}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()} style={{ paddingRight: 48 }} />
                <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {fieldErrors.pass && <div style={{ fontSize: 11, color: "#f87171", marginTop: 4, paddingLeft: 4, fontWeight: 600 }}>{fieldErrors.pass}</div>}
              {tab === "signup" && pass && (
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <div className={`strength-bar strength-${strength}`} style={{ flex: 1 }}>
                    <div className="strength-fill" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: strength === "weak" ? "#f87171" : strength === "medium" ? "#f5a623" : "#4ade80" }}>
                    {strengthLabels[strength] || ""}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error / Success Messages */}
        {err && (
          <div style={{ width: "100%", padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, fontSize: 13, color: "#f87171", fontWeight: 600, animation: "wrongShake 0.4s ease" }}>
            ⚠️ {err}
          </div>
        )}
        {msg && (
          <div style={{ width: "100%", padding: "10px 14px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12, fontSize: 13, color: "#4ade80", fontWeight: 600, animation: "slideUp 0.3s ease" }}>
            {msg}
          </div>
        )}

        {/* Submit Button */}
        <button className="btn btn-primary press-effect" onClick={handleSubmit} disabled={loading}
          style={{ fontSize: 15, padding: "15px 0", opacity: loading ? 0.7 : 1, position: "relative", overflow: "hidden" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 18, height: 18, border: "2.5px solid rgba(0,0,0,0.2)", borderTopColor: "#000", borderRadius: "50%", animation: "spinSlow 0.6s linear infinite" }} />
              Verifying...
            </div>
          ) : (
            tab === "login" ? "Sign In →" : tab === "signup" ? "Create Account →" : "Send Reset Link →"
          )}
        </button>

        {/* Footer Links */}
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: "0 4px" }}>
          {tab !== "forgot" && (
            <button onClick={() => { setTab("forgot"); setErr(""); }} style={{ background: "none", border: "none", color: "rgba(245,166,35,0.7)", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "color 0.2s" }}>
              Forgot password?
            </button>
          )}
          <button onClick={() => onLogin({ name: "Guest", email: "guest@tamilamuthu.com" })} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer", fontWeight: 500, marginLeft: "auto", transition: "color 0.2s" }}>
            Continue as Guest
          </button>
        </div>

        {/* Branding Footer */}
        <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.15)", textAlign: "center", fontWeight: 500 }}>
          Powered by Gemini AI • Edge-first Architecture
        </div>
      </div>
    </div>
  );
}
