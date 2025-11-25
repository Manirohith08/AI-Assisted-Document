import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ==========================================
// STYLES (Full Expanded Version)
// ==========================================
const styles = `
:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --bg: #f1f5f9;
  --surface: #ffffff;
  --text: #1e293b;
  --text-light: #64748b;
  --border: #cbd5e1;
  --success: #10b981;
  --danger: #ef4444;
}

body {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  margin: 0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Cards & Layouts */
.card {
  background: var(--surface);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  border: 1px solid var(--border);
}

.grid-layout {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

/* Forms */
input, select, textarea {
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0 1rem 0;
  border: 1px solid var(--border);
  border-radius: 6px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
  color: #1e293b; /* Force text color */
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* Buttons */
button {
  background-color: var(--primary);
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
}

button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

button.secondary {
  background-color: white;
  color: var(--text);
  border: 1px solid var(--border);
}

button.secondary:hover {
  background-color: #f8fafc;
  border-color: var(--text-light);
}

button.danger {
  background-color: var(--danger);
  color: white;
}

button.danger:hover {
  background-color: #dc2626;
}

/* Editor Layout */
.editor-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  height: 80vh;
}

.sidebar {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  overflow-y: auto;
  border: 1px solid var(--border);
}

.nav-item {
  padding: 12px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 5px;
  color: var(--text-light);
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-item:hover {
  background-color: #f8fafc;
  color: var(--primary);
}

.nav-item.active {
  background-color: #e0e7ff;
  color: var(--primary);
  font-weight: 700;
}

.main-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  overflow-y: auto;
}

.content-area {
  flex: 1;
  min-height: 300px;
  width: 100%;
  border: 1px solid #e2e8f0;
  padding: 15px;
  resize: vertical;
  font-family: inherit;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: #ffffff !important;
  color: #000000 !important;
  opacity: 1 !important;
}

.refine-bar {
  display: flex;
  gap: 10px;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  margin-bottom: 20px;
}

.feedback-box {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.project-item {
  padding: 20px;
  background: white;
  border: 1px solid var(--border);
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.project-item:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

// Automatically switch between Localhost and Real Server
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ==========================================
// COMPONENT 1: LOGIN & REGISTRATION
// ==========================================
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await axios.post(`${API_URL}/register`, { username, password });
        alert("Registration successful! You can now login.");
        setIsRegistering(false);
      } else {
        const res = await axios.post(`${API_URL}/token`, { username, password });
        onLogin(res.data.access_token);
      }
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.detail || "Authentication Failed";
      alert(msg);
    }
  };

  return (
    <div className="card" style={{maxWidth: '400px', margin: '100px auto', textAlign: 'center'}}>
      <h1 style={{color: '#4f46e5'}}>AI Doc Platform</h1>
      <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
      <p style={{color: '#64748b', marginBottom: '20px'}}>
        {isRegistering ? "Join to start creating documents." : "Sign in to access your dashboard."}
      </p>
      
      <form onSubmit={handleAuth}>
        <input 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button style={{width: '100%', marginTop: '10px'}}>
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      
      <p 
        onClick={() => setIsRegistering(!isRegistering)} 
        style={{cursor: 'pointer', color: '#4f46e5', marginTop: '20px', fontSize: '0.9rem', textDecoration: 'underline'}}
      >
        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
      </p>
    </div>
  );
};

// ==========================================
// COMPONENT 2: PROJECT CREATION WIZARD
// ==========================================
const ProjectWizard = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ title: '', topic: '', doc_type: 'docx' });
  const [outline, setOutline] = useState([]);

  // Step 1: Call Backend to get AI Outline suggestions
  const getOutline = async () => {
    if (!config.title || !config.topic) return alert("Please fill in all fields");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/generate-outline`, { 
        topic: config.topic, 
        doc_type: config.doc_type 
      });
      setOutline(res.data.outline);
      setStep(2);
    } catch (e) {
      console.error(e);
      alert("AI Error: Is backend running?");
    }
    setLoading(false);
  };

  // Step 2: Send finalized outline to Backend
  const createProject = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/projects/`, { 
        ...config, 
        outline: outline 
      });
      onComplete(res.data); 
    } catch (e) {
      console.error(e);
      alert("Creation Error. Check backend logs.");
    }
    setLoading(false);
  };

  const updateLine = (idx, val) => {
    const newArr = [...outline];
    newArr[idx] = val;
    setOutline(newArr);
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '800px', margin: '40px auto'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '60px'}}>
            <div className="spinner"></div>
            <h3>AI is working its magic...</h3>
            <p style={{color: '#64748b'}}>
              {step === 1 ? "Brainstorming structure..." : "Writing content for every section..."}
            </p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div>
                <h2>🚀 Start a New Project</h2>
                <p style={{color: '#64748b', marginBottom: '25px'}}>Define what you want to build, and our AI will handle the rest.</p>
                
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Project Title</label>
                <input 
                  value={config.title} 
                  onChange={e => setConfig({...config, title: e.target.value})} 
                  placeholder="e.g. Q3 Marketing Strategy" 
                />
                
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Document Format</label>
                <select 
                  value={config.doc_type} 
                  onChange={e => setConfig({...config, doc_type: e.target.value})}
                >
                  <option value="docx">Word Document (.docx)</option>
                  <option value="pptx">PowerPoint Presentation (.pptx)</option>
                </select>
                
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Topic / Prompt</label>
                <textarea 
                  rows={5} 
                  value={config.topic} 
                  onChange={e => setConfig({...config, topic: e.target.value})} 
                  placeholder="Describe the topic, tone, and key points you want to cover..." 
                />
                
                <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
                  <button className="secondary" onClick={onCancel}>Cancel</button>
                  <button onClick={getOutline} style={{flex: 1}}>AI Suggest Outline &rarr;</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2>📝 Review & Edit Outline</h2>
                <p style={{color: '#64748b', marginBottom: '20px'}}>
                  The AI suggested this structure. You can edit text, delete sections, or add new ones before generating content.
                </p>
                
                <div style={{maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                  {outline.map((line, idx) => (
                    <div key={idx} style={{display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center'}}>
                      <span style={{fontWeight: 'bold', color: '#cbd5e1', width: '30px'}}>#{idx+1}</span>
                      <input 
                        value={line} 
                        onChange={(e) => updateLine(idx, e.target.value)} 
                        style={{marginBottom: 0}}
                      />
                      <button 
                        className="danger" 
                        onClick={() => setOutline(outline.filter((_, i) => i !== idx))}
                        style={{padding: '8px 12px'}}
                        title="Remove Section"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    className="secondary" 
                    style={{width: '100%', marginTop: '10px', borderStyle: 'dashed'}} 
                    onClick={() => setOutline([...outline, "New Section"])}
                  >
                    + Add New Section
                  </button>
                </div>

                <div style={{display: 'flex', gap: '15px'}}>
                  <button className="secondary" onClick={() => setStep(1)}>&larr; Back</button>
                  <button onClick={createProject} style={{flex: 1}}>Generate Full Document &rarr;</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 3: EDITOR WITH FEEDBACK
// ==========================================
const Editor = ({ project, onBack }) => {
  // CRITICAL SAFETY CHECK: Prevent crash if project is undefined
  if (!project || !project.id) {
    return <div className="container"><div className="card"><h3>Loading Project Data...</h3></div></div>;
  }

  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [refining, setRefining] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [comment, setComment] = useState("");

  // Load sections when component mounts
  useEffect(() => {
    if (!project || !project.id) return;
    
    const fetchSections = async () => {
      try {
        const res = await axios.get(`${API_URL}/projects/${project.id}/sections`);
        setSections(res.data);
        if (res.data.length > 0) setActiveId(res.data[0].id);
      } catch (e) {
        console.error("Failed to load sections", e);
      }
    };
    fetchSections();
  }, [project.id]);

  // Update comment box when switching sections
  useEffect(() => {
    const sec = sections.find(s => s.id === activeId);
    if (sec) setComment(sec.user_notes || "");
  }, [activeId, sections]);

  const handleRefine = async () => {
    if (!instruction) return;
    setRefining(true);
    try {
      const res = await axios.put(`${API_URL}/sections/${activeId}/refine`, { instruction });
      // Update local state
      setSections(sections.map(s => s.id === activeId ? {...s, content: res.data.content} : s));
      setInstruction("");
    } catch (e) {
      alert("Refine Failed. Check console.");
    }
    setRefining(false);
  };

  const handleFeedback = async (type) => { // 'like' or 'dislike'
    try {
      await axios.put(`${API_URL}/sections/${activeId}/feedback`, { feedback: type });
      // Optimistic UI update
      setSections(sections.map(s => s.id === activeId ? {...s, feedback: type} : s));
    } catch (e) { console.error(e); }
  };

  const saveComment = async () => {
    try {
      await axios.put(`${API_URL}/sections/${activeId}/feedback`, { user_notes: comment });
      setSections(sections.map(s => s.id === activeId ? {...s, user_notes: comment} : s));
      alert("Note saved successfully!");
    } catch (e) { console.error(e); }
  };

  const handleDownload = () => {
    window.open(`${API_URL}/projects/${project.id}/export`, '_blank');
  };

  const activeSection = sections.find(s => s.id === activeId);

  return (
    <div className="container" style={{maxWidth: '1400px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
           <button className="secondary" onClick={onBack}>&larr; Dashboard</button>
           <div>
             <span style={{fontWeight: 'bold', fontSize: '1.2rem', display: 'block'}}>{project.title}</span>
             <span style={{fontSize: '0.8rem', color: '#64748b'}}>
               Format: <strong style={{color: '#4f46e5'}}>{project?.doc_type ? project.doc_type.toUpperCase() : "DOC"}</strong>
             </span>
           </div>
        </div>
        <button style={{background: '#10b981'}} onClick={handleDownload}>Download File ⬇</button>
      </div>

      <div className="editor-grid">
        {/* Sidebar */}
        <div className="sidebar">
          <h4 style={{marginTop: 0, padding: '0 10px', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase'}}>Outline</h4>
          {sections.map(s => (
            <div 
              key={s.id} 
              className={`nav-item ${activeId === s.id ? 'active' : ''}`} 
              onClick={() => setActiveId(s.id)}
            >
              <span>{s.title}</span>
              <div>
                {s.feedback === 'like' && <span>👍</span>}
                {s.feedback === 'dislike' && <span>👎</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeSection ? (
            <>
              <h2 style={{marginTop: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '15px'}}>{activeSection.title}</h2>
              
              <textarea 
                className="content-area" 
                value={activeSection.content} 
                readOnly 
                placeholder="Content will appear here..."
              />
              
              <div className="refine-bar">
                <input 
                  placeholder="Ask AI to refine (e.g. 'Make it shorter', 'Add statistics')" 
                  value={instruction} 
                  onChange={e => setInstruction(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRefine()}
                />
                <button onClick={handleRefine} disabled={refining} style={{minWidth: '120px'}}>
                  {refining ? "Refining..." : "✨ AI Refine"}
                </button>
              </div>

              <div className="feedback-box">
                <h4 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
                  📝 Notes & Feedback
                </h4>
                
                <div style={{marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center'}}>
                  <span style={{fontSize: '0.9rem', color: '#64748b'}}>Is this section helpful?</span>
                  <button 
                    className="secondary" 
                    style={{padding: '5px 10px', background: activeSection.feedback === 'like' ? '#dcfce7' : 'white', borderColor: activeSection.feedback === 'like' ? '#10b981' : '#e2e8f0'}} 
                    onClick={() => handleFeedback('like')}
                  >
                    👍 Like
                  </button>
                  <button 
                    className="secondary" 
                    style={{padding: '5px 10px', background: activeSection.feedback === 'dislike' ? '#fee2e2' : 'white', borderColor: activeSection.feedback === 'dislike' ? '#ef4444' : '#e2e8f0'}} 
                    onClick={() => handleFeedback('dislike')}
                  >
                    👎 Dislike
                  </button>
                </div>

                <textarea 
                  rows={2} 
                  placeholder="Add your personal comments or notes about this section..." 
                  value={comment} 
                  onChange={e => setComment(e.target.value)}
                  style={{marginBottom: '10px'}}
                />
                <button className="secondary" onClick={saveComment} style={{width: '100%'}}>Save Note</button>
              </div>
            </>
          ) : (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', flexDirection: 'column'}}>
              <div style={{fontSize: '3rem', marginBottom: '10px'}}>👈</div>
              <p>Select a section from the sidebar to start editing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 4: DASHBOARD
// ==========================================
const Dashboard = ({ onLogout, onCreate, onSelectProject }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects on load
    axios.get(`${API_URL}/projects`)
      .then(res => setProjects(res.data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <h1 style={{margin: 0}}>My Dashboard</h1>
        <button className="secondary" onClick={onLogout}>Logout</button>
      </div>

      <div className="grid-layout">
        {/* Create New Card */}
        <div 
          className="card" 
          style={{textAlign: 'center', cursor: 'pointer', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '200px', transition: 'all 0.2s'}} 
          onClick={onCreate}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#4f46e5'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
        >
          <div style={{fontSize: '3rem', color: '#cbd5e1', marginBottom: '10px'}}>+</div>
          <h3 style={{color: '#64748b', margin: 0}}>Create New Project</h3>
        </div>

        {/* Existing Projects List */}
        {projects.map(p => (
          <div key={p.id} className="card project-item" onClick={() => onSelectProject(p)} style={{display: 'block'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
              <span style={{
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                color: p.doc_type === 'docx' ? '#2563eb' : '#ea580c',
                background: p.doc_type === 'docx' ? '#dbeafe' : '#ffedd5',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                {p.doc_type ? p.doc_type.toUpperCase() : "DOC"}
              </span>
            </div>
            <h3 style={{margin: '0 0 10px 0', fontSize: '1.2rem'}}>{p.title}</h3>
            <p style={{color: '#64748b', fontSize: '0.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
              {p.topic}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP ORCHESTRATOR
// ==========================================
function App() {
  const [token, setToken] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'dashboard', 'wizard', 'editor'
  const [currentProject, setCurrentProject] = useState(null);

  // Handle View Routing
  const renderContent = () => {
    if (!token) {
      return <Login onLogin={(t) => { setToken(t); setView('dashboard'); }} />;
    }
    
    switch (view) {
      case 'wizard':
        return (
          <ProjectWizard 
            onCancel={() => setView('dashboard')} 
            onComplete={(p) => { setCurrentProject(p); setView('editor'); }} 
          />
        );
      case 'editor':
        return (
          <Editor 
            project={currentProject} 
            onBack={() => setView('dashboard')} 
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard 
            onLogout={() => setToken(null)} 
            onCreate={() => setView('wizard')} 
            onSelectProject={(p) => { setCurrentProject(p); setView('editor'); }} 
          />
        );
    }
  };

  return (
    <>
      <style>{styles}</style>
      {renderContent()}
    </>
  );
}

export default App;
