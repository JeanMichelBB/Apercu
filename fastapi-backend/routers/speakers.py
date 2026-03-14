from fastapi import APIRouter, HTTPException, Depends
from database.engine import SessionLocal
from database.models import Speaker
from schemas import SpeakerCreate
from routers.auth import require_admin

router = APIRouter(prefix="/speakers", tags=["speakers"])


@router.get("")
async def list_speakers():
    with SessionLocal() as db:
        speakers = db.query(Speaker).order_by(Speaker.name).all()
        return [_serialize(s) for s in speakers]


@router.get("/{speaker_id}")
async def get_speaker(speaker_id: str):
    with SessionLocal() as db:
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        return _serialize(speaker)


@router.post("")
async def create_speaker(body: SpeakerCreate, admin=Depends(require_admin)):
    with SessionLocal() as db:
        speaker = Speaker(**body.model_dump())
        db.add(speaker)
        db.commit()
        db.refresh(speaker)
        return _serialize(speaker)


@router.put("/{speaker_id}")
async def update_speaker(speaker_id: str, body: SpeakerCreate, admin=Depends(require_admin)):
    with SessionLocal() as db:
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        for field, value in body.model_dump(exclude_none=True).items():
            setattr(speaker, field, value)
        db.commit()
        db.refresh(speaker)
        return _serialize(speaker)


@router.delete("/{speaker_id}")
async def delete_speaker(speaker_id: str, admin=Depends(require_admin)):
    with SessionLocal() as db:
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        db.delete(speaker)
        db.commit()
        return {"detail": "Speaker deleted"}


def _serialize(speaker: Speaker) -> dict:
    return {
        "id": speaker.id,
        "name": speaker.name,
        "bio": speaker.bio,
        "photo_url": speaker.photo_url,
        "created_at": speaker.created_at.isoformat() if speaker.created_at else None,
    }
