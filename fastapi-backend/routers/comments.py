from fastapi import APIRouter, HTTPException, Depends, Header
from database.engine import SessionLocal
from database.models import Comment, PostLike, User, BlogPost
from schemas import CommentCreate
from routers.auth import get_current_user
from typing import Optional
import jwt
import os

router = APIRouter(tags=["comments"])


@router.get("/posts/{post_id}/comments")
async def list_comments(post_id: str):
    with SessionLocal() as db:
        comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at).all()
        user_ids = list({c.user_id for c in comments})
        users = {u.id: u.name for u in db.query(User).filter(User.id.in_(user_ids)).all()}
        return [
            {
                "id": c.id,
                "user_id": c.user_id,
                "user_name": users.get(c.user_id, "Unknown"),
                "content": c.content,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in comments
        ]


@router.post("/posts/{post_id}/comments")
async def add_comment(post_id: str, body: CommentCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=403, detail="User account required")
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id, BlogPost.status == "published").first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        comment = Comment(post_id=post_id, user_id=user_id, content=body.content.strip())
        db.add(comment)
        db.commit()
        db.refresh(comment)
        user = db.query(User).filter(User.id == user_id).first()
        return {
            "id": comment.id,
            "user_id": comment.user_id,
            "user_name": user.name if user else "Unknown",
            "content": comment.content,
            "created_at": comment.created_at.isoformat() if comment.created_at else None,
        }


@router.delete("/posts/{post_id}/comments/{comment_id}")
async def delete_comment(post_id: str, comment_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    role = current_user.get("role")
    with SessionLocal() as db:
        comment = db.query(Comment).filter(Comment.id == comment_id, Comment.post_id == post_id).first()
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        if role != "admin" and comment.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not your comment")
        db.delete(comment)
        db.commit()
        return {"detail": "Comment deleted"}


@router.get("/posts/{post_id}/likes")
async def get_likes(post_id: str, access_token: Optional[str] = Header(None, alias="access-token")):
    from routers.auth import SECRET_KEY
    user_id = None
    if access_token:
        try:
            payload = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except Exception:
            pass
    with SessionLocal() as db:
        count = db.query(PostLike).filter(PostLike.post_id == post_id).count()
        liked = bool(
            user_id and db.query(PostLike).filter(
                PostLike.post_id == post_id, PostLike.user_id == user_id
            ).first()
        )
        return {"count": count, "liked": liked}


@router.post("/posts/{post_id}/like")
async def toggle_like(post_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=403, detail="User account required")
    with SessionLocal() as db:
        post = db.query(BlogPost).filter(BlogPost.id == post_id, BlogPost.status == "published").first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        existing = db.query(PostLike).filter(
            PostLike.post_id == post_id, PostLike.user_id == user_id
        ).first()
        if existing:
            db.delete(existing)
            liked = False
        else:
            db.add(PostLike(post_id=post_id, user_id=user_id))
            liked = True
        db.commit()
        count = db.query(PostLike).filter(PostLike.post_id == post_id).count()
        return {"count": count, "liked": liked}
