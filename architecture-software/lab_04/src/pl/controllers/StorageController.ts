import { Router, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { StorageService } from "../../bll/services/StorageService";
import { CreateStorageRequest } from "../models";
import { toStorageResponse } from "../mappers";

const pi = (params: ParamsDictionary, key: string): number => parseInt(String(params[key]));

export function createStorageRouter(service: StorageService): Router {
  const router = Router();

  router.get("/", async (_req, res: Response) => {
    try {
      res.json((await service.getAll()).map(toStorageResponse));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/:id", async (req, res: Response) => {
    try {
      res.json(toStorageResponse(await service.getById(pi(req.params, "id"))));
    } catch (e: any) {
      res.status(404).json({ error: e.message });
    }
  });

  router.post("/", async (req, res: Response) => {
    try {
      const { name, location }: CreateStorageRequest = req.body;
      res.status(201).json(toStorageResponse(await service.create(name, location)));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.patch("/:id/deactivate", async (req, res: Response) => {
    try {
      res.json(toStorageResponse(await service.deactivate(pi(req.params, "id"))));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.delete("/:id", async (req, res: Response) => {
    try {
      await service.delete(pi(req.params, "id"));
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  return router;
}
