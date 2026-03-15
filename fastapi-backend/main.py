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
from database.models import Contact, Email, AdminUser, User, Event, Speaker, EventSpeaker, Registration, BlogPost, Comment, PostLike
from routers import contacts, emails, auth
from routers import events, speakers, posts, users, proxy, comments
from routers.auth import SECRET_KEY
from seed import seed_if_empty

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


def migrate_database():
    """Add any missing columns to existing tables without touching existing data."""
    conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
    with conn.cursor() as cursor:
        migrations = [
            ("users",      "email_verified", "ALTER TABLE users ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0"),
            ("events",     "status",     "ALTER TABLE events ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'draft'"),
            ("events",     "organizer_id","ALTER TABLE events ADD COLUMN organizer_id VARCHAR(36) NULL"),
            ("events",     "image_url",  "ALTER TABLE events ADD COLUMN image_url VARCHAR(500) NULL"),
            ("events",     "created_at", "ALTER TABLE events ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"),
            ("speakers",   "status",     "ALTER TABLE speakers ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'approved'"),
            ("speakers",   "created_by", "ALTER TABLE speakers ADD COLUMN created_by VARCHAR(36) NULL"),
            ("blog_posts", "status",     "ALTER TABLE blog_posts ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'draft'"),
            ("blog_posts", "created_by", "ALTER TABLE blog_posts ADD COLUMN created_by VARCHAR(36) NULL"),
            ("blog_posts", "image_url",  "ALTER TABLE blog_posts ADD COLUMN image_url VARCHAR(500) NULL"),
            ("speakers",   "gender",           "ALTER TABLE speakers ADD COLUMN gender VARCHAR(10) NULL"),
            ("events",     "rejection_reason", "ALTER TABLE events ADD COLUMN rejection_reason TEXT NULL"),
            ("speakers",   "rejection_reason", "ALTER TABLE speakers ADD COLUMN rejection_reason TEXT NULL"),
            ("blog_posts", "rejection_reason", "ALTER TABLE blog_posts ADD COLUMN rejection_reason TEXT NULL"),
        ]
        for table, column, alter_sql in migrations:
            cursor.execute(f"SHOW COLUMNS FROM `{table}` LIKE '{column}'")
            if not cursor.fetchone():
                cursor.execute(alter_sql)
        # Migrate existing published blog posts to status='published'
        cursor.execute("UPDATE blog_posts SET status = 'published' WHERE published = 1 AND status = 'draft'")
    conn.commit()
    conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Ensure database and user exist
    init_database()

    # 2. Create new tables
    Base.metadata.create_all(bind=engine)

    # 3. Add any missing columns to existing tables
    migrate_database()

    # 4. Seed admin user if Email table is empty
    session = SessionLocal()
    if not session.query(Email).all():
        hashed_password = bcrypt.hashpw(ADMIN_PASSWORD.encode(), bcrypt.gensalt())
        session.add(Email(email=ADMIN_USERNAME, password=hashed_password.decode()))
        session.commit()

    # 5. Seed sample data if database is empty
    seed_if_empty(session)
    session.close()

    yield


app = FastAPI(lifespan=lifespan)


PUBLIC_EXACT = {"/docs", "/openapi.json", "/login", "/submit-form", "/forget-password", "/auth/register", "/auth/user-login", "/auth/forgot-password", "/auth/verify-reset-code", "/auth/reset-password", "/auth/verify-email"}
PUBLIC_PREFIXES_GET = ("/speakers", "/posts", "/proxy")


def _is_public_event_get(path: str) -> bool:
    # Allow GET /events and GET /events/{id} and GET /events/{id}/speakers
    if path == "/events":
        return True
    parts = path.split("/")
    if len(parts) >= 3 and parts[1] == "events":
        # Block organizer/admin sub-paths
        if len(parts) > 3 and parts[3] in ("organizer", "admin", "registrations", "is-registered", "register"):
            return False
        return True
    return False


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    path = request.url.path
    method = request.method

    is_public = (
        path in PUBLIC_EXACT
        or (method == "GET" and path.startswith(PUBLIC_PREFIXES_GET))
        or (method == "GET" and _is_public_event_get(path))
    )

    if not is_public:
        token = request.headers.get("access-token")
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception:
            origin = request.headers.get("origin", "*")
            return JSONResponse(
                status_code=403,
                content={"detail": "Could not validate credentials"},
                headers={
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Credentials": "true",
                },
            )

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
app.include_router(events.router)
app.include_router(speakers.router)
app.include_router(posts.router)
app.include_router(users.router)
app.include_router(proxy.router)
app.include_router(comments.router)
