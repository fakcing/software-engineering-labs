import { IUnitOfWork } from "../../dal/UnitOfWork";
import { ContentType, ContentFormat } from "../../dal/entities/ContentItemEntity";
import { ContentItemDto, CreateContentItemDto, UpdateContentItemDto, ContentSearchDto } from "../dto";
import { toContentItemDto, toContentItemEntity } from "../mappers";

const allowedFormats: Record<ContentType, ContentFormat[]> = {
  [ContentType.Book]:     [ContentFormat.Pdf, ContentFormat.Epub, ContentFormat.Mobi, ContentFormat.Txt],
  [ContentType.Document]: [ContentFormat.Pdf, ContentFormat.Docx, ContentFormat.Txt],
  [ContentType.Video]:    [ContentFormat.Mp4, ContentFormat.Avi, ContentFormat.Mkv],
  [ContentType.Audio]:    [ContentFormat.Mp3, ContentFormat.Flac, ContentFormat.Wav, ContentFormat.Aac],
};

function validateFormat(type: ContentType, format: ContentFormat) {
  if (!allowedFormats[type].includes(format))
    throw new Error(`Формат "${format}" не підходить для типу "${type}". Дозволені: ${allowedFormats[type].join(", ")}`);
}

export class ContentService {
  constructor(private readonly uow: IUnitOfWork) {}

  async getAll(): Promise<ContentItemDto[]> {
    return (await this.uow.content.findAllWithStorage()).map(toContentItemDto);
  }

  async getById(id: number): Promise<ContentItemDto> {
    const item = await this.uow.content.findWithStorage(id);
    if (!item) throw new Error(`Контент #${id} не знайдено`);
    return toContentItemDto(item);
  }

  async create(dto: CreateContentItemDto): Promise<ContentItemDto> {
    validateFormat(dto.type as ContentType, dto.format as ContentFormat);
    if (!await this.uow.storages.exists(dto.storageId))
      throw new Error(`Сховище #${dto.storageId} не знайдено`);

    const saved = await this.uow.content.add(toContentItemEntity(dto));
    return toContentItemDto((await this.uow.content.findWithStorage(saved.id))!);
  }

  async update(dto: UpdateContentItemDto): Promise<ContentItemDto> {
    const item = await this.uow.content.findWithStorage(dto.id);
    if (!item) throw new Error(`Контент #${dto.id} не знайдено`);

    if (dto.format) validateFormat(item.type, dto.format as ContentFormat);
    if (dto.storageId && !await this.uow.storages.exists(dto.storageId))
      throw new Error(`Сховище #${dto.storageId} не знайдено`);

    if (dto.title !== undefined)           item.title = dto.title;
    if (dto.author !== undefined)          item.author = dto.author;
    if (dto.format !== undefined)          item.format = dto.format as ContentFormat;
    if (dto.genre !== undefined)           item.genre = dto.genre;
    if (dto.language !== undefined)        item.language = dto.language;
    if (dto.year !== undefined)            item.year = dto.year;
    if (dto.pageCount !== undefined)       item.pageCount = dto.pageCount;
    if (dto.durationSeconds !== undefined) item.durationSeconds = dto.durationSeconds;
    if (dto.album !== undefined)           item.album = dto.album;
    if (dto.tags !== undefined)            item.tags = dto.tags.join(",");
    if (dto.isAvailable !== undefined)     item.isAvailable = dto.isAvailable;
    if (dto.storageId !== undefined)       item.storageId = dto.storageId;

    await this.uow.content.update(item);
    return toContentItemDto((await this.uow.content.findWithStorage(item.id))!);
  }

  async delete(id: number): Promise<void> {
    if (!await this.uow.content.exists(id))
      throw new Error(`Контент #${id} не знайдено`);
    await this.uow.content.delete(id);
  }

  async search(dto: ContentSearchDto): Promise<ContentItemDto[]> {
    const results = await this.uow.content.search({ ...dto, type: dto.type as ContentType | undefined });
    return results.map(toContentItemDto);
  }

  async setAvailability(id: number, available: boolean): Promise<ContentItemDto> {
    const item = await this.uow.content.findWithStorage(id);
    if (!item) throw new Error(`Контент #${id} не знайдено`);
    if (item.isAvailable === available)
      throw new Error(`Статус вже "${available ? "доступний" : "недоступний"}"`);
    item.isAvailable = available;
    await this.uow.content.update(item);
    return toContentItemDto(item);
  }
}
