import random
import math
from typing import List, Tuple

ROLE_MULTIPLIERS = {
    "software-engineer": 1.0,
    "data-scientist": 1.15,
    "ml-engineer": 1.25,
    "devops-engineer": 1.1,
    "frontend-developer": 0.9,
    "backend-developer": 1.0,
    "fullstack-developer": 1.05,
    "product-manager": 1.2,
    "data-analyst": 0.85,
    "data-engineer": 1.1,
    "cloud-architect": 1.3,
    "security-engineer": 1.15,
    "ai-researcher": 1.35,
    "business-analyst": 0.8,
    "qa-engineer": 0.75,
}

EDUCATION_ALIASES = {
    "bachelor": "bachelors",
    "bachelor-s": "bachelors",
    "bachelors-degree": "bachelors",
    "bachelor-degree": "bachelors",
    "bachelor-s-degree": "bachelors",
    "undergraduate": "bachelors",
    "master": "masters",
    "master-s": "masters",
    "masters-degree": "masters",
    "master-degree": "masters",
    "master-s-degree": "masters",
    "postgraduate": "masters",
    "graduate": "masters",
    "doctorate": "phd",
    "ph-d": "phd",
}

EDUCATION_PREMIUMS = {
    "btech-tier1": 1.35,
    "b-tech-tier-1": 1.35,
    "btech": 1.1,
    "b-tech": 1.1,
    "be": 1.1,
    "b-e": 1.1,
    "mtech": 1.2,
    "m-tech": 1.2,
    "mca": 1.05,
    "bca": 0.95,
    "high-school": 0.85,
    "bachelors": 1.0,
    "masters": 1.15,
    "phd": 1.3,
    "bootcamp": 0.95,
    "self-taught": 0.9,
    "some-college": 1.0,
    "associate": 0.95,
    "diploma": 0.95,
    "certification": 0.95,
    "master-s": 1.15,
    "bachelor-s-degree": 1.0,
    "bachelor-s": 1.0,
    "bachelors-degree": 1.0,
}

LOCATION_ALIASES = {
    "usa": "united-states",
    "us": "united-states",
    "u-s": "united-states",
    "america": "united-states",
    "north-america": "united-states",
    "bay-area": "san-francisco",
    "nyc": "new-york",
    "silicon-valley": "san-francisco",
    "california": "san-francisco",
    "texas": "austin",
    "uk": "united-kingdom",
    "britain": "united-kingdom",
    "england": "united-kingdom",
    "europe": "germany",
    "germany": "germany",
    "dutch": "netherlands",
    "holland": "netherlands",
    "uae": "united-arab-emirates",
    "emirates": "united-arab-emirates",
    "dubai": "united-arab-emirates",
    "abu-dhabi": "united-arab-emirates",
    "australia": "australia",
    "aus": "australia",
    "japan": "japan",
    "jpn": "japan",
    "singapore": "singapore",
    "sg": "singapore",
    "france": "france",
    "brazil": "brazil",
    "india": "india",
    "in": "india",
    "bengaluru": "bangalore",
    "bombay": "mumbai",
    "new-delhi": "delhi",
    "delhi-ncr": "delhi",
    "gurgaon": "gurgaon",
    "noida": "noida",
    "remote": "remote-global",
    "anywhere": "remote-global",
    "canada": "canada",
    "ca": "canada",
}

LOCATION_FACTORS = {
    "india": 1.0,
    "bangalore": 1.35,
    "bengaluru": 1.35,
    "hyderabad": 1.25,
    "gurgaon": 1.25,
    "noida": 1.2,
    "delhi": 1.2,
    "mumbai": 1.25,
    "pune": 1.15,
    "chennai": 1.1,
    "ahmedabad": 0.95,
    "kochi": 0.9,
    "kolkata": 0.9,
    "trivandrum": 0.9,
    "chandigarh": 0.9,
    "jaipur": 0.85,
    "indore": 0.85,
    "coimbatore": 0.85,
    "remote-india": 1.0,
    "united-states": 7.5,
    "san-francisco": 9.5,
    "new-york": 9.0,
    "seattle": 8.5,
    "united-kingdom": 5.5,
    "london": 6.5,
    "singapore": 6.0,
    "remote-global": 4.5,
}

def _build_location_lookup():
    lookup = {}
    lookup.update(LOCATION_FACTORS)
    for alias, target in LOCATION_ALIASES.items():
        if target in lookup:
            lookup[alias] = lookup[target]
    return lookup

