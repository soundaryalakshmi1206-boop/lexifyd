
import { useState, useEffect, useRef, useCallback } from 'react'

const API = 'http://localhost:8000'

const SAMPLE_WORDS = ['படி','கல்','ஆறு','திங்கள்','கை','வாய்','தலை','மலை','கடல்','மாலை','வீடு','கண்','பால்','வழி','மனம்','ஒளி','தீ','அலை','பூ','நாள்']

const CATEGORIES = [
  { label: 'Classics',  words: ['படி','கல்','ஆறு','திங்கள்'], color: '#b5390f' },
  { label: 'Body',      words: ['கை','வாய்','தலை','கண்','காது'], color: '#c8922a' },
  { label: 'Nature',    words: ['மலை','கடல்','மழை','நீர்','தீ'], color: '#1a6b5a' },
  { label: 'Emotions',  words: ['மனம்','ஆசை','அன்பு','வலி'], color: '#7c3aad' },
]

// ── VILAKKU LAMP SVG ──────────────────────────────────────────────────────────
function LampIcon({ size = 48, animate = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="none">
      {/* flame */}
      <ellipse cx="24" cy="12" rx="5" ry="8" fill="#e8b86d"
        style={animate ? { animation: 'lampFlicker 1.4s ease-in-out infinite' } : {}} />
      <ellipse cx="24" cy="14" rx="3" ry="5" fill="#f5d99a"
        style={animate ? { animation: 'lampFlicker 1.1s ease-in-out infinite .2s' } : {}} />
      {/* wick */}
      <rect x="23" y="18" width="2" height="4" rx="1" fill="#7a5c3c" />
      {/* oil cup */}
      <path d="M14 22 Q14 36 24 36 Q34 36 34 22 Z" fill="#c8922a" />
      <path d="M14 22 Q14 30 24 30 Q34 30 34 22 Z" fill="#e8b86d" opacity=".4" />
      {/* base plate */}
      <ellipse cx="24" cy="36" rx="12" ry="3" fill="#b5390f" />
      {/* stem */}
      <rect x="21" y="39" width="6" height="10" rx="3" fill="#b5390f" />
      {/* foot */}
      <ellipse cx="24" cy="49" rx="9" ry="3" fill="#7a5c3c" />
      {/* spout */}
      <path d="M34 26 Q42 24 40 30 Q36 34 34 32 Z" fill="#c8922a" />
    </svg>
  )
}

// ── KOLAM DIVIDER ────────────────────────────────────────────────────────────
function KolamDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'1.5rem 0', opacity:.4 }}>
      <div style={{ flex:1, height:1, background:'var(--gold)' }} />
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="3" fill="var(--gold)" />
        <circle cx="16" cy="6"  r="2" fill="var(--terra)" />
        <circle cx="16" cy="26" r="2" fill="var(--terra)" />
        <circle cx="6"  cy="16" r="2" fill="var(--terra)" />
        <circle cx="26" cy="16" r="2" fill="var(--terra)" />
        <circle cx="9"  cy="9"  r="1.5" fill="var(--gold)" />
        <circle cx="23" cy="9"  r="1.5" fill="var(--gold)" />
        <circle cx="9"  cy="23" r="1.5" fill="var(--gold)" />
        <circle cx="23" cy="23" r="1.5" fill="var(--gold)" />
      </svg>
      <div style={{ flex:1, height:1, background:'var(--gold)' }} />
    </div>
  )
}

// ── XP BAR ───────────────────────────────────────────────────────────────────
function XPBar({ xp, streak }) {
  const level = Math.floor(xp / 100) + 1
  const pct   = (xp % 100)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:11, color:'var(--ink3)', fontWeight:500, letterSpacing:'.06em', textTransform:'uppercase' }}>Level</div>
        <div style={{ fontSize:20, fontWeight:700, color:'var(--terra)', fontFamily:'Syne,sans-serif', lineHeight:1 }}>{level}</div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--ink3)', marginBottom:4 }}>
          <span>{xp} XP</span><span>{100 - (xp%100)} to next</span>
        </div>
        <div style={{ height:6, background:'var(--cream3)', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--terra),var(--gold))', borderRadius:3, transition:'width .5s ease' }} />
        </div>
      </div>
      {streak > 0 && (
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:18 }}>🔥</div>
          <div style={{ fontSize:11, fontWeight:500, color:'var(--terra)', fontFamily:'Syne,sans-serif' }}>{streak}</div>
        </div>
      )}
    </div>
  )
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ tab, setTab, xp, streak }) {
  const tabs = [
    { id:'home',     label:'Home' },
    { id:'game',     label:'Game' },
    { id:'explore',  label:'Explore' },
    { id:'semantic', label:'Meanings' },
    { id:'chat',     label:'Ask Lexi' },
  ]
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:100,
      background:'rgba(247,240,227,.92)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid rgba(200,146,42,.2)',
      padding:'0 1.5rem', display:'flex', alignItems:'center',
      justifyContent:'space-between', height:60,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>setTab('home')}>
        <LampIcon size={36} animate={true} />
        <div>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:18, color:'var(--terra)', letterSpacing:'-.3px', lineHeight:1 }}>Lexifyd</div>
          <div style={{ fontSize:10, color:'var(--ink3)', letterSpacing:'.08em', textTransform:'uppercase' }}>Tamil Polysemy Engine</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:'6px 14px', borderRadius:999, border:'none',
            background: tab===t.id ? 'var(--terra)' : 'transparent',
            color: tab===t.id ? '#fff' : 'var(--ink3)',
            fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:500,
            cursor:'pointer', transition:'all .15s',
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ minWidth:120 }}>
        <XPBar xp={xp} streak={streak} />
      </div>
    </nav>
  )
}

