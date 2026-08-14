# Fictional Timeline Rotation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 20 seeded events and 20 seeded blog posts always look current relative to today's date — 5 past + 10 future events (with a "Completed" badge on past ones) and 20 posts spread across the past — by storing a day-offset per row and recomputing actual dates on every backend startup.

**Architecture:** Two new nullable columns (`day_offset` on `Event` and `BlogPost`, plus `published_date` on `BlogPost`) drive a `refresh_seeded_dates()` function in `seed.py`, called from the FastAPI startup lifespan on every boot. Only rows with `day_offset` set are touched — real, organizer-created content is untouched because it never gets a `day_offset`. Public APIs expose `is_past` (events) and `published_date` (posts); the frontend renders a "Completed" badge and uses `published_date` for display.

**Tech Stack:** FastAPI + SQLAlchemy (MySQL), React. No automated test suite exists in this project (`fastapi-backend` has no `pytest`/test directory) — per the approved spec, verification here is manual, matching how the rest of the seed data is validated today.

Spec: `docs/superpowers/specs/2026-08-14-fictional-timeline-rotation-design.md`

---

### Task 1: Add `day_offset` / `published_date` columns to models

**Files:**
- Modify: `fastapi-backend/database/models.py:45-57` (Event class)
- Modify: `fastapi-backend/database/models.py:108-118` (BlogPost class)

- [ ] **Step 1: Add `day_offset` to `Event`**

In `fastapi-backend/database/models.py`, inside the `Event` class, add the new column right after `created_at`:

```python
class Event(Base):
    __tablename__ = "events"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    title = Column(String(200))
    description = Column(Text)
    location = Column(String(200))
    date = Column(DateTime)
    capacity = Column(Integer)
    status = Column(String(20), default="draft")  # draft | pending | published | rejected
    organizer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    image_url = Column(String(500), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    day_offset = Column(Integer, nullable=True)  # seeded fictional events only; NULL for real events
```

- [ ] **Step 2: Add `published_date` and `day_offset` to `BlogPost`**

In the same file, update the `BlogPost` class:

```python
class BlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), unique=True)
    title = Column(String(200))
    content = Column(Text)
    published = Column(Boolean, default=False)
    status = Column(String(20), default="draft")  # draft | pending | published | rejected
    image_url = Column(String(500), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    published_date = Column(DateTime, nullable=True)  # display date; falls back to created_at if NULL
    day_offset = Column(Integer, nullable=True)  # seeded fictional posts only; NULL for real posts
```

- [ ] **Step 3: Verify the file imports still cover the types used**

`Integer` and `DateTime` are already imported at the top of `models.py` (line 1: `from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer, ForeignKey, func`) — no import changes needed. Confirm by reading the top of the file:

Run: `head -5 fastapi-backend/database/models.py`
Expected: shows the existing import line unchanged, containing `Integer` and `DateTime`.

- [ ] **Step 4: Commit**

```bash
git add fastapi-backend/database/models.py
git commit -m "feat: add day_offset/published_date columns for fictional timeline rotation"
```

---

### Task 2: Add column migrations for existing databases

**Files:**
- Modify: `fastapi-backend/main.py:44-58` (`migrations` list inside `migrate_database()`)

- [ ] **Step 1: Add the three new columns to the migrations list**

In `fastapi-backend/main.py`, extend the `migrations` list (ends at line 58 with the `blog_posts rejection_reason` row) to add:

```python
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
            ("events",     "day_offset",      "ALTER TABLE events ADD COLUMN day_offset INT NULL"),
            ("blog_posts", "day_offset",      "ALTER TABLE blog_posts ADD COLUMN day_offset INT NULL"),
            ("blog_posts", "published_date",  "ALTER TABLE blog_posts ADD COLUMN published_date DATETIME NULL"),
        ]
```

- [ ] **Step 2: Verify syntax**

Run: `cd fastapi-backend && python -c "import ast; ast.parse(open('main.py').read())"`
Expected: no output (parses cleanly).

- [ ] **Step 3: Commit**

```bash
git add fastapi-backend/main.py
git commit -m "feat: migrate day_offset/published_date columns on existing databases"
```

---

### Task 3: Rewrite seed events — 20 events with day offsets

**Files:**
- Modify: `fastapi-backend/seed.py:48-118` (replace `_build_events()`)

- [ ] **Step 1: Replace `_build_events()`**

Replace the entire existing `_build_events()` function (lines 48-118) with the version below. It keeps the 4 original published events (now carrying offsets instead of fixed dates), adds 1 more past event and 10 future events (15 active total, `status="published"`), and adds 5 dormant reserve events (`status="draft"`, not shown publicly, for a future rotation phase). `date` is computed at build time the same way `refresh_seeded_dates` will recompute it later, so a fresh seed already has correct dates before the first refresh runs.

