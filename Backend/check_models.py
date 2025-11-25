import google.generativeai as genai

# Using your key from ai_service.py
API_KEY = "AIzaSyAjlJqQYQAXUgFQQgOrCI1wt3piAnEkwo8" 
genai.configure(api_key=API_KEY)

print("Checking available models for this key...")
try:
    available = []
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ FOUND: {m.name}")
            available.append(m.name)
            
    if not available:
        print("❌ No models found. Your API Key might be invalid or has no permissions.")
except Exception as e:
    print(f"❌ Error: {e}")
