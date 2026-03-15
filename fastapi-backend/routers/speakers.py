from fastapi import APIRouter, HTTPException, Depends
from database.engine import SessionLocal
from database.models import Speaker, EventSpeaker, Event, SpeakerPost, BlogPost
from schemas import SpeakerCreate, RejectionBody
from routers.auth import require_admin, require_organizer

router = APIRouter(prefix="/speakers", tags=["speakers"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("")
async def list_speakers():
    with SessionLocal() as db:
        speakers = db.query(Speaker).filter(Speaker.status == "approved").order_by(Speaker.name).all()
        return [_serialize(s) for s in speakers]


@router.get("/{speaker_id}")
async def get_speaker(speaker_id: str):
    with SessionLocal() as db:
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id, Speaker.status == "approved").first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        return _serialize(speaker)


@router.get("/{speaker_id}/events")
async def get_speaker_events(speaker_id: str):
    with SessionLocal() as db:
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        links = db.query(EventSpeaker).filter(EventSpeaker.speaker_id == speaker_id).all()
        event_ids = [l.event_id for l in links]
        events = db.query(Event).filter(
            Event.id.in_(event_ids),
            Event.status == "published",
        ).order_by(Event.date).all()
        return [_serialize_event(e) for e in events]


@router.get("/{speaker_id}/posts")
async def get_speaker_posts(speaker_id: str):
    with SessionLocal() as db:
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        links = db.query(SpeakerPost).filter(SpeakerPost.speaker_id == speaker_id).all()
        post_ids = [l.post_id for l in links]
        posts = db.query(BlogPost).filter(
            BlogPost.id.in_(post_ids),
            BlogPost.published == True,
        ).order_by(BlogPost.created_at.desc()).all()
        return [_serialize_post(p) for p in posts]


# ── Organizer ─────────────────────────────────────────────────────────────────

@router.post("/submit")
async def submit_speaker(body: SpeakerCreate, organizer: dict = Depends(require_organizer)):
    user_id = organizer.get("user_id")
    with SessionLocal() as db:
        status = "approved" if organizer.get("role") == "admin" else "pending"
        speaker = Speaker(**body.model_dump(), status=status, created_by=user_id)
        db.add(speaker)
        db.commit()
        db.refresh(speaker)
        return _serialize(speaker)


@router.get("/organizer/my-speakers")
async def my_speakers(organizer: dict = Depends(require_organizer)):
    user_id = organizer.get("user_id")
    with SessionLocal() as db:
        query = db.query(Speaker)
        if organizer.get("role") != "admin":
            query = query.filter(Speaker.created_by == user_id)
        speakers = query.order_by(Speaker.created_at.desc()).all()
        return [_serialize(s) for s in speakers]


# ── Admin ─────────────────────────────────────────────────────────────────────

@router.get("/admin/all")
async def list_all_speakers(admin=Depends(require_admin)):
    with SessionLocal() as db:
        speakers = db.query(Speaker).order_by(Speaker.status, Speaker.name).all()
        return [_serialize(s) for s in speakers]


@router.post("")
async def create_speaker(body: SpeakerCreate, admin=Depends(require_admin)):
    with SessionLocal() as db:
        speaker = Speaker(**body.model_dump(), status="approved")
        db.add(speaker)
        db.commit()
        db.refresh(speaker)
        return _serialize(speaker)


@router.put("/{speaker_id}/approve")
async def approve_speaker(speaker_id: str, admin=Depends(require_admin)):
    with SessionLocal() as db:
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        speaker.status = "approved"
        db.commit()
        db.refresh(speaker)
        return _serialize(speaker)


@router.put("/{speaker_id}/reject")
async def reject_speaker(speaker_id: str, body: RejectionBody, admin=Depends(require_admin)):
    with SessionLocal() as db:
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        speaker.status = "rejected"
        speaker.rejection_reason = body.reason
        db.commit()
        db.refresh(speaker)
        return _serialize(speaker)


@router.post("/{speaker_id}/resubmit")
async def resubmit_speaker(speaker_id: str, organizer: dict = Depends(require_organizer)):
    user_id = organizer.get("user_id")
    with SessionLocal() as db:
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        if organizer.get("role") != "admin" and speaker.created_by != user_id:
            raise HTTPException(status_code=403, detail="Not your speaker")
        if speaker.status != "rejected":
            raise HTTPException(status_code=400, detail="Only rejected speakers can be resubmitted")
        speaker.status = "pending"
        speaker.rejection_reason = None
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


# ── Serializers ───────────────────────────────────────────────────────────────

def _avatar(speaker: Speaker) -> str:
    if speaker.photo_url:
        return speaker.photo_url
    # Append gender prefix to seed so male/female get distinct consistent avatars
    seed = f"{speaker.gender or 'x'}-{speaker.id}"
    return f"https://i.pravatar.cc/150?u={seed}"


def _serialize(speaker: Speaker) -> dict:
    return {
        "id": speaker.id,
        "name": speaker.name,
        "bio": speaker.bio,
        "photo_url": _avatar(speaker),
        "gender": speaker.gender,
        "status": speaker.status,
        "rejection_reason": speaker.rejection_reason,
        "created_by": speaker.created_by,
        "created_at": speaker.created_at.isoformat() if speaker.created_at else None,
    }


def _serialize_post(post: BlogPost) -> dict:
    return {
        "id": post.id,
        "title": post.title,
        "image_url": post.image_url,
        "created_at": post.created_at.isoformat() if post.created_at else None,
    }


def _serialize_event(event: Event) -> dict:
    return {
        "id": event.id,
        "title": event.title,
        "location": event.location,
        "date": event.date.isoformat() if event.date else None,
        "image_url": event.image_url,
    }