```python
def _build_events():
    today = datetime.now()

    def offset_date(days):
        return today + timedelta(days=days)

    events = []

    # ── Past (5), status=published ──────────────────────────────────────────
    events.append(Event(
        title="Tech Summit Montreal 2026",
        image_url="https://picsum.photos/seed/techsummit/800/400",
        description=(
            "The biggest tech conference in Montreal. Three days of talks, workshops, and networking "
            "with industry leaders. Topics included cloud architecture, AI/ML, DevOps, and product management.\n\n"
            "Attendees got hands-on workshops, live demos, and an unforgettable closing keynote."
        ),
        location="Palais des congrès de Montréal, 1001 Place Jean-Paul-Riopelle",
        date=offset_date(-60), day_offset=-60, capacity=500, status="published",
    ))
    events.append(Event(
        title="DevOps & Kubernetes Workshop",
        image_url="https://picsum.photos/seed/devops/800/400",
        description=(
            "A full-day hands-on workshop covering Kubernetes from zero to production. Attendees learned how to "
            "containerize applications, write Helm charts, set up CI/CD pipelines, and monitor a cluster with "
            "Prometheus and Grafana.\n\n"
            "Every skill level was welcome — beginners left with a working cluster."
        ),
        location="Station C, 180 Rue Sainte-Catherine O, Montréal",
        date=offset_date(-40), day_offset=-40, capacity=40, status="published",
    ))
    events.append(Event(
        title="AI & The Future of Work",
        image_url="https://picsum.photos/seed/aiwork/800/400",
        description=(
            "A panel discussion exploring how artificial intelligence is reshaping industries and job markets. "
            "Speakers shared real-world examples of AI adoption, the skills employers look for, and how to "
            "future-proof a career.\n\n"
            "An open Q&A followed the panel, with a networking cocktail after."
        ),
        location="Notman House, 51 Rue Sherbrooke O, Montréal",
        date=offset_date(-25), day_offset=-25, capacity=120, status="published",
    ))
    events.append(Event(
        title="Startup Pitch Night",
        image_url="https://picsum.photos/seed/startup/800/400",
        description=(
            "Ten early-stage startups pitched their ideas to a panel of investors and industry experts. "
            "The crowd voted for their favourite pitch of the night.\n\n"
            "Doors opened at 6pm, pitches ran from 7pm, with light refreshments provided."
        ),
        location="L'Escogriffe, 4467 Rue Saint-Denis, Montréal",
        date=offset_date(-14), day_offset=-14, capacity=80, status="published",
    ))
    events.append(Event(
        title="Women in Tech Mixer",
        image_url="https://picsum.photos/seed/womenintech/800/400",
        description=(
            "An evening mixer celebrating women building careers in tech. Short lightning talks from local "
            "engineers and founders, followed by open networking.\n\n"
            "Organized in partnership with three local tech communities."
        ),
        location="Crew Collective & Café, 360 Rue Saint-Jacques, Montréal",
        date=offset_date(-5), day_offset=-5, capacity=90, status="published",
    ))

    # ── Future (10), status=published ───────────────────────────────────────
    events.append(Event(
        title="Product Design Sprint",
        image_url="https://picsum.photos/seed/designsprint/800/400",
        description=(
            "A one-day intensive sprint where product teams take a real problem from idea to tested prototype. "
            "Based on the Google Ventures design sprint methodology.\n\n"
            "Come with a team of 3-5, or join a pickup team on the day."
        ),
        location="Notman House, 51 Rue Sherbrooke O, Montréal",
        date=offset_date(3), day_offset=3, capacity=60, status="published",
    ))
    events.append(Event(
        title="Cloud Security Bootcamp",
        image_url="https://picsum.photos/seed/cloudsecurity/800/400",
        description=(
            "A hands-on bootcamp covering cloud security fundamentals: IAM best practices, network segmentation, "
            "secrets management, and incident response.\n\n"
            "Bring a laptop with AWS or GCP free-tier access — instructions sent after registration."
        ),
        location="Station C, 180 Rue Sainte-Catherine O, Montréal",
        date=offset_date(7), day_offset=7, capacity=50, status="published",
    ))
    events.append(Event(
        title="Open Source Contributor Day",
        image_url="https://picsum.photos/seed/opensource/800/400",
        description=(
            "A full day dedicated to contributing to open source projects, with maintainers on-site to help "
            "newcomers land their first pull request.\n\n"
            "All experience levels welcome — no contribution is too small."
        ),
        location="Google Montréal, 2000 Rue Peel",
        date=offset_date(14), day_offset=14, capacity=100, status="published",
    ))
    events.append(Event(
        title="Founders' Fireside Chat",
        image_url="https://picsum.photos/seed/founders/800/400",
        description=(
            "An intimate fireside chat with three Montreal founders who scaled past Series A. "
            "Expect candid stories about fundraising, hiring, and the decisions they'd make differently.\n\n"
            "Seating is limited to keep the conversation close."
        ),
        location="Crew Collective & Café, 360 Rue Saint-Jacques, Montréal",
        date=offset_date(21), day_offset=21, capacity=70, status="published",
    ))
    events.append(Event(
        title="Data Engineering Conference",
        image_url="https://picsum.photos/seed/dataeng/800/400",
        description=(
            "A single-track conference on modern data engineering: streaming pipelines, the modern data stack, "
            "and lessons from running data platforms at scale.\n\n"
            "Talks run 25 minutes each, with extended breaks for hallway conversations."
        ),
        location="Palais des congrès de Montréal, 1001 Place Jean-Paul-Riopelle",
        date=offset_date(30), day_offset=30, capacity=300, status="published",
    ))
    events.append(Event(
        title="UX Research Meetup",
        image_url="https://picsum.photos/seed/uxresearch/800/400",
        description=(
            "A monthly meetup for UX researchers and designer-researchers. This edition focuses on running "
            "research with limited time and budget.\n\n"
            "Two lightning talks followed by small-group discussion."
        ),
        location="Notman House, 51 Rue Sherbrooke O, Montréal",
        date=offset_date(45), day_offset=45, capacity=45, status="published",
    ))
    events.append(Event(
        title="Mobile Dev Summit",
        image_url="https://picsum.photos/seed/mobiledev/800/400",
        description=(
            "A summit for iOS, Android, and cross-platform developers covering the latest in mobile tooling, "
            "performance, and app store strategy.\n\n"
            "Includes a hands-on workshop track for teams new to cross-platform frameworks."
        ),
        location="Station C, 180 Rue Sainte-Catherine O, Montréal",
        date=offset_date(60), day_offset=60, capacity=150, status="published",
    ))
    events.append(Event(
        title="Winter Hackathon 2027",
        image_url="https://picsum.photos/seed/hackathon2027/800/400",
        description=(
            "48 hours to build something amazing. Form a team or join solo — teammate-matching is available. "
            "Prizes totalling $10,000 across three categories: Best UX, Best Technical Achievement, and Most Impactful.\n\n"
            "Meals and snacks provided for the full 48 hours."
        ),
        location="Google Montréal, 2000 Rue Peel",
        date=offset_date(75), day_offset=75, capacity=200, status="published",
    ))
    events.append(Event(
        title="Growth Marketing Workshop",
        image_url="https://picsum.photos/seed/growthmarketing/800/400",
        description=(
            "A practical workshop on growth marketing for early-stage products: acquisition channels, "
            "activation funnels, and how to run experiments that actually move the needle.\n\n"
            "Bring your current funnel metrics — we'll work through them live."
        ),
        location="Crew Collective & Café, 360 Rue Saint-Jacques, Montréal",
        date=offset_date(90), day_offset=90, capacity=55, status="published",
    ))
    events.append(Event(
        title="Year-End Tech Gala",
        image_url="https://picsum.photos/seed/techgala/800/400",
        description=(
            "A black-tie evening celebrating the Montreal tech community's biggest wins of the year, with awards, "
            "dinner, and a live band.\n\n"
            "Proceeds support local coding bootcamp scholarships."
        ),
        location="Palais des congrès de Montréal, 1001 Place Jean-Paul-Riopelle",
        date=offset_date(120), day_offset=120, capacity=400, status="published",
    ))

    # ── Reserve pool (5), status=draft — dormant, not shown publicly, for a future rotation phase ──
    events.append(Event(
        title="Blockchain & Web3 Panel",
        image_url="https://picsum.photos/seed/blockchain/800/400",
        description="A panel discussion on practical use cases for blockchain technology beyond speculation.",
        location="Notman House, 51 Rue Sherbrooke O, Montréal",
        date=offset_date(150), day_offset=150, capacity=80, status="draft",
    ))
    events.append(Event(
        title="Women Founders Demo Day",
        image_url="https://picsum.photos/seed/womenfounders/800/400",
        description="Ten women-led startups demo their products to an audience of investors and peers.",
        location="Crew Collective & Café, 360 Rue Saint-Jacques, Montréal",
        date=offset_date(180), day_offset=180, capacity=100, status="draft",
    ))
    events.append(Event(
        title="Advanced Kubernetes Deep Dive",
        image_url="https://picsum.photos/seed/k8sdeep/800/400",
        description="A follow-up to the DevOps & Kubernetes Workshop, covering operators, service mesh, and multi-cluster setups.",
        location="Station C, 180 Rue Sainte-Catherine O, Montréal",
        date=offset_date(200), day_offset=200, capacity=40, status="draft",
    ))
    events.append(Event(
        title="Spring Product Launch Party",
        image_url="https://picsum.photos/seed/launchparty/800/400",
        description="A celebration for teams shipping major product launches this spring, with lightning demos.",
        location="L'Escogriffe, 4467 Rue Saint-Denis, Montréal",
        date=offset_date(220), day_offset=220, capacity=120, status="draft",
    ))
    events.append(Event(
        title="AI Ethics Symposium",
        image_url="https://picsum.photos/seed/aiethics/800/400",
        description="Researchers and practitioners discuss the ethical challenges of deploying AI systems at scale.",
        location="Palais des congrès de Montréal, 1001 Place Jean-Paul-Riopelle",
        date=offset_date(250), day_offset=250, capacity=150, status="draft",
    ))

    return events
```

