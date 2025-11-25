from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import models, database, auth, ai_service, doc_service, schemas

# Init DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth Routes ---
@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_pw = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    return {"msg": "User created successfully"}

@app.post("/token")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"access_token": auth.create_access_token({"sub": db_user.username}), "token_type": "bearer"}

# --- Core Logic ---

# 1. List Projects (REQUIRED for Dashboard)
@app.get("/projects")
def list_projects(db: Session = Depends(database.get_db)):
    """Fetch all projects for the dashboard"""
    return db.query(models.Project).all()

# 2. Generate Template (Bonus Feature)
@app.post("/generate-outline")
def generate_outline(req: schemas.OutlineRequest):
    try:
        outline = ai_service.generate_template(req.topic, req.doc_type)
        return {"outline": outline}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Create Project (Safe Atomic Version)
@app.post("/projects/")
def create_project(project: schemas.ProjectCreate, db: Session = Depends(database.get_db)):
    # 1. Create Project Object
    new_project = models.Project(
        title=project.title, 
        topic=project.topic, 
        doc_type=project.doc_type, 
        owner_id=1 
    )
    
    # 2. Generate Content in Memory
    for idx, title in enumerate(project.outline):
        content = ai_service.generate_section_content(project.topic, title, project.doc_type)
        new_section = models.Section(
            title=title, 
            content=content, 
            order_index=idx
        )
        new_project.sections.append(new_section)
    
    # 3. Save Everything Once
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    # 4. Return Safe Dictionary
    return {
        "id": new_project.id,
        "title": new_project.title,
        "topic": new_project.topic,
        "doc_type": new_project.doc_type
    }

@app.get("/projects/{project_id}/sections")
def get_sections(project_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Section).filter(models.Section.project_id == project_id).order_by(models.Section.order_index).all()

@app.put("/sections/{section_id}/refine")
def refine_section(section_id: int, req: schemas.RefineRequest, db: Session = Depends(database.get_db)):
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    refined_text = ai_service.refine_content(section.content, req.instruction)
    section.content = refined_text
    db.commit()
    return {"content": refined_text}

# 4. Feedback & Comments (REQUIRED for Assignment)
@app.put("/sections/{section_id}/feedback")
def update_section_feedback(section_id: int, req: schemas.SectionUpdate, db: Session = Depends(database.get_db)):
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    if req.feedback is not None:
        section.feedback = req.feedback
    if req.user_notes is not None:
        section.user_notes = req.user_notes
    db.commit()
    return {"msg": "Updated"}

@app.get("/projects/{project_id}/export")
def export_project(project_id: int, db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    sections = db.query(models.Section).filter(models.Section.project_id == project_id).all()
    
    if project.doc_type == "docx":
        file_stream = doc_service.export_docx(project, sections)
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ext = "docx"
    else:
        file_stream = doc_service.export_pptx(project, sections)
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ext = "pptx"
        
    return StreamingResponse(
        file_stream, 
        media_type=media_type, 
        headers={"Content-Disposition": f"attachment; filename={project.title}.{ext}"}
    )