"""
Seed script — populates the database with sample data.

Auto-run (safe):
    Called from main.py lifespan — only seeds if tables are empty.

Manual full reset (dev only):
    cd fastapi-backend
    python seed.py           # wipes existing seed data and re-inserts
    python seed.py --force   # same as above, explicit
"""

import os
import sys
from dotenv import load_dotenv
load_dotenv()

from database.engine import SessionLocal, engine, Base
from database.models import Event, Speaker, EventSpeaker, BlogPost, Registration
from datetime import datetime


def _build_speakers():
    return [
        Speaker(
            name="Marie Dupont",
            bio="Senior software architect with 15 years of experience in distributed systems and cloud-native applications.",
            photo_url="https://i.pravatar.cc/150?img=47",
        ),
        Speaker(
            name="James Carter",
            bio="Product manager turned entrepreneur. Founder of two successful SaaS startups and keynote speaker on product strategy.",
            photo_url="https://i.pravatar.cc/150?img=12",
        ),
        Speaker(
            name="Aisha Tremblay",
            bio="DevOps engineer and open-source contributor. Passionate about Kubernetes, observability, and developer experience.",
            photo_url="https://i.pravatar.cc/150?img=38",
        ),
        Speaker(
            name="Lucas Fontaine",
            bio="Data scientist and AI researcher at a leading Montreal tech firm. Specializes in NLP and machine learning at scale.",
            photo_url="https://i.pravatar.cc/150?img=53",
        ),
    ]


def _build_events():
    return [
        Event(
            title="Tech Summit Montreal 2026",
            description=(
                "Join us for the biggest tech conference in Montreal. "
                "Three days of talks, workshops, and networking with industry leaders. "
                "Topics include cloud architecture, AI/ML, DevOps, and product management.\n\n"
                "Whether you're a developer, designer, or founder, Tech Summit has something for you. "
                "Expect hands-on workshops, live demos, and an unforgettable closing keynote."
            ),
            location="Palais des congrès de Montréal, 1001 Place Jean-Paul-Riopelle",
            date=datetime(2026, 6, 15, 9, 0),
            capacity=500,
            status="published",
        ),
        Event(
            title="DevOps & Kubernetes Workshop",
            description=(
                "A full-day hands-on workshop covering Kubernetes from zero to production. "
                "You will learn how to containerize applications, write Helm charts, set up CI/CD pipelines, "
                "and monitor your cluster with Prometheus and Grafana.\n\n"
                "Bring your laptop. All skill levels welcome — beginners will leave with a working cluster."
            ),
            location="Station C, 180 Rue Sainte-Catherine O, Montréal",
            date=datetime(2026, 7, 8, 10, 0),
            capacity=40,
            status="published",
        ),
        Event(
            title="AI & The Future of Work",
            description=(
                "A panel discussion exploring how artificial intelligence is reshaping industries and job markets. "
                "Our speakers will share real-world examples of AI adoption, the skills employers are looking for, "
                "and how to future-proof your career.\n\n"
                "Open Q&A session follows the panel. Networking cocktail from 6pm."
            ),
            location="Notman House, 51 Rue Sherbrooke O, Montréal",
            date=datetime(2026, 8, 20, 17, 30),
            capacity=120,
            status="published",
        ),
        Event(
            title="Startup Pitch Night",
            description=(
                "Ten early-stage startups pitch their ideas to a panel of investors and industry experts. "
                "Come support the next generation of entrepreneurs and vote for your favourite pitch.\n\n"
                "Doors open at 6pm. Pitches start at 7pm sharp. Light refreshments provided."
            ),
            location="L'Escogriffe, 4467 Rue Saint-Denis, Montréal",
            date=datetime(2026, 9, 10, 18, 0),
            capacity=80,
            status="published",
        ),
        Event(
            title="Winter Hackathon 2026",
            description=(
                "48 hours to build something amazing. Form a team or join solo — we'll help you find teammates. "
                "Prizes totalling $10,000 across three categories: Best UX, Best Technical Achievement, and Most Impactful."
            ),
            location="Google Montréal, 2000 Rue Peel",
            date=datetime(2026, 12, 5, 9, 0),
            capacity=200,
            status="draft",
        ),
    ]