- [ ] **Step 2: Verify syntax**

Run: `cd fastapi-backend && python -c "import ast; ast.parse(open('seed.py').read())"`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add fastapi-backend/seed.py
git commit -m "feat: seed 20 events with day-offset dates (15 active + 5 dormant reserve)"
```

---

### Task 4: Rewrite seed posts — 20 posts with day offsets

**Files:**
- Modify: `fastapi-backend/seed.py:121-190` (replace `_build_posts()`)

- [ ] **Step 1: Replace `_build_posts()`**

Replace the entire existing `_build_posts()` function with the version below — the 4 original posts (offsets added) plus 16 new ones, offsets spread roughly biweekly-to-monthly into the past so the blog reads as continuously active over ~8 months. All `published=True`, `status="published"`.

```python
def _build_posts():
    today = datetime.now()

    def offset_date(days):
        return today + timedelta(days=days)

    posts_data = [
        (-3, "Why Kubernetes is the New Standard for Deployment", "kubernetes", (
            "Over the past five years, Kubernetes has gone from an experimental Google project to the de facto "
            "standard for deploying containerized applications. But what makes it so compelling?\n\n"
            "At its core, Kubernetes solves the hard problem of running distributed systems reliably at scale. "
            "It handles service discovery, load balancing, secret management, storage orchestration, and "
            "automated rollouts — all out of the box.\n\n"
            "For developers, the shift to Kubernetes means writing once and deploying anywhere. "
            "For ops teams, it means a unified control plane across on-premise and cloud environments. "
            "That combination is hard to beat."
        )),
        (-7, "5 Things We Learned Organizing Tech Summit Montreal", "techsummit5", (
            "After months of planning, Tech Summit Montreal brought together over 400 attendees, "
            "22 speakers, and more coffee than we'd care to admit. Here's what we learned.\n\n"
            "1. Start the speaker selection process earlier than you think.\n"
            "We opened our CFP eight weeks before the event. Next year, we're aiming for twelve.\n\n"
            "2. Hybrid events are harder than they look.\n"
            "Streaming live sessions while managing an in-person audience requires dedicated AV staff. "
            "Do not try to handle this with a laptop and a webcam.\n\n"
            "3. Networking time is the real product.\n"
            "Our post-session surveys showed that attendees valued unstructured networking breaks "
            "almost as highly as the keynotes. Build more of it in."
        )),
        (-14, "Announcing Our 2026 Speaker Lineup", "speakers2026", (
            "We are thrilled to announce the first wave of speakers for Tech Summit Montreal 2026.\n\n"
            "This year's theme is 'Building for Scale' — and our lineup reflects exactly that. "
            "From distributed systems to product-led growth, we've assembled a group of practitioners "
            "who have actually done the things they'll be talking about.\n\n"
            "Tickets go on sale soon. Keep an eye on this blog and our social channels for more announcements."
        )),
        (-21, "Call for Proposals: Tech Summit Montreal 2026", "cfp2026", (
            "We are now accepting proposals for Tech Summit Montreal 2026.\n\n"
            "We are looking for talks in the following areas:\n"
            "- Cloud infrastructure and platform engineering\n"
            "- AI/ML in production\n"
            "- Developer experience and tooling\n"
            "- Product strategy and go-to-market\n"
            "- Open source sustainability\n\n"
            "Talks should be 30 or 45 minutes. Workshops are 3 hours. "
            "Accepted speakers receive a full conference pass and travel assistance."
        )),
        (-28, "Behind the Scenes: Building Our Event Platform", "eventplatform", (
            "We get asked a lot how we run registrations, speaker management, and ticketing for our events. "
            "Short answer: we built our own platform, because nothing off-the-shelf fit how we actually run things.\n\n"
            "It started as a spreadsheet, then a small internal tool, and now handles everything from "
            "organizer submissions to public event listings. We'll be sharing more of the technical details "
            "in future posts."
        )),
        (-35, "How to Get the Most Out of Networking Events", "networking", (
            "Networking events can feel awkward, especially if you're new to the local tech scene. "
            "Here's what actually works, based on watching hundreds of attendees at our events.\n\n"
            "Show up early — the first 30 minutes are quieter and easier for one-on-one conversations. "
            "Ask people what they're working on, not just what they do. And follow up within 48 hours, "
            "while the conversation is still fresh for both of you."
        )),
        (-45, "The Rise of Platform Engineering", "platformeng", (
            "Platform engineering has emerged as one of the fastest-growing disciplines in tech over the last "
            "couple of years. It's the practice of building internal tools and self-service platforms that let "
            "product teams ship without needing deep infrastructure expertise.\n\n"
            "We're seeing this reflected directly in what our attendees ask for — more workshops on internal "
            "developer platforms, golden paths, and reducing cognitive load for application teams."
        )),
        (-55, "Diversity in Tech: Why Representation Matters", "diversity", (
            "Representation in tech isn't just a nice-to-have — teams with diverse perspectives consistently "
            "build better products for diverse users.\n\n"
            "That's part of why we run dedicated programming like our Women in Tech Mixer, and why we track "
            "the diversity of our own speaker lineup year over year. There's more work to do, and we're "
            "committed to doing it publicly."
        )),
        (-65, "From Idea to Startup: Lessons from Our Pitch Night", "pitchlessons", (
            "Our most recent Startup Pitch Night featured ten founders, each with six minutes to make their case. "
            "A few patterns stood out across the strongest pitches.\n\n"
            "The founders who did best led with the problem, not the product. They had a specific customer in "
            "mind, not a vague market. And they were honest about what they didn't know yet — investors respond "
            "well to founders who know the boundaries of their own knowledge."
        )),
        (-75, "A Beginner's Guide to Attending Your First Hackathon", "hackguide", (
            "First hackathon coming up? Here's what actually matters.\n\n"
            "Pick a team before the event if you can — scrambling to find teammates on the day eats into your "
            "build time. Scope your idea down aggressively; a small thing that works beats a big thing that "
            "doesn't. And sleep at least a little. Judges can tell."
        )),
        (-90, "Why We Switched to a Hybrid Event Format", "hybridformat", (
            "For our last several events, we moved to a hybrid format — in-person plus livestream. "
            "It wasn't an easy switch, but the reach has been worth it.\n\n"
            "We now regularly see remote attendance from outside Montreal, including people who've never been "
            "able to make it to an in-person event before. The lesson: don't treat the stream as an afterthought — "
            "budget for it like a second event."
        )),
        (-105, "Meet the Organizers: The Team Behind Tech Summit", "meettheteam", (
            "Tech Summit doesn't run itself — it's a small team of volunteers who spend evenings and weekends "
            "reviewing CFP submissions, coordinating sponsors, and troubleshooting registration bugs at 11pm.\n\n"
            "We wanted to introduce a few of the people who make it happen, and say thank you to the wider "
            "volunteer community that shows up every year."
        )),
        (-120, "Top 10 Talks You Missed at DevOps & Kubernetes Workshop", "top10talks", (
            "Couldn't make it to the DevOps & Kubernetes Workshop? Here's a rundown of the sessions that got "
            "the most positive feedback from attendees.\n\n"
            "Topics ranged from zero-downtime deployments to debugging flaky CI pipelines, with the Helm charts "
            "deep-dive edging out the rest as the most-requested session for a repeat next year."
        )),
        (-135, "Building an Inclusive Speaker Lineup", "inclusivelineup", (
            "Putting together a speaker lineup that reflects the diversity of our community takes deliberate "
            "effort — it doesn't happen by default.\n\n"
            "We changed our CFP process this year: blind first-round review, explicit outreach to underrepresented "
            "speakers, and a public breakdown of lineup demographics after the event. Small changes, but they add up."
        )),
        (-150, "What Attendees Are Saying About Our 2025 Events", "attendeesaying", (
            "We send a survey after every event, and we read every response. Here's a sample of what came back "
            "from last year's programming.\n\n"
            "The consistent theme: people want more hands-on workshops and fewer pure lecture-style talks. "
            "We've been adjusting the format accordingly, and the feedback since has been noticeably more positive."
        )),
        (-165, "The Montreal Tech Scene: A Year in Review", "yearinreview", (
            "Montreal's tech scene had a big year — new funding rounds, a growing AI research cluster, and a "
            "wave of new meetups and communities launching across the city.\n\n"
            "We tried to capture some of that energy across our own event calendar, and we're already planning "
            "next year's programming around where the community seems to be heading."
        )),
        (-180, "Sponsorship 101: How Companies Can Get Involved", "sponsorship101", (
            "We get a lot of questions from companies about how sponsorship actually works for our events.\n\n"
            "Short version: we care more about companies running genuinely useful booths and workshops than "
            "about logo size on a banner. The sponsors who get the most value are the ones who show up with "
            "something for attendees to actually do."
        )),
        (-200, "Volunteer Spotlight: Why They Keep Coming Back", "volunteerspotlight", (
            "Every event runs on volunteers — people checking badges, running AV, and making sure speakers have "
            "what they need. Some of ours have been showing up for years.\n\n"
            "We asked a few of them why they keep coming back. The answer, almost every time, came down to the "
            "community they'd built with other volunteers, not the events themselves."
        )),
        (-220, "Lessons from Running a 48-Hour Hackathon", "hack48lessons", (
            "Running a 48-hour hackathon is equal parts logistics and chaos management. Here's what we'd tell "
            "our past selves.\n\n"
            "Overprovision the wifi. Always. Have a quiet room for people who need to actually sleep. And judge "
            "on working demos, not slide decks — teams that build something real deserve to be seen over teams "
            "that just pitch well."
        )),
        (-240, "Our First Year: A Retrospective", "firstyear", (
            "It's been a year since we ran our first event out of a borrowed office with folding chairs and a "
            "handful of RSVPs. A lot has changed since then.\n\n"
            "We wanted to write down what we got right, what we got wrong, and what we'd tell anyone thinking "
            "about starting their own event community from scratch: start smaller than feels comfortable, and "
            "let the community tell you what to build next."
        )),
    ]

    return [
        BlogPost(
            title=title,
            image_url=f"https://picsum.photos/seed/{slug}/800/400",
            content=content,
            published=True,
            status="published",
            published_date=offset_date(offset),
            day_offset=offset,
        )
        for offset, title, slug, content in posts_data
    ]
