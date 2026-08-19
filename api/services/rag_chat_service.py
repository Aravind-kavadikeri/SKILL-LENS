import random
import re
import uuid
from typing import List, Optional


KNOWLEDGE_BASE = {
    "career_paths": {
        "software-engineer": "Software engineering involves designing, developing, testing, and maintaining software. Career progression typically goes from junior (0-2 yrs) → mid-level (2-5 yrs) → senior (5-8 yrs) → staff/principal (8+ yrs) → engineering manager or architect.",
        "data-scientist": "Data science combines statistics, programming, and domain expertise to extract insights from data. Typical progression: junior → data scientist → senior → lead → head of data. Key skills: Python, SQL, ML, statistics, and communication.",
        "ml-engineer": "ML engineering focuses on building and deploying machine learning models at scale. This is one of the fastest growing roles with 35% YoY growth. Core skills: Python, TensorFlow/PyTorch, MLOps, Docker, Kubernetes.",
        "devops-engineer": "DevOps bridges development and operations. Key concepts include CI/CD, infrastructure as code, containerization, and monitoring. Growth rate: 22% annually.",
        "data-engineer": "Data engineering is about building data pipelines and infrastructure. Often called the backbone of data science. Skills: SQL, Python, Spark, Airflow, Kafka, cloud platforms.",
    },
    "salary_info": {
        "entry": "Entry-level tech salaries in the US range from $65,000-$90,000 depending on role and location. In India, entry-level salaries range from ₹5-12 LPA for tech roles.",
        "mid": "Mid-level professionals (3-5 years) earn $90,000-$140,000 in the US and ₹15-30 LPA in India. ML engineers and data scientists typically command premium.",
        "senior": "Senior roles (7+ years) can earn $140,000-$200,000+ in the US and ₹35-70 LPA in India. Top talent at FAANG companies can earn $300,000-$500,000+.",
        "factors": "Salary depends on: location (SF/NYC premium 30-40%), industry (finance/tech pay most), education (masters +15%, PhD +30%), skills (AI/ML adds 15-25%), and company size.",
    },
    "skill_advice": {
        "trending": "Trending skills in 2025-2026: Generative AI (45% growth), LLMs (50% growth), Prompt Engineering (40% growth), MLOps (35% growth), PyTorch (28% growth), Rust (22% growth).",
        "future": "Skills with the highest future potential: AI/ML fundamentals, cloud-native development, cybersecurity, data engineering, and product thinking. Soft skills like communication and leadership remain critical.",
        "learning": "For learning tech skills: Coursera and edX for theory, Udacity for project-based, LeetCode for DSA practice, and GitHub for real-world experience. Bootcamps work well for career switchers.",
    },
    "market_trends": {
        "ai_impact": "AI is reshaping the job market. McKinsey estimates 50% of current work activities could be automated by 2030, but AI is also creating new roles. The net effect is positive for skilled workers.",
        "remote_work": "Remote tech jobs stabilized at 25-30% of all tech roles post-pandemic. Hybrid (2-3 days/week) is now the most common arrangement at 45% of companies.",
        "hiring": "Tech hiring in 2025-2026 shows strong recovery. AI/ML roles grew 35%, cloud roles 22%, and data roles 18%. Traditional software engineering grew at a moderate 8%.",
    },
    "resume_tips": {
        "ats": "90% of large companies use ATS (Applicant Tracking Systems). Optimize by: using standard section headers, including keywords from the job description, using .docx format, and avoiding tables/columns.",
        "structure": "A strong tech resume should include: contact info, professional summary (2-3 lines), technical skills section, work experience (with metrics), education, and projects.",
        "keywords": "Include these keywords for tech roles: specific programming languages, frameworks, tools, methodologies (Agile, Scrum), and domain-specific terminology.",
    },
    "skill_gaps": {
        "common": "Common skill gaps for career changers: For SWE→MLE: ML fundamentals, MLOps, statistical methods. For DA→DS: advanced ML, deployment, experimental design. For SDE→DevOps: containerization, CI/CD, monitoring.",
        "bridging": "To bridge skill gaps: 1) Identify the gap, 2) Find structured learning (courses/books), 3) Build portfolio projects, 4) Get certified, 5) Network with professionals in the target role.",
    },
    "job_search": {
        "strategy": "Effective job search strategy: 1) Target 15-20 companies, 2) Customize resume for each application, 3) Network for referrals (highest conversion), 4) Prepare systematically for interviews, 5) Follow up after applications.",
        "interview_prep": "Technical interview preparation: DSA (LeetCode medium/hard), system design (for senior roles), behavioral (STAR method), and role-specific knowledge. Most companies have 4-6 round processes.",
    },
}


