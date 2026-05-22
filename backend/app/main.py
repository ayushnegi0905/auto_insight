from fastapi import FastAPI
from app.routes import upload
from app.routes import auth

from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine,Base
from app.db import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AutoInsight API running"}

app.include_router(upload.router)

app.include_router(auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