```

- [ ] **Step 2: Verify syntax**

Run: `cd fastapi-backend && python -c "import ast; ast.parse(open('seed.py').read())"`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add fastapi-backend/seed.py
git commit -m "feat: seed 20 blog posts spread across the past 8 months"
```

---

### Task 5: Add `refresh_seeded_dates()` and wire it into startup

**Files:**
- Modify: `fastapi-backend/seed.py` (add new function near `seed_if_empty`)
- Modify: `fastapi-backend/main.py:89-90` (call the new function after `seed_if_empty`)

- [ ] **Step 1: Add `refresh_seeded_dates()` to `seed.py`**

In `fastapi-backend/seed.py`, add this function directly above `seed_if_empty`:

```python
def refresh_seeded_dates(db):
    """Recompute date/published_date for every row with a day_offset, relative to right now.

    Runs on every backend startup so the 5-past/10-future event split and the spread of
    blog post published dates stay correct relative to today, regardless of how long ago
    the database was originally seeded. Only touches rows with day_offset set — real,
    organizer-created content never has a day_offset and is untouched.
    """
    try:
        today = datetime.now()
        events = db.query(Event).filter(Event.day_offset.isnot(None)).all()
        for e in events:
            e.date = today + timedelta(days=e.day_offset)
        posts = db.query(BlogPost).filter(BlogPost.day_offset.isnot(None)).all()
        for p in posts:
            p.published_date = today + timedelta(days=p.day_offset)
        db.commit()
        if events or posts:
            print(f"🔄 Refreshed dates for {len(events)} event(s) and {len(posts)} post(s).")
    except Exception as exc:
        db.rollback()
        print(f"⚠️  refresh_seeded_dates failed (non-fatal): {exc}")
```

