import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ==========================================
// 1. STYLES (Full CSS)
// ==========================================
const styles = `
:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --bg: #f8fafc;
  --surface: #ffffff;
  --text: #0f172a;
  --text-light: #64748b;
  --border: #e2e8f0;
  --success: #10b981;
  --danger: #ef4444;
  --font-main: 'Inter', system-ui, -apple-system, sans-serif;
}

body {
  font-family: var(--font-main);
  background-color: var(--bg);
  color: var(--text);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Cards */
.card {
  background: var(--surface);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
  border: 1px solid var(--border);
}

/* Grid Layouts */
.grid-layout {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.editor-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  height: 82vh;
}

/* Inputs */
input, select, textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  margin: 0.5rem 0 1.2rem 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 1rem;
  color: var(--text);
  background-color: #fff;
  transition: all 0.2s ease;
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
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

button.secondary {
  background-color: white;
  color: var(--text);
  border: 1px solid var(--border);
}

button.secondary:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

button.danger {
  background-color: #fee2e2;
  color: var(--danger);
  border: 1px solid #fecaca;
}

button.danger:hover {
  background-color: #fecaca;
}

/* Sidebar */
.sidebar {
  background: var(--surface);
  border-radius: 12px;
  padding: 1.5rem;
  overflow-y: auto;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  color: var(--text-light);
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.nav-item:hover {
  background-color: #f1f5f9;
  color: var(--primary);
}

.nav-item.active {
  background-color: #e0e7ff;
  color: var(--primary);
  border-color: #c7d2fe;
  font-weight: 700;
}

/* Main Content Area */
.main-content {
  background: var(--surface);
  border-radius: 12px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  overflow-y: auto;
}

/* The Document Paper */
.content-area {
  flex: 1;
  min-height: 400px;
  width: 100%;
  border: 1px solid var(--border);
  padding: 2rem;
  resize: none;
  font-family: 'Georgia', serif; /* Document feel */
  font-size: 1.15rem;
  line-height: 1.7;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #ffffff;
  color: #0f172a; /* Force Dark Text */
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.content-area:focus {
  outline: none;
  border-color: var(--primary);
}

/* Feedback & Refine Tools */
.refine-bar {
  display: flex;
  gap: 12px;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  margin-bottom: 1.5rem;
}

.feedback-box {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-top: auto;
}

/* Project Cards */
.project-item {
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.project-item:hover {
  border-color: var(--primary);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.project-tag {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tag-docx { background: #dbeafe; color: #1d4ed8; }
.tag-pptx { background: #ffedd5; color: #c2410c; }

/* Loader */
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 30px auto;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ==========================================
// 2. AUTHENTICATION COMPONENT
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
        alert("Registration successful! Please login.");
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
    <div className="container" style={{display: 'flex', alignItems: 'center', height: '100vh'}}>
      <div className="card" style={{maxWidth: '400px', margin: '0 auto', width: '100%'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{color: '#4f46e5', margin: '0 0 10px 0'}}>AI Doc Platform</h1>
          <p style={{color: '#64748b', margin: 0}}>
            {isRegistering ? "Create your account" : "Sign in to your workspace"}
          </p>
        </div>
        
        <form onSubmit={handleAuth}>
          <label style={{fontWeight: 600, fontSize: '0.9rem'}}>Username</label>
          <input 
            placeholder="Enter username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          
          <label style={{fontWeight: 600, fontSize: '0.9rem'}}>Password</label>
          <input 
            type="password" 
            placeholder="Enter password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          <button style={{width: '100%', marginTop: '1rem'}}>
            {isRegistering ? "Create Account" : "Sign In"}
          </button>
        </form>
        
        <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
          <button 
            className="secondary" 
            style={{border: 'none', background: 'none', textDecoration: 'underline', color: '#64748b'}}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Already have an account? Login" : "New here? Create account"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. PROJECT WIZARD (AI SCAFFOLDING)
// ==========================================
const ProjectWizard = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ title: '', topic: '', doc_type: 'docx' });
  const [outline, setOutline] = useState([]);

  // Step 1: AI Outline Generation
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
      alert("AI Error: Could not generate outline. Is the backend running?");
    }
    setLoading(false);
  };

  // Step 2: Final Project Creation
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
      alert("Creation Error: Failed to save project.");
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
            <h3>AI is working...</h3>
            <p style={{color: '#64748b'}}>
              {step === 1 ? "Analyzing topic & generating outline..." : "Writing content for every section..."}
            </p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div>
                <h2 style={{marginTop: 0}}>🚀 Start New Project</h2>
                <p style={{color: '#64748b', marginBottom: '25px'}}>Tell us what you want to build.</p>
                
                <label style={{fontWeight: 'bold'}}>Project Title</label>
                <input 
                  value={config.title} 
                  onChange={e => setConfig({...config, title: e.target.value})} 
                  placeholder="e.g. 2025 Market Analysis" 
                />
                
                <label style={{fontWeight: 'bold'}}>Document Format</label>
                <select 
                  value={config.doc_type} 
                  onChange={e => setConfig({...config, doc_type: e.target.value})}
                >
                  <option value="docx">Word Document (.docx)</option>
                  <option value="pptx">PowerPoint Presentation (.pptx)</option>
                </select>
                
                <label style={{fontWeight: 'bold'}}>Topic / Prompt</label>
                <textarea 
                  rows={5} 
                  value={config.topic} 
                  onChange={e => setConfig({...config, topic: e.target.value})} 
                  placeholder="Describe the content, tone, and key points..." 
                />
                
                <div style={{display: 'flex', gap: '15px', marginTop: '20px'}}>
                  <button className="secondary" onClick={onCancel}>Cancel</button>
                  <button onClick={getOutline} style={{flex: 1}}>AI Suggest Outline &rarr;</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{marginTop: 0}}>📝 Review Outline</h2>
                <p style={{color: '#64748b', marginBottom: '20px'}}>
                  Review the structure before generating content. You can edit or remove sections.
                </p>
                
                <div style={{maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#f8fafc'}}>
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
// 4. EDITOR (CONTENT, REFINE, FEEDBACK)
// ==========================================
const Editor = ({ project, onBack }) => {
  // CRITICAL FIX: Prevent crash if project is missing
  if (!project || !project.id) {
    return (
      <div className="container">
        <div className="card" style={{textAlign: 'center'}}>
          <h3>Loading Project Data...</h3>
          <button className="secondary" onClick={onBack}>Go Back</button>
        </div>
      </div>
    );
  }

  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [refining, setRefining] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [comment, setComment] = useState("");

  // Fetch Sections
  useEffect(() => {
    if (!project.id) return;
    
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

  // Sync comment box with active section
  useEffect(() => {
    const sec = sections.find(s => s.id === activeId);
    if (sec) setComment(sec.user_notes || "");
  }, [activeId, sections]);

  // AI Refinement
  const handleRefine = async () => {
    if (!instruction) return;
    setRefining(true);
    try {
      const res = await axios.put(`${API_URL}/sections/${activeId}/refine`, { instruction });
      setSections(sections.map(s => s.id === activeId ? {...s, content: res.data.content} : s));
      setInstruction("");
    } catch (e) {
      alert("Refine Failed. Please try again.");
    }
    setRefining(false);
  };

  // Like / Dislike
  const handleFeedback = async (type) => {
    try {
      await axios.put(`${API_URL}/sections/${activeId}/feedback`, { feedback: type });
      setSections(sections.map(s => s.id === activeId ? {...s, feedback: type} : s));
    } catch (e) { console.error(e); }
  };

  // Save User Note
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
             <h2 style={{margin: 0, fontSize: '1.5rem'}}>{project.title}</h2>
             <span className={`project-tag tag-${project?.doc_type || 'docx'}`} style={{marginTop: '5px', display: 'inline-block'}}>
               {project?.doc_type ? project.doc_type.toUpperCase() : "DOC"}
             </span>
           </div>
        </div>
        <button style={{background: '#10b981'}} onClick={handleDownload}>Download File ⬇</button>
      </div>

      <div className="editor-grid">
        {/* Sidebar */}
        <div className="sidebar">
          <h4 style={{marginTop: 0, padding: '0 10px', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Outline</h4>
          {sections.map(s => (
            <div 
              key={s.id} 
              className={`nav-item ${activeId === s.id ? 'active' : ''}`} 
              onClick={() => setActiveId(s.id)}
            >
              <span>{s.title}</span>
              <div style={{display: 'flex', gap: '5px'}}>
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
              <h1 style={{marginTop: 0, paddingBottom: '15px', borderBottom: '1px solid #e2e8f0'}}>{activeSection.title}</h1>
              
              <textarea 
                className="content-area" 
                value={activeSection.content} 
                readOnly 
                placeholder="Content will appear here..."
              />
              
              {/* AI Tools */}
              <div className="refine-bar">
                <input 
                  placeholder="Ask AI to refine (e.g. 'Make it shorter', 'Add statistics')" 
                  value={instruction} 
                  onChange={e => setInstruction(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRefine()}
                />
                <button onClick={handleRefine} disabled={refining} style={{minWidth: '130px'}}>
                  {refining ? "Generating..." : "✨ AI Refine"}
                </button>
              </div>

              {/* Feedback & Notes */}
              <div className="feedback-box">
                <h4 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                  📝 Notes & Feedback
                </h4>
                
                <div style={{marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center'}}>
                  <span style={{fontSize: '0.9rem', color: '#64748b', fontWeight: 500}}>Rate this content:</span>
                  <button 
                    className="secondary" 
                    style={{padding: '6px 12px', background: activeSection.feedback === 'like' ? '#dcfce7' : 'white', borderColor: activeSection.feedback === 'like' ? '#10b981' : '#e2e8f0'}} 
                    onClick={() => handleFeedback('like')}
                  >
                    👍 Like
                  </button>
                  <button 
                    className="secondary" 
                    style={{padding: '6px 12px', background: activeSection.feedback === 'dislike' ? '#fee2e2' : 'white', borderColor: activeSection.feedback === 'dislike' ? '#ef4444' : '#e2e8f0'}} 
                    onClick={() => handleFeedback('dislike')}
                  >
                    👎 Dislike
                  </button>
                </div>

                <textarea 
                  rows={3} 
                  placeholder="Add your personal notes here (these are saved)..." 
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
              <p style={{fontSize: '1.1rem'}}>Select a section from the sidebar to start editing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. DASHBOARD (PROJECT LIST)
// ==========================================
const Dashboard = ({ onLogout, onCreate, onSelectProject }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/projects`)
      .then(res => setProjects(res.data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <h1 style={{margin: 0, color: '#1e293b'}}>My Dashboard</h1>
        <button className="secondary" onClick={onLogout}>Logout</button>
      </div>

      <div className="grid-layout">
        {/* Create New Card */}
        <div 
          className="card" 
          style={{textAlign: 'center', cursor: 'pointer', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '220px', transition: 'all 0.2s', background: 'transparent'}} 
          onClick={onCreate}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#4f46e5'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
        >
          <div style={{fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px'}}>+</div>
          <h3 style={{color: '#64748b', margin: 0}}>Create New Project</h3>
        </div>

        {/* Existing Projects */}
        {projects.map(p => (
          <div key={p.id} className="project-item" onClick={() => onSelectProject(p)}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
              <span className={`project-tag tag-${p.doc_type}`}>
                {p.doc_type.toUpperCase()}
              </span>
            </div>
            <h3 style={{margin: '0 0 10px 0', fontSize: '1.3rem', color: '#1e293b'}}>{p.title}</h3>
            <p style={{color: '#64748b', fontSize: '0.95rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
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
  const [view, setView] = useState('login'); 
  const [currentProject, setCurrentProject] = useState(null);

  // Setup Axios Token Header
  const handleLogin = (t) => {
    setToken(t);
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setView('dashboard');
  };

  // Handle View Routing
  const renderContent = () => {
    if (!token) {
      return <Login onLogin={handleLogin} />;
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
            onLogout={() => {
              setToken(null); 
              delete axios.defaults.headers.common['Authorization'];
            }} 
            onCreate={() => setView('wizard')} 
            onSelectProject={(p) => { setCurrentProject(p); setView('editor'); }} 
          />
        );
    }
  };

  return (
    <>
      {/* Inject CSS */}
      <style>{styles}</style>
      {renderContent()}
    </>
  );
}

export default App;
