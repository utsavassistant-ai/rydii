/**
 * Upload all scooter images to Vercel Blob and update DB image/gallery URLs.
 * Run: node scripts/upload-images-blob.mjs
 */
import { put } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");

const BLOB_TOKEN   = process.env.BLOB_READ_WRITE_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SECRET_KEY;

if (!BLOB_TOKEN || !SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing env vars: BLOB_READ_WRITE_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ── helpers ────────────────────────────────────────────────────────────────

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

async function uploadLocal(localPath) {
  const abs = path.join(PUBLIC_DIR, localPath);
  if (!fs.existsSync(abs)) { console.warn("  SKIP (not found):", abs); return null; }
  const ext = path.extname(abs).toLowerCase();
  const blob = new Blob([fs.readFileSync(abs)], { type: MIME[ext] || "image/jpeg" });
  const key = "scooters" + localPath;  // e.g. scooters/honda-activa-6g/hero.jpg
  const { url } = await put(key, blob, { access: "public", token: BLOB_TOKEN, allowOverwrite: true });
  console.log("  ✓ local →", url);
  return url;
}

async function uploadRemote(srcUrl, key) {
  const res = await fetch(srcUrl);
  if (!res.ok) { console.warn("  SKIP (fetch failed):", srcUrl); return null; }
  const buf = await res.arrayBuffer();
  const ct  = res.headers.get("content-type") || "image/jpeg";
  const blob = new Blob([buf], { type: ct });
  const { url } = await put(key, blob, { access: "public", token: BLOB_TOKEN, allowOverwrite: true });
  console.log("  ✓ remote →", url);
  return url;
}

async function resolveImage(src, slug, role) {
  if (!src) return null;
  if (src.startsWith("/")) return uploadLocal(src);
  // external URL
  const ext = src.includes("jpg") || src.includes("jpeg") ? ".jpg" : ".jpg";
  return uploadRemote(src, `scooters/${slug}/${role}${ext}`);
}

// ── main ───────────────────────────────────────────────────────────────────

const { data: scooters, error } = await supabase.from("scooters").select("id, slug, image, gallery");
if (error) { console.error("DB fetch failed:", error); process.exit(1); }

console.log(`Found ${scooters.length} scooters\n`);

for (const s of scooters) {
  console.log(`► ${s.slug}`);

  // hero image
  const heroUrl = await resolveImage(s.image, s.slug, "hero");

  // gallery images
  const galleryUrls = [];
  const gallery = Array.isArray(s.gallery) ? s.gallery : [];
  for (let i = 0; i < gallery.length; i++) {
    const url = await resolveImage(gallery[i], s.slug, `gallery-${i}`);
    if (url) galleryUrls.push(url);
  }

  // update DB
  const patch = {};
  if (heroUrl) patch.image = heroUrl;
  if (galleryUrls.length) patch.gallery = galleryUrls;

  if (Object.keys(patch).length) {
    const { error: upErr } = await supabase.from("scooters").update(patch).eq("id", s.id);
    if (upErr) console.error("  DB update failed:", upErr);
    else console.log("  DB updated");
  }
  console.log();
}

console.log("Done.");