Add `timedelta` to the existing `datetime` import at the top of `seed.py`:

```python
from datetime import datetime, timedelta
```

- [ ] **Step 2: Call it from the startup lifespan**

In `fastapi-backend/main.py`, update the import on line 19 and the lifespan body around lines 88-90:

```python
from seed import seed_if_empty, refresh_seeded_dates
```

```python
    # 5. Seed sample data if database is empty
    seed_if_empty(session)
    # 6. Refresh fictional event/post dates relative to today (every startup)
    refresh_seeded_dates(session)
    session.close()
```

- [ ] **Step 3: Verify syntax on both files**

Run: `cd fastapi-backend && python -c "import ast; ast.parse(open('seed.py').read()); ast.parse(open('main.py').read())"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add fastapi-backend/seed.py fastapi-backend/main.py
git commit -m "feat: refresh seeded event/post dates on every backend startup"
```

---

### Task 6: Expose `is_past` on the events API

**Files:**
- Modify: `fastapi-backend/routers/events.py:1-9` (imports)
- Modify: `fastapi-backend/routers/events.py` (`_serialize` function, currently the last function in the file)

- [ ] **Step 1: Add a datetime import alias already present — confirm reuse**

`routers/events.py` already imports `from datetime import datetime as dt_datetime, timedelta` at the top (line 7). Reuse `dt_datetime.utcnow()`... but `Event.date` is stored via `datetime.now()` (local, naive) in `seed.py`, so for consistency use `dt_datetime.now()` here, matching how the rest of `events.py` already compares dates (see the existing `data["date"] <= dt_datetime.utcnow()` check further down — that one intentionally uses UTC for validation; for display purposes here we just need "is this date before now", so `dt_datetime.now()` matches the naive local timestamps written by seed.py). No new import needed.

