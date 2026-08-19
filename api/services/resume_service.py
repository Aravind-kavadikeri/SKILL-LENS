import io
import re
import math
from typing import List, Tuple, Dict, Set, Optional
from collections import Counter

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    import docx
except ImportError:
    docx = None


ROLE_SKILLS: Dict[str, Set[str]] = {
    "software-engineer": {"python", "java", "javascript", "typescript", "git", "docker", "sql", "react", "node.js", "aws", "ci/cd", "rest", "api", "microservices", "agile", "linux", "debugging", "testing", "oop", "data-structures", "algorithms"},
    "data-scientist": {"python", "r", "sql", "machine-learning", "deep-learning", "statistics", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "jupyter", "data-visualization", "matplotlib", "seaborn", "hypothesis-testing", "regression", "classification", "nlp", "feature-engineering", "a/b-testing"},
    "ml-engineer": {"python", "machine-learning", "deep-learning", "tensorflow", "pytorch", "docker", "kubernetes", "mlops", "sql", "aws", "git", "nlp", "computer-vision", "data-pipelines", "model-deployment", "api", "rest", "scikit-learn", "feature-engineering", "hyperparameter-tuning"},
    "devops-engineer": {"python", "bash", "docker", "kubernetes", "terraform", "ansible", "jenkins", "ci/cd", "aws", "azure", "gcp", "linux", "git", "prometheus", "grafana", "monitoring", "logging", "networking", "security", "automation", "shell-scripting"},
    "data-engineer": {"python", "sql", "spark", "kafka", "airflow", "hadoop", "aws", "gcp", "docker", "postgresql", "mongodb", "snowflake", "bigquery", "etl", "data-pipelines", "data-warehouse", "data-lake", "streaming", "batch-processing", "orchestration"},
    "frontend-developer": {"javascript", "typescript", "react", "angular", "vue", "html", "css", "next.js", "git", "responsive-design", "webpack", "rest", "api", "testing", "jest", "cypress", "ux", "figma", "sass", "redux", "tailwind"},
    "backend-developer": {"python", "java", "node.js", "sql", "postgresql", "mongodb", "docker", "aws", "fastapi", "django", "flask", "git", "rest", "api", "microservices", "redis", "rabbitmq", "testing", "ci/cd", "linux", "go"},
    "fullstack-developer": {"python", "javascript", "typescript", "react", "node.js", "sql", "postgresql", "mongodb", "docker", "aws", "git", "html", "css", "rest", "api", "ci/cd", "testing", "redis", "linux", "agile", "next.js"},
    "product-manager": {"communication", "leadership", "teamwork", "problem-solving", "critical-thinking", "project-management", "data-analysis", "sql", "analytics", "user-research", "agile", "scrum", "roadmapping", "a/b-testing", "stakeholder-management", "product-strategy", "market-research", "wireframing", "prototyping"},
    "data-analyst": {"sql", "python", "excel", "tableau", "power-bi", "statistics", "pandas", "communication", "data-visualization", "data-cleaning", "data-wrangling", "hypothesis-testing", "regression", "a/b-testing", "reporting", "dashboard"},
    "cloud-architect": {"aws", "azure", "gcp", "docker", "kubernetes", "terraform", "python", "networking", "security", "linux", "communication", "leadership", "microservices", "serverless", "cloudformation", "architecture", "cost-optimization", "high-availability", "disaster-recovery"},
    "security-engineer": {"python", "bash", "linux", "networking", "security", "aws", "docker", "kubernetes", "penetration-testing", "vulnerability-assessment", "encryption", "authentication", "authorization", "siem", "firewall", "ids/ips", "compliance", "risk-assessment"},
    "ai-researcher": {"python", "machine-learning", "deep-learning", "tensorflow", "pytorch", "nlp", "computer-vision", "generative-ai", "reinforcement-learning", "statistics", "r", "mathematics", "research", "communication", "publications", "experiment-design", "probability", "linear-algebra", "calculus"},
    "business-analyst": {"sql", "excel", "data-analysis", "communication", "problem-solving", "critical-thinking", "project-management", "teamwork", "requirements-gathering", "stakeholder-management", "process-modeling", "uml", "agile", "documentation", "data-visualization"},
    "qa-engineer": {"python", "java", "selenium", "testing", "ci/cd", "docker", "git", "problem-solving", "attention-to-detail", "communication", "api-testing", "performance-testing", "test-automation", "manual-testing", "bug-tracking", "jira", "cypress"},
}

