import { Router, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ContentService } from "../../bll/services/ContentService";
import {
  CreateContentItemRequest,
  UpdateContentItemRequest,
  ContentSearchRequest,
} from "../models";
import { toContentItemResponse, toCreateContentDto, toUpdateContentDto } from "../mappers";

const qs = (v: unknown): string | undefined => typeof v === "string" ? v : undefined;
const qi = (v: unknown): number | undefined => typeof v === "string" ? parseInt(v) : undefined;
const qb = (v: unknown): boolean | undefined => typeof v === "string" ? v === "true" : undefined;
const pi = (params: ParamsDictionary, key: string): number => parseInt(String(params[key]));

export function createContentRouter(service: ContentService): Router {
  const router = Router();

  router.get("/", async (_req, res: Response) => {
    try {
      res.json((await service.getAll()).map(toContentItemResponse));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/search", async (req, res: Response) => {
    try {
      const q = req.query;
      const criteria: ContentSearchRequest = {
        title:       qs(q.title),
        author:      qs(q.author),
        type:        qs(q.type) as ContentSearchRequest["type"],
        genre:       qs(q.genre),
        language:    qs(q.language),
        year:        qi(q.year),
        storageId:   qi(q.storageId),
        isAvailable: qb(q.isAvailable),
      };
      res.json((await service.search(criteria)).map(toContentItemResponse));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/:id", async (req, res: Response) => {
    try {
      res.json(toContentItemResponse(await service.getById(pi(req.params, "id"))));
    } catch (e: any) {
      res.status(404).json({ error: e.message });
    }
  });

  router.post("/", async (req, res: Response) => {
    try {
      const created = await service.create(toCreateContentDto(req.body as CreateContentItemRequest));
      res.status(201).json(toContentItemResponse(created));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.put("/:id", async (req, res: Response) => {
    try {
      const updated = await service.update(toUpdateContentDto(pi(req.params, "id"), req.body as UpdateContentItemRequest));
      res.json(toContentItemResponse(updated));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.patch("/:id/availability", async (req, res: Response) => {
    try {
      const { isAvailable } = req.body as { isAvailable: boolean };
      const updated = await service.setAvailability(pi(req.params, "id"), isAvailable);
      res.json(toContentItemResponse(updated));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.delete("/:id", async (req, res: Response) => {
    try {
      await service.delete(pi(req.params, "id"));
      res.status(204).send();
    } catch (e: any) {
      res.status(404).json({ error: e.message });
    }
  });

  return router;
}
