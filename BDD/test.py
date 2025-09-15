import pandas as pd
from sqlalchemy import create_engine

# Connexion à la BDD
engine = create_engine("postgresql+psycopg2://postgres:1504@localhost:5432/sneakers")

# Charger la table sneakers
df = pd.read_sql("SELECT name, image FROM sneakers LIMIT 20;", engine)

print(df)
