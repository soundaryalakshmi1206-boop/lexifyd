from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Dict, Any
from google import genai
import os, random, json, copy, time

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TAMIL_WORDS = {
    "படி": ["read/study", "staircase/step", "unit of measure", "settle/deposit"],
    "கல்": ["stone/rock", "to learn", "hard/firm"],
    "ஆறு": ["river", "the number six", "to cool down/comfort"],
    "திங்கள்": ["Monday", "the moon", "month"],
    "கை": ["hand", "handle/grip", "branch of tree"],
    "வாய்": ["mouth", "opportunity/chance", "canal/opening"],
    "தலை": ["head", "chief/leader", "top/beginning"],
    "நில்": ["stop/stand", "land/ground", "stay"],
    "மூக்கு": ["nose", "snout", "tip/pointed end", "pride/arrogance"],
    "கண்": ["eye", "bud of a plant", "mesh of a net", "node of bamboo"],
    "காது": ["ear", "handle of a pot", "ring/earring"],
    "பல்": ["tooth", "many/several", "comb teeth"],
    "நாக்கு": ["tongue", "flame of fire", "sharp edge"],
    "விரல்": ["finger", "toe", "unit of length"],
    "மார்பு": ["chest/breast", "front side", "courage"],
    "தோல்": ["skin", "leather", "outer covering", "defeat"],
    "உதடு": ["lip", "edge/rim of vessel"],
    "கழுத்து": ["neck", "throat", "narrow part"],
    "நெஞ்சு": ["chest", "heart/courage", "front"],
    "மலை": ["mountain/hill", "to climb", "heap/pile"],
    "கடல்": ["sea/ocean", "vast expanse", "blue color"],
    "நிலம்": ["land/ground", "earth/soil", "region/place"],
    "மழை": ["rain", "shower of anything", "blessing"],
    "வெயில்": ["sunlight", "heat", "dry season"],
    "நீர்": ["water", "liquid", "tears"],
    "காற்று": ["wind/air", "breath", "rumor/news"],
    "தீ": ["fire", "harm/evil", "burning sensation"],
    "மண்": ["soil/earth", "clay", "smell of rain on earth"],
    "அலை": ["wave", "to roam/wander", "vibration"],
    "குளம்": ["pond/lake", "pool", "tank"],
    "வெள்ளம்": ["flood", "white color", "abundance"],
    "நிழல்": ["shadow/shade", "reflection", "protection"],
    "ஒளி": ["light", "brightness", "fame/glory"],
    "இருள்": ["darkness", "ignorance", "night"],
    "இலை": ["leaf", "a thin sheet", "paan leaf"],
    "பூ": ["flower", "to bloom", "zero (colloquial)"],
    "கிளை": ["branch", "division/department", "dialect"],
    "வேர்": ["root", "origin/source", "base"],
    "பழம்": ["fruit", "old/ancient", "ripe"],
    "விதை": ["seed", "origin", "to sow"],
    "தண்டு": ["stem/stalk", "stick/rod", "punishment"],
    "முள்": ["thorn", "spine", "sharp edge"],
    "கொம்பு": ["horn", "branch", "musical instrument"],
    "போ": ["go", "leave/depart", "die (euphemism)"],
    "வா": ["come", "be born", "occur/happen"],
    "நட": ["walk", "happen/occur", "dance"],
    "விழு": ["fall", "desire intensely", "worship"],
    "பிடி": ["hold/catch", "grip", "arrest", "a fistful"],
    "வை": ["place/keep", "scold", "plant"],
    "எடு": ["take/pick up", "carry", "subtract", "earn"],
    "கொடு": ["give", "sting/bite", "provide"],
    "விடு": ["leave/let go", "send", "answer", "dawn"],
    "முறி": ["break", "fold", "receipt/document"],
    "கட்டு": ["tie/bind", "build/construct", "bundle", "discipline"],
    "திற": ["open", "ability/skill", "kind/type"],
    "மூடு": ["close/shut", "cover", "stupid (slang)"],
    "தள்ளு": ["push", "reduce price", "postpone", "reject"],
    "இழு": ["pull/drag", "attract", "draw a line"],
    "சுற்று": ["revolve/rotate", "surround", "wander around"],
    "மாற்று": ["change/exchange", "alloy of metal", "remedy"],
    "வீடு": ["house/home", "to leave/quit", "liberation (spiritual)"],
    "அறை": ["room", "to hit/beat", "shelf"],
    "கதவு": ["door", "opportunity", "valve"],
    "சாவி": ["key", "musical note", "solution"],
    "பாத்திரம்": ["vessel/utensil", "character in story", "worthy person"],
    "மேடை": ["stage/platform", "raised ground", "podium"],
    "வலை": ["net", "web", "trap", "to spin"],
    "குழல்": ["pipe/tube", "flute", "hair braid"],
    "கம்பி": ["wire/rod", "telegram (old usage)", "bar"],
    "உப்பு": ["salt", "saltiness", "wit/humor"],
    "இனிப்பு": ["sweet", "sweetness", "something pleasant"],
    "கசப்பு": ["bitterness", "harsh truth", "resentment"],
    "புளி": ["tamarind", "sourness", "fermented taste"],
    "பால்": ["milk", "part/section", "gender", "a literary genre"],
    "சோறு": ["cooked rice", "food", "living/livelihood"],
    "மாவு": ["flour", "dough", "powder"],
    "புலி": ["tiger", "brave person", "a type of fish"],
    "மான்": ["deer", "honor/dignity", "a measurement"],
    "பாம்பு": ["snake", "treacherous person", "winding road"],
    "ஆடு": ["goat", "to dance/sway", "to shake"],
    "மீன்": ["fish", "the zodiac sign Pisces", "star (poetic)"],
    "பறவை": ["bird", "free person", "one who flies"],
    "யானை": ["elephant", "something massive/huge"],
    "குதிரை": ["horse", "knight (chess piece)", "quick person"],
    "நாள்": ["day", "date", "fate/destiny", "a star"],
    "இரவு": ["night", "darkness", "secrecy"],
    "காலை": ["morning", "leg/foot (poetic)", "time period"],
    "மாலை": ["evening", "garland of flowers", "necklace"],
    "வேளை": ["time/moment", "occasion", "meal time"],
    "கணம்": ["moment/instant", "group/multitude", "divine beings"],
    "நேரம்": ["time", "moment", "opportunity", "fate"],
    "பொழுது": ["time/period", "daylight", "leisure"],
    "வெள்ளை": ["white", "clean", "blank", "silver"],
    "கருப்பு": ["black", "dark", "evil/bad (metaphor)"],
    "சிவப்பு": ["red", "anger", "auspicious color"],
    "பசுமை": ["green", "freshness", "youth/immaturity"],
    "மனம்": ["mind", "heart", "desire", "mood"],
    "உள்ளம்": ["heart/mind", "inner self", "intention"],
    "ஆசை": ["desire/wish", "love/affection", "greed"],
    "பயம்": ["fear", "respect (archaic)", "cowardice"],
    "கோபம்": ["anger", "passionate desire", "wrath"],
    "அன்பு": ["love/affection", "kindness", "attachment"],
    "வலி": ["pain", "strength/power", "right side"],
    "சுகம்": ["comfort/pleasure", "health", "happiness"],
    "துக்கம்": ["sorrow/grief", "funeral rites", "heaviness"],
    "தாய்": ["mother", "source/origin", "motherland"],
    "தந்தை": ["father", "creator", "founder"],
    "குழந்தை": ["child", "innocent person", "young one"],
    "நண்பன்": ["friend", "ally", "companion"],
    "அரசன்": ["king", "ruler", "champion"],
    "மேல்": ["up/above", "more/further", "heaven", "after/next"],
    "கீழ்": ["below/down", "east (archaic)", "inferior", "south"],
    "முன்": ["front/before", "past (time)", "first"],
    "பின்": ["back/behind", "after/later", "trace/footstep"],
    "நடு": ["middle/center", "to plant", "at midnight"],
    "அளவு": ["measure/amount", "limit", "proportion", "moderation"],
    "எடை": ["weight", "importance", "gravity"],
    "நீளம்": ["length", "height", "duration"],
    "உயரம்": ["height", "elevation", "greatness"],
    "சொல்": ["word", "to say/speak", "advice"],
    "பேச்சு": ["speech/talk", "conversation", "dialect"],
    "குரல்": ["voice", "vote", "sound"],
    "ஒலி": ["sound/noise", "echo", "music note"],
    "பாட்டு": ["song", "poem", "lesson/verse"],
    "கதை": ["story/tale", "gossip", "history"],
    "செய்தி": ["news", "message", "information", "deed"],
    "வேலை": ["work/job", "errand", "servant", "function"],
    "தொழில்": ["occupation/trade", "industry", "deed/action"],
    "கூலி": ["wage/salary", "laborer", "fee"],
    "பயிற்சி": ["training/practice", "exercise", "drill"],
    "வழி": ["way/path", "method/means", "lineage/ancestry", "via"],
    "பாதை": ["path/road", "track", "way of life"],
    "ஓடு": ["run", "flow", "tile", "to function"],
    "ஏறு": ["climb/ascend", "increase", "male buffalo", "to board"],
    "இறங்கு": ["descend/get off", "decrease", "humble oneself"],
    "வேகம்": ["speed/velocity", "urgency", "momentum"],
    "பெரியது": ["big/large", "important", "elder/senior"],
    "சிறியது": ["small/little", "minor", "young/junior"],
    "புதியது": ["new thing", "fresh", "modern"],
    "பழையது": ["old thing", "ancient", "experienced"],
    "கடினம்": ["difficulty", "hardness", "cruelty"],
    "எளிமை": ["simplicity", "ease", "humility"],
    "கால்": ["leg/foot", "a quarter", "time/era"],
    "கனல்": ["fire/ember", "heat", "anger"],
    "துளி": ["drop of water", "tiny bit", "a moment"],
    "வான்": ["sky", "heaven", "rain (poetic)"],
    "இடம்": ["place/space", "left side", "opportunity"],
    "ஊர்": ["village/town", "to crawl", "to drive"],
    "நாடு": ["country/nation", "to seek", "homeland"],
    "குன்று": ["small hill", "to decrease", "to diminish"],
    "நிலை": ["state/condition", "position", "to stand firm"],
    "வகை": ["type/kind", "method", "division"],
    "தொடர்": ["to continue", "series", "connection"],
    "முடிவு": ["end/conclusion", "decision", "result"],
    "சேர்": ["to join/add", "to reach", "to collect"],
    "பிரி": ["to separate", "to divide", "farewell"],
    "மாறு": ["to change", "opposite/contrary", "exchange"],
    "மொழி": ["language", "to speak", "word"],
    "தமிழ்": ["Tamil language", "sweetness", "the Tamil people"],
    "இசை": ["music", "to agree", "harmony"],
    "கலை": ["art", "to disperse", "crescent moon"],
    "நூல்": ["thread/yarn", "book/scripture", "a unit of weight"],
    "மதி": ["moon", "intelligence", "to respect"],
    "சுடர்": ["flame", "star", "brightness"],
    "உயிர்": ["life/soul", "vowel letter", "breath"],
    "வரம்": ["boon/blessing", "boundary", "to come (archaic)"],
    "முயற்சி": ["effort/attempt", "trying", "rabbit (archaic)"],
    "பலன்": ["result/benefit", "fruit", "strength"],
    "விளைவு": ["result/outcome", "crop", "effect"],
    "வரலாறு": ["history", "biography", "origin story"],
    "காலம்": ["time/era", "death", "season"],
    "தரம்": ["quality/grade", "floor/ground", "standard"],
}