// ── HOME ─────────────────────────────────────────────────────────────────────
function Home({ setTab, setGameWord }) {
  const [hovWord, setHovWord] = useState(null)

  const handlePlay = (word) => {
    setGameWord(word)
    setTab('game')
  }

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'3rem 1.5rem' }}>
      {/* Hero */}
      <div className="fade-up" style={{ textAlign:'center', marginBottom:'3rem' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--cream2)', border:'1px solid rgba(200,146,42,.3)', borderRadius:999, padding:'4px 16px', fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--terra)', marginBottom:'1.5rem' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--terra)', display:'inline-block' }} />
          TechZeal 2026 · Sona College of Technology
        </div>

        <div style={{ animation:'float 4s ease-in-out infinite', marginBottom:'1.5rem', display:'inline-block' }}>
          <LampIcon size={80} animate={true} />
        </div>

        <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(40px,7vw,80px)', fontWeight:800, lineHeight:.95, letterSpacing:'-3px', color:'var(--ink)', marginBottom:'1.25rem' }}>
          ஒரு வார்த்தை.<br/>
          <span style={{ background:'linear-gradient(135deg,var(--terra),var(--gold))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            பல அர்த்தங்கள்.
          </span>
        </h1>
        <p style={{ fontSize:17, color:'var(--ink3)', lineHeight:1.7, maxWidth:500, margin:'0 auto 2rem', fontWeight:300 }}>
          One Tamil word. Five meanings. Zero confusion.<br/>
          Master polysemy through AI-powered context challenges.
        </p>
        <button onClick={()=>setTab('game')} style={{
          display:'inline-flex', alignItems:'center', gap:10,
          background:'var(--terra)', color:'#fff',
          padding:'14px 32px', borderRadius:999, border:'none',
          fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700,
          cursor:'pointer', letterSpacing:'-.2px', transition:'all .2s',
          boxShadow:'0 4px 20px rgba(181,57,15,.3)',
        }}
          onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
        >
          <LampIcon size={22} animate={false} />
          Start playing
        </button>
      </div>

      <KolamDivider />

      {/* Word categories */}
      {CATEGORIES.map((cat, ci) => (
        <div key={ci} style={{ marginBottom:'2rem', animationDelay:`${ci*.1}s` }} className="fade-up">
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <div style={{ width:4, height:18, background:cat.color, borderRadius:2 }} />
            <span style={{ fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, color:'var(--ink2)', letterSpacing:'.04em', textTransform:'uppercase' }}>{cat.label}</span>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {cat.words.map((w, wi) => (
              <button key={wi}
                onMouseEnter={()=>setHovWord(w)}
                onMouseLeave={()=>setHovWord(null)}
                onClick={()=>handlePlay(w)}
                style={{
                  fontFamily:'Noto Sans Tamil,sans-serif',
                  fontSize:22, fontWeight:600,
                  padding:'10px 20px', borderRadius:var(--r),
                  border:`1.5px solid ${hovWord===w ? cat.color : 'rgba(200,146,42,.25)'}`,
                  background: hovWord===w ? cat.color : 'var(--cream2)',
                  color: hovWord===w ? '#fff' : 'var(--ink)',
                  cursor:'pointer',
                  transition:'all .2s cubic-bezier(.34,1.56,.64,1)',
                  transform: hovWord===w ? 'translateY(-4px) scale(1.06)' : 'none',
                  boxShadow: hovWord===w ? `0 8px 24px ${cat.color}40` : 'none',
                }}
              >{w}</button>
            ))}
          </div>
        </div>
      ))}

      <KolamDivider />

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} className="fade-up">
        {[
          { val:'150+', label:'Tamil words', sub:'across 12 categories' },
          { val:'4–6',  label:'Senses each', sub:'AI-generated in real time' },
          { val:'∞',    label:'Challenges',  sub:'never the same sentence twice' },
        ].map((s,i)=>(
          <div key={i} style={{ background:'var(--cream2)', border:'1px solid rgba(200,146,42,.2)', borderRadius:var(--r2), padding:'1.25rem', textAlign:'center' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:36, fontWeight:800, color:'var(--terra)', lineHeight:1 }}>{s.val}</div>
            <div style={{ fontWeight:600, fontSize:14, color:'var(--ink)', marginTop:4 }}>{s.label}</div>
            <div style={{ fontSize:12, color:'var(--ink3)', marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── GAME ─────────────────────────────────────────────────────────────────────
function Game({ gameWord, setGameWord, xp, setXp, streak, setStreak, history, setHistory }) {
  const [question, setQuestion] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [inputWord, setInputWord] = useState(gameWord || 'கல்')

  const fetchQuestion = useCallback(async (word) => {
    setLoading(true); setSelected(null); setAnswered(false); setQuestion(null)
    try {
      const r = await fetch(`${API}/question/${encodeURIComponent(word)}`)
      const d = await r.json()
      setQuestion(d)
    } catch { setQuestion({ error: 'Cannot reach backend. Run: uvicorn main:app --reload' }) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchQuestion(gameWord || 'கல்') }, [gameWord])

  const handleAnswer = (opt) => {
    if (answered) return
    setSelected(opt); setAnswered(true)
    const correct = opt === question.correct_answer
    if (correct) {
      setXp(x => x + 30)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
    setHistory(h => [{ word: question.word, sense: question.correct_answer, correct, ts: Date.now() }, ...h].slice(0,50))
  }

  const next = () => fetchQuestion(inputWord)

  const speak = (text) => {
    if (!window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ta-IN'; u.rate = .85
    window.speechSynthesis.speak(u)
  }

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'2rem 1.5rem' }}>

      {/* Word picker */}
      <div style={{ display:'flex', gap:8, marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <div style={{ display:'flex', flex:1, gap:0, border:'1px solid rgba(200,146,42,.35)', borderRadius:var(--r), overflow:'hidden', background:'var(--cream2)' }}>
          <input
            value={inputWord}
            onChange={e=>setInputWord(e.target.value)}
            placeholder="Type any Tamil word..."
            style={{ flex:1, padding:'10px 14px', border:'none', background:'transparent', fontFamily:'Noto Sans Tamil,sans-serif', fontSize:18, color:'var(--ink)', outline:'none' }}
          />
          <button onClick={()=>{ setGameWord(inputWord); fetchQuestion(inputWord) }}
            style={{ padding:'10px 18px', background:'var(--terra)', color:'#fff', border:'none', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13 }}>
            Go
          </button>
        </div>
        {SAMPLE_WORDS.slice(0,6).map(w=>(
          <button key={w} onClick={()=>{ setInputWord(w); setGameWord(w); fetchQuestion(w) }}
            style={{ fontFamily:'Noto Sans Tamil,sans-serif', fontSize:16, padding:'8px 14px', borderRadius:999, border:'1px solid rgba(200,146,42,.3)', background: gameWord===w?'var(--terra)':'var(--cream2)', color: gameWord===w?'#fff':'var(--ink)', cursor:'pointer', transition:'all .15s' }}>
            {w}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'4rem', color:'var(--ink3)' }}>
          <div style={{ animation:'float 1s ease-in-out infinite', display:'inline-block', marginBottom:16 }}>
            <LampIcon size={56} animate={true} />
          </div>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:15, color:'var(--terra)' }}>Gemini is thinking...</div>
          <div style={{ fontSize:13, color:'var(--ink3)', marginTop:4 }}>Generating a Tamil challenge for you</div>
        </div>
      )}

      {question?.error && (
        <div style={{ background:'#fff3e0', border:'1px solid #ffb74d', borderRadius:var(--r), padding:'1.25rem', color:'#e65100', fontSize:14 }}>
          {question.error}
        </div>
      )}

      {question && !question.error && !loading && (
        <div className="pop-in">
          {/* Sentence card */}
          <div style={{
            background:'var(--cream2)',
            border:'1px solid rgba(200,146,42,.3)',
            borderRadius:var(--r2),
            padding:'2rem',
            marginBottom:'1.25rem',
            textAlign:'center',
            position:'relative',
          }}>
            {/* Kolam corner decorations */}
            {['0 0','100% 0','0 100%','100% 100%'].map((pos,i)=>(
              <div key={i} style={{ position:'absolute', top: i<2?8:'auto', bottom: i>=2?8:'auto', left: i%2===0?8:'auto', right: i%2===1?8:'auto', width:16, height:16, opacity:.3 }}>
                <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="2" fill="var(--gold)"/><circle cx="2" cy="2" r="1.5" fill="var(--terra)"/><circle cx="14" cy="2" r="1.5" fill="var(--terra)"/><circle cx="2" cy="14" r="1.5" fill="var(--terra)"/><circle cx="14" cy="14" r="1.5" fill="var(--terra)"/></svg>
              </div>
            ))}

            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--ink4)', marginBottom:'1rem' }}>
              Fill in the blank
            </div>

            {/* Tamil sentence */}
            <div
              onClick={()=>speak(question.tamil_sentence)}
              style={{ fontFamily:'Noto Sans Tamil,sans-serif', fontSize:26, lineHeight:1.8, color:'var(--ink)', marginBottom:8, cursor:'pointer', transition:'color .15s' }}
              title="Click to hear pronunciation"
            >
              {question.tamil_sentence?.split('___').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span style={{
                      display:'inline-block',
                      minWidth:100, borderBottom:`2.5px solid ${answered ? (selected===question.correct_answer?'var(--teal)':'var(--terra)') : 'var(--gold)'}`,
                      margin:'0 6px', paddingBottom:2,
                      color: answered ? (selected===question.correct_answer?'var(--teal)':'var(--terra)') : 'transparent',
                      fontWeight:700, transition:'all .3s',
                    }}>
                      {answered ? selected : '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* English translation */}
            <div style={{ fontSize:14, color:'var(--ink3)', fontStyle:'italic' }}>
              {question.english_sentence}
            </div>

            <div style={{ fontSize:11, color:'var(--ink4)', marginTop:8 }}>
              🔊 Click sentence to hear it
            </div>
          </div>

          {/* Options */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:'1.25rem' }}>
            {question.options?.map((opt, i) => {
              const isCorrect = opt === question.correct_answer
              const isSelected = opt === selected
              let bg = 'var(--cream2)', border = '1px solid rgba(200,146,42,.3)', color = 'var(--ink)'
              if (answered) {
                if (isCorrect) { bg='rgba(26,107,90,.12)'; border='1.5px solid var(--teal)'; color='var(--teal)' }
                else if (isSelected && !isCorrect) { bg='rgba(181,57,15,.1)'; border='1.5px solid var(--terra)'; color='var(--terra)' }
              }
              return (
                <button key={i} onClick={()=>handleAnswer(opt)}
                  style={{
                    padding:'14px 16px', borderRadius:var(--r), border,
                    background:bg, color, cursor: answered?'default':'pointer',
                    fontFamily:'Noto Sans Tamil,sans-serif', fontSize:18, fontWeight:600,
                    transition:'all .2s cubic-bezier(.34,1.56,.64,1)',
                    textAlign:'left',
                    animation: answered && isSelected && !isCorrect ? 'shake .3s' : 'none',
                    transform: (!answered && isSelected) ? 'scale(1.02)' : 'none',
                  }}
                  onMouseEnter={e=>{ if(!answered) e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e=>{ if(!answered) e.currentTarget.style.transform='none' }}
                >
                  <span style={{ fontSize:11, display:'block', fontFamily:'DM Sans,sans-serif', fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase', opacity:.6, marginBottom:2 }}>
                    {answered && isCorrect ? '✓ Correct' : answered && isSelected ? '✗ Wrong' : String.fromCharCode(65+i)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {answered && (
            <div className="pop-in" style={{
              padding:'1rem 1.25rem', borderRadius:var(--r),
              background: selected===question.correct_answer ? 'rgba(26,107,90,.1)' : 'rgba(181,57,15,.1)',
              border: `1px solid ${selected===question.correct_answer ? 'var(--teal)' : 'var(--terra)'}`,
              marginBottom:'1rem',
            }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color: selected===question.correct_answer?'var(--teal)':'var(--terra)', marginBottom:4 }}>
                {selected===question.correct_answer ? `Correct! +30 XP 🎉` : `The answer is: ${question.correct_answer}`}
              </div>
              <div style={{ fontSize:13, color:'var(--ink2)' }}>
                <strong>{question.word}</strong> means <em>"{question.correct_answer}"</em> in this context
              </div>
            </div>
          )}

          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button onClick={next} style={{
              padding:'11px 28px', borderRadius:999,
              background: answered?'var(--terra)':'transparent',
              border:`1.5px solid ${answered?'var(--terra)':'rgba(200,146,42,.4)'}`,
              color: answered?'#fff':'var(--ink3)',
              fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14,
              cursor:'pointer', transition:'all .2s',
            }}>
              {answered ? 'Next question →' : 'Skip'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── EXPLORE ──────────────────────────────────────────────────────────────────
function Explore() {
  const [word, setWord]     = useState('படி')
  const [input, setInput]   = useState('படி')
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [sense, setSense]   = useState(0)

  const fetchData = async (w) => {
    setLoading(true); setData(null); setSense(0)
    try {
      const r = await fetch(`${API}/semantic/${encodeURIComponent(w)}`)
      const d = await r.json()
      setData(d)
    } catch { setData({ error: true }) }
    setLoading(false)
  }

  useEffect(() => { fetchData('படி') }, [])

  const SENSE_COLORS = ['#b5390f','#c8922a','#1a6b5a','#7c3aad','#2a4fa3','#d4491a']

  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ta-IN'; u.rate = .85
    window.speechSynthesis?.speak(u)
  }

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:'2rem 1.5rem' }}>
      {/* Search */}
      <div style={{ display:'flex', gap:8, marginBottom:'2rem' }}>
        <div style={{ flex:1, display:'flex', border:'1px solid rgba(200,146,42,.35)', borderRadius:var(--r), overflow:'hidden', background:'var(--cream2)' }}>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter'){ setWord(input); fetchData(input) }}}
            placeholder="Enter any Tamil word..."
            style={{ flex:1, padding:'12px 16px', border:'none', background:'transparent', fontFamily:'Noto Sans Tamil,sans-serif', fontSize:20, color:'var(--ink)', outline:'none' }} />
          <button onClick={()=>{ setWord(input); fetchData(input) }}
            style={{ padding:'12px 20px', background:'var(--terra)', color:'#fff', border:'none', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700 }}>
            Explore
          </button>
        </div>
        <button onClick={()=>speak(word)} style={{ padding:'12px 16px', border:'1px solid rgba(200,146,42,.3)', borderRadius:var(--r), background:'var(--cream2)', cursor:'pointer', fontSize:18 }} title="Pronounce">
          🔊
        </button>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'4rem' }}>
          <div style={{ animation:'float 1s ease-in-out infinite', display:'inline-block' }}>
            <LampIcon size={56} animate={true} />
          </div>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:600, color:'var(--terra)', marginTop:12 }}>Exploring meanings...</div>
        </div>
      )}

      {data && !data.error && !loading && (
        <div className="fade-up">
          {/* Big word header */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:'2rem', marginBottom:'2rem', paddingBottom:'2rem', borderBottom:'1px solid rgba(200,146,42,.2)' }}>
            <div onClick={()=>speak(word)} style={{ fontFamily:'Noto Sans Tamil,sans-serif', fontSize:88, fontWeight:700, lineHeight:1, color:'var(--ink)', cursor:'pointer', flexShrink:0, transition:'transform .3s cubic-bezier(.34,1.56,.64,1)' }}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'}
              onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
            >{word}</div>
            <div style={{ paddingTop:8 }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'var(--ink)', marginBottom:4 }}>
                {data.senses?.length || 0} meanings
              </div>
              <div style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.6, marginBottom:12 }}>
                Across {[...new Set(data.senses?.map(s=>s.pos))].join(', ')} categories
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {[...new Set(data.senses?.map(s=>s.pos))].map((p,i)=>(
                  <span key={i} style={{ fontSize:11, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', padding:'3px 10px', borderRadius:999, border:'1px solid currentColor', color:SENSE_COLORS[i]||'var(--ink3)' }}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sense cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:10, marginBottom:'1.5rem' }}>
            {data.senses?.map((s, i) => (
              <div key={i} onClick={()=>setSense(i)} style={{
                border: `${sense===i?'2':'1'}px solid ${sense===i?SENSE_COLORS[i]||'var(--terra)':'rgba(200,146,42,.25)'}`,
                borderRadius:var(--r2), padding:'16px 18px', cursor:'pointer',
                background: sense===i ? `${(SENSE_COLORS[i]||'#b5390f')}12` : 'var(--cream2)',
                transition:'all .2s cubic-bezier(.34,1.56,.64,1)',
                transform: sense===i ? 'translateY(-3px)' : 'none',
              }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:SENSE_COLORS[i]||'var(--terra)', marginBottom:8, fontFamily:'Syne,sans-serif' }}>{s.pos}</div>
                <div style={{ fontFamily:'Noto Sans Tamil,sans-serif', fontSize:22, fontWeight:600, color:'var(--ink)', marginBottom:4 }}>{word}</div>
                <div style={{ fontSize:13, color:'var(--ink3)', fontWeight:400 }}>{s.meaning}</div>
                {s.context && <div style={{ fontSize:11, color:'var(--ink4)', marginTop:6, fontStyle:'italic' }}>{s.context}</div>}
              </div>
            ))}
          </div>

          {/* Selected sense detail */}
          {data.senses?.[sense] && (
            <div className="pop-in" style={{ background:'var(--cream2)', border:'1px solid rgba(200,146,42,.3)', borderRadius:var(--r2), padding:'1.25rem 1.5rem' }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--ink4)', marginBottom:10, fontFamily:'Syne,sans-serif' }}>Selected sense</div>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ fontFamily:'Noto Sans Tamil,sans-serif', fontSize:36, fontWeight:700, color:SENSE_COLORS[sense]||'var(--terra)' }}>{word}</div>
                <div>
                  <div style={{ fontWeight:500, color:'var(--ink)', fontSize:16 }}>{data.senses[sense].meaning}</div>
                  <div style={{ fontSize:13, color:'var(--ink3)', marginTop:2 }}>{data.senses[sense].pos} · {data.senses[sense].context}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick word picks */}
      <KolamDivider />
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {SAMPLE_WORDS.map(w=>(
          <button key={w} onClick={()=>{ setInput(w); setWord(w); fetchData(w) }}
            style={{ fontFamily:'Noto Sans Tamil,sans-serif', fontSize:16, padding:'7px 14px', borderRadius:999, border:'1px solid rgba(200,146,42,.3)', background: word===w?'var(--terra)':'var(--cream2)', color: word===w?'#fff':'var(--ink)', cursor:'pointer', transition:'all .15s' }}>
            {w}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── SEMANTIC WEB ─────────────────────────────────────────────────────────────
function SemanticWeb() {
  const [word, setWord]   = useState('கல்')
  const [input, setInput] = useState('கல்')
  const [data, setData]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [hov, setHov]     = useState(null)
  const svgW = 640, svgH = 400, cx = 320, cy = 200, r = 150

  const fetchData = async (w) => {
    setLoading(true); setData(null)
    try {
      const res = await fetch(`${API}/semantic/${encodeURIComponent(w)}`)
      const d   = await res.json()
      setData(d)
    } catch { setData({ error: true }) }
    setLoading(false)
  }

  useEffect(() => { fetchData('கல்') }, [])

  const COLORS = ['#b5390f','#c8922a','#1a6b5a','#7c3aad','#2a4fa3','#d4491a','#854F0B','#0F6E56']

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:'2rem 1.5rem' }}>
      <div style={{ display:'flex', gap:8, marginBottom:'1.5rem' }}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter'){ setWord(input); fetchData(input) }}}
          placeholder="Tamil word..."
          style={{ flex:1, padding:'10px 14px', border:'1px solid rgba(200,146,42,.35)', borderRadius:var(--r), background:'var(--cream2)', fontFamily:'Noto Sans Tamil,sans-serif', fontSize:18, color:'var(--ink)', outline:'none' }} />
        <button onClick={()=>{ setWord(input); fetchData(input) }}
          style={{ padding:'10px 20px', background:'var(--terra)', color:'#fff', border:'none', borderRadius:var(--r), cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700 }}>Draw</button>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'4rem' }}>
          <div style={{ animation:'float 1s ease-in-out infinite', display:'inline-block' }}><LampIcon size={56} animate={true} /></div>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:600, color:'var(--terra)', marginTop:12 }}>Mapping meanings...</div>
        </div>
      )}

      {data && !data.error && !loading && (
        <div className="fade-up">
          <div style={{ background:'var(--cream2)', border:'1px solid rgba(200,146,42,.25)', borderRadius:var(--r2), overflow:'hidden', marginBottom:'1rem' }}>
            <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display:'block' }}>
              {/* Decorative kolam dots */}
              {[0,1,2,3,4,5,6,7].map(i=>{
                const a = (i/8)*Math.PI*2
                return <circle key={i} cx={cx+Math.cos(a)*30} cy={cy+Math.sin(a)*30} r="2" fill="var(--gold)" opacity=".3" />
              })}

              {/* Lines from center to nodes */}
              {data.senses?.map((s,i) => {
                const total = data.senses.length
                const angle = (i/total)*Math.PI*2 - Math.PI/2
                const nx = cx + Math.cos(angle)*r
                const ny = cy + Math.sin(angle)*r
                return (
                  <line key={i} x1={cx} y1={cy} x2={nx} y2={ny}
                    stroke={COLORS[i%COLORS.length]} strokeWidth={hov===i?2.5:1}
                    strokeOpacity={hov===i?1:.45}
                    style={{ transition:'all .2s' }} />
                )
              })}

              {/* Center node */}
              <circle cx={cx} cy={cy} r="44" fill="var(--terra)" />
              <circle cx={cx} cy={cy} r="40" fill="var(--terra2)" opacity=".5" />
              <text x={cx} y={cy-6} textAnchor="middle" dominantBaseline="central"
                style={{ fontFamily:'Noto Sans Tamil,sans-serif', fontSize:22, fontWeight:700, fill:'#fff' }}>{word}</text>
              <text x={cx} y={cy+14} textAnchor="middle"
                style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fill:'rgba(255,255,255,.7)', fontWeight:500 }}>
                {data.senses?.length} senses
              </text>

              {/* Sense nodes */}
              {data.senses?.map((s,i) => {
                const total = data.senses.length
                const angle = (i/total)*Math.PI*2 - Math.PI/2
                const nx = cx + Math.cos(angle)*r
                const ny = cy + Math.sin(angle)*r
                const col = COLORS[i%COLORS.length]
                const isHov = hov===i
                const bw = 110, bh = 54
                return (
                  <g key={i} style={{ cursor:'pointer' }}
                    onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
                    <rect x={nx-bw/2} y={ny-bh/2} width={bw} height={bh} rx="10"
                      fill={col} fillOpacity={isHov?.9:.7}
                      style={{ transition:'all .2s' }} />
                    <text x={nx} y={ny-8} textAnchor="middle" dominantBaseline="central"
                      style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, fill:'#fff' }}>
                      {s.meaning?.length>14 ? s.meaning.slice(0,13)+'…' : s.meaning}
                    </text>
                    <text x={nx} y={ny+10} textAnchor="middle"
                      style={{ fontFamily:'DM Sans,sans-serif', fontSize:10, fill:'rgba(255,255,255,.75)' }}>
                      {s.pos}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {hov !== null && data.senses?.[hov] && (
            <div className="pop-in" style={{ background:`${COLORS[hov%COLORS.length]}15`, border:`1px solid ${COLORS[hov%COLORS.length]}`, borderRadius:var(--r), padding:'1rem 1.25rem' }}>
              <strong style={{ color:COLORS[hov%COLORS.length] }}>{data.senses[hov].meaning}</strong>
              <span style={{ fontSize:12, color:'var(--ink3)', marginLeft:8 }}>{data.senses[hov].pos}</span>
              {data.senses[hov].context && <div style={{ fontSize:13, color:'var(--ink2)', marginTop:4, fontStyle:'italic' }}>{data.senses[hov].context}</div>}
            </div>
          )}

          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:'1rem' }}>
            {SAMPLE_WORDS.map(w=>(
              <button key={w} onClick={()=>{ setInput(w); setWord(w); fetchData(w) }}
                style={{ fontFamily:'Noto Sans Tamil,sans-serif', fontSize:14, padding:'5px 12px', borderRadius:999, border:'1px solid rgba(200,146,42,.3)', background:word===w?'var(--terra)':'var(--cream2)', color:word===w?'#fff':'var(--ink)', cursor:'pointer', transition:'all .15s' }}>
                {w}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── LEXI CHAT ────────────────────────────────────────────────────────────────
function LexiChat() {
  const [messages, setMessages] = useState([
    { role:'assistant', content:'வணக்கம்! I\'m Lexi 🪔 — your Tamil language guide. Ask me about any Tamil word, its meanings, or how to use it in context. I love polysemy!' }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang]       = useState('english')
  const bottomRef             = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role:'user', content:input.trim() }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs); setInput(''); setLoading(true)
    try {
      const r = await fetch(`${API}/chat`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ messages: newMsgs.map(m=>({ role:m.role, content:m.content })), lang }),
      })
      const d = await r.json()
      setMessages(m => [...m, { role:'assistant', content: d.reply }])
    } catch {
      setMessages(m => [...m, { role:'assistant', content:'Sorry, I could not connect to the backend. Please run: uvicorn main:app --reload' }])
    }
    setLoading(false)
  }

  const SUGGESTIONS = ['What does படி mean?','Explain ஆறு polysemy','Give me a Tamil word quiz','How does Lexifyd work?']

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'2rem 1.5rem' }}>
      {/* Lang toggle */}
      <div style={{ display:'flex', gap:6, marginBottom:'1rem', justifyContent:'flex-end' }}>
        {['english','tamil','mixed'].map(l=>(
          <button key={l} onClick={()=>setLang(l)} style={{
            padding:'5px 14px', borderRadius:999, border:'1px solid rgba(200,146,42,.3)',
            background: lang===l?'var(--terra)':'var(--cream2)',
            color: lang===l?'#fff':'var(--ink3)',
            fontSize:12, fontWeight:500, cursor:'pointer', textTransform:'capitalize',
          }}>{l}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ background:'var(--cream2)', border:'1px solid rgba(200,146,42,.2)', borderRadius:var(--r2), padding:'1.25rem', marginBottom:'1rem', minHeight:360, maxHeight:420, overflowY:'auto' }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ display:'flex', gap:10, marginBottom:'1rem', alignItems:'flex-start', flexDirection: m.role==='user'?'row-reverse':'row' }}>
            {m.role==='assistant' && (
              <div style={{ flexShrink:0, marginTop:2 }}><LampIcon size={32} animate={i===messages.length-1} /></div>
            )}
            <div style={{
              maxWidth:'78%', padding:'10px 14px', borderRadius:var(--r),
              background: m.role==='user' ? 'var(--terra)' : 'var(--cream)',
              color: m.role==='user' ? '#fff' : 'var(--ink)',
              border: m.role==='assistant' ? '1px solid rgba(200,146,42,.2)' : 'none',
              fontSize:14, lineHeight:1.65,
              fontFamily: m.content.match(/[\u0B80-\u0BFF]/) ? 'Noto Sans Tamil,DM Sans,sans-serif' : 'DM Sans,sans-serif',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <LampIcon size={32} animate={true} />
            <div style={{ display:'flex', gap:4 }}>
              {[0,1,2].map(i=>(
                <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'var(--gold)', animation:`float .9s ease-in-out ${i*.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:'1rem' }}>
        {SUGGESTIONS.map((s,i)=>(
          <button key={i} onClick={()=>{ setInput(s); }}
            style={{ fontSize:12, padding:'5px 12px', borderRadius:999, border:'1px solid rgba(200,146,42,.3)', background:'var(--cream2)', color:'var(--ink3)', cursor:'pointer', transition:'all .15s' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='var(--cream3)'; e.currentTarget.style.color='var(--ink)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='var(--cream2)'; e.currentTarget.style.color='var(--ink3)' }}
          >{s}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display:'flex', gap:8, border:'1px solid rgba(200,146,42,.4)', borderRadius:var(--r), overflow:'hidden', background:'var(--cream2)' }}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') send() }}
          placeholder="Ask Lexi anything about Tamil..."
          style={{ flex:1, padding:'12px 16px', border:'none', background:'transparent', fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--ink)', outline:'none' }} />
        <button onClick={send} disabled={!input.trim()||loading}
          style={{ padding:'12px 20px', background: input.trim()&&!loading?'var(--terra)':'var(--cream3)', color: input.trim()&&!loading?'#fff':'var(--ink3)', border:'none', cursor: input.trim()&&!loading?'pointer':'default', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, transition:'all .15s' }}>
          Send
        </button>
      </div>
    </div>
  )
}

// ── SESSION REPORT ────────────────────────────────────────────────────────────
function Report({ xp, streak, history }) {
  const total   = history.length
  const correct = history.filter(h=>h.correct).length
  const acc     = total ? Math.round(correct/total*100) : 0

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'2rem 1.5rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:'1.5rem' }}>
        {[
          { val: acc+'%',  label:'Accuracy',   sub: `${correct} of ${total} correct` },
          { val: xp,       label:'XP earned',  sub: `Level ${Math.floor(xp/100)+1}` },
          { val: streak,   label:'Streak',      sub: streak>0?'Keep it up! 🔥':'Start playing' },
        ].map((s,i)=>(
          <div key={i} style={{ background:'var(--cream2)', border:'1px solid rgba(200,146,42,.2)', borderRadius:var(--r2), padding:'1.25rem', textAlign:'center' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:36, fontWeight:800, color:'var(--terra)', lineHeight:1 }}>{s.val}</div>
            <div style={{ fontWeight:500, fontSize:13, color:'var(--ink)', marginTop:4 }}>{s.label}</div>
            <div style={{ fontSize:11, color:'var(--ink3)', marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <KolamDivider />

      {history.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--ink3)' }}>
          <div style={{ animation:'float 3s ease-in-out infinite', display:'inline-block', marginBottom:16 }}><LampIcon size={56} /></div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, color:'var(--ink)', marginBottom:6 }}>No games yet</div>
          <div style={{ fontSize:14 }}>Play the game to build your report</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {history.map((h,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', border:'1px solid rgba(200,146,42,.2)', borderRadius:var(--r), background:'var(--cream2)', fontSize:13 }}>
              <span style={{ fontFamily:'Noto Sans Tamil,sans-serif', fontSize:18, fontWeight:600, color:'var(--ink)', minWidth:48 }}>{h.word}</span>
              <span style={{ flex:1, color:'var(--ink3)' }}>{h.sense}</span>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color: h.correct?'var(--teal)':'var(--terra)', fontSize:12 }}>
                {h.correct ? '✓ Correct' : '✗ Wrong'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]         = useState('home')
  const [gameWord, setGameWord] = useState('கல்')
  const [xp, setXp]           = useState(0)
  const [streak, setStreak]   = useState(0)
  const [history, setHistory] = useState([])

  const PANELS = {
    home:     <Home setTab={setTab} setGameWord={setGameWord} />,
    game:     <Game gameWord={gameWord} setGameWord={setGameWord} xp={xp} setXp={setXp} streak={streak} setStreak={setStreak} history={history} setHistory={setHistory} />,
    explore:  <Explore />,
    semantic: <SemanticWeb />,
    chat:     <LexiChat />,
    report:   <Report xp={xp} streak={streak} history={history} />,
  }

  return (
    <>
      <Nav tab={tab} setTab={setTab} xp={xp} streak={streak} />
      <main style={{ minHeight:'calc(100vh - 60px)' }}>
        {PANELS[tab]}
      </main>

      {/* Footer */}
      <footer style={{ textAlign:'center', padding:'2rem', borderTop:'1px solid rgba(200,146,42,.15)', background:'var(--cream2)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}>
          <LampIcon size={24} animate={false} />
          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'var(--terra)' }}>Lexifyd</span>
          <span style={{ fontSize:12, color:'var(--ink3)' }}>· Context-Aware Tamil Polysemy Engine</span>
        </div>
        <div style={{ fontSize:11, color:'var(--ink4)' }}>TechZeal 2026 · Sona College of Technology · Powered by Gemini AI</div>
      </footer>
    </>
  )
}
