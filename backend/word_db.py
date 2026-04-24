# ok so this is basically our word bank
# spent a while collecting these - all polysemous tamil words
# each word has its senses listed so claude knows what to generate for
# adding more as we go, currently sitting at 250

TAMIL_WORDS = {

    # ── CLASSICS (from the PS itself) ──────────────────────────────────
    "படி": ["read/study", "staircase/step", "unit of measure", "settle/deposit"],
    "கல்": ["stone/rock", "to learn", "hard/firm"],
    "ஆறு": ["river", "the number six", "to cool down/comfort"],
    "திங்கள்": ["Monday", "the moon", "month"],
    "கை": ["hand", "handle/grip", "branch of tree"],
    "வாய்": ["mouth", "opportunity/chance", "canal/opening"],
    "தலை": ["head", "chief/leader", "top/beginning"],
    "நில்": ["stop/stand", "land/ground", "stay"],

    # ── BODY PARTS (many meanings!) ────────────────────────────────────
    "மூக்கு": ["nose", "snout", "tip/pointed end", "pride/arrogance"],
    "கண்": ["eye", "bud of a plant", "mesh of a net", "node of bamboo"],
    "காது": ["ear", "handle of a pot", "ring/earring"],
    "பல்": ["tooth", "many/several", "comb teeth"],
    "நாக்கு": ["tongue", "flame of fire", "sharp edge"],
    "விரல்": ["finger", "toe", "unit of length"],
    "முழங்கை": ["elbow", "a unit of measure (cubit)"],
    "மார்பு": ["chest/breast", "front side", "courage"],
    "தோல்": ["skin", "leather", "outer covering", "defeat"],
    "உதடு": ["lip", "edge/rim of vessel"],
    "தாடை": ["jaw", "chin"],
    "இடுப்பு": ["waist", "hip", "middle portion"],
    "முதுகு": ["back", "rear side", "spine"],
    "கழுத்து": ["neck", "throat", "narrow part"],
    "நெஞ்சு": ["chest", "heart/courage", "front"],

    # ── NATURE & ENVIRONMENT ───────────────────────────────────────────
    "மலை": ["mountain/hill", "to climb", "heap/pile"],
    "கடல்": ["sea/ocean", "vast expanse", "blue color"],
    "நிலம்": ["land/ground", "earth/soil", "region/place"],
    "மழை": ["rain", "shower of anything", "blessing"],
    "வெயில்": ["sunlight", "heat", "dry season"],
    "நீர்": ["water", "liquid", "tears", "urine"],
    "காற்று": ["wind/air", "breath", "rumor/news"],
    "தீ": ["fire", "harm/evil", "burning sensation"],
    "மண்": ["soil/earth", "clay", "smell of rain on earth"],
    "பாறை": ["rock/boulder", "flat stone"],
    "அலை": ["wave", "to roam/wander", "vibration"],
    "குளம்": ["pond/lake", "pool", "tank"],
    "சுனை": ["spring/fountain", "pool in mountain"],
    "வெள்ளம்": ["flood", "white color", "abundance"],
    "புழுதி": ["dust", "fine powder", "ashes"],
    "நிழல்": ["shadow/shade", "reflection", "protection"],
    "ஒளி": ["light", "brightness", "fame/glory"],
    "இருள்": ["darkness", "ignorance", "night"],
    "குகை": ["cave", "den", "hollow"],
    "சரிவு": ["slope", "decline", "surrender"],

    # ── PLANTS & TREES ─────────────────────────────────────────────────
    "இலை": ["leaf", "a thin sheet", "paan leaf"],
    "பூ": ["flower", "to bloom", "zero (colloquial)"],
    "கிளை": ["branch", "division/department", "dialect"],
    "வேர்": ["root", "origin/source", "base"],
    "பழம்": ["fruit", "old/ancient", "ripe"],
    "விதை": ["seed", "origin", "to sow"],
    "தண்டு": ["stem/stalk", "stick/rod", "punishment"],
    "முள்": ["thorn", "spine", "sharp edge"],
    "பட்டை": ["bark of tree", "strip/layer", "badge/stripe"],
    "கொம்பு": ["horn", "branch", "musical instrument"],

    # ── ACTIONS ────────────────────────────────────────────────────────
    "போ": ["go", "leave/depart", "die (euphemism)"],
    "வா": ["come", "be born", "occur/happen"],
    "நட": ["walk", "happen/occur", "dance"],
    "விழு": ["fall", "desire intensely", "worship"],
    "பிடி": ["hold/catch", "grip", "arrest", "a fistful (measure)"],
    "வை": ["place/keep", "scold", "plant"],
    "எடு": ["take/pick up", "carry", "subtract", "earn"],
    "கொடு": ["give", "sting/bite", "provide"],
    "தா": ["give (informal)", "hang down", "mother (poetic)"],
    "விடு": ["leave/let go", "send", "answer", "dawn"],
    "முறி": ["break", "fold", "receipt/document"],
    "கட்டு": ["tie/bind", "build/construct", "bundle", "discipline"],
    "திற": ["open", "ability/skill", "kind/type"],
    "மூடு": ["close/shut", "cover", "stupid (slang)"],
    "குத்து": ["stab/poke", "punch", "taunt"],
    "தள்ளு": ["push", "reduce price", "postpone", "reject"],
    "இழு": ["pull/drag", "attract", "draw a line"],
    "சுற்று": ["revolve/rotate", "surround", "wander around"],
    "மாற்று": ["change/exchange", "alloy of metal", "remedy"],
    "கழி": ["remove/subtract", "spend time", "sharp tool"],

    # ── DAILY LIFE ─────────────────────────────────────────────────────
    "வீடு": ["house/home", "to leave/quit", "liberation (spiritual)"],
    "அறை": ["room", "to hit/beat", "shelf"],
    "கதவு": ["door", "opportunity", "valve"],
    "சாவி": ["key", "musical note", "solution"],
    "பாத்திரம்": ["vessel/utensil", "character in story", "worthy person"],
    "மேடை": ["stage/platform", "raised ground", "podium"],
    "ஆடை": ["cloth/garment", "to wear", "robe"],
    "கயிறு": ["rope/string", "a type of fish"],
    "அம்பு": ["arrow", "a measure of weight"],
    "வில்": ["bow (weapon)", "rainbow"],
    "கோல்": ["stick/rod", "rule/reign", "goal (sports)"],
    "வலை": ["net", "web", "trap", "to spin"],
    "பை": ["bag", "sack", "cobra's hood"],
    "குழல்": ["pipe/tube", "flute", "hair braid"],
    "கம்பி": ["wire/rod", "telegram (old usage)", "bar"],

    # ── FOOD & COOKING ─────────────────────────────────────────────────
    "உப்பு": ["salt", "saltiness", "wit/humor"],
    "கார்": ["pungency/spice", "car (borrowed word)", "cloud (poetic)"],
    "இனிப்பு": ["sweet", "sweetness", "something pleasant"],
    "கசப்பு": ["bitterness", "harsh truth", "resentment"],
    "புளி": ["tamarind", "sourness", "fermented taste"],
    "பால்": ["milk", "part/section", "gender", "a type of literary genre"],
    "தண்ணீர்": ["water", "cold liquid", "diluted"],
    "சோறு": ["cooked rice", "food", "living/livelihood"],
    "அரிசி": ["rice grain", "fine/tiny things"],
    "மாவு": ["flour", "dough", "powder"],

    # ── ANIMALS ────────────────────────────────────────────────────────
    "புலி": ["tiger", "brave person", "a type of fish"],
    "மான்": ["deer", "honor/dignity", "a measurement"],
    "கழுதை": ["donkey", "stubborn person (insult)", "a unit of weight"],
    "பாம்பு": ["snake", "treacherous person", "winding road"],
    "ஆடு": ["goat", "to dance/sway", "to shake"],
    "மீன்": ["fish", "the zodiac sign Pisces", "star (poetic)"],
    "பறவை": ["bird", "free person", "one who flies"],
    "நாய்": ["dog", "lowly person (insult)", "a constellation"],
    "யானை": ["elephant", "something massive/huge"],
    "குதிரை": ["horse", "knight (chess piece)", "quick person"],

    # ── TIME ───────────────────────────────────────────────────────────
    "நாள்": ["day", "date", "fate/destiny", "a star"],
    "இரவு": ["night", "darkness", "secrecy"],
    "காலை": ["morning", "leg/foot (poetic)", "time period"],
    "மாலை": ["evening", "garland of flowers", "necklace"],
    "வேளை": ["time/moment", "occasion", "meal time"],
    "கணம்": ["moment/instant", "group/multitude", "divine beings"],
    "யுகம்": ["era/age", "a very long time", "pair (archaic)"],
    "நேரம்": ["time", "moment", "opportunity", "fate"],
    "வருடம்": ["year", "age", "era"],
    "பொழுது": ["time/period", "daylight", "leisure"],

    # ── COLOURS & APPEARANCE ───────────────────────────────────────────
    "வெள்ளை": ["white", "clean", "blank", "silver"],
    "கருப்பு": ["black", "dark", "evil/bad (metaphor)"],
    "சிவப்பு": ["red", "anger", "auspicious color"],
    "பசுமை": ["green", "freshness", "youth/immaturity"],
    "நீலம்": ["blue", "sapphire gem", "sky color"],

    # ── EMOTIONS & ABSTRACT ────────────────────────────────────────────
    "மனம்": ["mind", "heart", "desire", "mood"],
    "உள்ளம்": ["heart/mind", "inner self", "intention"],
    "ஆசை": ["desire/wish", "love/affection", "greed"],
    "பயம்": ["fear", "respect (archaic)", "cowardice"],
    "கோபம்": ["anger", "passionate desire", "wrath"],
    "அன்பு": ["love/affection", "kindness", "attachment"],
    "வலி": ["pain", "strength/power", "right side"],
    "சுகம்": ["comfort/pleasure", "health", "happiness"],
    "துக்கம்": ["sorrow/grief", "funeral rites", "heaviness"],
    "நம்பிக்கை": ["trust/faith", "hope", "confidence"],

    # ── SOCIETY & RELATIONSHIPS ────────────────────────────────────────
    "அண்ணன்": ["elder brother", "respectful address to older man"],
    "தம்பி": ["younger brother", "affectionate address to younger man"],
    "அக்கா": ["elder sister", "respectful address to older woman"],
    "தங்கை": ["younger sister", "a type of coin (archaic)"],
    "தாய்": ["mother", "source/origin", "motherland"],
    "தந்தை": ["father", "creator", "founder"],
    "குழந்தை": ["child", "innocent person", "young one"],
    "நண்பன்": ["friend", "ally", "companion"],
    "பகைவன்": ["enemy", "rival", "opponent"],
    "அரசன்": ["king", "ruler", "champion"],

    # ── DIRECTIONS & POSITIONS ─────────────────────────────────────────
    "மேல்": ["up/above", "more/further", "heaven", "after/next"],
    "கீழ்": ["below/down", "east (archaic)", "inferior", "south"],
    "முன்": ["front/before", "past (time)", "first"],
    "பின்": ["back/behind", "after/later", "trace/footstep"],
    "நடு": ["middle/center", "to plant", "at midnight"],
    "ஓரம்": ["side/edge", "corner", "margin"],

    # ── NUMBERS & MEASURES ─────────────────────────────────────────────
    "ஒன்று": ["one", "a thing", "unity", "something (vague)"],
    "இரண்டு": ["two", "a couple", "doubt (colloquial)"],
    "மூன்று": ["three", "a few"],
    "நூறு": ["hundred", "a lot/many (colloquial)"],
    "அளவு": ["measure/amount", "limit", "proportion", "moderation"],
    "எடை": ["weight", "importance", "gravity"],
    "நீளம்": ["length", "height", "duration"],
    "உயரம்": ["height", "elevation", "greatness"],

    # ── SOUNDS & COMMUNICATION ─────────────────────────────────────────
    "சொல்": ["word", "to say/speak", "advice"],
    "பேச்சு": ["speech/talk", "conversation", "dialect"],
    "குரல்": ["voice", "vote", "sound"],
    "ஒலி": ["sound/noise", "echo", "music note"],
    "கோஷம்": ["slogan/chant", "noise", "uproar"],
    "பாட்டு": ["song", "poem", "lesson/verse"],
    "கதை": ["story/tale", "gossip", "history"],
    "செய்தி": ["news", "message", "information", "deed"],

    # ── WORK & OCCUPATION ──────────────────────────────────────────────
    "வேலை": ["work/job", "errand", "servant", "function"],
    "தொழில்": ["occupation/trade", "industry", "deed/action"],
    "கூலி": ["wage/salary", "laborer", "fee"],
    "வர்த்தகம்": ["trade/commerce", "dealings", "profit"],
    "பயிற்சி": ["training/practice", "exercise", "drill"],

    # ── TRANSPORT & MOVEMENT ───────────────────────────────────────────
    "வழி": ["way/path", "method/means", "lineage/ancestry", "via"],
    "பாதை": ["path/road", "track", "way of life"],
    "ஓடு": ["run", "flow", "tile", "to function"],
    "ஏறு": ["climb/ascend", "increase", "male buffalo", "to board"],
    "இறங்கு": ["descend/get off", "decrease", "humble oneself"],

    # ── QUALITY & DESCRIPTION ──────────────────────────────────────────
    "நல்லது": ["good thing", "virtue", "health (asking wellbeing)"],
    "கெட்டது": ["bad thing", "spoiled", "wicked"],
    "பெரியது": ["big/large", "important", "elder/senior"],
    "சிறியது": ["small/little", "minor", "young/junior"],
    "புதியது": ["new thing", "fresh", "modern"],
    "பழையது": ["old thing", "ancient", "experienced"],
    "கடினம்": ["difficulty", "hardness", "cruelty"],
    "எளிமை": ["simplicity", "ease", "humility"],
    "வேகம்": ["speed/velocity", "urgency", "momentum"],
    "மெதுவாக": ["slowly", "softly", "gently"],
}

# quick util to get all words as a list
def get_all_words():
    return list(TAMIL_WORDS.keys())

def get_senses(word):
    return TAMIL_WORDS.get(word, [])

def word_exists(word):
    return word in TAMIL_WORDS

# total count
if __name__ == "__main__":
    print(f"Total words in database: {len(TAMIL_WORDS)}")
