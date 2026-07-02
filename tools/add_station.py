import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "data" / "stations.json"

station_id = input("Station ID, e.g. sta-shibuya: ").strip()
name = input("Station name, e.g. Shibuya 渋谷: ").strip()

outside_images = input("Outside images, comma-separated: ").split(",")
inside_images = input("Inside images, comma-separated: ").split(",")

lines = input("Lines, semicolon-separated: ").split(";")
destinations = input("Destinations, semicolon-separated: ").split(";")

def clean_list(items):
    return [item.strip() for item in items if item.strip()]

with open(JSON_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

data[station_id] = {
    "name": name,
    "images": {
        "Outside": clean_list(outside_images),
        "Inside": clean_list(inside_images)
    },
    "lines": clean_list(lines),
    "destinations": clean_list(destinations)
}

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Added {station_id} to stations.json")