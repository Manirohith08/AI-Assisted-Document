import google.generativeai as genai
import os

# --- CONFIGURATION ---
API_KEY = "AIzaSyAjlJqQYQAXUgFQQgOrCI1wt3piAnEkwo8" 

genai.configure(api_key=API_KEY)

# ✅ UPDATED: Using the fastest, newest model available to your key
model = genai.GenerativeModel('gemini-2.0-flash')

def generate_template(topic: str, doc_type: str):
    """Generates an outline. Returns fallback data if AI fails."""
    print(f"🤖 AI Request: Generating template for '{topic}'...")
    try:
        structure_type = "Section Headers" if doc_type == "docx" else "Slide Titles"
        prompt = (
            f"Create a structured outline for a {doc_type} presentation/document about '{topic}'. "
            f"Return ONLY a list of 5 to 7 {structure_type}. "
            "Do not include numbering (like 1. or I.). Just the titles separated by newlines."
        )
        response = model.generate_content(prompt)
        
        # Parse response
        lines = [line.strip().replace('*', '').strip() for line in response.text.split('\n') if line.strip()]
        return lines

    except Exception as e:
        print(f"❌ AI ERROR (Template): {e}")
        print("⚠️ Switching to FALLBACK DATA so you can continue...")
        return [
            "Executive Summary (AI Unavailable)",
            "Market Overview",
            "Key Challenges & Opportunities",
            "Strategic Recommendations",
            "Conclusion"
        ]

def generate_section_content(topic: str, section_title: str, doc_type: str):
    """Generates section content. Returns fallback text if AI fails."""
    print(f"🤖 AI Request: Writing content for '{section_title}'...")
    try:
        if doc_type == "pptx":
            prompt = f"Write 3-4 concise bullet points for a slide titled '{section_title}'. Topic: '{topic}'."
        else:
            prompt = f"Write a detailed paragraph (100 words) for a section titled '{section_title}'. Topic: '{topic}'."
        
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        print(f"❌ AI ERROR (Content): {e}")
        return (
            f"This is placeholder content for '{section_title}'. \n"
            f"The AI service could not be reached, but the application flow is working correctly.\n"
            f"Topic Context: {topic}"
        )

def refine_content(current_content: str, instruction: str):
    """Refines text. Returns original text if AI fails."""
    print(f"🤖 AI Request: Refining content...")
    try:
        prompt = (
            f"Act as an editor. Refine this text: '{current_content}'\n"
            f"Instruction: '{instruction}'. Return ONLY the refined text."
        )
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        print(f"❌ AI ERROR (Refine): {e}")
        return f"{current_content}\n\n[Note: AI Refine failed, original text kept.]"