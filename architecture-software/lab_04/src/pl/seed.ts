import "reflect-metadata";
import { initializeDatabase } from "../dal/AppDataSource";
import { UnitOfWork } from "../dal/UnitOfWork";
import { ContentService } from "../bll/services/ContentService";
import { StorageService } from "../bll/services/StorageService";

async function seed() {
  await initializeDatabase();
  const uow = new UnitOfWork();
  const cs  = new ContentService(uow);
  const ss  = new StorageService(uow);

  const s1 = await ss.create("Основний сервер", "Серверна кімната A / Rack 3");
  const s2 = await ss.create("Cloud S3",        "AWS S3 / eu-central-1");
  const s3 = await ss.create("NAS Архів",       "Підвал / NAS-01");

  await cs.create({ title: "Clean Code",               author: "Robert C. Martin",  type: "book",     format: "epub", genre: "Programming", language: "en", year: 2008, pageCount: 464,  tags: ["programming", "refactoring"], storageId: s1.id });
  await cs.create({ title: "The Pragmatic Programmer",  author: "David Thomas",      type: "book",     format: "pdf",  genre: "Programming", language: "en", year: 2019, pageCount: 352,  storageId: s1.id });
  await cs.create({ title: "Дюна",                      author: "Френк Герберт",     type: "book",     format: "epub", genre: "Фантастика",  language: "uk", year: 1965, pageCount: 896,  storageId: s2.id });
  await cs.create({ title: "TypeScript Handbook",       author: "Microsoft",         type: "document", format: "pdf",  genre: "Reference",   language: "en", year: 2024, pageCount: 112,  tags: ["typescript"], storageId: s1.id });
  await cs.create({ title: "Звіт Q1 2025",              author: "Відділ досліджень", type: "document", format: "docx",                       language: "uk", year: 2025, pageCount: 28,   storageId: s2.id });
  await cs.create({ title: "Design Patterns Explained", author: "Derek Banas",       type: "video",    format: "mp4",  genre: "Education",   language: "en", year: 2023, durationSeconds: 7200, tags: ["patterns", "oop"], storageId: s3.id });
  await cs.create({ title: "The Matrix",                author: "Wachowski Sisters", type: "video",    format: "mkv",  genre: "Sci-Fi",      language: "en", year: 1999, durationSeconds: 8160, storageId: s3.id });
  await cs.create({ title: "Dark Side of the Moon",     author: "Pink Floyd",        type: "audio",    format: "flac", genre: "Rock",        language: "en", year: 1973, durationSeconds: 2563, album: "The Dark Side of the Moon", storageId: s2.id });
  await cs.create({ title: "Bohemian Rhapsody",         author: "Queen",             type: "audio",    format: "mp3",  genre: "Rock",        language: "en", year: 1975, durationSeconds: 354,  album: "A Night at the Opera",      storageId: s2.id });

  const all = await cs.getAll();
  await cs.setAvailability(all.find(i => i.title === "The Matrix")!.id, false);

  console.log("✅ Дані завантажено. Запускай: npm run dev");
  process.exit(0);
}

seed().catch((e) => { console.error(e.message); process.exit(1); });
