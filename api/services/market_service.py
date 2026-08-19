import random
import math
from datetime import datetime, timedelta
from typing import List, Optional


TRENDING_SKILLS_DATA = [
    {"name": "Python", "category": "programming", "base_growth": 0.25},
    {"name": "Machine Learning", "category": "ml-ai", "base_growth": 0.35},
    {"name": "Deep Learning", "category": "ml-ai", "base_growth": 0.30},
    {"name": "TensorFlow", "category": "ml-ai", "base_growth": 0.20},
    {"name": "PyTorch", "category": "ml-ai", "base_growth": 0.28},
    {"name": "Natural Language Processing", "category": "ml-ai", "base_growth": 0.32},
    {"name": "Computer Vision", "category": "ml-ai", "base_growth": 0.22},
    {"name": "Generative AI", "category": "ml-ai", "base_growth": 0.45},
    {"name": "LLM", "category": "ml-ai", "base_growth": 0.50},
    {"name": "Prompt Engineering", "category": "ml-ai", "base_growth": 0.40},
    {"name": "Kubernetes", "category": "devops", "base_growth": 0.20},
    {"name": "Docker", "category": "devops", "base_growth": 0.15},
    {"name": "AWS", "category": "cloud", "base_growth": 0.18},
    {"name": "Azure", "category": "cloud", "base_growth": 0.22},
    {"name": "GCP", "category": "cloud", "base_growth": 0.20},
    {"name": "Terraform", "category": "devops", "base_growth": 0.25},
    {"name": "MLOps", "category": "ml-ai", "base_growth": 0.35},
    {"name": "Data Engineering", "category": "data-science", "base_growth": 0.20},
    {"name": "Spark", "category": "big-data", "base_growth": 0.15},
    {"name": "Kafka", "category": "big-data", "base_growth": 0.18},
    {"name": "React", "category": "web", "base_growth": 0.12},
    {"name": "TypeScript", "category": "programming", "base_growth": 0.20},
    {"name": "Go", "category": "programming", "base_growth": 0.18},
    {"name": "Rust", "category": "programming", "base_growth": 0.22},
    {"name": "SQL", "category": "database", "base_growth": 0.08},
    {"name": "NoSQL", "category": "database", "base_growth": 0.12},
    {"name": "GraphQL", "category": "web", "base_growth": 0.15},
    {"name": "Next.js", "category": "web", "base_growth": 0.18},
    {"name": "FastAPI", "category": "web", "base_growth": 0.22},
    {"name": "Snowflake", "category": "database", "base_growth": 0.25},
    {"name": "dbt", "category": "data-science", "base_growth": 0.28},
    {"name": "Airflow", "category": "big-data", "base_growth": 0.15},
    {"name": "Data Science", "category": "data-science", "base_growth": 0.20},
    {"name": "Tableau", "category": "data-science", "base_growth": 0.10},
    {"name": "Power BI", "category": "data-science", "base_growth": 0.12},
    {"name": "Java", "category": "programming", "base_growth": 0.05},
    {"name": "JavaScript", "category": "programming", "base_growth": 0.08},
    {"name": "C++", "category": "programming", "base_growth": 0.06},
    {"name": "Git", "category": "devops", "base_growth": 0.04},
    {"name": "CI/CD", "category": "devops", "base_growth": 0.16},
]


