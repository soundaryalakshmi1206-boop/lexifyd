import { useState, useEffect, useRef } from "react";
import { DETAILED_WORDS } from "../data/lexical_db.js";

const TV = "/mascot.png";

function ScoringPopup({ text, color = "#f5a623" }) {
  return (
    <div style={{
      position: "fixed", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
      zIndex: 1000, pointerEvents: "none", animation: "slideUp 0.6s var(--ease-spring) both"
    }}>
      <div style={{
        fontSize: 32, fontWeight: 900, color, textShadow: "0 0 20px rgba(0,0,0,0.5)",
        background: "rgba(0,0,0,0.4)", padding: "10px 20px", borderRadius: 24, backdropFilter: "blur(8px)"
      }}>
        {text}
      </div>
    </div>
  );
}

export default function Game({ word, user, onResult, onBack }) {
  const [tab, setTab] = useState("study"); // study, quiz, result
  const [loading, setLoading] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);

  const data = DETAILED_WORDS[word];

  if (!data) return (
    <div className="page" style={{ background: "#0d0a14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="text-center">
        <div style={{ fontSize: 40 }}>🏮</div>
        <div style={{ color: "#fff", marginTop: 12, fontWeight: 700 }}>Preparing word world...</div>
        <button onClick={onBack} className="btn btn-outline" style={{ marginTop: 20 }}>Back to Home</button>
      </div>
    </div>
  );

  const meanings = data.meanings || [];
  const currentSense = meanings[quizIdx % meanings.length];

  function handleAnswer(ans) {
    if (feedback) return;
    const correct = ans === currentSense.english_label || ans === currentSense.meaning;
    setFeedback({ correct, chosen: ans });

    if (correct) {
      setScore(s => s + 50);
      setShowPopup("+50 XP");
    } else {
      setShowPopup("Try Again!");
    }

    setTimeout(() => {
      setShowPopup(null);
      setFeedback(null);
      if (quizIdx < meanings.length - 1) {
        setQuizIdx(i => i + 1);
      } else {
        setTab("result");
        finishSession(correct);
      }
    }, 1500);
  }

  function finishSession(lastPassed) {
    const finalScore = score + (lastPassed ? 50 : 0);
    if (onResult) {
      onResult(word, lastPassed, finalScore);
    }
    setSessionResults({ xp: finalScore, mastered: lastPassed });
  }

  return (
    <div className="page" style={{ background: "#0d0a14", minHeight: "100vh" }}>
      <style>{`
        .sense-card { transition: all 0.3s var(--ease-spring); border: 1px solid rgba(255,255,255,0.06); }
        .sense-card:hover { border-color: rgba(245,166,35,0.3); transform: scale(1.02); }
        .quiz-opt { transition: all 0.2s var(--ease-spring); }
        .quiz-opt:active { transform: scale(0.96); }
      `}</style>
      <div style={{ position: "fixed", inset: 0, opacity: 0.05, backgroundImage: "url('/src/assets/tamil_bg.png')", backgroundSize: "cover", zIndex: 0, pointerEvents: "none" }}/>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(13,10,20,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="back-btn" onClick={onBack}>←</button>
            <div>
                 <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{word}</div>
                 <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Lexical Journey</div>
            </div>
          </div>
          <div className="streak-badge">🔥 {user.streak || 1}</div>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "20px 16px 100px", maxWidth: 450, margin: "0 auto" }}>

        {tab === "study" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
             {/* Word Title Section */}
             <div className="card-glass" style={{ textAlign: "center", padding: "30px 20px", borderRadius: 24, marginBottom: 20 }}>
                <div style={{ fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 56, fontWeight: 900, color: "#f5a623", textShadow: "0 0 30px rgba(245,166,35,0.3)" }}>{word}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: 4 }}>Root Word • {meanings.length} Meanings</div>
                
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
                   <button onClick={() => setTab("quiz")} className="btn btn-primary" style={{ width: "auto", padding: "12px 28px" }}>Start Quiz →</button>
                   <button onClick={() => setShowMindMap(true)} className="btn btn-outline" style={{ width: "auto", padding: "12px 24px" }}>Mind Map 🕸️</button>
                </div>
             </div>

             {/* Master Kural */}
             <div className="kural-card" style={{ marginBottom: 20, animation: "slideUp 0.6s var(--ease-spring)" }}>
                <div className="kural-tamil">{data.thirukkural}</div>
                <div className="kural-english">{data.thirukkural_translation}</div>
                <div className="kural-number">Wisdom of Kural</div>
             </div>

             <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12, paddingLeft: 4 }}>Meanings & Context</div>
             
             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {meanings.map((s, i) => (
                  <div key={i} className="card sense-card" style={{ padding: "16px 18px", background: "rgba(255,255,255,0.03)", animation: `slideUp 0.6s var(--ease-spring) ${i * 0.1}s both` }}>
                    <div style={{ display: "flex", gap: 12 }}>
                       <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(245,166,35,0.15)", color: "#f5a623", fontSize: 14, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i+1}</div>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{s.meaning}</div>
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6, lineHeight: 1.5 }}>{s.sentence}</div>
                          <div style={{ fontSize: 12, color: "#f5a623", opacity: 0.6, marginTop: 4, fontStyle: "italic" }}>{s.translation}</div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {tab === "quiz" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>QUESTION {quizIdx + 1} / {meanings.length}</div>
                <div style={{ fontSize: 13, color: "#f5a623", fontWeight: 800 }}>XP: {score}</div>
             </div>
             <div className="progress-track" style={{ marginBottom: 28, height: 4 }}><div className="progress-fill" style={{ width: `${((quizIdx + 1) / meanings.length) * 100}%` }}/></div>
             
             <div className="card-glass" style={{ padding: "30px 24px", borderRadius: 24, textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: "#f5a623", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Select the correct meaning</div>
                <div style={{ fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 44, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{word}</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", fontStyle: "italic", lineHeight: 1.6 }}>"{currentSense.sentence}"</div>
             </div>

             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(currentSense.quiz_options || ["A", "B", "C", "D"]).map((opt, i) => {
                  const isCorrectField = feedback && (opt === currentSense.english_label || opt === currentSense.meaning);
                  const isWrongField = feedback && opt === feedback.chosen && !feedback.correct;
                  return (
                    <button key={i} onClick={() => handleAnswer(opt)} className={`option-btn quiz-opt ${isCorrectField ? "correct" : ""} ${isWrongField ? "wrong" : ""}`} style={{ animation: `slideUp 0.5s var(--ease-spring) ${i * 0.05}s both` }}>
                       <div className="opt-letter">{String.fromCharCode(65 + i)}</div>
                       <div className="opt-text">{opt}</div>
                       {isCorrectField && <span style={{ fontSize: 18 }}>✨</span>}
                    </button>
                  );
                })}
             </div>

             {/* Mascot Feedback */}
             {feedback && (
                <div style={{ marginTop: 32, display: "flex", gap: 14, alignItems: "center", animation: "slideUp 0.4s var(--ease-spring)" }}>
                   <img src={TV} alt="TV" style={{ width: 44, height: 44, objectPosition: "top center", objectFit: "cover", borderRadius: 10, border: "1.5px solid #f5a623" }}/>
                   <div className="card-glass" style={{ padding: "8px 14px", flex: 1, borderRadius: "14px 14px 14px 4px" }}>
                      <div style={{ fontSize: 13, color: feedback.correct ? "#4ade80" : "#f87171", fontWeight: 800 }}>{feedback.correct ? "அற்புதம்! (Splendid!)" : "மீண்டும் முயற்சி செய்! (Try again!)"}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{feedback.correct ? "You mastered this sense." : "The correct meaning was " + (currentSense.meaning || currentSense.english_label)}</div>
                   </div>
                </div>
             )}
          </div>
        )}

        {tab === "result" && (
          <div style={{ textAlign: "center", animation: "scaleIn 0.6s var(--ease-spring) both" }}>
             <div style={{ fontSize: 80, marginBottom: 12 }}>{sessionResults?.mastered ? "🏮" : "✨"}</div>
             <h2 className="heading-xl" style={{ color: "#fff", marginBottom: 8 }}>Round Complete!</h2>
             <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>The wisdom of <b>{word}</b> is now within you.</p>
             
             <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "32px 0" }}>
                <div className="card-glass" style={{ padding: "16px 24px", minWidth: 120 }}>
                   <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>Earned</div>
                   <div style={{ fontSize: 28, fontWeight: 900, color: "#f5a623" }}>+{sessionResults?.xp}</div>
                   <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>QUIZ XP</div>
                </div>
                <div className="card-glass" style={{ padding: "16px 24px", minWidth: 120 }}>
                   <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>Status</div>
                   <div style={{ fontSize: 22, fontWeight: 900, color: sessionResults?.mastered ? "#4ade80" : "#f5a623", marginTop: 4 }}>{sessionResults?.mastered ? "MASTERED" : "LEARNING"}</div>
                   <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>PROFICIENCY</div>
                </div>
             </div>

             <button onClick={onBack} className="btn btn-primary" style={{ maxWidth: 280, margin: "0 auto", padding: "16px 0" }}>Back to Home →</button>
             <button onClick={() => { setTab("study"); setQuizIdx(0); setScore(0); }} className="btn btn-outline" style={{ maxWidth: 280, margin: "12px auto 0", padding: "12px 0" }}>Review Again 🔁</button>
          </div>
        )}
      </div>

      {/* Mind Map Overlay */}
      {showMindMap && (
        <div className="mindmap-overlay" onClick={() => setShowMindMap(false)}>
           <div className="mindmap-modal animate-scale" onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                 <h3 className="heading-md" style={{ color: "#fff" }}>Semantic Mind Map</h3>
                 <button onClick={() => setShowMindMap(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 24, cursor: "pointer" }}>×</button>
              </div>
              <div className="mindmap-center">{word}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                 {meanings.map((s, i) => (
                    <div key={i} className="card-glass mindmap-node" style={{ animation: `slideRight 0.5s var(--ease-spring) ${i * 0.1}s both` }}>
                       <div style={{ fontSize: 11, color: "#f5a623", fontWeight: 800, textTransform: "uppercase", marginBottom: 2 }}>SENSE {i+1}</div>
                       <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{s.meaning}</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {showPopup && <ScoringPopup text={showPopup} color={showPopup.includes("+") ? "#4ade80" : "#f87171"} />}
    </div>
  );
}
