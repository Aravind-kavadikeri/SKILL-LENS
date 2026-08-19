import random
from typing import List, Optional


CITIES = {
    "india": [
        {"name": "Bangalore", "lat": 12.9716, "lon": 77.5946},
        {"name": "Hyderabad", "lat": 17.3850, "lon": 78.4867},
        {"name": "Pune", "lat": 18.5204, "lon": 73.8567},
        {"name": "Gurgaon", "lat": 28.4595, "lon": 77.0266},
        {"name": "Noida", "lat": 28.5355, "lon": 77.3910},
        {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777},
        {"name": "Chennai", "lat": 13.0827, "lon": 80.2707},
        {"name": "Delhi", "lat": 28.7041, "lon": 77.1025},
        {"name": "Ahmedabad", "lat": 23.0225, "lon": 72.5714},
        {"name": "Kochi", "lat": 9.9312, "lon": 76.2673},
        {"name": "Trivandrum", "lat": 8.5241, "lon": 76.9366},
        {"name": "Kolkata", "lat": 22.5726, "lon": 88.3639},
        {"name": "Chandigarh", "lat": 30.7333, "lon": 76.7794},
        {"name": "Jaipur", "lat": 26.9124, "lon": 75.7873},
        {"name": "Indore", "lat": 22.7196, "lon": 75.8577},
        {"name": "Coimbatore", "lat": 11.0168, "lon": 76.9558},
    ],
    "us": [
        {"name": "San Francisco", "lat": 37.7749, "lon": -122.4194},
        {"name": "New York", "lat": 40.7128, "lon": -74.0060},
        {"name": "Seattle", "lat": 47.6062, "lon": -122.3321},
        {"name": "Boston", "lat": 42.3601, "lon": -71.0589},
        {"name": "Austin", "lat": 30.2672, "lon": -97.7431},
        {"name": "Chicago", "lat": 41.8781, "lon": -87.6298},
        {"name": "Los Angeles", "lat": 34.0522, "lon": -118.2437},
        {"name": "Denver", "lat": 39.7392, "lon": -104.9903},
        {"name": "Washington DC", "lat": 38.9072, "lon": -77.0369},
        {"name": "Dallas", "lat": 32.7767, "lon": -96.7970},
    ],
    "global": [
        {"name": "San Francisco", "lat": 37.7749, "lon": -122.4194},
        {"name": "London", "lat": 51.5074, "lon": -0.1278},
        {"name": "Bangalore", "lat": 12.9716, "lon": 77.5946},
        {"name": "Berlin", "lat": 52.5200, "lon": 13.4050},
        {"name": "Singapore", "lat": 1.3521, "lon": 103.8198},
        {"name": "New York", "lat": 40.7128, "lon": -74.0060},
        {"name": "Tokyo", "lat": 35.6762, "lon": 139.6503},
        {"name": "Toronto", "lat": 43.6532, "lon": -79.3832},
        {"name": "Sydney", "lat": -33.8688, "lon": 151.2093},
        {"name": "Dubai", "lat": 25.2048, "lon": 55.2708},
    ],
}


class GeographicIntelligence:

    def __init__(self):
        self.cities = CITIES

    def get_location_data(self, metric: str = "hiring") -> dict:
        country = "global"
        cities = self.cities.get(country, self.cities["global"])
        random.seed(42)

        locations = []
        total_value = 0
        total_count = 0
        top_value = -1
        top_region = ""

        for city in cities:
            if metric == "hiring":
                value = round(random.uniform(40, 100), 1)
                count = random.randint(500, 10000)
            elif metric == "salary":
                base = random.choice([850000, 1150000, 1450000, 1850000, 2200000, 2800000])
                value = round(base + random.gauss(0, 150000), -3)
                count = random.randint(200, 5000)
            elif metric == "remote":
                value = round(random.uniform(10, 70), 1)
                count = random.randint(100, 3000)
            else:
                value = round(random.uniform(0, 100), 1)
                count = random.randint(100, 5000)

            growth = round(random.uniform(-5, 25), 1)

            locations.append({
                "name": city["name"],
                "lat": city["lat"],
                "lon": city["lon"],
                "value": value,
                "count": count,
                "growth": growth,
            })

            total_value += value
            total_count += count
            if value > top_value:
                top_value = value
                top_region = city["name"]

        return {
            "locations": locations,
            "summary": {
                "total": total_count,
                "avg_value": round(total_value / max(len(locations), 1), 1),
                "top_region": top_region,
            },
        }
