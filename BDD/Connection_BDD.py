import http.client
import json
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import requests
from urllib.parse import quote
from bs4 import BeautifulSoup

# --- Charger clé API ---
load_dotenv()
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
if not RAPIDAPI_KEY:
    raise ValueError("Clé API non trouvée ! Vérifie ton .env")

# --- Connexion PostgreSQL ---
engine = create_engine("postgresql+psycopg2://postgres:1504@localhost:5432/sneakers")

# --- Créer dossier images ---
os.makedirs("images", exist_ok=True)

# --- Récupérer toutes les marques ---
conn = http.client.HTTPSConnection("the-sneaker-database.p.rapidapi.com")
headers = {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': "the-sneaker-database.p.rapidapi.com"
}

conn.request("GET", "/brands", headers=headers)
res = conn.getresponse()
data = res.read()
if res.status != 200:
    raise Exception(f"Erreur API marques : {res.status} {res.reason}")

brands_list = json.loads(data.decode("utf-8")).get("results", [])
df_brands = pd.DataFrame(brands_list, columns=["brand_name"])
df_brands.to_sql("brands", engine, if_exists="replace", index=False)
print("Marques insérées avec succès !")

# --- Récupérer sneakers par marque (limite 10) ---
sneakers_list = []

for brand in brands_list:
    brand_encoded = quote(brand)
    conn.request("GET", f"/sneakers?limit=10&brand={brand_encoded}", headers=headers)  # limite 10
    res = conn.getresponse()
    data = res.read()
    
    if res.status != 200:
        print(f"Erreur API sneakers pour {brand} : {res.status}")
        continue
    
    results = json.loads(data.decode("utf-8")).get("results", [])
    
    for sneaker in results:
        media = sneaker.get("image", {})
        image_url = media.get("original") or media.get("small") or media.get("thumbnail")
        
        # Si pas d'image, utiliser StockX
        if not image_url:
            stockx_url = sneaker.get("links", {}).get("stockX")
            if stockx_url:
                try:
                    r = requests.get(stockx_url)
                    soup = BeautifulSoup(r.text, "html.parser")
                    img_tag = soup.find("img")
                    if img_tag and img_tag.get("src"):
                        image_url = img_tag["src"]
                except Exception as e:
                    print(f"Erreur récupération StockX pour {sneaker.get('name')}: {e}")
        
        sneakers_list.append({
            "brand": brand,
            "name": sneaker.get("name"),
            "colorway": sneaker.get("colorway"),
            "releaseDate": sneaker.get("releaseDate"),
            "retailPrice": sneaker.get("retailPrice"),
            "image": image_url
        })

# --- DataFrame et insertion PostgreSQL ---
df_sneakers = pd.DataFrame(sneakers_list)
print(df_sneakers[["name", "image"]].head(10))
df_sneakers.to_sql("sneakers", engine, if_exists="replace", index=False)
print("Sneakers insérées avec succès !")

# --- Télécharger images ---
for idx, row in df_sneakers.iterrows():
    if row["image"]:
        try:
            img_data = requests.get(row["image"]).content
            filename = f"images/{row['brand'].replace(' ', '_')}_{idx}.jpg"
            with open(filename, "wb") as f:
                f.write(img_data)
        except Exception as e:
            print(f"Erreur téléchargement {row['name']}: {e}")

print("Images téléchargées !")
