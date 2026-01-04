import { NextFunction, Request, Response } from "express";
import { EventService } from "./event.service";
import { GetEventsQuery } from "../../types/event";
import { ApiError } from "../../utils/api-error";
import { plainToInstance } from "class-transformer";
import { CreateEventDTO } from "./dto/create-event-dto";

export class EventController {
  eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  getEvents = async (req: Request, res: Response) => {
    const result = await this.eventService.getEvents();
    return res.status(200).send(result);
  };

  getEventsDashboard = async (req: Request, res: Response) => {
    const query: GetEventsQuery = {
      page: parseInt(req.query.page as string) || 1,
      take: parseInt(req.query.take as string) || 3,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
    };
    const result = await this.eventService.getEventsDashboard(
      query,
      res.locals.user.id
    );
    return res.status(200).send(result);
  };

  getEventByTitle = async (req: Request, res: Response) => {
    const { title } = req.params;
    const result = await this.eventService.getEventByTitle(title);
    return res.status(200).send(result);
  };

  createEvent = async (req: Request, res: Response) => {
    // 🔥 HARD FIX BOOLEAN
    if (typeof req.body.isFree === "string") {
      req.body.isFree = req.body.isFree === "true";
    }

    let body = plainToInstance(CreateEventDTO, req.body, {
      enableImplicitConversion: true,
    });

    const result = await this.eventService.createEvent(
      body,
      res.locals.user.id,
      req.file
    );
    return res.status(201).send(result);
  };

  deleteEvent = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.eventService.deleteEvent(id);
    return res.status(200).send(result);
  };

  getEventBySlug = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const result = await this.eventService.getEventBySlug(slug);
    return res.status(200).send(result);
  };
}
