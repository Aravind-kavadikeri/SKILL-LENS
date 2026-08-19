class CareerTwinEngine:

    def __init__(self):
        self.profiles = {}

    def create_profile(self, user_id: str, profile_data: dict) -> dict:
        self.profiles[user_id] = profile_data
        return {
            "user_id": user_id,
            "status": "created",
            "profile": profile_data,
        }

    def get_profile(self, user_id: str) -> dict:
        profile = self.profiles.get(user_id)
        if profile is None:
            return {"user_id": user_id, "status": "not_found", "profile": None}
        return {
            "user_id": user_id,
            "status": "found",
            "profile": profile,
        }

    def update_profile(self, user_id: str, updates: dict) -> dict:
        if user_id in self.profiles:
            self.profiles[user_id].update(updates)
        else:
            self.profiles[user_id] = updates
        return {
            "user_id": user_id,
            "status": "updated",
            "profile": self.profiles[user_id],
        }

    def simulate_career_path(self, user_id: str, target_role: str, time_horizon_years: int = 5) -> dict:
        profile = self.profiles.get(user_id, {})
        current_role = profile.get("current_role", "software-engineer")
        skills = profile.get("skills", [])

        milestones = []
        for year in range(1, time_horizon_years + 1):
            milestones.append({
                "year": year,
                "projected_role": target_role if year >= 3 else current_role,
                "skills_to_acquire": [f"skill_{year}_{i}" for i in range(1, 4)],
                "projected_salary_increase": round(10 + year * 5 + (year ** 0.5) * 3, 1),
                "certifications_recommended": [f"Cert-{year}-{i}" for i in range(1, 3)],
            })

        return {
            "user_id": user_id,
            "current_role": current_role,
            "target_role": target_role,
            "time_horizon_years": time_horizon_years,
            "skill_gap": len(set(profile.get("target_skills", [])) - set(skills)),
            "milestones": milestones,
            "estimated_effort_hours": time_horizon_years * 200,
            "career_projection": f"From {current_role} to {target_role} in {time_horizon_years} years",
        }