- [ ] **Step 2: Update `_serialize` to include `is_past`**

Find the `_serialize` function at the bottom of `fastapi-backend/routers/events.py`:

```python
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
```

Replace with:

```python
def _serialize(event: Event, speakers: list = []) -> dict:
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "location": event.location,
        "date": event.date.isoformat() if event.date else None,
        "is_past": bool(event.date and event.date < dt_datetime.now()),
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
```

- [ ] **Step 3: Verify syntax**

Run: `cd fastapi-backend && python -c "import ast; ast.parse(open('routers/events.py').read())"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add fastapi-backend/routers/events.py
git commit -m "feat: expose is_past on the events API response"
```

---

### Task 7: Expose `published_date` on the posts API (with fallback)

**Files:**
- Modify: `fastapi-backend/routers/posts.py` (`_serialize` function)
- Modify: `fastapi-backend/routers/posts.py:16-19` (`list_posts` ordering)

- [ ] **Step 1: Update `_serialize` to include `published_date`**

Find the `_serialize` function at the bottom of `fastapi-backend/routers/posts.py`:

```python
def _serialize(post: BlogPost) -> dict:
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "published": post.published,
        "status": post.status,
        "rejection_reason": post.rejection_reason,
        "image_url": post.image_url,
        "created_by": post.created_by,
        "created_at": post.created_at.isoformat() if post.created_at else None,
    }
```

