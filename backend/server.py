from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import bcrypt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Catholic Professionals PNG API")

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

# User Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str = Field(default_factory=lambda: f"user_{uuid.uuid4().hex[:12]}")
    email: EmailStr
    name: str
    picture: Optional[str] = None
    role: str = "admin"  # admin, editor
    auth_provider: str = "local"  # local, google
    password_hash: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str = Field(default_factory=lambda: f"sess_{uuid.uuid4().hex}")
    expires_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=7))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Contact Form Models
class ContactForm(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    status: str = "pending"  # pending, read, responded
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactFormCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactStatusUpdate(BaseModel):
    status: str

# Event Models
class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: str
    time: str
    end_date: Optional[str] = None
    end_time: Optional[str] = None
    location: str
    attendees: int = 0
    featured: bool = False
    image: Optional[str] = None
    recurring: bool = False
    recurrence_pattern: Optional[str] = None  # daily, weekly, monthly
    recurrence_end: Optional[str] = None
    rsvp_enabled: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    time: str
    end_date: Optional[str] = None
    end_time: Optional[str] = None
    location: str
    attendees: int = 0
    featured: bool = False
    image: Optional[str] = None
    recurring: bool = False
    recurrence_pattern: Optional[str] = None
    recurrence_end: Optional[str] = None
    rsvp_enabled: bool = False

# RSVP Model
class RSVP(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    guests: int = 1
    status: str = "confirmed"  # confirmed, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RSVPCreate(BaseModel):
    event_id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    guests: int = 1

# News Models
class News(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    date: str
    author: str
    category: str
    readTime: str = "5 min read"
    featured: bool = False
    image: Optional[str] = None
    published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    date: str
    author: str
    category: str
    readTime: str = "5 min read"
    featured: bool = False
    image: Optional[str] = None
    published: bool = True

# Newsletter Models
class Newsletter(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: Optional[str] = None
    subscribed: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsletterCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None

# Page Settings Models
class PageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page: str  # hero, about, footer
    settings: dict
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PageSettingsUpdate(BaseModel):
    settings: dict

# Member Directory Models
class Member(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    profession: str
    company: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    featured: bool = False
    published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MemberCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    profession: str
    company: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    featured: bool = False
    published: bool = True

# Gallery Image Model
class GalleryImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    path: str
    caption: Optional[str] = None
    category: Optional[str] = None
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== AUTH HELPERS ====================

async def get_current_user(request: Request) -> User:
    """Get current user from session token (cookie or header)"""
    session_token = request.cookies.get("session_token")
    
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_doc)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Catholic Professionals PNG API", "version": "2.0.0"}


# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register")
async def register(input: UserCreate, response: Response):
    """Register with email/password"""
    # Check if user exists
    existing = await db.users.find_one({"email": input.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=input.email,
        name=input.name,
        password_hash=hash_password(input.password),
        auth_provider="local"
    )
    
    user_doc = user.model_dump()
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    await db.users.insert_one(user_doc)
    
    # Create session
    session = UserSession(user_id=user.user_id)
    session_doc = session.model_dump()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session.session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "user_id": user.user_id,
        "email": user.email,
        "name": user.name,
        "role": user.role
    }


@api_router.post("/auth/login")
async def login(input: UserLogin, response: Response):
    """Login with email/password"""
    user_doc = await db.users.find_one({"email": input.email}, {"_id": 0})
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user_doc.get("auth_provider") == "google":
        raise HTTPException(status_code=400, detail="Please use Google login")
    
    if not user_doc.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(input.password, user_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    session = UserSession(user_id=user_doc["user_id"])
    session_doc = session.model_dump()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session.session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "user_id": user_doc["user_id"],
        "email": user_doc["email"],
        "name": user_doc["name"],
        "role": user_doc.get("role", "admin")
    }


@api_router.post("/auth/google/session")
async def google_session(request: Request, response: Response):
    """Exchange Google OAuth session_id for local session"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Get user data from Emergent Auth
    async with httpx.AsyncClient() as client:
        auth_response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
    
    if auth_response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    auth_data = auth_response.json()
    
    # Check if user exists
    existing = await db.users.find_one({"email": auth_data["email"]}, {"_id": 0})
    
    if existing:
        user_id = existing["user_id"]
        # Update user info
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": auth_data["name"], "picture": auth_data.get("picture")}}
        )
    else:
        # Create new user
        user = User(
            email=auth_data["email"],
            name=auth_data["name"],
            picture=auth_data.get("picture"),
            auth_provider="google"
        )
        user_id = user.user_id
        user_doc = user.model_dump()
        user_doc['created_at'] = user_doc['created_at'].isoformat()
        await db.users.insert_one(user_doc)
    
    # Create session
    session = UserSession(user_id=user_id)
    session_doc = session.model_dump()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session.session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {
        "user_id": user_id,
        "email": user_doc["email"],
        "name": user_doc["name"],
        "picture": user_doc.get("picture"),
        "role": user_doc.get("role", "admin")
    }


@api_router.get("/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "user_id": user.user_id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
        "role": user.role
    }


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    
    return {"message": "Logged out successfully"}


# ==================== CONTACT ROUTES ====================

@api_router.post("/contact", response_model=ContactForm)
async def create_contact(input: ContactFormCreate):
    contact_dict = input.model_dump()
    contact_obj = ContactForm(**contact_dict)
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    return contact_obj

@api_router.get("/contact", response_model=List[ContactForm])
async def get_contacts(user: User = Depends(get_current_user)):
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for contact in contacts:
        if isinstance(contact.get('created_at'), str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    return contacts

@api_router.patch("/contact/{contact_id}")
async def update_contact_status(contact_id: str, update: ContactStatusUpdate, user: User = Depends(get_current_user)):
    result = await db.contacts.update_one(
        {"id": contact_id},
        {"$set": {"status": update.status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Status updated"}

@api_router.delete("/contact/{contact_id}")
async def delete_contact(contact_id: str, user: User = Depends(get_current_user)):
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted"}


# ==================== EVENT ROUTES ====================

@api_router.post("/events", response_model=Event)
async def create_event(input: EventCreate, user: User = Depends(get_current_user)):
    event_dict = input.model_dump()
    event_obj = Event(**event_dict)
    doc = event_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.events.insert_one(doc)
    return event_obj

@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find({}, {"_id": 0}).sort("date", 1).to_list(100)
    for event in events:
        if isinstance(event.get('created_at'), str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
    return events

@api_router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if isinstance(event.get('created_at'), str):
        event['created_at'] = datetime.fromisoformat(event['created_at'])
    return event

@api_router.put("/events/{event_id}")
async def update_event(event_id: str, input: EventCreate, user: User = Depends(get_current_user)):
    update_data = input.model_dump()
    result = await db.events.update_one(
        {"id": event_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated"}

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, user: User = Depends(get_current_user)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}


# ==================== RSVP ROUTES ====================

@api_router.post("/rsvp", response_model=RSVP)
async def create_rsvp(input: RSVPCreate):
    # Check if event exists and has RSVP enabled
    event = await db.events.find_one({"id": input.event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    rsvp_dict = input.model_dump()
    rsvp_obj = RSVP(**rsvp_dict)
    doc = rsvp_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.rsvps.insert_one(doc)
    
    # Update attendee count
    await db.events.update_one(
        {"id": input.event_id},
        {"$inc": {"attendees": input.guests}}
    )
    
    return rsvp_obj

@api_router.get("/rsvp/{event_id}", response_model=List[RSVP])
async def get_event_rsvps(event_id: str, user: User = Depends(get_current_user)):
    rsvps = await db.rsvps.find({"event_id": event_id}, {"_id": 0}).to_list(1000)
    for rsvp in rsvps:
        if isinstance(rsvp.get('created_at'), str):
            rsvp['created_at'] = datetime.fromisoformat(rsvp['created_at'])
    return rsvps

@api_router.delete("/rsvp/{rsvp_id}")
async def cancel_rsvp(rsvp_id: str, user: User = Depends(get_current_user)):
    rsvp = await db.rsvps.find_one({"id": rsvp_id}, {"_id": 0})
    if not rsvp:
        raise HTTPException(status_code=404, detail="RSVP not found")
    
    await db.rsvps.delete_one({"id": rsvp_id})
    await db.events.update_one(
        {"id": rsvp["event_id"]},
        {"$inc": {"attendees": -rsvp["guests"]}}
    )
    
    return {"message": "RSVP cancelled"}


# ==================== NEWS ROUTES ====================

@api_router.post("/news", response_model=News)
async def create_news(input: NewsCreate, user: User = Depends(get_current_user)):
    news_dict = input.model_dump()
    news_obj = News(**news_dict)
    doc = news_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.news.insert_one(doc)
    return news_obj

@api_router.get("/news", response_model=List[News])
async def get_news(published_only: bool = True):
    query = {"published": True} if published_only else {}
    news_items = await db.news.find(query, {"_id": 0}).sort("date", -1).to_list(100)
    for item in news_items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    return news_items

@api_router.get("/news/{news_id}", response_model=News)
async def get_news_item(news_id: str):
    news = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    if isinstance(news.get('created_at'), str):
        news['created_at'] = datetime.fromisoformat(news['created_at'])
    return news

@api_router.put("/news/{news_id}")
async def update_news(news_id: str, input: NewsCreate, user: User = Depends(get_current_user)):
    update_data = input.model_dump()
    result = await db.news.update_one({"id": news_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "News updated"}

@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str, user: User = Depends(get_current_user)):
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "News deleted"}


# ==================== NEWSLETTER ROUTES ====================

@api_router.post("/newsletter", response_model=Newsletter)
async def subscribe_newsletter(input: NewsletterCreate):
    existing = await db.newsletters.find_one({"email": input.email}, {"_id": 0})
    if existing:
        if not existing.get("subscribed"):
            await db.newsletters.update_one({"email": input.email}, {"$set": {"subscribed": True}})
        return Newsletter(**existing)
    
    newsletter_dict = input.model_dump()
    newsletter_obj = Newsletter(**newsletter_dict)
    doc = newsletter_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.newsletters.insert_one(doc)
    return newsletter_obj

@api_router.get("/newsletter", response_model=List[Newsletter])
async def get_newsletter_subscribers(user: User = Depends(get_current_user)):
    subscribers = await db.newsletters.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    for sub in subscribers:
        if isinstance(sub.get('created_at'), str):
            sub['created_at'] = datetime.fromisoformat(sub['created_at'])
    return subscribers

@api_router.delete("/newsletter/{email}")
async def unsubscribe_newsletter(email: str):
    result = await db.newsletters.update_one({"email": email}, {"$set": {"subscribed": False}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return {"message": "Unsubscribed successfully"}


# ==================== PAGE SETTINGS ROUTES ====================

@api_router.get("/settings/{page}")
async def get_page_settings(page: str):
    settings = await db.page_settings.find_one({"page": page}, {"_id": 0})
    if not settings:
        return {"page": page, "settings": {}}
    return settings

@api_router.put("/settings/{page}")
async def update_page_settings(page: str, input: PageSettingsUpdate, user: User = Depends(get_current_user)):
    result = await db.page_settings.update_one(
        {"page": page},
        {"$set": {"settings": input.settings, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    return {"message": "Settings updated"}

@api_router.get("/settings")
async def get_all_settings(user: User = Depends(get_current_user)):
    settings = await db.page_settings.find({}, {"_id": 0}).to_list(100)
    return settings


# ==================== MEMBER DIRECTORY ROUTES ====================

@api_router.post("/members", response_model=Member)
async def create_member(input: MemberCreate, user: User = Depends(get_current_user)):
    member_dict = input.model_dump()
    member_obj = Member(**member_dict)
    doc = member_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.members.insert_one(doc)
    return member_obj

@api_router.get("/members", response_model=List[Member])
async def get_members(published_only: bool = True):
    query = {"published": True} if published_only else {}
    members = await db.members.find(query, {"_id": 0}).sort("name", 1).to_list(1000)
    for member in members:
        if isinstance(member.get('created_at'), str):
            member['created_at'] = datetime.fromisoformat(member['created_at'])
    return members

@api_router.get("/members/{member_id}", response_model=Member)
async def get_member(member_id: str):
    member = await db.members.find_one({"id": member_id}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    if isinstance(member.get('created_at'), str):
        member['created_at'] = datetime.fromisoformat(member['created_at'])
    return member

@api_router.put("/members/{member_id}")
async def update_member(member_id: str, input: MemberCreate, user: User = Depends(get_current_user)):
    update_data = input.model_dump()
    result = await db.members.update_one({"id": member_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"message": "Member updated"}

@api_router.delete("/members/{member_id}")
async def delete_member(member_id: str, user: User = Depends(get_current_user)):
    result = await db.members.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"message": "Member deleted"}


# ==================== GALLERY ROUTES ====================

@api_router.get("/gallery")
async def get_gallery_images():
    """Get all gallery images from both database and filesystem"""
    # Get images from database
    db_images = await db.gallery.find({}, {"_id": 0}).to_list(1000)
    
    # Get images from filesystem
    highlights_path = Path("/app/frontend/public/images/Highlights")
    fs_images = []
    if highlights_path.exists():
        for img_file in highlights_path.glob("*.jpg"):
            fs_images.append({
                "id": img_file.stem,
                "filename": img_file.name,
                "path": f"/images/Highlights/{img_file.name}",
                "caption": None,
                "category": "Highlights"
            })
    
    return {"db_images": db_images, "fs_images": fs_images}

@api_router.post("/gallery")
async def upload_gallery_image(
    file: UploadFile = File(...),
    caption: str = None,
    category: str = None,
    user: User = Depends(get_current_user)
):
    """Upload a new gallery image"""
    upload_dir = Path("/app/frontend/public/images/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = upload_dir / filename
    
    # Save file
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    # Save to database
    image = GalleryImage(
        filename=filename,
        path=f"/images/uploads/{filename}",
        caption=caption,
        category=category
    )
    doc = image.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.gallery.insert_one(doc)
    
    return image

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, user: User = Depends(get_current_user)):
    """Delete a gallery image"""
    image = await db.gallery.find_one({"id": image_id}, {"_id": 0})
    if image:
        # Delete from filesystem
        filepath = Path(f"/app/frontend/public{image['path']}")
        if filepath.exists():
            filepath.unlink()
        # Delete from database
        await db.gallery.delete_one({"id": image_id})
    return {"message": "Image deleted"}


# ==================== DASHBOARD STATS ====================

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(user: User = Depends(get_current_user)):
    """Get dashboard statistics"""
    contacts_count = await db.contacts.count_documents({})
    pending_contacts = await db.contacts.count_documents({"status": "pending"})
    events_count = await db.events.count_documents({})
    news_count = await db.news.count_documents({})
    members_count = await db.members.count_documents({})
    subscribers_count = await db.newsletters.count_documents({"subscribed": True})
    
    return {
        "contacts": {"total": contacts_count, "pending": pending_contacts},
        "events": events_count,
        "news": news_count,
        "members": members_count,
        "subscribers": subscribers_count
    }


# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
