import json
import os
import time

# This script generates the 250-word local Lexical Database for the React App.
# You can use any free API provider here (like Groq) or Google Gemini.

TAMIL_WORDS = [
    # Add your 250 target words here. Let's start with 5 examples.
    "படி", "கல்", "ஆறு", "திங்கள்", "கை"
]

def generate_word_data(word):
    # Mock function: In production, substitute with an API call (e.g., groq or gemini)
    # The prompt should be exactly like what was in main.py lexical generation.
    return {
        "root_word": word,
        "transliteration": "Placeholder",
        "core_english_meaning": "Placeholder meaning",
        "core_regional_meaning": "",
        "simple_tamil_explanation": "Test explanation",
        "usage_category": "General",
        "related_words": ["A", "B"],
        "opposites": ["C", "D"],
        "grammar": {
            "part_of_speech": "noun",
            "tense_forms": [],
            "gender_forms": [],
            "derived_forms": []
        },
        "meanings": [
            {
                "meaning_english": "Primary Meaning",
                "meaning_regional": "",
                "part_of_speech": "noun",
                "sentences": [
                    {
                        "tamil": f"This tests {word} in sentence format",
                        "english": "Translation here",
                        "regional": "",
                        "simple_explanation": "Context",
                        "grammar_note": "Rule",
                        "breakdown": [{"word": word, "eng": "meaning", "reg": ""}]
                    }
                ]
            }
        ]
    }

if __name__ == "__main__":
    db = {}
    print("Starting generation for 250 words...")
    for i, word in enumerate(TAMIL_WORDS):
        print(f"Generating [{i+1}/{len(TAMIL_WORDS)}]: {word}")
        db[word] = generate_word_data(word)
        time.sleep(1) # Prevent rate limits
        
    # Write to the frontend data foldier
    output_path = os.path.join("..", "frontend2", "src", "data", "generated_lexical_db.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
        
    print(f"Done! Saved to {output_path}. Import this in lexical_db.js")