async def ask_gemini(prompt: str, retries=1) -> str:
    for attempt in range(retries + 1):
        try:
            # Note: We use the sync client here because the new google-genai 
            # client's async support might vary by environment, but in FastAPI
            # we should ideally use an async client if available. 
            # For now, we keep the client call but wrap it or ensure the handler is async.
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            if ("429" in str(e) or "RESOURCE_EXHAUSTED" in str(e)) and attempt < retries:
                import asyncio
                print(f"Wait! RATE LIMIT HIT! Retrying in 45 seconds... (Attempt {attempt+1}/{retries})")
                await asyncio.sleep(45)
                continue
            raise e
    return ""

def extract_json(text: str):
    import re
    # Find the first { or [ and the last } or ]
    match = re.search(r'(\{.*\}|\[.*\])', text, re.DOTALL)
    if match:
        return match.group(0)
    return text.strip().replace("```json", "").replace("```", "").strip()

@app.get("/")
def home():
    return {"message": "Lexifyd backend running with Gemini!", "total_words": len(TAMIL_WORDS)}


@app.get("/words")
async def list_words():
    result = [{"word": w, "sense_count": len(s)} for w, s in TAMIL_WORDS.items()]
    return {"words": result, "count": len(result)}


CACHE_FILE = "lexi_cache.json"

