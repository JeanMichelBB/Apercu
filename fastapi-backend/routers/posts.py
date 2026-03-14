from fastapi import APIRouter, HTTPException, Depends, Query
from database.engine import SessionLocal
from database.models import BlogPost
from schemas import BlogPostCreate, BlogPostUpdate
from routers.auth import require_admin
from typing import Optional

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("")
async def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    with SessionLocal() as db:
        query = db.query(BlogPost).filter(BlogPost.published == True)
        total = query.count()
        posts = query.order_by(BlogPost.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "items": [_serialize(p) for p in posts],
        }


@router.get("/all")
async def list_all_posts(admin=Depends(require_admin)):
    with SessionLocal() as db:
        posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
        return [_serialize(p) for p in posts]


@router.get("/{post_id}")
async def get_post(post_id: str):
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id, BlogPost.published == True).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return _serialize(post)


@router.post("")
async def create_post(body: BlogPostCreate, admin=Depends(require_admin)):
    with SessionLocal() as db:
        post = BlogPost(**body.model_dump())
        db.add(post)
        db.commit()
        db.refresh(post)
        return _serialize(post)


@router.put("/{post_id}")
async def update_post(post_id: str, body: BlogPostUpdate, admin=Depends(require_admin)):
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        for field, value in body.model_dump(exclude_none=True).items():
            setattr(post, field, value)
        db.commit()
        db.refresh(post)
        return _serialize(post)


@router.delete("/{post_id}")
async def delete_post(post_id: str, admin=Depends(require_admin)):
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        db.delete(post)
        db.commit()
        return {"detail": "Post deleted"}


def _serialize(post: BlogPost) -> dict:
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "published": post.published,
        "created_at": post.created_at.isoformat() if post.created_at else None,
    }
