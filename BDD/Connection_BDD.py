from sqlalchemy import create_engine, text

# Remplace les infos avec tes identifiants réels
engine = create_engine("postgresql+psycopg2://postgres:1504@localhost:5432/sneakers")

with engine.connect() as conn:
    result = conn.execute(text("SELECT now()"))
    for row in result:
        print(row)

#sudo service postgresql start
#sudo service postgresql status

#Lancer le shell sql
#sudo -u postgres psql
