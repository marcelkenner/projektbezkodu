import fs from "fs";
import path from "path";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const EXCLUDED = new Set([
  "_examples",
  "glossary",
  "narzedzia",
  "narzedzia-dla-tworcow",
  "newsletter",
  "og-image-templates",
  "editorial-checklist",
  "kategoria",
  "kontakt",
  "mapa-strony",
  "polityka-prywatnosci",
  "regulamin",
  "zasady-afiliacji",
  "szukaj",
  "sitemaps",
  "do-pobrania",
]);

export function listContentCategories(): string[] {
  if (!fs.existsSync(CONTENT_ROOT)) {
    return [];
  }

  const entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });

  return entries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !EXCLUDED.has(entry.name),
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "pl"));
}
