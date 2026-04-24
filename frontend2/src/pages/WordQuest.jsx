import { useState, useEffect } from "react";
import { getWordsList } from "../data/lexical_db.js";

const TRANSLITERATIONS = {
  "படி":"padi","கல்":"kal","ஆறு":"aaru","திங்கள்":"thingal","கை":"kai","வாய்":"vaay",
  "தலை":"thalai","நில்":"nil","மூக்கு":"mookku","கண்":"kan","காது":"kaadhu","பல்":"pal",
  "நாக்கு":"naakku","விரல்":"viral","மார்பு":"maarbu","தோல்":"thol","உதடு":"utadu",
  "கழுத்து":"kazhuththu","நெஞ்சு":"nenju","மலை":"malai","கடல்":"kadal","நிலம்":"nilam",
  "மழை":"mazhai","வெயில்":"veyil","நீர்":"neer","காற்று":"kaatru","தீ":"thee","மண்":"man",
  "அலை":"alai","குளம்":"kulam","வெள்ளம்":"vellam","நிழல்":"nizhal","ஒளி":"oli",
  "இருள்":"irul","இலை":"ilai","பூ":"poo","கிளை":"kilai","வேர்":"ver","பழம்":"pazham",
  "விதை":"vidhai","தண்டு":"thandu","முள்":"mul","கொம்பு":"kombu","போ":"po","வா":"vaa",
  "நட":"nada","விழு":"vizhu","பிடி":"pidi","வை":"vai","எடு":"edu","கொடு":"kodu",
  "விடு":"vidu","முறி":"muri","கட்டு":"kattu","திற":"thira","மூடு":"moodu",
  "தள்ளு":"thallu","இழு":"izhu","சுற்று":"sutru","மாற்று":"maatru","வீடு":"veedu",
  "அறை":"arai","கதவு":"kadavu","சாவி":"saavi","பாத்திரம்":"paathiram","மேடை":"medai",
  "வலை":"valai","குழல்":"kuzhal","கம்பி":"kambi","உப்பு":"uppu","இனிப்பு":"inippu",
  "கசப்பு":"kasappu","புளி":"puli","பால்":"paal","சோறு":"soru","மாவு":"maavu",
  "புலி":"puli","மான்":"maan","பாம்பு":"paambu","ஆடு":"aadu","மீன்":"meen",
  "பறவை":"paravai","யானை":"yaanai","குதிரை":"kudirai","நாள்":"naal","இரவு":"iravu",
  "காலை":"kaalai","மாலை":"maalai","வேளை":"velai","கணம்":"kanam","நேரம்":"neram",
  "பொழுது":"pozhudhu","வெள்ளை":"vellai","கருப்பு":"karuppu","சிவப்பு":"sivappu",
  "பசுமை":"pasumai","மனம்":"manam","உள்ளம்":"ullam","ஆசை":"aasai","பயம்":"payam",
  "கோபம்":"kopam","அன்பு":"anbu","வலி":"vali","சுகம்":"sugam","துக்கம்":"thukkam",
  "தாய்":"thaay","தந்தை":"thandhai","குழந்தை":"kuzhandhai","நண்பன்":"nanban",
  "அரசன்":"arasan","மேல்":"mel","கீழ்":"keezh","முன்":"mun","பின்":"pin","நடு":"nadu",
  "அளவு":"alavu","எடை":"edai","நீளம்":"neelam","உயரம்":"uyaram","சொல்":"sol",
  "பேச்சு":"peechu","குரல்":"kural","ஒலி":"oli","பாட்டு":"paattu","கதை":"kathai",
  "செய்தி":"seydhi","வேலை":"velai","தொழில்":"thozhil","கூலி":"kooli","பயிற்சி":"payitri",
  "வழி":"vazhi","பாதை":"paadhai","ஓடு":"odu","ஏறு":"eru","இறங்கு":"irangu",
  "வேகம்":"vegam","மொழி":"mozhi","தமிழ்":"thamizh","இசை":"isai",
  "கலை":"kalai","நூல்":"nool","மதி":"madhi","சுடர்":"sudar","உயிர்":"uyir",
  "வரம்":"varam","முயற்சி":"muyarsi","பலன்":"palan","விளைவு":"vilaivuu",
  "வரலாறு":"varalaru","காலம்":"kaalam","தரம்":"tharam",
};

const CATEGORIES = [
  { label: "All", filter: null },
  { label: "Body", filter: ["கை","வாய்","தலை","மூக்கு","கண்","காது","பல்","நாக்கு","விரல்","மார்பு","தோல்","உதடு","கழுத்து","நெஞ்சு","கால்"] },
  { label: "Nature", filter: ["மலை","கடல்","நிலம்","மழை","வெயில்","நீர்","காற்று","தீ","மண்","அலை","குளம்","வெள்ளம்","நிழல்","ஒளி","இருள்","வான்"] },
  { label: "Action", filter: ["போ","வா","நட","விழு","பிடி","வை","எடு","கொடு","விடு","முறி","கட்டு","திற","மூடு","தள்ளு","இழு","சுற்று","ஓடு","ஏறு","இறங்கு"] },
  { label: "Emotion", filter: ["மனம்","உள்ளம்","ஆசை","பயம்","கோபம்","அன்பு","வலி","சுகம்","துக்கம்"] },
];

