from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
import httpx
from urllib.parse import urlparse

router = APIRouter(prefix="/proxy", tags=["proxy"])

ALLOWED_HOSTS = {
    "i.pravatar.cc",
    "pravatar.cc",
    "picsum.photos",
    "images.unsplash.com",
    "randomuser.me",
}


@router.get("/image")
async def proxy_image(url: str):
    parsed = urlparse(url)
    if parsed.hostname not in ALLOWED_HOSTS:
        raise HTTPException(status_code=400, detail="Image host not allowed")
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:
            r = await client.get(url)
            content_type = r.headers.get("content-type", "image/jpeg")
            return Response(
                content=r.content,
                media_type=content_type,
                headers={"Cache-Control": "public, max-age=86400"},
            )
    except Exception:
        raise HTTPException(status_code=502, detail="Failed to fetch image")