ALL_SKILLS: Set[str] = set()
for skills in ROLE_SKILLS.values():
    ALL_SKILLS.update(skills)

# Additional common tech skills & soft skills
EXTRA_SKILLS: Set[str] = {
    "c++", "c#", "go", "ruby", "rust", "scala", "graphql", "nosql", "elasticsearch",
    "kafka", "rabbitmq", "redis", "dynamodb", "sqlite", "oracle", "mysql",
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "cross-functional leadership", "mentorship", "code review", "system architecture",
    "ci/cd", "devops", "mlops", "generative ai", "llms", "rag", "langchain", "prompt engineering"
}
ALL_SKILLS.update(EXTRA_SKILLS)

SKILL_ALIASES: Dict[str, str] = {
    "js": "javascript",
    "ecmascript": "javascript",
    "reactjs": "react",
    "react.js": "react",
    "ts": "typescript",
    "py": "python",
    "k8s": "kubernetes",
    "kube": "kubernetes",
    "postgres": "postgresql",
    "postgresql": "postgresql",
    "aws cloud": "aws",
    "amazon web services": "aws",
    "gcp": "gcp",
    "google cloud": "gcp",
    "google cloud platform": "gcp",
    "azure": "azure",
    "microsoft azure": "azure",
    "node": "node.js",
    "nodejs": "node.js",
    "node.js": "node.js",
    "tf": "tensorflow",
    "scikit learn": "scikit-learn",
    "sklearn": "scikit-learn",
    "ai": "ai",
    "artificial intelligence": "ai",
    "ml": "machine-learning",
    "dl": "deep-learning",
    "nlp": "nlp",
    "cv": "computer-vision",
    "docker": "docker",
    "ci cd": "ci/cd",
    "ci/cd": "ci/cd",
    "rest api": "rest",
    "restful": "rest",
    "graphql": "graphql",
    "sql": "sql",
    "nosql": "nosql",
    "power bi": "power-bi",
    "powerbi": "power-bi",
    "tableau": "tableau",
    "excel": "excel",
    "ms excel": "excel",
    "nextjs": "next.js",
    "next.js": "next.js",
    "vuejs": "vue",
    "vue.js": "vue",
    "angularjs": "angular",
}

ACTION_VERBS: Set[str] = {
    "architected", "spearheaded", "engineered", "optimized", "scaled", "deployed",
    "reduced", "increased", "accelerated", "transformed", "designed", "developed",
    "implemented", "launched", "mentored", "orchestrated", "automated", "built",
    "expanded", "generated", "pioneered", "overhauled", "strengthened", "delivered",
    "led", "directed", "formulated", "established", "maximized", "integrated"
}

EDUCATION_KEYWORDS: Dict[str, str] = {
    "iit": "btech-tier1",
    "nit": "btech-tier1",
    "bits pilani": "btech-tier1",
    "iiit": "btech-tier1",
    "phd": "phd",
    "ph.d": "phd",
    "doctorate": "phd",
    "m.tech": "mtech",
    "mtech": "mtech",
    "m.e.": "mtech",
    "me": "mtech",
    "masters": "masters",
    "master's": "masters",
    "master": "masters",
    "msc": "masters",
    "m.s.": "masters",
    "mca": "mca",
    "bca": "bca",
    "b.tech": "btech",
    "btech": "btech",
    "b.e.": "btech",
    "be": "btech",
    "bchelors": "bachelors",
    "bachelor's": "bachelors",
    "bachelor": "bachelors",
    "b.s.": "bachelors",
    "bs": "bachelors",
    "high school": "high-school",
    "bootcamp": "bootcamp",
    "boot camp": "bootcamp",
}