LOCATION_LOOKUP = _build_location_lookup()

INDUSTRY_ALIASES = {
    "fintech": "finance",
    "fin-tech": "finance",
    "edtech": "education",
    "ed-tech": "education",
    "ai": "artificial-intelligence",
    "ml": "ai-ml",
    "machine-learning": "ai-ml",
    "deep-learning": "ai-ml",
    "data-science": "data-analytics",
    "it": "information-technology",
    "pharma": "pharmaceutical",
    "biotechnology": "biotech",
    "ecommerce": "e-commerce",
    "management-consulting": "consulting",
    "non-profit": "government",
    "ngo": "government",
    "saas": "software",
    "social-media": "media",
    "news": "media",
    "publishing": "media",
    "advertising": "media",
    "logistics": "transportation",
    "supply-chain": "transportation",
    "oil-gas": "oil-and-gas",
    "renewable-energy": "energy",
    "solar": "energy",
    "wind": "energy",
    "auto": "automotive",
    "public-sector": "government",
    "early-stage": "startups",
    "venture-capital": "finance",
    "private-equity": "finance",
    "hedge-fund": "investment",
    "prop-trading": "investment",
    "quant": "finance",
    "web3": "technology",
    "blockchain": "technology",
    "crypto": "technology",
    "devops": "technology",
    "platform-engineering": "technology",
    "infrastructure": "technology",
}

INDUSTRY_FACTORS = {
    "technology": 1.15,
    "information-technology": 1.15,
    "it-services": 1.1,
    "software": 1.15,
    "finance": 1.3,
    "banking": 1.3,
    "financial-services": 1.3,
    "investment": 1.35,
    "healthcare": 1.1,
    "pharmaceutical": 1.15,
    "biotech": 1.2,
    "e-commerce": 1.1,
    "consulting": 1.2,
    "education": 0.8,
    "academia": 0.75,
    "research": 1.05,
    "government": 0.85,
    "manufacturing": 0.95,
    "automotive": 1.0,
    "media": 0.9,
    "entertainment": 0.95,
    "energy": 1.05,
    "oil-and-gas": 1.1,
    "startups": 0.9,
    "enterprise": 1.1,
    "retail": 0.9,
    "telecommunications": 1.05,
    "telecom": 1.05,
    "insurance": 1.15,
    "real-estate": 0.95,
    "transportation": 0.95,
    "aerospace": 1.15,
    "defense": 1.15,
    "gaming": 1.05,
    "cybersecurity": 1.2,
    "data-analytics": 1.1,
    "cloud-computing": 1.15,
    "ai-ml": 1.25,
    "artificial-intelligence": 1.3,
}

def _build_industry_lookup():
    lookup = {}
    lookup.update(INDUSTRY_FACTORS)
    for alias, target in INDUSTRY_ALIASES.items():
        if target in lookup:
            lookup[alias] = lookup[target]
    return lookup

INDUSTRY_LOOKUP = _build_industry_lookup()

BASE_SALARIES = {
    "software-engineer": 850000,
    "data-scientist": 1150000,
    "ml-engineer": 1400000,
    "devops-engineer": 1050000,
    "frontend-developer": 800000,
    "backend-developer": 900000,
    "fullstack-developer": 950000,
    "product-manager": 1400000,
    "data-analyst": 650000,
    "data-engineer": 1100000,
    "cloud-architect": 1800000,
    "security-engineer": 1200000,
    "ai-researcher": 2000000,
    "business-analyst": 750000,
    "qa-engineer": 650000,
    "student": 450000,
    "student-intern": 450000,
}