class MarketIntelligence:

    def __init__(self):
        random.seed(42)
        self.trending_skills = TRENDING_SKILLS_DATA

    def get_market_pulse(self) -> dict:
        now = datetime.now()
        points = []
        for i in range(30, 0, -1):
            dt = now - timedelta(days=i)
            base = 65 + math.sin(i * 0.3) * 10 + random.gauss(0, 3)
            points.append({
                "date": dt.strftime("%Y-%m-%d"),
                "value": round(base, 1),
                "label": "Market Pulse",
            })
        return {"data": points}

    def get_trending_skills(self, months: int = 12) -> dict:
        now = datetime.now()
        skills_result = []

        for skill in self.trending_skills:
            growth_rate = skill["base_growth"] + random.gauss(0, 0.03)
            trend = []
            for i in range(months, 0, -1):
                dt = now - timedelta(days=30 * i)
                base_value = 50 + skill["base_growth"] * 100 * (1 - math.exp(-i * 0.1))
                noise = random.gauss(0, 3)
                trend.append({
                    "date": dt.strftime("%Y-%m-%d"),
                    "value": round(base_value + noise, 1),
                })

            skills_result.append({
                "name": skill["name"],
                "growth_rate": round(max(growth_rate, -0.1), 3),
                "category": skill["category"],
                "trend": trend,
            })

        skills_result.sort(key=lambda x: x["growth_rate"], reverse=True)
        return {"skills": skills_result}

    def get_weekly_trends(self) -> dict:
        now = datetime.now()
        weeks = []

        for w in range(8, 0, -1):
            week_start = now - timedelta(weeks=w, days=now.weekday())
            top_skills = []
            for i, skill in enumerate(random.sample(self.trending_skills, 10)):
                change = round(random.gauss(0, 5), 1)
                top_skills.append({
                    "name": skill["name"],
                    "rank": i + 1,
                    "change": change,
                })

            weeks.append({
                "week_start": week_start.strftime("%Y-%m-%d"),
                "top_skills": top_skills,
                "market_pulse": round(random.uniform(55, 85), 1),
                "new_jobs": random.randint(5000, 25000),
            })

        return {
            "weeks": weeks,
            "summary": {
                "total_change": round(random.gauss(12, 5), 1),
                "fastest_growing": random.choice(self.trending_skills)["name"],
                "fastest_declining": random.choice(self.trending_skills)["name"],
            },
        }

    def get_quarterly_report(self) -> dict:
        quarters_list = []
        for q in range(4):
            q_skills = []
            for skill in random.sample(self.trending_skills, 8):
                q_skills.append({
                    "name": skill["name"],
                    "growth_rate": round(skill["base_growth"] + random.gauss(0, 0.05), 3),
                    "demand_score": round(random.uniform(60, 100), 1),
                })

            industries = ["Technology", "Finance", "Healthcare", "E-commerce", "Consulting", "Education"]
            ind_trends = []
            for ind in industries:
                ind_trends.append({
                    "industry": ind,
                    "growth": round(random.uniform(2, 25), 1),
                })

            quarters_list.append({
                "quarter": f"Q{q + 1} 2025",
                "skills": q_skills,
                "industry_trends": ind_trends,
            })

        return {
            "quarters": quarters_list,
            "summary": {
                "top_skill": self.trending_skills[0]["name"],
                "top_industry": "Technology",
                "avg_growth": round(random.uniform(12, 18), 1),
            },
        }

    def get_executive_view(self, view: str = "executive") -> dict:
        if view == "seeker":
            return {
                "top_roles": [
                    {"role": "ML Engineer", "growth": 35, "avg_salary": 1850000},
                    {"role": "Data Scientist", "growth": 28, "avg_salary": 1550000},
                    {"role": "DevOps Engineer", "growth": 22, "avg_salary": 1400000},
                    {"role": "AI Researcher", "growth": 40, "avg_salary": 2200000},
                    {"role": "Cloud Architect", "growth": 20, "avg_salary": 2000000},
                ],
                "salary_benchmarks": [
                    {"role": "Entry Level", "p25": 650000, "p50": 850000, "p75": 1200000},
                    {"role": "Mid Level", "p25": 1200000, "p50": 1800000, "p75": 2600000},
                    {"role": "Senior", "p25": 2400000, "p50": 3500000, "p75": 4800000},
                    {"role": "Lead/Manager", "p25": 3800000, "p50": 5500000, "p75": 7500000},
                ],
                "skill_gaps": [
                    {"skill": "Generative AI", "demand": 95, "supply": 35},
                    {"skill": "LLM", "demand": 92, "supply": 30},
                    {"skill": "MLOps", "demand": 85, "supply": 40},
                    {"skill": "PyTorch", "demand": 80, "supply": 50},
                ],
                "market_outlook": {
                    "outlook": "Very Positive",
                    "hiring_intent": 78,
                    "avg_salary_growth": 12.5,
                    "top_industries_hiring": ["Technology", "Finance", "Healthcare"],
                },
            }
        elif view == "recruiter":
            return {
                "talent_scarcity": [
                    {"role": "ML Engineer", "scarcity_index": 92, "avg_days_to_hire": 65},
                    {"role": "AI Researcher", "scarcity_index": 95, "avg_days_to_hire": 80},
                    {"role": "Cloud Architect", "scarcity_index": 80, "avg_days_to_hire": 55},
                    {"role": "Data Engineer", "scarcity_index": 75, "avg_days_to_hire": 50},
                ],
                "hiring_trends": [
                    {"quarter": "Q1 2025", "tech_hires": 12500, "avg_salary": 1350000},
                    {"quarter": "Q2 2025", "tech_hires": 14000, "avg_salary": 1400000},
                    {"quarter": "Q3 2025", "tech_hires": 15500, "avg_salary": 1420000},
                    {"quarter": "Q4 2025", "tech_hires": 14800, "avg_salary": 1450000},
                ],
                "salary_ranges": [
                    {"role": "Software Engineer", "min": 600000, "max": 3500000, "median": 1450000},
                    {"role": "Data Scientist", "min": 800000, "max": 3800000, "median": 1650000},
                    {"role": "DevOps Engineer", "min": 750000, "max": 3200000, "median": 1350000},
                ],
                "candidate_clusters": [
                    {"cluster": "Early Career", "count": 4500, "traits": ["1-3 years exp", "high adaptability", "lower salary expectations"]},
                    {"cluster": "Mid Career", "count": 6200, "traits": ["4-7 years exp", "specialized skills", "seeking growth"]},
                    {"cluster": "Senior", "count": 3800, "traits": ["8+ years exp", "leadership potential", "higher salary demands"]},
                ],
            }
        else:
            return {
                "workforce_trends": [
                    {"trend": "AI/ML Adoption", "impact": "High", "workforce_affected_pct": 35},
                    {"trend": "Remote Work", "impact": "Medium", "workforce_affected_pct": 45},
                    {"trend": "Skills Obsolescence", "impact": "High", "workforce_affected_pct": 25},
                    {"trend": "Gig Economy Growth", "impact": "Medium", "workforce_affected_pct": 20},
                ],
                "strategic_insights": [
                    "AI talent gap widening - 60% of companies report difficulty hiring ML engineers",
                    "Cloud computing skills now required in 78% of tech roles, up from 45% in 2022",
                    "Generative AI creating 2.5x more jobs than it's displacing in the short term",
                    "Data literacy becoming a baseline requirement across all business functions",
                ],
                "competitive_landscape": [
                    {"company": "Tech Giants", "hiring_volume": 25000, "avg_salary": 2800000, "top_focus": "AI/ML"},
                    {"company": "Financial Services", "hiring_volume": 18000, "avg_salary": 2200000, "top_focus": "Data Engineering"},
                    {"company": "Healthcare", "hiring_volume": 12000, "avg_salary": 1500000, "top_focus": "AI/ML"},
                    {"company": "Startups", "hiring_volume": 22000, "avg_salary": 1800000, "top_focus": "Full Stack"},
                ],
                "kpi_summary": {
                    "total_jobs_market": 185000,
                    "avg_salary_yoy_growth": 12.5,
                    "talent_scarcity_index": 78,
                    "market_health_score": 82,
                    "projected_growth_next_quarter": 8.3,
                },
            }

    def get_summary(self) -> dict:
        random.seed(datetime.now().day)

        top_skills_data = []
        sorted_skills = sorted(self.trending_skills, key=lambda x: x["base_growth"], reverse=True)
        for skill in sorted_skills[:10]:
            top_skills_data.append({
                "name": skill["name"],
                "growth": round(skill["base_growth"] * 100 + random.gauss(0, 5), 1),
                "demand": round(random.uniform(70, 100), 1),
                "category": skill["category"],
            })

        current_month = datetime.now().month
        salary_trend = []
        for i in range(12, 0, -1):
            m = current_month - i
            if m < 1:
                m += 12
            month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            base = 1050000 + i * 18000 + random.gauss(0, 30000)
            salary_trend.append({
                "month": month_names[m - 1],
                "salary": round(base, -3),
            })

        return {
            "total_jobs": 185000 + random.randint(-5000, 5000),
            "total_skills": 350 + random.randint(-10, 10),
            "avg_salary": round(1250000 + random.gauss(0, 30000), -3),
            "market_pulse_score": round(68 + random.gauss(0, 5), 1),
            "job_growth_rate": round(12.5 + random.gauss(0, 2), 1),
            "top_skills": top_skills_data,
            "salary_trend": salary_trend,
        }