function SkeletonCards() {
  return (
    <div className="grid-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14, animation: `skeletonPulse 1.5s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
    </div>
  );
}

export default function WordQuest({ user, onPlay, onBack }) {
  const [allWords, setAllWords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    getWordsList()
      .then(d => { setAllWords(d.words || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const hist = user.wordHistory || [];
  const learned = new Set(hist.filter(h => h.passed > 0).map(h => h.word));
  const failed = new Set(hist.filter(h => h.attempts > 0 && h.passed === 0).map(h => h.word));

  const activeCat = CATEGORIES.find(c => c.label === category);

  const shown = allWords.filter(w => {
    if (search.trim()) {
      return w.word.includes(search.trim()) || (TRANSLITERATIONS[w.word] || "").toLowerCase().includes(search.trim().toLowerCase());
    }
    if (activeCat?.filter) return activeCat.filter.includes(w.word);
    return true;
  }).slice(0, 80);

  return (
    <div className="page" style={{ background: "#0d0a14", minHeight: "100vh" }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.04, backgroundImage: "url('/src/assets/tamil_bg.png')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0, pointerEvents: "none" }}/>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(13,10,20,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button className="back-btn" onClick={onBack}>←</button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", fontFamily: "'Inter','Outfit',sans-serif" }}>Word Quest</div>
            <div style={{ fontFamily: "'Noto Sans Tamil',sans-serif", fontSize: 11, color: "rgba(245,166,35,0.6)", fontWeight: 600 }}>சொல் தேர்வு — Choose a word</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[["⭐", user.xp || 0, "rgba(245,166,35,0.1)", "#f5a623"],
            ["🔥", user.streak || 1, "rgba(239,68,68,0.1)", "#f87171"],
            ["📊", `Lvl ${user.level === "intermediate" ? 4 : user.level === "reader" ? 3 : user.level === "basic" ? 2 : 1}`, "rgba(34,197,94,0.1)", "#4ade80"]
          ].map(([icon, val, bg, color], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: bg, borderRadius: 20, fontSize: 12, fontWeight: 700, color }}>
              {icon} {val}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
          <span>{learned.size}/{allWords.length} Mastered</span>
          <span>Each word has multiple meanings!</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${allWords.length ? (learned.size / allWords.length) * 100 : 0}%` }}/></div>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "14px 12px 100px" }}>
        {/* Search */}
        <div className="input-icon" style={{ marginBottom: 12 }}>
          <span className="icon">🔍</span>
          <input className="input" placeholder="Search words..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }}/>
        </div>

        {/* Category Chips */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14, paddingBottom: 4, scrollbarWidth: "none" }}>
          {CATEGORIES.map(c => (
            <button key={c.label} onClick={() => { setCategory(c.label); setSearch(""); }}
              className="press-effect"
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer",
                border: category === c.label ? "1.5px solid #f5a623" : "1px solid rgba(255,255,255,0.08)",
                background: category === c.label ? "rgba(245,166,35,0.12)" : "rgba(255,255,255,0.03)",
                color: category === c.label ? "#f5a623" : "rgba(255,255,255,0.5)",
                transition: "all 0.2s ease"
              }}>
              {c.label}
            </button>
          ))}
        </div>

        {loading && <SkeletonCards />}

        {/* Word grid */}
        <div className="grid-2">
          {shown.map((w, i) => {
            const isLearned = learned.has(w.word);
            const isFailed = failed.has(w.word);
            return (
              <button key={w.word} onClick={() => onPlay(w.word)} className="word-card hover-lift press-effect"
                style={{ textAlign: "left", animation: `slideUp ${0.3}s ease ${Math.min(i * 0.03, 0.6)}s both`, position: "relative" }}>
                {/* Status badge */}
                {isLearned && <div className="badge badge-success" style={{ position: "absolute", top: 8, right: 8, fontSize: 9 }}>✓ Mastered</div>}
                {isFailed && <div className="badge badge-warning" style={{ position: "absolute", top: 8, right: 8, fontSize: 9 }}>🔁 Retry</div>}

                <div className="tamil-word">{w.word}</div>
                <div className="transliteration">{TRANSLITERATIONS[w.word] || ""}</div>
                <div className="meaning-count">
                  <span>📖</span>
                  <span>{w.sense_count} meanings</span>
                </div>
              </button>
            );
          })}
        </div>

        {shown.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div>No words found for "{search || category}"</div>
          </div>
        )}
      </div>
    </div>
  );
}