Replace with:

```python
def _serialize(post: BlogPost) -> dict:
    display_date = post.published_date or post.created_at
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "published": post.published,
        "status": post.status,
        "rejection_reason": post.rejection_reason,
        "image_url": post.image_url,
        "created_by": post.created_by,
        "created_at": post.created_at.isoformat() if post.created_at else None,
        "published_date": display_date.isoformat() if display_date else None,
    }
```

- [ ] **Step 2: Order the public post list by `published_date`**

In `list_posts` (top of `fastapi-backend/routers/posts.py`), change the ordering so seeded posts appear in the right chronological order (falling back to `created_at` for real posts without a `published_date`):

```python
@router.get("")
async def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    with SessionLocal() as db:
        query = db.query(BlogPost).filter(BlogPost.status == "published")
        total = query.count()
        posts = query.order_by(
            func.coalesce(BlogPost.published_date, BlogPost.created_at).desc()
        ).offset((page - 1) * limit).limit(limit).all()
        return {"total": total, "page": page, "limit": limit, "items": [_serialize(p) for p in posts]}
```

Add the `func` import at the top of the file:

```python
from sqlalchemy import func
```

- [ ] **Step 3: Verify syntax**

Run: `cd fastapi-backend && python -c "import ast; ast.parse(open('routers/posts.py').read())"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add fastapi-backend/routers/posts.py
git commit -m "feat: expose published_date on the posts API, order by it"
```

---

### Task 8: "Completed" badge on the events list page

**Files:**
- Modify: `first-look/src/pages/EventsPage/EventsPage.jsx:71-76`
- Modify: `first-look/src/pages/EventsPage/EventsPage.css`

- [ ] **Step 1: Add the badge to the event card**

In `first-look/src/pages/EventsPage/EventsPage.jsx`, find this block:

```jsx
              <div className="event-card-body">
                <div className="event-card-date">
                  {new Date(event.date).toLocaleDateString('en-CA', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </div>
                <h2 className="event-card-title">{event.title}</h2>
```

Replace with:

```jsx
              <div className="event-card-body">
                <div className="event-card-date">
                  {new Date(event.date).toLocaleDateString('en-CA', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                  {event.is_past && <span className="event-card-completed">Completed</span>}
                </div>
                <h2 className="event-card-title">{event.title}</h2>
```

- [ ] **Step 2: Add the badge style**

Append to `first-look/src/pages/EventsPage/EventsPage.css`:

```css
.event-card-completed {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.15rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: #eee;
  color: #555;
  border-radius: 3px;
}
```

- [ ] **Step 3: Visually verify in the running app**

Run: `cd first-look && npm run dev`, open the Events page, confirm the 5 past-dated events show a grey "Completed" pill next to their date and the 10 future events don't.

- [ ] **Step 4: Commit**

```bash
git add first-look/src/pages/EventsPage/EventsPage.jsx first-look/src/pages/EventsPage/EventsPage.css
git commit -m "feat: show Completed badge on past events in the events list"
```

---

### Task 9: "Completed" badge on the event detail page

**Files:**
- Modify: `first-look/src/pages/EventDetailPage/EventDetailPage.jsx:88-95`
- Modify: `first-look/src/pages/EventDetailPage/EventDetailPage.css`

- [ ] **Step 1: Add the badge to the header**

In `first-look/src/pages/EventDetailPage/EventDetailPage.jsx`, find:

```jsx
        <div className="event-detail-header">
          <h1 className="event-detail-title">{event.title}</h1>
          <div className="event-detail-meta">
            <span>📅 {new Date(event.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>📍 {event.location}</span>
            {event.capacity && <span>👥 Capacity: {event.capacity}</span>}
          </div>
        </div>
```

Replace with:

