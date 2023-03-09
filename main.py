from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import bcrypt
app = FastAPI()
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with the domains you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Database connection
conn = psycopg2.connect(
    host="localhost",
    database="weatherapp",
    user="postgres",
    password="test"
)

# User model


class User(BaseModel):
    email: str
    password: str
    name: str

# LoginUser model


class LoginUser(BaseModel):
    email: str
    password: str


@app.post("/signup")
def signup(user: User):
    cursor = conn.cursor()

    # Check if email already exists
    cursor.execute("SELECT email FROM users WHERE email=%s", (user.email,))
    existing_user = cursor.fetchone()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())

    # Insert user into database
    cursor.execute(
        "INSERT INTO users (email, password,name) VALUES (%s, %s, %s)",
        (user.email, hashed_password.decode(), user.name)
    )
    conn.commit()

    return {"message": "User created successfully"}


@app.post("/login")
def login(user: LoginUser):
    cursor = conn.cursor()

    # Retrieve user from database
    cursor.execute(
        "SELECT email, password FROM users WHERE email=%s", (user.email,))
    db_user = cursor.fetchone()

    if db_user is None:
        raise HTTPException(
            status_code=400, detail="Incorrect email or password")

    # Verify password
    if bcrypt.checkpw(user.password.encode(), db_user[1].encode()):
        return {"message": "Login successful"}
    else:
        raise HTTPException(
            status_code=400, detail="Incorrect email or password")