def _build_posts():
    return [
        BlogPost(
            title="Why Kubernetes is the New Standard for Deployment",
            content=(
                "Over the past five years, Kubernetes has gone from an experimental Google project to the de facto "
                "standard for deploying containerized applications. But what makes it so compelling?\n\n"
                "At its core, Kubernetes solves the hard problem of running distributed systems reliably at scale. "
                "It handles service discovery, load balancing, secret management, storage orchestration, and "
                "automated rollouts — all out of the box.\n\n"
                "For developers, the shift to Kubernetes means writing once and deploying anywhere. "
                "For ops teams, it means a unified control plane across on-premise and cloud environments. "
                "That combination is hard to beat.\n\n"
                "If you haven't made the jump yet, our upcoming DevOps & Kubernetes Workshop is the perfect place to start."
            ),
            published=True,
        ),
        BlogPost(
            title="5 Things We Learned Organizing Tech Summit Montreal",
            content=(
                "After months of planning, Tech Summit Montreal 2025 brought together over 400 attendees, "
                "22 speakers, and more coffee than we'd care to admit. Here's what we learned.\n\n"
                "1. Start the speaker selection process earlier than you think.\n"
                "We opened our CFP eight weeks before the event. Next year, we're aiming for twelve.\n\n"
                "2. Hybrid events are harder than they look.\n"
                "Streaming live sessions while managing an in-person audience requires dedicated AV staff. "
                "Do not try to handle this with a laptop and a webcam.\n\n"
                "3. Networking time is the real product.\n"
                "Our post-session surveys showed that attendees valued unstructured networking breaks "
                "almost as highly as the keynotes. Build more of it in.\n\n"
                "4. Sponsors care about brand perception, not just logos.\n"
                "The sponsors who got the most value were those who ran interactive booths, not those with the biggest banner.\n\n"
                "5. The community shows up when you show up for them.\n"
                "We had volunteers we'd never met before drive three hours to help set up. "
                "That kind of commitment doesn't come from nowhere — it comes from years of consistent community building."
            ),
            published=True,
        ),
        BlogPost(
            title="Announcing Our 2026 Speaker Lineup",
            content=(
                "We are thrilled to announce the first wave of speakers for Tech Summit Montreal 2026.\n\n"
                "This year's theme is 'Building for Scale' — and our lineup reflects exactly that. "
                "From distributed systems to product-led growth, we've assembled a group of practitioners "
                "who have actually done the things they'll be talking about.\n\n"
                "Tickets go on sale March 1st. Early bird pricing ends March 31st. "
                "Keep an eye on this blog and our social channels for more announcements in the coming weeks."
            ),
            published=True,
        ),
        BlogPost(
            title="Call for Proposals: Tech Summit Montreal 2026",
            content=(
                "We are now accepting proposals for Tech Summit Montreal 2026.\n\n"
                "We are looking for talks in the following areas:\n"
                "- Cloud infrastructure and platform engineering\n"
                "- AI/ML in production\n"
                "- Developer experience and tooling\n"
                "- Product strategy and go-to-market\n"
                "- Open source sustainability\n\n"
                "Talks should be 30 or 45 minutes. Workshops are 3 hours.\n\n"
                "The CFP closes April 15th. Accepted speakers receive a full conference pass and travel assistance."
            ),
            published=False,
        ),
    ]


def _insert(db):
    """Insert all seed data. Assumes tables are already empty."""
    speakers = _build_speakers()
    for s in speakers:
        db.add(s)
    db.commit()
    for s in speakers:
        db.refresh(s)

    events = _build_events()
    for e in events:
        db.add(e)
    db.commit()
    for e in events:
        db.refresh(e)

    links = [
        (events[0].id, speakers[0].id),
        (events[0].id, speakers[1].id),
        (events[0].id, speakers[2].id),
        (events[1].id, speakers[2].id),
        (events[2].id, speakers[1].id),
        (events[2].id, speakers[3].id),
    ]
    for event_id, speaker_id in links:
        db.add(EventSpeaker(event_id=event_id, speaker_id=speaker_id))
    db.commit()

    posts = _build_posts()
    for p in posts:
        db.add(p)
    db.commit()

    published_events = sum(1 for e in events if e.status == "published")
    published_posts = sum(1 for p in posts if p.published)
    print("✓ Seed complete.")
    print(f"  {len(speakers)} speakers")
    print(f"  {len(events)} events ({published_events} published)")
    print(f"  {len(posts)} blog posts ({published_posts} published)")


def seed_if_empty(db):
    """Called automatically on startup — only seeds when all tables are empty."""
    already_seeded = (
        db.query(Event).count() > 0
        or db.query(Speaker).count() > 0
        or db.query(BlogPost).count() > 0
    )
    if already_seeded:
        print("⏭  Seed skipped — database already contains data.")
        return
    print("🌱 Empty database detected — running seed...")
    _insert(db)


# ── Manual dev reset ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    print("⚠️  Wiping existing seed data...")
    db.query(EventSpeaker).delete()
    db.query(Registration).delete()
    db.query(Event).delete()
    db.query(Speaker).delete()
    db.query(BlogPost).delete()
    db.commit()
    _insert(db)
    db.close()
