#!/usr/bin/env python3
"""
Build the gallery manifest for the Palm Springs landing page.

Usage (from the repository root):
    pip install pillow          # once
    python3 tools/build_images.py

What it does
  1. Scans images/palm-springs/<folder>/ for .jpg .jpeg .png .webp files.
     Folders: aerial, exterior, lagoon-villas, townhouses, interiors, amenities
  2. Converts JPG/PNG to WebP (max 2000 px on the long side, quality 80) and
     moves the original to images/palm-springs/_originals/ (not deployed,
     see .vercelignore). Oversized WebP files are resized in place.
  3. Writes images/palm-springs/images.json with src, width, height, alt and
     caption for every image. Alt text you edit by hand in images.json is kept
     on the next run, and so are captions.

File names become captions and alt text, so name files descriptively, e.g.
  lagoon-villas/lagoon-villa-modern-01.jpg  -> design "Modern"
  amenities/lap-pool-02.jpg                 -> "Lap pool"
"""
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required: pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / "images" / "palm-springs"
ORIGINALS = BASE / "_originals"
MANIFEST = BASE / "images.json"
FOLDERS = ["aerial", "exterior", "lagoon-villas", "townhouses", "interiors", "amenities", "floorplans"]
LABELS = {
    "aerial": "Aerial view",
    "exterior": "Villa exterior",
    "lagoon-villas": "Lagoon villa",
    "townhouses": "Townhouse",
    "interiors": "Interior",
    "amenities": "Amenity",
    "floorplans": "Floor plan",
}
MAX_SIDE = 2000
QUALITY = 80
EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def words_from_name(stem: str, folder: str) -> str:
    s = stem.lower()
    if folder == "lagoon-villas":
        # lagoon-villa-modern-01 -> "Modern"
        s = re.sub(r"^lagoon[-_ ]?villas?[-_ ]*", "", s)
    s = re.sub(r"[-_ ]*\d+$", "", s)          # trailing numbers
    s = re.sub(r"[-_]+", " ", s).strip()
    return s[:1].upper() + s[1:] if s else ""


def convert(path: Path, folder: str) -> Path:
    """Return the path of the WebP to use, converting/resizing if needed."""
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        needs_resize = max(im.size) > MAX_SIDE
        if path.suffix.lower() == ".webp" and not needs_resize:
            return path
        if needs_resize:
            im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGB")
        out = path.with_suffix(".webp")
        im.save(out, "WEBP", quality=QUALITY, method=6)
    if path.suffix.lower() != ".webp":
        dest = ORIGINALS / folder / path.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(path), dest)
    return out


def main() -> None:
    old = {}
    if MANIFEST.exists():
        try:
            for items in json.loads(MANIFEST.read_text()).get("folders", {}).values():
                for it in items:
                    old[it["src"]] = it
        except (ValueError, KeyError):
            pass

    manifest = {"generated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "folders": {}}
    total = 0
    for folder in FOLDERS:
        d = BASE / folder
        d.mkdir(parents=True, exist_ok=True)
        items = []
        files = sorted(p for p in d.iterdir() if p.is_file() and p.suffix.lower() in EXTS)
        done = set()
        for p in files:
            webp = convert(p, folder)
            if webp in done:
                continue
            done.add(webp)
            with Image.open(webp) as im:
                w, h = im.size
            src = webp.relative_to(ROOT).as_posix()
            name = words_from_name(webp.stem, folder)
            label = LABELS[folder]
            if folder == "lagoon-villas":
                caption = name or "Lagoon Villa"
                alt = f"Lagoon villa{', ' + name + ' design' if name else ''} at Palm Springs by Nakheel (representative image)"
            else:
                caption = name or label
                alt = f"{caption} at Palm Springs by Nakheel ({label.lower()}, representative image)"
            if src in old:  # keep hand-edited alt text and captions
                alt = old[src].get("alt") or alt
                caption = old[src].get("caption") or caption
            items.append({"src": src, "w": w, "h": h, "alt": alt, "caption": caption})
        manifest["folders"][folder] = items
        total += len(items)
        print(f"{folder:14s} {len(items)} image(s)")

    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {MANIFEST.relative_to(ROOT)} ({total} images)")


if __name__ == "__main__":
    main()
