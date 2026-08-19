import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import (
    dashboard,
    job_market,
    skills,
    salary,
    forecast,
    resume,
    skill_gap,
    skill_graph,
    geographic,
    realtime,
    executive,
    chat,
)

app = FastAPI(
    title="SkillLens API",
    description="Market intelligence and career analytics platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(dashboard.router)
app.include_router(job_market.router)
app.include_router(skills.router)
app.include_router(salary.router)
app.include_router(forecast.router)
app.include_router(resume.router)
app.include_router(skill_gap.router)
app.include_router(skill_graph.router)
app.include_router(geographic.router)
app.include_router(realtime.router)
app.include_router(executive.router)
app.include_router(chat.router)

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.on_event("startup")
async def startup_event():
    model_dir = os.path.join(os.path.dirname(__file__), "models")
    if not os.path.isdir(model_dir):
        os.makedirs(model_dir, exist_ok=True)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "SkillLens API",
    }