```jsx
        <div className="event-detail-header">
          <h1 className="event-detail-title">
            {event.title}
            {event.is_past && <span className="event-detail-completed">Completed</span>}
          </h1>
          <div className="event-detail-meta">
            <span>📅 {new Date(event.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>📍 {event.location}</span>
            {event.capacity && <span>👥 Capacity: {event.capacity}</span>}
          </div>
        </div>
```

- [ ] **Step 2: Add the badge style**

Append to `first-look/src/pages/EventDetailPage/EventDetailPage.css`:

```css
.event-detail-completed {
  display: inline-block;
  margin-left: 0.75rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: #eee;
  color: #555;
  border-radius: 3px;
  vertical-align: middle;
}
```

- [ ] **Step 3: Visually verify in the running app**

Open a past event's detail page (e.g. "Tech Summit Montreal 2026" after reseeding) and confirm the "Completed" badge appears next to the title; confirm a future event's detail page does not show it.

- [ ] **Step 4: Commit**

```bash
git add first-look/src/pages/EventDetailPage/EventDetailPage.jsx first-look/src/pages/EventDetailPage/EventDetailPage.css
git commit -m "feat: show Completed badge on past event detail page"
```

---

### Task 10: Use `published_date` for blog display dates

**Files:**
- Modify: `first-look/src/pages/BlogDetailPage/BlogDetailPage.jsx:80-82`
- Modify: `first-look/src/pages/BlogPage/BlogPage.jsx:53` (and surrounding line)

- [ ] **Step 1: Update `BlogDetailPage.jsx`**

Find:

```jsx
        <div className="blog-detail-date">
          {new Date(post.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
```

Replace with:

```jsx
        <div className="blog-detail-date">
          {new Date(post.published_date || post.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
```

- [ ] **Step 2: Update `BlogPage.jsx`**

Run this to see the exact surrounding lines first:

Run: `sed -n '45,58p' first-look/src/pages/BlogPage/BlogPage.jsx`

Find the line matching:

```jsx
                  {new Date(post.created_at).toLocaleDateString('en-CA', {
```

Replace `post.created_at` with `post.published_date || post.created_at` on that line, keeping the rest of the `toLocaleDateString` call (options object and closing) exactly as-is:

```jsx
                  {new Date(post.published_date || post.created_at).toLocaleDateString('en-CA', {
```

- [ ] **Step 3: Visually verify in the running app**

Open `/blog` and a post detail page; confirm dates now read as spread across the past ~8 months rather than all showing today's insert timestamp.

- [ ] **Step 4: Commit**

```bash
git add first-look/src/pages/BlogDetailPage/BlogDetailPage.jsx first-look/src/pages/BlogPage/BlogPage.jsx
git commit -m "feat: display published_date instead of created_at for blog posts"
```

---

### Task 11: Full manual verification

**Files:** none (verification only)

- [ ] **Step 1: Reset the database with the new seed data**

```bash
cd fastapi-backend
python seed.py --force
```

Expected output includes `✓ Seed complete.` followed by `20 events (15 published)` — wait, the reserve 5 are `status="draft"`, so the printed summary from `_insert()` (`published_events = sum(1 for e in events if e.status == "published")`) will show `15 published` out of `20 events`, and `20 blog posts (20 published)`.

- [ ] **Step 2: Start the backend and confirm the refresh runs**

```bash
uvicorn main:app --reload
```

Expected: console prints `🔄 Refreshed dates for 20 event(s) and 20 post(s).` shortly after startup (the reserve events have `day_offset` set too, so all 20 events are included even though only 15 are published/visible).

- [ ] **Step 3: Confirm the public events API shows the correct split**

```bash
curl -s http://localhost:8001/events?limit=100 | python -m json.tool | grep -c '"is_past": true'
curl -s http://localhost:8001/events?limit=100 | python -m json.tool | grep -c '"is_past": false'
```

Expected: `5` past, `10` future (the 5 reserve events are `status="draft"` and excluded from this endpoint entirely, since `list_events` filters `Event.status == "published"`).

- [ ] **Step 4: Confirm the posts API returns `published_date` spread into the past**

```bash
curl -s http://localhost:8001/posts?limit=20 | python -m json.tool | grep published_date
```

Expected: 20 distinct dates, all before today, spaced roughly biweekly-to-monthly apart, most recent first.

- [ ] **Step 5: Visual check in the browser**

Start the frontend (`cd first-look && npm run dev`), open `/events` and confirm 5 cards show "Completed" and 10 don't; open `/blog` and confirm dates read as spread across recent months, not all today.

- [ ] **Step 6: Confirm real (non-seeded) content is unaffected**

Log in as an organizer, create a new event with today's date via the UI. Confirm it has no `day_offset` (check via `curl http://localhost:8001/events/<new-id>` — `day_offset` isn't exposed in the response, but functionally: restart the backend again and confirm the new event's `date` did not change, proving the refresh only touches seeded rows).

No commit for this task — it's verification only.
