import { IUnitOfWork } from "../../dal/UnitOfWork";
import { StorageDto } from "../dto";
import { toStorageDto } from "../mappers";

export class StorageService {
  constructor(private readonly uow: IUnitOfWork) {}

  async getAll(): Promise<StorageDto[]> {
    return (await this.uow.storages.findAllWithItems()).map(toStorageDto);
  }

  async getById(id: number): Promise<StorageDto> {
    const storage = await this.uow.storages.findWithItems(id);
    if (!storage) throw new Error(`Сховище #${id} не знайдено`);
    return toStorageDto(storage);
  }

  async create(name: string, location: string): Promise<StorageDto> {
    if (!name.trim()) throw new Error("Назва сховища не може бути порожньою");
    if ((await this.uow.storages.findWhere({ name } as any)).length > 0)
      throw new Error(`Сховище з назвою "${name}" вже існує`);
    const saved = await this.uow.storages.add({ name, location, isActive: true } as any);
    return toStorageDto(saved);
  }

  async deactivate(id: number): Promise<StorageDto> {
    const storage = await this.uow.storages.findWithItems(id);
    if (!storage) throw new Error(`Сховище #${id} не знайдено`);
    if (!storage.isActive) throw new Error("Сховище вже неактивне");
    storage.isActive = false;
    return toStorageDto(await this.uow.storages.update(storage));
  }

  async delete(id: number): Promise<void> {
    const storage = await this.uow.storages.findWithItems(id);
    if (!storage) throw new Error(`Сховище #${id} не знайдено`);
    if (storage.items?.length > 0)
      throw new Error(`Не можна видалити — в сховищі ${storage.items.length} елемент(ів)`);
    await this.uow.storages.delete(id);
  }
}
