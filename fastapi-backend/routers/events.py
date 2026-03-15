from fastapi import APIRouter, HTTPException, Depends, Query
from database.engine import SessionLocal
from database.models import Event, Registration, User, Speaker, EventSpeaker
from schemas import EventCreate, EventUpdate, RejectionBody
from routers.auth import require_admin, require_organizer, get_current_user
from typing import Optional
from datetime import datetime as dt_datetime, timedelta

router = APIRouter(prefix="/events", tags=["events"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("")
async def list_events(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    with SessionLocal() as db:
        query = db.query(Event).filter(Event.status == "published")
        if search:
            query = query.filter(Event.title.ilike(f"%{search}%"))
        total = query.count()
        events = query.order_by(Event.date).offset((page - 1) * limit).limit(limit).all()

        # Batch-load speakers for all returned events
        event_ids = [e.id for e in events]
        links = db.query(EventSpeaker).filter(EventSpeaker.event_id.in_(event_ids)).all()
        speaker_ids = list({l.speaker_id for l in links})
        speakers_map = {
            s.id: s for s in db.query(Speaker).filter(
                Speaker.id.in_(speaker_ids), Speaker.status == "approved"
            ).all()
        }
        event_speakers: dict[str, list] = {e.id: [] for e in events}
        for link in links:
            s = speakers_map.get(link.speaker_id)
            if s:
                event_speakers[link.event_id].append(s)

        return {
            "total": total, "page": page, "limit": limit,
            "items": [_serialize(e, event_speakers.get(e.id, [])) for e in events],
        }


@router.get("/my/registrations")
async def my_registrations(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=403, detail="User account required")
    with SessionLocal() as db:
        regs = db.query(Registration).filter(Registration.user_id == user_id).all()
        event_ids = [r.event_id for r in regs]
        events = db.query(Event).filter(Event.id.in_(event_ids)).all()
        return [_serialize(e) for e in events]


@router.get("/{event_id}")
async def get_event(event_id: str):
    with SessionLocal() as db:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        return _serialize(event)


@router.get("/{event_id}/speakers")
async def get_event_speakers(event_id: str):
    with SessionLocal() as db:
        links = db.query(EventSpeaker).filter(EventSpeaker.event_id == event_id).all()
        speaker_ids = [l.speaker_id for l in links]
        speakers = db.query(Speaker).filter(Speaker.id.in_(speaker_ids)).order_by(Speaker.name).all()
        return [{"id": s.id, "name": s.name, "bio": s.bio, "photo_url": s.photo_url or f"https://i.pravatar.cc/150?u={s.id}"} for s in speakers]


@router.post("/{event_id}/speakers/{speaker_id}")
async def add_event_speaker(event_id: str, speaker_id: str, organizer: dict = Depends(require_organizer)):
    organizer_id = organizer.get("user_id")
    with SessionLocal() as db:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        if organizer.get("role") != "admin" and event.organizer_id != organizer_id:
            raise HTTPException(status_code=403, detail="Not your event")
        speaker = db.query(Speaker).filter(Speaker.id == speaker_id, Speaker.status == "approved").first()
        if not speaker:
            raise HTTPException(status_code=404, detail="Speaker not found")
        exists = db.query(EventSpeaker).filter_by(event_id=event_id, speaker_id=speaker_id).first()
        if exists:
            raise HTTPException(status_code=400, detail="Speaker already linked")
        db.add(EventSpeaker(event_id=event_id, speaker_id=speaker_id))
        db.commit()
        return {"detail": "Speaker added"}


@router.delete("/{event_id}/speakers/{speaker_id}")
async def remove_event_speaker(event_id: str, speaker_id: str, organizer: dict = Depends(require_organizer)):
    organizer_id = organizer.get("user_id")
    with SessionLocal() as db:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        if organizer.get("role") != "admin" and event.organizer_id != organizer_id:
            raise HTTPException(status_code=403, detail="Not your event")
        link = db.query(EventSpeaker).filter_by(event_id=event_id, speaker_id=speaker_id).first()
        if not link:
            raise HTTPException(status_code=404, detail="Speaker not linked")
        db.delete(link)
        db.commit()
        return {"detail": "Speaker removed"}


# ── Organizer ─────────────────────────────────────────────────────────────────

@router.get("/organizer/my-events")
async def my_events(organizer: dict = Depends(require_organizer)):
    organizer_id = organizer.get("user_id")
    with SessionLocal() as db:
        query = db.query(Event)
        if organizer.get("role") != "admin":
            query = query.filter(Event.organizer_id == organizer_id)
        events = query.order_by(Event.date).all()
        return [_serialize(e) for e in events]


@router.get("/{event_id}/registrations")
async def event_registrations(event_id: str, organizer: dict = Depends(require_organizer)):
    organizer_id = organizer.get("user_id")
    with SessionLocal() as db:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        if organizer.get("role") != "admin" and event.organizer_id != organizer_id:
            raise HTTPException(status_code=403, detail="Not your event")
        regs = db.query(Registration).filter(Registration.event_id == event_id).all()
        user_ids = [r.user_id for r in regs]
        users_map = {
            u.id: {"name": u.name, "email": u.email}
            for u in db.query(User).filter(User.id.in_(user_ids)).all()
        }
        return [
            {
                "id": r.id,
                "user_id": r.user_id,
                "name": users_map.get(r.user_id, {}).get("name", ""),
                "email": users_map.get(r.user_id, {}).get("email", ""),
                "registered_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in regs
        ]


@router.post("")
async def create_event(body: EventCreate, organizer: dict = Depends(require_organizer)):
    organizer_id = organizer.get("user_id")
    role = organizer.get("role")
    with SessionLocal() as db:
        data = body.model_dump()
        if role != "admin" and data.get("date") and data["date"] <= dt_datetime.utcnow():
            raise HTTPException(status_code=400, detail="Event date must be in the future.")
        # Duplicate check: same title (case-insensitive) on the same calendar day
        if data.get("date") and data.get("title"):
            day_start = data["date"].replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            duplicate = db.query(Event).filter(
                Event.title.ilike(data["title"]),
                Event.date >= day_start,
                Event.date < day_end,
            ).first()
            if duplicate:
                raise HTTPException(status_code=400, detail="An event with this title already exists on that date.")
        # Admin can set any status; organizer always submits as pending
        if role != "admin":
            data["status"] = "pending"
        event = Event(**data, organizer_id=organizer_id)
        db.add(event)
        db.commit()
        db.refresh(event)
        return _serialize(event)


@router.put("/{event_id}")
async def update_event(event_id: str, body: EventUpdate, organizer: dict = Depends(require_organizer)):
    organizer_id = organizer.get("user_id")
    role = organizer.get("role")
    with SessionLocal() as db:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        if role != "admin" and event.organizer_id != organizer_id:
            raise HTTPException(status_code=403, detail="Not your event")
        if role != "admin" and event.status == "published":
            raise HTTPException(status_code=400, detail="Cannot edit a published event")
        updates = body.model_dump(exclude_none=True)
        new_title = updates.get("title", event.title)
        new_date = updates.get("date", event.date)
        if new_date and new_title:
            day_start = new_date.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            duplicate = db.query(Event).filter(
                Event.id != event_id,
                Event.title.ilike(new_title),
                Event.date >= day_start,
                Event.date < day_end,
            ).first()
            if duplicate:
                raise HTTPException(status_code=400, detail="An event with this title already exists on that date.")
        for field, value in updates.items():
            # Organizers cannot change status directly
            if field == "status" and role != "admin":
                continue
            setattr(event, field, value)
        db.commit()
        db.refresh(event)
        return _serialize(event)


@router.delete("/{event_id}")
async def delete_event(event_id: str, organizer: dict = Depends(require_organizer)):
    organizer_id = organizer.get("user_id")
    role = organizer.get("role")
    with SessionLocal() as db:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        if role != "admin" and event.organizer_id != organizer_id:
            raise HTTPException(status_code=403, detail="Not your event")
        db.query(Registration).filter(Registration.event_id == event_id).delete()
        db.query(EventSpeaker).filter(EventSpeaker.event_id == event_id).delete()
        db.delete(event)
        db.commit()
        return {"detail": "Event deleted"}


# ── Admin ─────────────────────────────────────────────────────────────────────

@router.get("/admin/all")
async def list_all_events(admin=Depends(require_admin)):
    with SessionLocal() as db:
        events = db.query(Event).order_by(Event.date).all()
        return [_serialize(e) for e in events]


@router.get("/admin/pending")
async def list_pending_events(admin=Depends(require_admin)):
    with SessionLocal() as db:
        events = db.query(Event).filter(Event.status == "pending").order_by(Event.created_at).all()
        return [_serialize(e) for e in events]


@router.put("/{event_id}/approve")
async def approve_event(event_id: str, admin=Depends(require_admin)):
    with SessionLocal() as db:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        event.status = "published"
        db.commit()
        db.refresh(event)
        return _serialize(event)


@router.put("/{event_id}/reject")
async def reject_event(event_id: str, body: RejectionBody, admin=Depends(require_admin)):
    with SessionLocal() as db:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        event.status = "rejected"
        event.rejection_reason = body.reason
        db.commit()
        db.refresh(event)
        return _serialize(event)


@router.post("/{event_id}/resubmit")
async def resubmit_event(event_id: str, organizer: dict = Depends(require_organizer)):
    organizer_id = organizer.get("user_id")
    with SessionLocal() as db:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        if organizer.get("role") != "admin" and event.organizer_id != organizer_id:
            raise HTTPException(status_code=403, detail="Not your event")
        if event.status != "rejected":
            raise HTTPException(status_code=400, detail="Only rejected events can be resubmitted")
        event.status = "pending"
        event.rejection_reason = None
        db.commit()
        db.refresh(event)
        return _serialize(event)


# ── User registrations ────────────────────────────────────────────────────────

@router.get("/{event_id}/is-registered")
async def is_registered(event_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        return {"registered": False}
    with SessionLocal() as db:
        exists = db.query(Registration).filter(
            Registration.event_id == event_id,
            Registration.user_id == user_id,
        ).first()
        return {"registered": bool(exists)}


@router.delete("/{event_id}/register")
async def cancel_registration(event_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=403, detail="User account required")
    with SessionLocal() as db:
        reg = db.query(Registration).filter(
            Registration.event_id == event_id,
            Registration.user_id == user_id,
        ).first()
        if not reg:
            raise HTTPException(status_code=404, detail="Registration not found")
        db.delete(reg)
        db.commit()
        return {"detail": "Registration cancelled"}


@router.post("/{event_id}/register")
async def register_for_event(event_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=403, detail="User account required to register")
    with SessionLocal() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if user and not user.email_verified:
            raise HTTPException(status_code=403, detail="Please verify your email before registering for events.")
        event = db.query(Event).filter(Event.id == event_id, Event.status == "published").first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        if db.query(Registration).filter(Registration.event_id == event_id, Registration.user_id == user_id).first():
            raise HTTPException(status_code=400, detail="Already registered")
        count = db.query(Registration).filter(Registration.event_id == event_id).count()
        if event.capacity and count >= event.capacity:
            raise HTTPException(status_code=400, detail="Event is full")
        db.add(Registration(event_id=event_id, user_id=user_id))
        db.commit()
        print(
            f"[EMAIL] Registration confirmation → {user.email}\n"
            f"  Hi {user.name}, you are registered for '{event.title}'\n"
            f"  Date: {event.date.strftime('%B %d, %Y at %H:%M')}\n"
            f"  Location: {event.location}"
        )
        return {"detail": "Registered successfully"}


@router.get("/registrations/all")
async def all_registrations(admin=Depends(require_admin)):
    with SessionLocal() as db:
        regs = db.query(Registration).all()
        event_ids = {r.event_id for r in regs}
        events_map = {e.id: e.title for e in db.query(Event).filter(Event.id.in_(event_ids)).all()}
        return [
            {
                "id": r.id,
                "event_id": r.event_id,
                "event_title": events_map.get(r.event_id, ""),
                "user_id": r.user_id,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in regs
        ]


def _serialize(event: Event, speakers: list = []) -> dict:
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "location": event.location,
        "date": event.date.isoformat() if event.date else None,
        "capacity": event.capacity,
        "status": event.status,
        "organizer_id": event.organizer_id,
        "image_url": event.image_url,
        "rejection_reason": event.rejection_reason,
        "created_at": event.created_at.isoformat() if event.created_at else None,
        "speakers": [
            {"id": s.id, "name": s.name, "photo_url": s.photo_url or f"https://i.pravatar.cc/150?u={s.id}"}
            for s in speakers
        ],
    }