question_cache: Dict[str, Any] = {}
semantic_cache: Dict[str, Any] = {}

if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        try:
            cache_data = json.load(f)
            question_cache.update(cache_data.get("questions", {}))
            semantic_cache.update(cache_data.get("semantic", {}))
        except Exception:
            pass
else:
    pass

def save_cache():
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump({"questions": question_cache, "semantic": semantic_cache}, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print("Could not save cache:", e)

class ReportItem(BaseModel):
    word: str
    issue: str

@app.post("/report")
def report_hallucination(item: ReportItem):
    # In a real production environment, this would save to a database.
    print(f"🚨 FLAGGED HALLUCINATION: Word '{item.word}', Issue: '{item.issue}'")
    return {"status": "reported", "message": "Thank you! Our human-in-the-loop team will review this."}

@app.get("/question/{word}")
async def get_question(word: str, lang: str = "english"):
    if word in question_cache:
        cached = copy.deepcopy(question_cache[word])
        random.shuffle(cached["options"])
        return cached

    if word in TAMIL_WORDS:
        senses = TAMIL_WORDS[word]
        if len(senses) >= 4:
            chosen_senses = random.sample(senses, 4)
        elif len(senses) >= 2:
            chosen_senses = senses + random.choices(senses, k=4-len(senses))
        else:
            chosen_senses = [senses[0]] * 4
    else:
        chosen_senses = ["meaning 1", "meaning 2", "meaning 3", "meaning 4"]

    lang_note = f"Provide translations appropriately in {lang}." if lang not in ["english", "tamil"] else ""

    prompt = f"""You are a Tamil linguistic expert building a "Context-Aware Lexical Engine" Polysemy Challenge.
Word: "{word}"
Senses to test:
1) "{chosen_senses[0]}"
2) "{chosen_senses[1]}"
3) "{chosen_senses[2]}"
4) "{chosen_senses[3]}"

Generate FOUR distinct Tamil sentences (A, B, C, D).
Sentence A must use "{word}" in sense 1.
Sentence B must use "{word}" in sense 2.
Sentence C must use "{word}" in sense 3.
Sentence D must use "{word}" in sense 4.

Replace the word "{word}" (or its conjugated forms) with ___ in all Tamil sentences.
Provide English translations with ___ indicating the missing word.

Reply ONLY in this exact JSON format, no markdown formatting:
{{
  "word": "{word}",
  "sentences": [
    {{"id": "A", "tamil": "<sentence A with ___>", "english": "<translation A>", "correct_tamil": "<exact conjugated Tamil word for sense 1>", "correct_sense": "{chosen_senses[0]}"}},
    {{"id": "B", "tamil": "<sentence B with ___>", "english": "<translation B>", "correct_tamil": "<exact conjugated Tamil word for sense 2>", "correct_sense": "{chosen_senses[1]}"}},
    {{"id": "C", "tamil": "<sentence C with ___>", "english": "<translation C>", "correct_tamil": "<exact conjugated Tamil word for sense 3>", "correct_sense": "{chosen_senses[2]}"}},
    {{"id": "D", "tamil": "<sentence D with ___>", "english": "<translation D>", "correct_tamil": "<exact conjugated Tamil word for sense 4>", "correct_sense": "{chosen_senses[3]}"}}
  ],
  "options": [
    {{"tamil": "<correct_tamil A>", "meaning": "{chosen_senses[0]}"}},
    {{"tamil": "<correct_tamil B>", "meaning": "{chosen_senses[1]}"}},
    {{"tamil": "<correct_tamil C>", "meaning": "{chosen_senses[2]}"}},
    {{"tamil": "<correct_tamil D>", "meaning": "{chosen_senses[3]}"}}
  ]
}}
{lang_note}"""

    try:
        raw = await ask_gemini(prompt)
        raw = extract_json(raw)
        data = json.loads(raw)

        # Validate that all 4 sentences were returned
        if "sentences" not in data or len(data["sentences"]) != 4:
            return {"error": f"AI returned {len(data.get('sentences', []))} sentences instead of 4. Please try again."}
        if "options" not in data or len(data["options"]) < 4:
            return {"error": "AI returned insufficient options. Please try again."}

        # Shuffle options so the correct answers aren't always first
        random.shuffle(data["options"])

        question_cache[word] = data
        save_cache()
        return data
    except Exception as e:
        return {"error": f"Failed to generate challenge: {str(e)}"}


@app.get("/semantic/{word}")
async def get_semantic(word: str):
    if word in semantic_cache:
        return semantic_cache[word]

    senses = TAMIL_WORDS.get(word, [])

    prompt = f"""For the Tamil word "{word}", provide a semantic web analysis.
{"Known meanings: " + ", ".join(senses) if senses else "Figure out the meanings yourself."}

For each meaning give: meaning in English, part of speech (noun/verb/adjective), short context (3-5 words).

Reply ONLY as a JSON array, no extra text, no markdown:
[{{"meaning": "read", "pos": "verb", "context": "studying for exams"}}]"""

    try:
        raw = await ask_gemini(prompt)
        raw = extract_json(raw)
        data = json.loads(raw)
    except Exception:
        data = [{"meaning": s, "pos": "unknown", "context": ""} for s in senses]

    semantic_cache[word] = {"word": word, "senses": data}
    save_cache()
    return semantic_cache[word]

lexical_cache: Dict[str, Any] = {}

@app.get("/lexical/{word}")
async def get_lexical_data(word: str, lang: str = "english"):
    cache_key = f"{word}_{lang}"
    if cache_key in lexical_cache:
        return lexical_cache[cache_key]

    prompt = f"""You are a master Tamil linguist and teacher.
Generate a comprehensive, deep lexical JSON profile for the Tamil root word "{word}".
User selected language: {lang}.

The JSON EXACT structure must be:
{{
  "root_word": "{word}",
  "transliteration": "<English pronunciation guide>",
  "core_english_meaning": "<Main English meaning>",
  "core_regional_meaning": "<Main meaning in {lang} if {lang} is not english or tamil. Otherwise empty string>",
  "simple_tamil_explanation": "<A simple Tamil sentence explaining the word>",
  "usage_category": "<e.g., Daily conversation, Literature, Formal>",
  "related_words": ["<word1>", "<word2>"],
  "opposites": ["<word1>", "<word2>"],
  "grammar": {{
    "part_of_speech": "<noun/verb/adjective/etc>",
    "tense_forms": ["<past>", "<present>", "<future>"],
    "gender_forms": ["<male>", "<female>", "<neutral>"],
    "derived_forms": ["<form1>", "<form2>"]
  }},
  "meanings": [
    {{
      "meaning_english": "<Specific meaning in English based on context>",
      "meaning_regional": "<Specific meaning in {lang} if {lang} is not english/tamil. Otherwise empty string>",
      "part_of_speech": "<pos for this context>",
      "sentences": [
        {{
          "tamil": "<Tamil sentence>",
          "english": "<English translation of sentence>",
          "regional": "<Translation in {lang} if {lang} is not english/tamil. Otherwise empty string>",
          "simple_explanation": "<Brief learner explanation in English or {lang}>",
          "grammar_note": "<Why does the word change here? Tense/gender/role>",
          "breakdown": [
            {{"word": "<tamil>", "eng": "<english>", "reg": "<{lang} meaning if applicable>"}}
          ]
        }}
      ]
    }}
  ]
}}

REQUIREMENTS:
1. "meanings" array MUST contain ALL distinct polysemous meanings of "{word}" (e.g. if it's "படி", it must have meanings for 'read/study', 'staircase/step', 'unit of measure', 'settle/deposit').
2. EACH meaning in the "meanings" array MUST have EXACTLY 4 distinct, natural Tamil sentences in the "sentences" array. This is strictly required. No exceptions.
3. Everything must be valid JSON, no markdown formatting globally, just the raw JSON object. Do not include ```json.
4. If {lang} is hindi, telugu, malayalam, or kannada, YOU MUST PROVIDE all the "regional" fields (meaning_regional, regional sentence translations) as well as the English fields. English translates MUST ALSO BE INCLUDED.
"""
    try:
        raw = await ask_gemini(prompt)
        raw = extract_json(raw)
        data = json.loads(raw)
        lexical_cache[cache_key] = data
        return data
    except Exception as e:
        return {"error": f"Failed to generate lexical data: {str(e)}"}



class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    lang: str = "english"

@app.post("/chat")
async def chat(req: ChatRequest):
    history = ""
    for m in req.messages:
        role = "User" if m.role == "user" else "Thiruvalluvar"
        history += f"{role}: {m.content}\n"

    prompt = f"""You are Thiruvalluvar, the legendary ancient Tamil poet and philosopher, author of the Thirukkural.
    You are serving as the wise, calm, and encouraging guide in the "Lexifyd Tamizha" Tamil language learning app.
    
    The user is asking you a question. They have requested that you reply in {req.lang}.

    Your tone:
    - Calm, wise, respectful, and highly encouraging.
    - Deeply knowledgeable about Tamil history, culture, and linguistics.
    - Always offer a brief, powerful piece of advice or a relevant Kural quote if appropriate.
    - Treat the user as a respected student ("அன்புடையார்" / Dear learner).

    Only output the text of your response, directly addressing the user. Do not use asterisks for actions.
    Format your response with line breaks for readability.

Conversation so far:
{history}
Thiruvalluvar:"""

    try:
        reply = await ask_gemini(prompt)
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Sorry, I had trouble responding! Error: {str(e)}"}
