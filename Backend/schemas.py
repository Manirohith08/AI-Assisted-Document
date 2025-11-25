from pydantic import BaseModel
from typing import List, Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class OutlineRequest(BaseModel):
    topic: str
    doc_type: str

class ProjectCreate(BaseModel):
    title: str
    topic: str
    doc_type: str
    outline: List[str] 

class RefineRequest(BaseModel):
    instruction: str

# --- NEW SCHEMA FOR FEEDBACK ---
class SectionUpdate(BaseModel):
    feedback: Optional[str] = None
    user_notes: Optional[str] = None