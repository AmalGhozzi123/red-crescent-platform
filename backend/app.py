# backend/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from firebase_admin import credentials, initialize_app, firestore
from fastapi.middleware.cors import CORSMiddleware
import os
import bcrypt
import jwt
from datetime import datetime, timedelta

# Configuration (place these in env vars en prod)
FIREBASE_KEY_PATH = "firebase_key.json"  # ton fichier de clef
JWT_SECRET = os.environ.get("JWT_SECRET", "change_this_secret")  # mettre en variable d'env en prod
JWT_ALGORITHM = "HS256"
JWT_EXP_MINUTES = 60  # durée du token

# Initialisation Firebase (Admin SDK)
cred = credentials.Certificate(FIREBASE_KEY_PATH)
initialize_app(cred)
db = firestore.client()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # -> remplacer par ton domaine en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schéma pour les données reçues
class LoginData(BaseModel):
    email: str
    password: str

def create_jwt_token(admin_id: str, email: str):
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXP_MINUTES)
    payload = {
        "sub": admin_id,
        "email": email,
        "exp": expire.timestamp()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

@app.post("/login")
def login(data: LoginData):
    try:
        # Chercher l'admin par email dans la collection "admin"
        admins_ref = db.collection("admin")
        query = admins_ref.where("email", "==", data.email).limit(1).get()

        if not query:
            # aucun admin avec cet email
            raise HTTPException(status_code=401, detail="Incorrect email or password!")

        admin_doc = query[0]
        admin_data = admin_doc.to_dict()
        stored_pw = admin_data.get("mot_de_passe")  # attendu haché (bcrypt)

        if not stored_pw:
            raise HTTPException(status_code=500, detail="Donnée de mot de passe manquante pour cet utilisateur")

        # Vérifier le mot de passe :
        # - si stored_pw commence par b'$2b$' ou '$2b$' -> haché bcrypt
        # - sinon (héritage) -> comparaison directe (moins sécurisé)
        is_password_ok = False
        try:
            # bcrypt expects bytes
            if isinstance(stored_pw, str):
                # stored_pw devrait être le string du hash, ex "$2b$12$..."
                is_password_ok = bcrypt.checkpw(data.password.encode("utf-8"), stored_pw.encode("utf-8"))
            else:
                # improbable, mais géré
                is_password_ok = bcrypt.checkpw(data.password.encode("utf-8"), stored_pw)
        except ValueError:
            # si format non-bcrypt, fallback (NE PAS UTILISER EN PROD) :
            is_password_ok = (data.password == stored_pw)

        if not is_password_ok:
            raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

        # Création du token JWT
        token = create_jwt_token(admin_doc.id, data.email)

        return {"message": "Login successful", "token": token, "admin_id": admin_doc.id}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/volunteers")
def get_volunteers():
    try:
        volunteers_ref = db.collection("volunteers")
        docs = volunteers_ref.get()

        volunteers = []
        for doc in docs:
            v = doc.to_dict()
            v["id"] = doc.id  # inclure l'id Firestore
            volunteers.append(v)

        return {"volunteers": volunteers}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Route : désactiver un volontaire (mettre isDeleted=True et isAccepted=False)
@app.put("/volunteers/{volunteer_id}/deactivate")
def deactivate_volunteer(volunteer_id: str):
    try:
        volunteer_ref = db.collection("volunteers").document(volunteer_id)
        doc = volunteer_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Volontaire introuvable")

        volunteer_ref.update({
            "isDeleted": True,
            "isAccepted": False,
            "updatedAt": firestore.SERVER_TIMESTAMP
        })

        return {"message": "Volontaire désactivé avec succès"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# Route : activer un volontaire (mettre isDeleted=False et isAccepted=True)
@app.put("/volunteers/{volunteer_id}/activate")
def activate_volunteer(volunteer_id: str):
    try:
        volunteer_ref = db.collection("volunteers").document(volunteer_id)
        doc = volunteer_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Volunteer not found")

        volunteer_ref.update({
            "isDeleted": False,
            "isAccepted": True,
            "updatedAt": firestore.SERVER_TIMESTAMP
        })

        return {"message": "Volunteer successfully activated"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