class ResumeAnalyzer:

    def __init__(self):
        self.role_skills = ROLE_SKILLS

    def _extract_text(self, content: bytes, filename: str) -> str:
        fn_lower = filename.lower()

        # Handle PDF files
        if (fn_lower.endswith(".pdf") or content.startswith(b"%PDF")) and pdfplumber:
            try:
                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    pages_text = []
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            pages_text.append(page_text)
                    extracted = "\n".join(pages_text)
                    if extracted.strip():
                        return extracted
            except Exception:
                pass

        # Handle DOCX files
        if (fn_lower.endswith(".docx") or content.startswith(b"PK\x03\x04")) and docx:
            try:
                doc = docx.Document(io.BytesIO(content))
                paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                extracted = "\n".join(paragraphs)
                if extracted.strip():
                    return extracted
            except Exception:
                pass

        # Fallback text decoding
        try:
            return content.decode("utf-8", errors="ignore")
        except Exception:
            return content.decode("latin-1", errors="ignore")

    def _extract_skills(self, text_lower: str) -> List[str]:
        found = set()
        for skill in ALL_SKILLS:
            escaped = re.escape(skill)
            # Match with word boundaries or special boundary symbols
            pattern = r'(?:\b|_)' + escaped + r'(?:\b|_)'
            if re.search(pattern, text_lower):
                found.add(skill)

        # Check aliases
        for alias, main_skill in SKILL_ALIASES.items():
            escaped = re.escape(alias)
            pattern = r'(?:\b|_)' + escaped + r'(?:\b|_)'
            if re.search(pattern, text_lower):
                found.add(main_skill)

        return sorted(list(found))

    def _extract_contact_info(self, text: str) -> dict:
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        phone_match = re.search(r'(\+?\d{1,3}[\s\.-]?)?\(?\d{3}\)?[\s\.-]?\d{3}[\s\.-]?\d{4}', text)
        linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w\-]+', text, re.IGNORECASE)
        github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/[\w\-]+', text, re.IGNORECASE)
        portfolio_match = re.search(r'(?:https?://)?(?:www\.)?[\w\-]+\.(?:io|me|dev|com)', text, re.IGNORECASE)

        pf_url = None
        if portfolio_match:
            val = portfolio_match.group(0)
            if "linkedin" not in val.lower() and "github" not in val.lower():
                pf_url = val

        return {
            "email": email_match.group(0) if email_match else None,
            "phone": phone_match.group(0) if phone_match else None,
            "linkedin": linkedin_match.group(0) if linkedin_match else None,
            "github": github_match.group(0) if github_match else None,
            "portfolio": pf_url,
        }

    def _extract_sections(self, text_lower: str) -> Tuple[List[str], List[str]]:
        expected_sections = {
            "Experience": ["experience", "employment history", "work history", "career history", "professional experience"],
            "Education": ["education", "academic background", "qualification", "qualifications", "academic"],
            "Skills": ["skills", "technical skills", "core competencies", "technologies", "expertise"],
            "Projects": ["projects", "personal projects", "key projects", "academic projects"],
            "Certifications": ["certifications", "licenses", "certificates", "credentials"],
        }
        found_sections = []
        missing_sections = []

        for sec_name, keywords in expected_sections.items():
            if any(kw in text_lower for kw in keywords):
                found_sections.append(sec_name)
            else:
                missing_sections.append(sec_name)

        return found_sections, missing_sections

    def _analyze_impact_and_verbs(self, text_lower: str) -> Tuple[int, int, float]:
        # Count action verbs
        found_verbs = [v for v in ACTION_VERBS if re.search(r'\b' + re.escape(v) + r'\b', text_lower)]
        verb_count = len(found_verbs)

        # Count metrics / numbers
        metric_patterns = [
            r'\b\d+(?:\.\d+)?%',                      # Percentages
            r'\$\d+(?:,\d+)*(?:\.\d+)?[kmbKMB]?',       # Dollar values
            r'\b\d+\s*(?:x|times)\b',                   # Multipliers
            r'\b(?:saved|increased|reduced|improved|grew|scaled|managed|led)\s+.*?\b\d+', # Action + number
            r'\b\d+\+\s*(?:users|clients|projects|team members|engineers|microservices|requests)\b'
        ]
        metrics_found = set()
        for pat in metric_patterns:
            for m in re.findall(pat, text_lower, re.IGNORECASE):
                metrics_found.add(m)

        metrics_count = len(metrics_found)

        # Calculate impact score (0-100)
        # 5+ action verbs gives up to 50 pts; 3+ metrics gives up to 50 pts
        verb_score = min(50.0, (verb_count / 5.0) * 50.0)
        metric_score = min(50.0, (metrics_count / 3.0) * 50.0)
        impact_score = round(verb_score + metric_score, 1)

        return verb_count, metrics_count, impact_score

    def analyze(
        self,
        file_content: bytes,
        filename: str,
        target_role: Optional[str] = None,
        job_description: Optional[str] = None
    ) -> dict:
        text = self._extract_text(file_content, filename)
        text_lower = text.lower()

        found_skills = self._extract_skills(text_lower)
        experience_years = self._extract_experience(text_lower)
        education_level = self._extract_education(text_lower)
        contact_info = self._extract_contact_info(text)
        sections_found, sections_missing = self._extract_sections(text_lower)
        action_verbs_count, metrics_count, impact_score = self._analyze_impact_and_verbs(text_lower)

        # Calculate Role Match Scores
        role_scores = {}
        for role, skills in self.role_skills.items():
            matched = sum(1 for s in skills if s in found_skills)
            score = round((matched / max(len(skills), 1)) * 100, 1)
            role_scores[role] = score

        sorted_roles = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)
        suggested = [
            {"role": r.replace("-", " ").title(), "match_score": s}
            for r, s in sorted_roles[:5] if s > 0
        ]

        # Determine evaluation role (user specified target_role or best auto-detected role)
        if target_role:
            target_key = target_role.lower().replace(" ", "-")
            eval_role = target_key if target_key in self.role_skills else sorted_roles[0][0]
        else:
            eval_role = sorted_roles[0][0] if sorted_roles else "software-engineer"

        target_skills = self.role_skills.get(eval_role, set())

        # If job description is provided, extract JD skills and merge into target skills
        if job_description:
            jd_skills = set(self._extract_skills(job_description.lower()))
            if jd_skills:
                target_skills = target_skills | jd_skills

        matched_target_skills = set(found_skills) & target_skills
        missing = list(target_skills - set(found_skills))

        # 4-Pillar ATS Scoring Model
        # Pillar 1: Keyword & Technical Fit Score (40%)
        keyword_score = round((len(matched_target_skills) / max(len(target_skills), 1)) * 100, 1)

        # Pillar 2: Impact & Quantifiable Accomplishments Score (25%)
        # (impact_score computed above)

        # Pillar 3: Formatting & Parsability (20%)
        # Deduct if text too short or contact info missing
        formatting_deductions = 0
        if not contact_info["email"]:
            formatting_deductions += 15
        if not contact_info["phone"]:
            formatting_deductions += 10
        if len(text.strip()) < 200:
            formatting_deductions += 30
        formatting_score = max(30.0, 100.0 - formatting_deductions)

        # Pillar 4: Section Completeness & Experience Alignment (15%)
        section_score = round((len(sections_found) / 5.0) * 100, 1)
        exp_score = min(100.0, (experience_years / 5.0) * 100)
        alignment_score = round(section_score * 0.6 + exp_score * 0.4, 1)

        # Overall Multi-Pillar ATS Score
        overall_ats = (
            keyword_score * 0.40 +
            impact_score * 0.25 +
            formatting_score * 0.20 +
            alignment_score * 0.15
        )
        ats_score = round(overall_ats, 1)

        # ATS Recommendations
        recommendations = []
        if not contact_info["email"]:
            recommendations.append("High Priority: Include a professional email address at the top of your resume.")
        if not contact_info["linkedin"]:
            recommendations.append("Add your LinkedIn profile link to improve recruiter verification and contactability.")
        if metrics_count < 2:
            recommendations.append(f"Quantify your achievements: Only {metrics_count} metrics found. Add numbers, %, or $ values to highlight results.")
        if action_verbs_count < 4:
            recommendations.append("Start bullet points with strong action verbs (e.g. Architected, Spearheaded, Optimized, Scaled).")
        if missing:
            recommendations.append(f"Add missing key skills for {eval_role.replace('-', ' ').title()}: {', '.join(missing[:5])}.")
        if "Experience" in sections_missing or "Education" in sections_missing:
            recommendations.append(f"Ensure clear standard section headers: Missing {', '.join(sections_missing[:2])}.")
        if not recommendations:
            recommendations.append("Your resume is exceptionally well optimized for ATS! Consider adding subtle project metrics for an extra boost.")

        summary = f"Resume analyzed for {eval_role.replace('-', ' ').title()} with an overall ATS score of {ats_score}/100. "
        summary += f"Identified {len(found_skills)} technical skills and {metrics_count} quantifiable metrics across {experience_years} years of experience."

        ats_breakdown = {
            "keyword_score": keyword_score,
            "impact_score": impact_score,
            "formatting_score": formatting_score,
            "section_score": section_score,
            "experience_score": exp_score,
            "action_verbs_count": action_verbs_count,
            "metrics_count": metrics_count,
            "contact_info": contact_info,
            "sections_found": sections_found,
            "sections_missing": sections_missing,
        }

        return {
            "ats_score": ats_score,
            "skills_found": found_skills,
            "missing_skills": missing[:10],
            "experience_years": experience_years,
            "education_level": education_level,
            "suggested_roles": suggested,
            "summary": summary,
            "formatting_score": formatting_score,
            "impact_score": impact_score,
            "ats_breakdown": ats_breakdown,
            "ats_recommendations": recommendations,
            "contact_info": contact_info,
            "target_role": eval_role.replace("-", " ").title(),
            "match_score": keyword_score,
        }

    def match_role(self, resume_text: str, target_role: str) -> dict:
        text_lower = resume_text.lower()
        target_key = target_role.lower().replace(" ", "-")

        target_skills = self.role_skills.get(target_key, set())
        found_skills = self._extract_skills(text_lower)

        matched = set(found_skills) & target_skills
        gaps = target_skills - matched

        match_score = round((len(matched) / max(len(target_skills), 1)) * 100, 1)

        recs = []
        for gap in list(gaps)[:5]:
            recs.append(f"Learn {gap.replace('-', ' ')} to strengthen your profile")
        recs.append(f"Build projects that demonstrate {list(matched)[:1][0] if matched else 'key skills'} expertise")
        recs.append(f"Add quantifiable achievements to your resume")

        return {
            "match_score": match_score,
            "matching_skills": list(matched),
            "gap_skills": list(gaps),
            "recommendations": recs,
        }

    def _extract_experience(self, text: str) -> float:
        patterns = [
            r"(\d+)\+?\s*years?\s*(?:of\s+)?experience",
            r"experience\s*(?:of\s+)?(\d+)\+?\s*years?",
            r"(\d+)\+?\s*yr\s*(?:of\s+)?experience",
            r"experience\s*(?:of\s+)?(\d+)\+?\s*yr",
        ]
        for pat in patterns:
            m = re.search(pat, text)
            if m:
                return float(m.group(1))

        total = 0
        found_any = False
        year_patterns = [
            (r"(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\s*[-–to]+\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}", True),
            (r"\d{4}\s*[-–to]+\s*\d{4}", False),
            (r"(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\s*[-–to]+\s*(?:present|current|now)", True),
            (r"\d{4}\s*[-–to]+\s*(?:present|current|now)", False),
        ]
        for pat, has_month in year_patterns:
            matches = re.findall(pat, text, re.IGNORECASE)
            for m in matches:
                found_any = True
                nums = re.findall(r"\d{4}", m)
                if len(nums) >= 2:
                    diff = int(nums[-1]) - int(nums[0])
                    total += diff

        if found_any:
            return max(0.5, min(float(total), 40))

        return 3.0

    def _extract_education(self, text: str) -> str:
        text_lower = text.lower()
        best_level = "not-specified"
        priority = {"phd": 6, "mtech": 5, "btech-tier1": 5, "btech": 4, "masters": 4, "mca": 4, "bachelors": 3, "bca": 3, "bootcamp": 2, "high-school": 1}

        for keyword, level in EDUCATION_KEYWORDS.items():
            if keyword in text_lower:
                if priority.get(level, 0) > priority.get(best_level, 0):
                    best_level = level

        return best_level

    def _extract_notice_period(self, text: str) -> str:
        text_lower = text.lower()
        if any(w in text_lower for w in ["immediate", "ready to join", "serving notice", "0 days"]):
            return "Immediate Joiner"
        if any(w in text_lower for w in ["15 days", "15-day", "2 weeks"]):
            return "15 Days"
        if any(w in text_lower for w in ["30 days", "30-day", "1 month"]):
            return "30 Days"
        if any(w in text_lower for w in ["60 days", "60-day", "2 months"]):
            return "60 Days"
        if any(w in text_lower for w in ["90 days", "90-day", "3 months"]):
            return "90 Days"
        return "Standard (30-60 days)"

