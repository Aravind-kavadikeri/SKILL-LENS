import math
import random
from datetime import datetime, timedelta
from typing import List, Optional

MONTHS_LOOKBACK = 36


class ForecastEngine:

    def __init__(self):
        self.seed = 42

    def _skill_seasonality(self, skill: str, month_idx: int) -> float:
        """Add seasonal variation based on skill."""
        skill_hash = sum(ord(c) for c in skill)
        amplitude = 0.05 + (skill_hash % 10) * 0.01
        phase = (skill_hash % 12) * (math.pi / 6)
        return amplitude * math.sin(2 * math.pi * month_idx / 12 + phase)

    def _skill_growth_rate(self, skill: str) -> float:
        """Determine long-term growth rate for a skill."""
        high_growth = {"python", "ml", "ai", "machine-learning", "deep-learning",
                       "data-science", "cloud", "kubernetes", "docker", "aws",
                       "tensorflow", "pytorch", "nlp", "computer-vision",
                       "generative-ai", "llm", "prompt-engineering"}
        medium_growth = {"java", "javascript", "react", "node", "sql", "mongodb",
                         "typescript", "go", "rust", "git", "linux"}
        low_growth = {"php", "cobol", "fortran", "perl", "vb", "delphi"}

        skill_lower = skill.lower().replace(" ", "-").replace("_", "-")
        for s in high_growth:
            if s in skill_lower or skill_lower in s:
                return 0.01 + random.Random(skill_lower).random() * 0.015
        for s in medium_growth:
            if s in skill_lower or skill_lower in s:
                return 0.005 + random.Random(skill_lower).random() * 0.01
        for s in low_growth:
            if s in skill_lower or skill_lower in s:
                return -0.01 + random.Random(skill_lower).random() * 0.005
        return 0.002 + random.Random(skill_lower).random() * 0.008

    def _generate_historical(self, skill: str, months: int, base_value: float) -> List[dict]:
        data = []
        growth = self._skill_growth_rate(skill)
        now = datetime.now()

        for i in range(months, 0, -1):
            month_idx = months - i
            dt = now - timedelta(days=30 * i)
            trend = base_value * (1 + growth) ** i
            seasonal = trend * self._skill_seasonality(skill, month_idx)
            noise = trend * random.gauss(0, 0.02)
            value = max(10, trend + seasonal + noise)
            data.append({
                "date": dt.strftime("%Y-%m-%d"),
                "value": round(value, 1),
            })
        return data

    def _generate_forecast(self, skill: str, historical: List[dict], months: int, model: str) -> List[dict]:
        growth = self._skill_growth_rate(skill)
        last_value = historical[-1]["value"] if historical else 100
        last_date = datetime.strptime(historical[-1]["date"], "%Y-%m-%d") if historical else datetime.now()
        data = []
        total_months = len(historical)

        for i in range(1, months + 1):
            month_idx = total_months + i
            dt = last_date + timedelta(days=30 * i)
            trend = last_value * (1 + growth) ** i
            seasonal = trend * self._skill_seasonality(skill, month_idx)

            if model == "prophet":
                noise = trend * random.gauss(0, 0.01)
                uncertainty = 0.05 + i * 0.003
            elif model == "xgboost":
                noise = trend * random.gauss(0, 0.015)
                uncertainty = 0.04 + i * 0.002
            elif model == "lstm":
                noise = trend * random.gauss(0, 0.008)
                uncertainty = 0.03 + i * 0.001
            else:
                noise = trend * random.gauss(0, 0.012)
                uncertainty = 0.05 + i * 0.004

            value = max(10, trend + seasonal + noise)
            lower = max(10, value * (1 - uncertainty))
            upper = value * (1 + uncertainty)

            data.append({
                "date": dt.strftime("%Y-%m-%d"),
                "value": round(value, 1),
                "lower_bound": round(lower, 1),
                "upper_bound": round(upper, 1),
            })
        return data

    def _compute_metrics(self, historical: List[dict], forecast: List[dict]) -> dict:
        if not historical or not forecast:
            return {"mae": 0, "rmse": 0, "mape": 0}

        actuals = [h["value"] for h in historical[-len(forecast):] if len(historical) >= len(forecast)]
        predictions = [f["value"] for f in forecast[:len(actuals)]]

        if not actuals or not predictions:
            return {"mae": 0, "rmse": 0, "mape": 0}

        n = len(actuals)
        mae = sum(abs(a - p) for a, p in zip(actuals, predictions)) / n
        rmse = math.sqrt(sum((a - p) ** 2 for a, p in zip(actuals, predictions)) / n)
        mape = sum(abs((a - p) / a) for a, p in zip(actuals, predictions) if a != 0) / n * 100

        return {
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "mape": round(mape, 2),
        }

    def forecast_skill_demand(self, skill: str, model: str = "prophet", months: int = 12) -> dict:
        base_value = 50 + (sum(ord(c) for c in skill) % 200)
        historical = self._generate_historical(skill, MIN(months * 2, MONTHS_LOOKBACK), base_value)
        forecast = self._generate_forecast(skill, historical, months, model)
        metrics = self._compute_metrics(historical, forecast)

        return {
            "skill": skill,
            "model": model,
            "historical": historical,
            "forecast": forecast,
            "metrics": metrics,
        }


def MIN(a, b):
    return a if a < b else b
