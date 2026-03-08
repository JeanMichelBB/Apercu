from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from starlette.responses import JSONResponse
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import bcrypt
import pymysql
import jwt
import os

load_dotenv()

from database.engine import engine, SessionLocal, Base
from database.models import Contact, Email, AdminUser
from routers import contacts, emails, auth
from routers.auth import SECRET_KEY

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_ROOT_PASSWORD = os.getenv("DB_ROOT_PASSWORD")


def init_database():
    conn = pymysql.connect(host=DB_HOST, user="root", password=DB_ROOT_PASSWORD)
    with conn.cursor() as cursor:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}`")
        cursor.execute(f"CREATE USER IF NOT EXISTS '{DB_USER}'@'%' IDENTIFIED BY '{DB_PASSWORD}'")
        cursor.execute(f"GRANT ALL PRIVILEGES ON `{DB_NAME}`.* TO '{DB_USER}'@'%'")
        cursor.execute("FLUSH PRIVILEGES")
    conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Ensure database and user exist
    init_database()

    # 2. Create tables
    Base.metadata.create_all(bind=engine)

    # 3. Seed admin user if Email table is empty
    session = SessionLocal()
    if not session.query(Email).all():
        hashed_password = bcrypt.hashpw(ADMIN_PASSWORD.encode(), bcrypt.gensalt())
        session.add(Email(email=ADMIN_USERNAME, password=hashed_password.decode()))
        session.commit()
    session.close()

    yield


app = FastAPI(lifespan=lifespan)


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.url.path not in ["/docs", "/openapi.json", "/login", "/submit-form", "/forget-password"]:
        token = request.headers.get("access-token")
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception:
            return JSONResponse(status_code=403, content={"detail": "Could not validate credentials"})
    response = await call_next(request)
    return response


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="FastAPI",
        version="1.0.0",
        description="Apercu API",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "access-token": {"type": "apiKey", "name": "access-token", "in": "header"}
    }
    openapi_schema["security"] = [{"access-token": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contacts.router)
app.include_router(emails.router)
app.include_router(auth.router)