class SalaryPredictor:

    def __init__(self):
        self.base_salaries = BASE_SALARIES
        self.role_multipliers = ROLE_MULTIPLIERS
        self.education_premiums = EDUCATION_PREMIUMS
        self.location_factors = LOCATION_LOOKUP
        self.industry_factors = INDUSTRY_LOOKUP

    @staticmethod
    def _normalize_key(value: str) -> str:
        import re
        if not value or not value.strip():
            return ""
        v = value.lower().strip()
        v = re.sub(r"['\u2019]", '', v)
        v = re.sub(r'[^a-z0-9\s]', ' ', v)
        return re.sub(r'\s+', '-', v.strip())

    def _get_key(self, mapping: dict, value: str, default: float) -> float:
        dash_key = self._normalize_key(value)
        if not dash_key:
            return default
        if dash_key in mapping:
            return mapping[dash_key]

        words = set(dash_key.replace('-', ' ').split())

        best_score = 0
        best_val = default
        for k, v in mapping.items():
            if k == dash_key or dash_key in k or k in dash_key:
                return v
            k_words = set(k.replace('-', ' ').split())
            if k_words and words:
                shared = len(k_words & words)
                total = max(len(k_words), len(words))
                score = shared / total if total > 0 else 0
                if score > best_score:
                    best_score = score
                    best_val = v

        if best_score >= 0.5:
            return best_val
        return default

    def predict(self, role: str, experience: float, location: str, education: str, industry: str, skills: List[str]) -> dict:
        base = self._get_key(self.base_salaries, role, 85000)
        role_mult = self._get_key(self.role_multipliers, role, 1.0)
        edu_mult = self._get_key(self.education_premiums, education, 1.0)
        loc_mult = self._get_key(self.location_factors, location, 1.0)
        ind_mult = self._get_key(self.industry_factors, industry, 1.0)

        exp_factor = 1.0 + (math.log2(experience + 1) * 0.12)
        skill_bonus = min(len(skills) * 0.015, 0.2)

        predicted = base * role_mult * edu_mult * loc_mult * ind_mult * exp_factor * (1 + skill_bonus)
        predicted = round(predicted, -2)

        margin = 0.08 + (0.02 * (10 / (experience + 5)))
        ci = [round(predicted * (1 - margin), -2), round(predicted * (1 + margin), -2)]

        base_role_salary = base * role_mult
        exp_impact = round(base_role_salary * (exp_factor - 1), -2)
        edu_impact = round(base_role_salary * (edu_mult - 1), -2)
        loc_impact = round(base_role_salary * (loc_mult - 1), -2)
        ind_impact = round(base_role_salary * (ind_mult - 1), -2)
        skills_impact = round(base_role_salary * skill_bonus, -2)

        factors = [
            {"name": "Base Role Salary", "impact": round(base_role_salary, -2), "value": f"₹{base_role_salary:,.0f}"},
            {"name": "Experience Impact", "impact": exp_impact, "value": f"{experience} years"},
            {"name": "Education Premium", "impact": edu_impact, "value": education or "Default"},
            {"name": "Location Multiplier", "impact": loc_impact, "value": location or "Default"},
            {"name": "Industry Premium", "impact": ind_impact, "value": industry or "Default"},
            {"name": "Skills Bonus", "impact": skills_impact, "value": f"{len(skills)} skills"},
        ]

        return {
            "predicted_salary": predicted,
            "confidence_interval": ci,
            "factors": factors,
        }

    def explain(self, role: str, experience: float, location: str, education: str, industry: str, skills: List[str]) -> dict:
        base = self._get_key(self.base_salaries, role, 85000)
        role_mult = self._get_key(self.role_multipliers, role, 1.0)
        edu_mult = self._get_key(self.education_premiums, education, 1.0)
        loc_mult = self._get_key(self.location_factors, location, 1.0)
        ind_mult = self._get_key(self.industry_factors, industry, 1.0)
        exp_factor = 1.0 + (math.log2(experience + 1) * 0.12)
        skill_bonus = min(len(skills) * 0.015, 0.2)

        base_value = base * role_mult
        feature_shaps = []

        shap_experience = base_value * (exp_factor - 1)
        shap_education = base_value * role_mult * (edu_mult - 1)
        shap_location = base_value * role_mult * edu_mult * (loc_mult - 1)
        shap_industry = base_value * role_mult * edu_mult * loc_mult * (ind_mult - 1)
        shap_skills = base_value * role_mult * edu_mult * loc_mult * ind_mult * skill_bonus

        all_shaps = {
            "experience": (experience, shap_experience),
            "education": (education, shap_education),
            "location": (location, shap_location),
            "industry": (industry, shap_industry),
            "skills": (f"{len(skills)} skills", shap_skills),
        }

        features = []
        waterfall = []
        cumulative = base_value

        for name, (val, shap_val) in all_shaps.items():
            direction = "positive" if shap_val >= 0 else "negative"
            features.append({
                "name": name,
                "value": val,
                "shap_value": round(shap_val, -2),
                "impact_direction": direction,
            })
            cumulative += shap_val
            waterfall.append({
                "feature": name,
                "contribution": round(shap_val, -2),
                "cumulative": round(cumulative, -2),
            })

        return {
            "base_value": round(base_value, -2),
            "features": features,
            "waterfall": waterfall,
        }
