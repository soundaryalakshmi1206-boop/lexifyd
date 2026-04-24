import { useState, useRef, useEffect } from "react";
import * as webllm from "@mlc-ai/web-llm";
import { API } from "../App";

const TV = "/mascot.png";
const LANG_MAP = { malayalam:"Malayalam", kannada:"Kannada", tamil:"Tamil", telugu:"Telugu", hindi:"Hindi", english:"English" };

// Global engine so it doesn't redownload/reload on re-renders
let globalEngine = null;

export default function Guide({ user, onBack }) {
  const [msgs, setMsgs] = useState([
    { role: "guide", text: `வணக்கம், ${user.name}! 🙏 I am Thiruvalluvar. I am here to guide you through the wisdom of Tamil. Ask me anything about words, meanings, or culture. I will answer in ${LANG_MAP[user.lang||"english"]}.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [engineReady, setEngineReady] = useState(!!globalEngine);
  const [initMsg, setInitMsg] = useState(globalEngine ? "" : "Initializing Edge AI...");

  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, initMsg]);

  useEffect(() => {
    if (!globalEngine) {
      initLLM();
    }
  }, []);

  async function initLLM() {
    try {
      const engine = new webllm.MLCEngine();
      engine.setInitProgressCallback((report) => {
        setInitMsg(report.text);
      });
      await engine.reload("Phi-3-mini-4k-instruct-q4f16_1-MLC");
      globalEngine = engine;
      setEngineReady(true);
      setInitMsg("");
    } catch (e) {
      setInitMsg("Edge AI unavailable. Connecting to Cloud wisdom...");
      console.error(e);
      // Fallback logic could go here
    }
  }

  async function send() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      if (engineReady && globalEngine) {
        // Try local LLM first
        const systemPrompt = `You are Thiruvalluvar, the legendary ancient Tamil poet. You are serving as a wise guide in a Tamil language learning app. You must reply respectfully in ${LANG_MAP[user.lang||"english"]}. Keep responses under 60 words. Be poetic and wise.`;
        const apiMessages = [
          { role: "system", content: systemPrompt },
          ...msgs.map(m => ({ role: m.role === "guide" ? "assistant" : "user", content: m.text })),
          { role: "user", content: text }
        ];
        const reply = await globalEngine.chat.completions.create({ messages: apiMessages });
        setMsgs(m => [...m, { role: "guide", text: reply.choices[0].message.content }]);
      } else {
        // Fallback to backend cloud AI
        const response = await fetch(`${API}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: msgs.map(m => ({ role: m.role === "guide" ? "assistant" : "user", content: m.text })).concat({ role: "user", content: text }),
            lang: user.lang || "english"
          })
        });
        const data = await response.json();
        setMsgs(m => [...m, { role: "guide", text: data.reply || "I am currently meditating on deep thoughts. Let's try again in a moment." }]);
      }
    } catch (e) {
      console.error("Chat error:", e);
      setMsgs(m => [...m, { role: "guide", text: "ஐயா! I am facing an issue connecting to my internal wisdom. Let us try again." }]);
    }
    setLoading(false);
  }

  return (
    <div className="page" style={{ background: "#0d0a14", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.1, backgroundImage: "url('/src/assets/tamil_bg.png')", backgroundSize: "cover", zIndex: 0 }}/>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 10, background: "rgba(13,10,20,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
        <button className="back-btn" onClick={onBack}>←</button>
        <div style={{ position: "relative" }}>
           <img src={TV} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "contain", border: "2px solid rgba(245,166,35,0.4)" }} onError={e => e.target.style.display="none"}/>
           <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, background: engineReady ? "#4ade80" : "#f5a623", borderRadius: "50%", border: "2px solid #0d0a14", boxShadow: `0 0 8px ${engineReady ? "#4ade80" : "#f5a623"}` }} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Thiruvalluvar</div>
          <div style={{ fontSize: 11, color: engineReady ? "#4ade80" : "#f5a623", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {engineReady ? "Edge AI Online" : "Meditating..."}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20, position: "relative", zIndex: 1 }}>
        
        {initMsg && !engineReady && (
          <div className="card-glass" style={{ padding: 24, textAlign: "center", animation: "fadeIn 1s ease" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>🪔</div>
            <div style={{ fontSize: 16, color: "#f5a623", fontWeight: 800, marginBottom: 8, letterSpacing: "1px" }}>Arise, O Scholar!</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Thiruvalluvar is preparing his wisdom for you. Please wait a moment...</div>
            <div style={{ width: "100%", height: 3, background: "rgba(245,166,35,0.1)", borderRadius: 2, marginTop: 24, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "var(--grad-gold)", width: initMsg.includes("%") ? initMsg.split("%")[0].split(" ").pop() + "%" : "10%", transition: "width 0.3s ease" }}/>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 700, margin: "10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Journey Started</div>
        
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 12, alignItems: "flex-end", animation: "slideUp 0.3s var(--ease-spring)" }}>
            {m.role === "guide" && <img src={TV} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "contain", border: "1.5px solid rgba(245,166,35,0.3)", background: "rgba(255,255,255,0.05)" }} onError={e=>e.target.style.display="none"}/>}
            <div className={m.role === "user" ? "chat-bubble-user" : "chat-bubble-guide"} style={{ borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px", boxShadow: m.role === "user" ? "0 4px 16px rgba(245,166,35,0.2)" : "none" }}>
              <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", gap: 12, alignItems: "flex-end", animation: "fadeIn 0.3s ease" }}>
            <img src={TV} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "contain", opacity: 0.5 }} onError={e=>e.target.style.display="none"}/>
            <div className="chat-bubble-guide" style={{ borderRadius: "20px 20px 20px 4px" }}>
              <div className="typing-dots"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: 20 }}/>
      </div>

      {/* Input Area */}
      <div style={{ position: "relative", zIndex: 10, background: "rgba(13,10,20,0.9)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px", display: "flex", gap: 12 }}>
        <input className="input" 
          style={{ borderRadius: 28, padding: "16px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }} 
          placeholder={(engineReady || true) ? `Ask in ${LANG_MAP[user.lang||"english"]}...` : "Waiting for wisdom..."}
          value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button onClick={send} disabled={!input.trim() || loading || !engineReady} 
          className="press-effect"
          style={{
            width: 52, height: 52, borderRadius: "50%", background: "var(--grad-gold)", border: "none", color: "#000",
            fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: (input.trim()) ? "pointer" : "not-allowed",
            opacity: (input.trim()) ? 1 : 0.5, boxShadow: "0 4px 16px rgba(245,166,35,0.3)"
          }}>
          ➤
        </button>
      </div>
    </div>
  );
}
