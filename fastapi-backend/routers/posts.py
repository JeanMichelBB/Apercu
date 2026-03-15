from fastapi import APIRouter, HTTPException, Depends, Query, Header
from database.engine import SessionLocal
from database.models import BlogPost, SpeakerPost, Speaker
from schemas import BlogPostCreate, BlogPostUpdate
from routers.auth import require_admin, require_organizer
from typing import Optional

router = APIRouter(prefix="/posts", tags=["posts"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("")
async def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    with SessionLocal() as db:
        query = db.query(BlogPost).filter(BlogPost.status == "published")
        total = query.count()
        posts = query.order_by(BlogPost.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
        return {"total": total, "page": page, "limit": limit, "items": [_serialize(p) for p in posts]}


# ── Admin ─────────────────────────────────────────────────────────────────────

@router.get("/all")
async def list_all_posts(admin=Depends(require_admin)):
    with SessionLocal() as db:
        posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
        return [_serialize(p) for p in posts]


# ── Organizer ─────────────────────────────────────────────────────────────────

@router.get("/organizer/my-posts")
async def my_posts(organizer: dict = Depends(require_organizer)):
    user_id = organizer.get("user_id")
    with SessionLocal() as db:
        query = db.query(BlogPost)
        if organizer.get("role") != "admin":
            query = query.filter(BlogPost.created_by == user_id)
        posts = query.order_by(BlogPost.created_at.desc()).all()
        return [_serialize(p) for p in posts]


@router.post("")
async def create_post(body: BlogPostCreate, organizer: dict = Depends(require_organizer)):
    user_id = organizer.get("user_id")
    role = organizer.get("role")
    with SessionLocal() as db:
        data = body.model_dump()
        if role == "admin":
            status = "published" if data.get("published") else "draft"
        else:
            status = "pending" if data.get("published") else "draft"
            data["published"] = False  # organizers can't publish directly
        post = BlogPost(**data, status=status, created_by=user_id)
        db.add(post)
        db.commit()
        db.refresh(post)
        return _serialize(post)


# ── Parameterized routes (must come after all named routes) ───────────────────

@router.get("/{post_id}/speakers")
async def get_post_speakers(post_id: str):
    with SessionLocal() as db:
        links = db.query(SpeakerPost).filter(SpeakerPost.post_id == post_id).all()
        speaker_ids = [l.speaker_id for l in links]
        speakers = db.query(Speaker).filter(Speaker.id.in_(speaker_ids)).order_by(Speaker.name).all()
        return [{"id": s.id, "name": s.name, "bio": s.bio, "photo_url": s.photo_url or f"https://i.pravatar.cc/150?u={s.id}"} for s in speakers]


@router.post("/{post_id}/speakers/{speaker_id}")
async def add_post_speaker(post_id: str, speaker_id: str, organizer: dict = Depends(require_organizer)):
    user_id = organizer.get("user_id")
    role = organizer.get("role")
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if role != "admin" and post.created_by != user_id:
            raise HTTPException(status_code=403, detail="Not your post")
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id, Speaker.status == "approved").first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found or not approved")
        existing = db.query(SpeakerPost).filter(SpeakerPost.post_id == post_id, SpeakerPost.speaker_id == speaker_id).first()
        if not existing:
            db.add(SpeakerPost(post_id=post_id, speaker_id=speaker_id))
            db.commit()
        return {"detail": "Speaker added"}


@router.delete("/{post_id}/speakers/{speaker_id}")
async def remove_post_speaker(post_id: str, speaker_id: str, organizer: dict = Depends(require_organizer)):
    user_id = organizer.get("user_id")
    role = organizer.get("role")
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if role != "admin" and post.created_by != user_id:
            raise HTTPException(status_code=403, detail="Not your post")
        link = db.query(SpeakerPost).filter(SpeakerPost.post_id == post_id, SpeakerPost.speaker_id == speaker_id).first()
        if link:
            db.delete(link)
            db.commit()
        return {"detail": "Speaker removed"}


@router.get("/{post_id}")
async def get_post(post_id: str, access_token: Optional[str] = Header(None, alias="access-token")):
    from routers.auth import SECRET_KEY
    import jwt as pyjwt
    is_privileged = False
    if access_token:
        try:
            payload = pyjwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
            is_privileged = payload.get("role") in ("admin", "organizer")
        except Exception:
            pass
    with SessionLocal() as db:
        query = db.query(BlogPost).filter(BlogPost.id == post_id)
        if not is_privileged:
            query = query.filter(BlogPost.status == "published")
        post = query.first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return _serialize(post)


@router.put("/{post_id}/approve")
async def approve_post(post_id: str, admin=Depends(require_admin)):
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        post.status = "published"
        post.published = True
        db.commit()
        db.refresh(post)
        return _serialize(post)


@router.put("/{post_id}/reject")
async def reject_post(post_id: str, admin=Depends(require_admin)):
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        post.status = "draft"
        post.published = False
        db.commit()
        db.refresh(post)
        return _serialize(post)


@router.put("/{post_id}")
async def update_post(post_id: str, body: BlogPostUpdate, organizer: dict = Depends(require_organizer)):
    user_id = organizer.get("user_id")
    role = organizer.get("role")
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if role != "admin" and post.created_by != user_id:
            raise HTTPException(status_code=403, detail="Not your post")
        data = body.model_dump(exclude_none=True)
        if role != "admin":
            # Organizer toggling published → moves to pending/draft
            if "published" in data:
                data["status"] = "pending" if data["published"] else "draft"
                data["published"] = False
        else:
            if "published" in data:
                data["status"] = "published" if data["published"] else "draft"
        for field, value in data.items():
            setattr(post, field, value)
        db.commit()
        db.refresh(post)
        return _serialize(post)


@router.delete("/{post_id}")
async def delete_post(post_id: str, organizer: dict = Depends(require_organizer)):
    user_id = organizer.get("user_id")
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if organizer.get("role") != "admin" and post.created_by != user_id:
            raise HTTPException(status_code=403, detail="Not your post")
        db.delete(post)
        db.commit()
        return {"detail": "Post deleted"}


# ── Serializer ────────────────────────────────────────────────────────────────

def _serialize(post: BlogPost) -> dict:
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "published": post.published,
        "status": post.status,
        "image_url": post.image_url,
        "created_by": post.created_by,
        "created_at": post.created_at.isoformat() if post.created_at else None,
    }