class RAGChatbot:

    def __init__(self):
        self.knowledge_base = KNOWLEDGE_BASE
        self.conversations = {}

    def chat(self, message: str, conversation_id: Optional[str] = None, context: Optional[dict] = None) -> dict:
        if not conversation_id or conversation_id not in self.conversations:
            conversation_id = conversation_id or str(uuid.uuid4())
            self.conversations[conversation_id] = {"history": [], "context": context or {}}

        conv = self.conversations[conversation_id]
        conv["history"].append({"role": "user", "content": message})

        reply, sources = self.generate_response(message, conv["history"], context or {})

        conv["history"].append({"role": "assistant", "content": reply})

        suggested_questions = self._suggest_questions(message)

        return {
            "reply": reply,
            "sources": sources,
            "conversation_id": conversation_id,
            "suggested_questions": suggested_questions,
        }

    def generate_response(self, message: str, history: List[dict], context: dict) -> tuple:
        message_lower = message.lower()

        sources = []
        relevant_knowledge = []

        for topic, subtopics in self.knowledge_base.items():
            for subtopic, content in subtopics.items():
                relevance = self._compute_relevance(message_lower, subtopic, content)
                if relevance > 0.15:
                    relevant_knowledge.append((relevance, content, subtopic))

        relevant_knowledge.sort(key=lambda x: x[0], reverse=True)
        top_knowledge = relevant_knowledge[:3]

        for rel, content, subtopic in top_knowledge:
            title = subtopic.replace("_", " ").title()
            sources.append({"title": title, "relevance": round(rel, 2)})

        reply = self._compose_reply(message_lower, top_knowledge, context)

        return reply, sources

    def _compute_relevance(self, query: str, subtopic: str, content: str) -> float:
        query_tokens = set(re.findall(r'\b\w+\b', query.lower()))
        content_tokens = set(re.findall(r'\b\w+\b', content.lower()))
        subtopic_tokens = set(re.findall(r'\b\w+\b', subtopic.lower()))

        all_tokens = content_tokens | subtopic_tokens
        if not all_tokens:
            return 0

        overlap = len(query_tokens & all_tokens)
        score = overlap / max(len(all_tokens), 1) * 2

        key_terms = {
            "salary": ["salary", "pay", "compensation", "income", "earn", "money"],
            "career": ["career", "job", "role", "path", "progression", "promotion", "growth"],
            "skill": ["skill", "learn", "technology", "tool", "framework", "language"],
            "market": ["market", "trend", "hiring", "demand", "industry", "sector"],
            "resume": ["resume", "cv", "ats", "application", "interview"],
            "ai": ["ai", "artificial intelligence", "machine learning", "deep learning", "ml"],
            "gap": ["gap", "transition", "switch", "change", "move"],
        }

        for category, terms in key_terms.items():
            if any(t in query for t in terms):
                cat_subtopic = category
                if (cat_subtopic == "ai" and ("ml" in subtopic or "ai" in subtopic or "learn" in subtopic)) or \
                   cat_subtopic in subtopic:
                    score += 0.3

        return min(score, 1.0)

    def _compose_reply(self, query: str, knowledge: list, context: dict) -> str:
        if not knowledge:
            return ("I can help with career questions! Try asking about salaries, skill trends, "
                    "career paths, or resume tips. What would you like to know?")

        page_context = context.get("page", "")
        if page_context:
            page_context = page_context.strip("/").replace("-", " ").title()

        parts = []
        for rel, content, subtopic in knowledge:
            if rel > 0.5:
                parts.append(content)

        if not parts:
            parts = [c for _, c, _ in knowledge]

        reply = " ".join(parts)

        if len(reply) > 600:
            reply = reply[:600] + "..."

        questions_detected = self._detect_question_type(query)
        if questions_detected == "salary" and "salary" not in reply.lower():
            reply += " " + self.knowledge_base.get("salary_info", {}).get("factors", "")
        elif questions_detected == "trending" and "trend" not in reply.lower():
            reply += " " + self.knowledge_base.get("skill_advice", {}).get("trending", "")

        return reply.strip()

    def _detect_question_type(self, query: str) -> str:
        q = query.lower()
        if any(w in q for w in ["salary", "pay", "compensation", "earn"]):
            return "salary"
        if any(w in q for w in ["trend", "growing", "popular", "demand", "hot"]):
            return "trending"
        if any(w in q for w in ["learn", "study", "course", "skill"]):
            return "learning"
        if any(w in q for w in ["resume", "cv", "ats"]):
            return "resume"
        if any(w in q for w in ["career", "path", "job", "role"]):
            return "career"
        return "general"

    def _suggest_questions(self, last_message: str) -> List[str]:
        qtype = self._detect_question_type(last_message)

        suggestions = {
            "salary": [
                "What factors affect my salary the most?",
                "How does location impact tech salaries?",
                "What's the salary progression for ML engineers?",
            ],
            "trending": [
                "What are the most in-demand skills for 2026?",
                "How is AI changing the job market?",
                "Which industries are hiring the most right now?",
            ],
            "learning": [
                "What's the best way to learn machine learning?",
                "How long does it take to become a data scientist?",
                "Should I do a bootcamp or a master's degree?",
            ],
            "resume": [
                "How do I optimize my resume for ATS?",
                "What should I include in a tech resume?",
                "How do I explain a career gap in my resume?",
            ],
            "career": [
                "How do I transition from software engineer to ML engineer?",
                "What's the career progression for data scientists?",
                "Should I specialize or stay generalist?",
            ],
            "general": [
                "What are the highest paying tech roles?",
                "How do I switch careers into tech?",
                "What skills should I learn for future-proofing my career?",
            ],
        }

        return suggestions.get(qtype, suggestions["general"])
