from fastapi import APIRouter, HTTPException, Depends
from database.engine import SessionLocal
from database.models import User
from routers.auth import require_admin

router = APIRouter(prefix="/users", tags=["users"])


@router.get("")
async def list_users(admin=Depends(require_admin)):
    with SessionLocal() as db:
        users = db.query(User).order_by(User.created_at.desc()).all()
        return [_serialize(u) for u in users]


@router.put("/{user_id}/role")
async def update_role(user_id: str, role: str, admin=Depends(require_admin)):
    allowed = {"user", "organizer"}
    if role not in allowed:
        raise HTTPException(status_code=400, detail=f"Role must be one of: {allowed}")
    with SessionLocal() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.role = role
        db.commit()
        db.refresh(user)
        return _serialize(user)


@router.delete("/{user_id}")
async def delete_user(user_id: str, admin=Depends(require_admin)):
    with SessionLocal() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        db.delete(user)
        db.commit()
        return {"detail": "User deleted"}


def _serialize(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }
