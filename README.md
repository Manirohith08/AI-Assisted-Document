📝 AI-Assisted Document Authoring Platform

A full-stack, AI-powered web application that helps users generate, refine, and export structured business documents (Word & PowerPoint) using Google Gemini AI.

🚀 Features

User Authentication: Secure Login and Registration (JWT-based).

Project Dashboard: View and manage all existing document projects.

AI Scaffolding: * Bonus Feature: AI-Suggested Outlines for creating structured document skeletons automatically.

AI Content Generation: Automatic generation of detailed paragraphs (Word) or bullet points (PPT) for each section.

Interactive Editor:

AI Refinement: Rewrite sections (e.g., "Make it professional", "Shorten this").

Feedback Loop: Like/Dislike sections to track quality.

User Notes: Add personal comments for future edits.

Document Export: Download final results as formatted .docx or .pptx files.

🛠️ Tech Stack

Backend

Framework: FastAPI (Python)

Database: SQLite (via SQLAlchemy)

AI Model: Google Gemini 2.0 Flash (via google-generativeai)

Document Handling: python-docx, python-pptx

Authentication: python-jose, passlib[bcrypt]

Frontend

Framework: React.js (Vite)

Styling: Custom CSS (Responsive & Modern)

HTTP Client: Axios

⚙️ Setup Instructions

Prerequisites

Python 3.10+ installed.

Node.js & npm installed.

A free Google Gemini API Key from Google AI Studio.

1. Backend Setup

Navigate to the backend folder:

cd Backend


Create a virtual environment:

python -m venv venv


Activate the environment:

Windows: venv\Scripts\activate

Mac/Linux: source venv/bin/activate

Install dependencies:

pip install -r requirements.txt


Configure API Key:

Open backend/ai_service.py.

Replace the API_KEY variable with your actual Gemini API key.

2. Frontend Setup

Open a new terminal and navigate to the frontend folder:

cd Frontend


Install dependencies:

npm install


🏃‍♂️ How to Run Locally

Step 1: Start the Backend Server

In your Backend terminal (with venv active):

uvicorn main:app --reload


The server will start at http://127.0.0.1:8000

Step 2: Start the Frontend Application

In your Frontend terminal:

npm run dev


The app will run at http://localhost:5173

🌍 Deployment Instructions

Backend (Render.com)

Create a new Web Service on Render connected to your GitHub repo.

Root Directory: Backend

Build Command: pip install -r requirements.txt

Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

Environment Variables: Add GEMINI_API_KEY with your key value.

Frontend (Vercel)

Import your repo to Vercel.

Root Directory: Frontend

Environment Variable: Add VITE_API_URL pointing to your Render Backend URL (e.g., https://your-app.onrender.com).

📖 Usage Examples & Workflow

Scenario: Creating a Pitch Deck

Login/Register: Create an account.

Dashboard: Click "+ Create New Project".

Configuration:

Title: "EcoHome Startup Pitch"

Format: PowerPoint (.pptx)

Prompt: "A pitch deck for a smart thermostat startup focused on energy saving."

AI Template: Click "AI Suggest Outline". The system generates slides like "Problem", "Solution", "Market Size".

Generate: Click "Generate Full Document".

Refine: * Select the "Market Size" slide.

Type "Add statistics about US energy consumption" in the refine box.

Click "✨ AI Refine".

Export: Click "Download File" to get the .pptx.


