from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    doc_type = Column(String) 
    topic = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="projects")
    sections = relationship("Section", back_populates="project", cascade="all, delete-orphan")

class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    title = Column(String) 
    content = Column(Text, default="") 
    order_index = Column(Integer)
    
    # --- NEW FIELDS FOR ASSIGNMENT COMPLETION ---
    feedback = Column(String, default=None) # "like" or "dislike"
    user_notes = Column(Text, default="")   # User comments
    # --------------------------------------------
    
    project = relationship("Project", back_populates="sections")