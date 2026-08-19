import random
from typing import List, Tuple, Optional


class SkillGraphAnalyzer:

    def __init__(self):
        self._build_knowledge_graph()

    def _build_knowledge_graph(self):
        self.skill_categories = {
            "programming": ["python", "java", "javascript", "typescript", "go", "rust", "c++", "c#", "sql", "r"],
            "web": ["react", "angular", "vue", "node.js", "django", "flask", "fastapi", "html/css", "next.js"],
            "data-science": ["pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "jupyter", "matplotlib", "seaborn", "scipy"],
            "ml-ai": ["machine-learning", "deep-learning", "nlp", "computer-vision", "generative-ai", "llm", "prompt-engineering", "reinforcement-learning", "mlops"],
            "devops": ["docker", "kubernetes", "ci/cd", "jenkins", "git", "terraform", "ansible", "prometheus", "grafana"],
            "cloud": ["aws", "azure", "gcp", "cloudformation", "lambda", "s3", "ec2"],
            "database": ["postgresql", "mongodb", "redis", "elasticsearch", "mysql", "snowflake", "bigquery"],
            "big-data": ["spark", "hadoop", "kafka", "airflow", "hive", "hbase"],
            "soft-skills": ["communication", "leadership", "teamwork", "problem-solving", "critical-thinking", "project-management"],
        }

        self.nodes = []
        self.edges = []

        node_id = 0
        category_clusters = {
            "programming": "core",
            "web": "web",
            "data-science": "data",
            "ml-ai": "ai-ml",
            "devops": "infra",
            "cloud": "infra",
            "database": "data",
            "big-data": "data",
            "soft-skills": "soft",
        }

        for category, skills in self.skill_categories.items():
            for skill in skills:
                weight = random.uniform(0.5, 1.0) if category != "soft-skills" else random.uniform(0.3, 0.7)
                self.nodes.append({
                    "id": skill.lower().replace(" ", "-").replace("/", "-"),
                    "name": skill,
                    "category": category,
                    "weight": round(weight, 2),
                    "cluster": category_clusters.get(category, "other"),
                })

        self.node_ids = {n["id"]: n for n in self.nodes}

        intra_category_weight = random.uniform(0.6, 0.9)
        for cat, skills in self.skill_categories.items():
            for i, s1 in enumerate(skills):
                for j, s2 in enumerate(skills):
                    if i < j:
                        w = random.uniform(0.4, 0.9)
                        self.edges.append({
                            "source": s1.lower().replace(" ", "-").replace("/", "-"),
                            "target": s2.lower().replace(" ", "-").replace("/", "-"),
                            "weight": round(w, 2),
                            "relationship": "related",
                        })

        cross_category_pairs = [
            ("python", "pandas"), ("python", "tensorflow"), ("python", "machine-learning"),
            ("python", "django"), ("python", "fastapi"), ("python", "spark"),
            ("java", "spring"), ("java", "hadoop"), ("java", "aws"),
            ("javascript", "react"), ("javascript", "node.js"), ("typescript", "angular"),
            ("sql", "postgresql"), ("sql", "spark"), ("sql", "snowflake"),
            ("docker", "kubernetes"), ("docker", "aws"), ("kubernetes", "terraform"),
            ("machine-learning", "deep-learning"), ("machine-learning", "tensorflow"),
            ("machine-learning", "pytorch"), ("machine-learning", "nlp"),
            ("deep-learning", "computer-vision"), ("deep-learning", "generative-ai"),
            ("generative-ai", "llm"), ("llm", "prompt-engineering"),
            ("aws", "lambda"), ("aws", "s3"), ("aws", "ec2"),
            ("react", "node.js"), ("react", "next.js"),
            ("data-science", "statistics"), ("data-science", "machine-learning"),
            ("nlp", "python"), ("computer-vision", "python"),
            ("data-analysis", "python"), ("data-analysis", "sql"),
            ("communication", "project-management"),
            ("problem-solving", "critical-thinking"),
            ("teamwork", "communication"),
        ]

        for src, tgt in cross_category_pairs:
            src_id = src.lower().replace(" ", "-").replace("/", "-")
            tgt_id = tgt.lower().replace(" ", "-").replace("/", "-")
            if src_id in self.node_ids and tgt_id in self.node_ids:
                w = random.uniform(0.3, 0.8)
                self.edges.append({
                    "source": src_id,
                    "target": tgt_id,
                    "weight": round(w, 2),
                    "relationship": "related",
                })

    def _skill_id(self, name: str) -> str:
        return name.lower().replace(" ", "-").replace("/", "-").replace("+", "p").replace("#", "sharp")

    def get_graph(self) -> dict:
        return {
            "nodes": self.nodes,
            "edges": self.edges,
        }

    def _get_skills_for_role(self, role: str) -> List[str]:
        role_skills = {
            "software-engineer": ["python", "java", "javascript", "typescript", "git", "docker", "sql", "react", "node.js", "aws", "ci/cd", "problem-solving", "communication", "teamwork"],
            "data-scientist": ["python", "r", "sql", "machine-learning", "deep-learning", "statistics", "pandas", "numpy", "scikit-learn", "tensorflow", "jupyter", "data-visualization", "communication", "problem-solving"],
            "ml-engineer": ["python", "machine-learning", "deep-learning", "tensorflow", "pytorch", "docker", "kubernetes", "mlops", "sql", "aws", "git", "nlp", "computer-vision"],
            "devops-engineer": ["python", "bash", "docker", "kubernetes", "terraform", "ansible", "jenkins", "ci/cd", "aws", "azure", "linux", "git", "prometheus", "grafana", "problem-solving"],
            "data-engineer": ["python", "sql", "spark", "kafka", "airflow", "hadoop", "aws", "docker", "postgresql", "mongodb", "snowflake", "bigquery", "git"],
            "frontend-developer": ["javascript", "typescript", "react", "angular", "vue", "html/css", "next.js", "git", "problem-solving", "communication"],
            "backend-developer": ["python", "java", "node.js", "sql", "postgresql", "mongodb", "docker", "aws", "fastapi", "django", "flask", "git", "problem-solving"],
            "fullstack-developer": ["python", "javascript", "typescript", "react", "node.js", "sql", "postgresql", "mongodb", "docker", "aws", "git", "html/css", "problem-solving"],
            "product-manager": ["communication", "leadership", "teamwork", "problem-solving", "critical-thinking", "project-management", "data-analysis", "sql", "analytics", "user-research", "agile"],
            "data-analyst": ["sql", "python", "excel", "tableau", "power-bi", "statistics", "pandas", "communication", "problem-solving", "critical-thinking"],
            "cloud-architect": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "python", "networking", "security", "linux", "communication", "leadership"],
            "security-engineer": ["python", "bash", "linux", "networking", "security", "aws", "docker", "kubernetes", "problem-solving", "critical-thinking"],
            "ai-researcher": ["python", "machine-learning", "deep-learning", "tensorflow", "pytorch", "nlp", "computer-vision", "generative-ai", "reinforcement-learning", "statistics", "r", "mathematics", "research", "communication"],
            "business-analyst": ["sql", "excel", "data-analysis", "communication", "problem-solving", "critical-thinking", "project-management", "teamwork", "requirements-gathering"],
            "qa-engineer": ["python", "java", "selenium", "testing", "ci/cd", "docker", "git", "problem-solving", "attention-to-detail", "communication"],
            "student": ["python", "java", "c++", "sql", "git", "html/css", "javascript", "problem-solving", "communication", "teamwork", "data-structures-and-algorithms", "leetcode/gfg", "object-oriented-programming"],
        }
        role_aliases = {
            "student": "student",
            "intern": "student",
            "student-intern": "student",
            "student---intern-(campus-placement)": "student",
            "student-/-intern-(campus-placement)": "student",
            "graduate-trainee-/-sde-intern": "student",
            "graduate-trainee": "student",
            "campus-placement": "student",
            "machine-learning-engineer": "ml-engineer",
            "mle": "ml-engineer",
            "full-stack-developer": "fullstack-developer",
            "fullstack-developer": "fullstack-developer",
            "ai-engineer": "ai-researcher",
            "research-scientist": "ai-researcher",
            "ai-researcher": "ai-researcher",
            "mlops-engineer": "ml-engineer",
            "security-analyst": "security-engineer",
            "product-manager": "product-manager",
            "business-analyst": "business-analyst",
            "software-engineer": "software-engineer",
        }
        key = role.lower().replace(" ", "-").replace("+", "-p").strip("-")
        resolved = role_aliases.get(key, key)
        return role_skills.get(resolved, ["python", "sql", "git", "communication", "problem-solving", "teamwork", "agile", "linux", "docker", "critical-thinking", "data-analysis", "project-management"])

    def find_paths(self, role: str, target_role: Optional[str] = None) -> dict:
        if not target_role or not target_role.strip():
            target_role = "ml-engineer" if role.lower() != "ml-engineer" else "data-scientist"

        current_skills = set(s.lower().replace(" ", "-").replace("/", "-") for s in self._get_skills_for_role(role))
        target_skills = set(s.lower().replace(" ", "-").replace("/", "-") for s in self._get_skills_for_role(target_role))


        common = current_skills & target_skills
        needed = target_skills - current_skills

        paths = []
        needed_list = list(needed)
        random.shuffle(needed_list)

        path_nodes = []
        for skill in common:
            path_nodes.append({"skill": skill, "level": "proficient"})

        for i, skill in enumerate(needed_list[:6]):
            level = "beginner" if i < 2 else ("intermediate" if i < 4 else "advanced")
            path_nodes.append({"skill": skill, "level": level})

        paths.append({
            "nodes": path_nodes,
            "total_effort": round(len(needed_list) * 4 + len(common) * 1, 1),
        })

        if len(needed_list) > 3:
            path_nodes2 = []
            for skill in list(common)[:3]:
                path_nodes2.append({"skill": skill, "level": "advanced"})

            prioritized = needed_list[:3] + needed_list[-3:] if len(needed_list) >= 6 else needed_list
            for skill in prioritized:
                path_nodes2.append({"skill": skill, "level": "intermediate"})

            paths.append({
                "nodes": path_nodes2,
                "total_effort": round(len(prioritized) * 5 + 3, 1),
            })

        return {"paths": paths}

    def analyze_gaps(self, current_role: str, target_role: str) -> dict:
        current_skills = self._get_skills_for_role(current_role)
        target_skills = self._get_skills_for_role(target_role)

        current_set = set(s.lower() for s in current_skills)
        target_set = set(s.lower() for s in target_skills)

        common = current_set & target_set
        gaps = target_set - current_set

        match_score = round((len(common) / max(len(target_set), 1)) * 100, 1)

        importance_map = {"high": 0.4, "medium": 0.35, "low": 0.25}
        gap_items = []
        for i, skill in enumerate(gaps):
            if i < len(gaps) * 0.3:
                imp = "high"
                effort = "3-6 months"
            elif i < len(gaps) * 0.7:
                imp = "medium"
                effort = "1-3 months"
            else:
                imp = "low"
                effort = "2-4 weeks"
            gap_items.append({
                "skill": skill,
                "importance": imp,
                "learning_effort": effort,
            })

        return {
            "current_skills": current_skills,
            "target_skills": target_skills,
            "common_skills": list(common),
            "gaps": gap_items,
            "match_score": match_score,
        }

    def get_learning_roadmap(self, role: str) -> dict:
        FILLER = ["python", "sql", "git", "communication", "problem-solving", "teamwork", "agile", "linux", "docker", "critical-thinking", "data-analysis", "project-management", "aws", "algorithm", "javascript"]
        skills = self._get_skills_for_role(role)
        if len(skills) < 16:
            used = [s.lower() for s in skills]
            for filler in FILLER:
                if len(skills) >= 16:
                    break
                if filler not in used:
                    skills.append(filler)
                    used.append(filler)

        def safe(idx, fallback=0):
            return skills[idx] if len(skills) > idx else skills[fallback % max(len(skills), 1)]

        stages = [
            {
                "order": 1,
                "title": "Foundations",
                "skills": skills[:3],
                "duration_weeks": 4,
                "resources": [
                    {"name": f"Introduction to {safe(0)}", "url": f"https://www.coursera.org/courses?query={safe(0).replace(' ', '%20')}"},
                    {"name": f"{safe(1)} Fundamentals", "url": f"https://www.udemy.com/courses/search/?q={safe(1).replace(' ', '%20')}"},
                    {"name": f"Getting Started with {safe(2)}", "url": f"https://www.codecademy.com/learn/{safe(2).replace(' ', '-')}"},
                ],
            },
            {
                "order": 2,
                "title": "Core Skills",
                "skills": skills[3:7],
                "duration_weeks": 8,
                "resources": [
                    {"name": f"Advanced {safe(3)}", "url": f"https://www.pluralsight.com/courses/{safe(3).replace(' ', '-')}-advanced"},
                    {"name": f"{safe(4)} in Practice", "url": f"https://www.linkedin.com/learning/search?keywords={safe(4).replace(' ', '%20')}"},
                ],
            },
            {
                "order": 3,
                "title": "Specialization",
                "skills": skills[7:11],
                "duration_weeks": 8,
                "resources": [
                    {"name": f"Mastering {safe(5)}", "url": f"https://www.udacity.com/courses/search?q={safe(5).replace(' ', '%20')}"},
                    {"name": f"{safe(6)} for Professionals", "url": f"https://www.edx.org/learn/{safe(6).replace(' ', '-')}"},
                ],
            },
            {
                "order": 4,
                "title": "Real-World Projects",
                "skills": skills[11:15],
                "duration_weeks": 6,
                "resources": [
                    {"name": "Build Your Portfolio", "url": "https://github.com/topics/portfolio"},
                    {"name": "Open Source Contribution Guide", "url": "https://www.firsttimersonly.com/"},
                ],
            },
            {
                "order": 5,
                "title": "Advanced & Special Topics",
                "skills": skills[15:],
                "duration_weeks": 4,
                "resources": [
                    {"name": "Industry Best Practices", "url": "https://www.oreilly.com/search/?query=best-practices"},
                    {"name": "Advanced Topics", "url": "https://www.packtpub.com/search?q=advanced"},
                ],
            },
        ]

        stages = [s for s in stages if s["skills"]]

        return {
            "role": role,
            "stages": stages,
        }
