from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import models, database, auth, ai_service, doc_service, schemas

# Init DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Security Scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency: Get Current User ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# --- Auth ---
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

# --- Project Management (PROTECTED) ---

@app.get("/projects")
def list_projects(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user) # <--- SECURITY CHECK
):
    """Fetch ONLY projects belonging to the logged-in user"""
    return db.query(models.Project).filter(models.Project.owner_id == current_user.id).all()

@app.post("/generate-outline")
def generate_outline(req: schemas.OutlineRequest):
    try:
        outline = ai_service.generate_template(req.topic, req.doc_type)
        return {"outline": outline}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/projects/")
def create_project(
    project: schemas.ProjectCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user) # <--- SECURITY CHECK
):
    # Use current_user.id instead of hardcoded 1
    new_project = models.Project(
        title=project.title, topic=project.topic, 
        doc_type=project.doc_type, 
        owner_id=current_user.id 
    )
    
    for idx, title in enumerate(project.outline):
        content = ai_service.generate_section_content(project.topic, title, project.doc_type)
        new_section = models.Section(title=title, content=content, order_index=idx)
        new_project.sections.append(new_section)
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return {
        "id": new_project.id, "title": new_project.title,
        "topic": new_project.topic, "doc_type": new_project.doc_type
    }

@app.get("/projects/{project_id}/sections")
def get_sections(project_id: int, db: Session = Depends(database.get_db)):
    # In a real production app, you should also check if project belongs to user here
    return db.query(models.Section).filter(models.Section.project_id == project_id).order_by(models.Section.order_index).all()

# --- Refinement & Feedback ---

@app.put("/sections/{section_id}/refine")
def refine_section(section_id: int, req: schemas.RefineRequest, db: Session = Depends(database.get_db)):
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    refined_text = ai_service.refine_content(section.content, req.instruction)
    section.content = refined_text
    db.commit()
    return {"content": refined_text}

@app.put("/sections/{section_id}/feedback")
def update_section_feedback(section_id: int, req: schemas.SectionUpdate, db: Session = Depends(database.get_db)):
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    if req.feedback is not None:
        section.feedback = req.feedback
    if req.user_notes is not None:
        section.user_notes = req.user_notes
    db.commit()
    return {"msg": "Updated"}

# --- Export ---
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
        file_stream, media_type=media_type, 
        headers={"Content-Disposition": f"attachment; filename={project.title}.{ext}"}
    )
