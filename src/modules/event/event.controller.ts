import { Request, Response } from "express";
import { EventService } from "./event.service";
import { GetEventsQuery } from "../../types/event";

export class EventController {
  eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  getEvents = async (req: Request, res: Response) => {
    const query: GetEventsQuery = {
      page: parseInt(req.query.page as string) || 1,
      take: parseInt(req.query.take as string) || 3,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
    };
    const result = await this.eventService.getEvents(query);
    return res.status(200).send(result);
  };

  getEventByTitle = async (req: Request, res: Response) => {
    const title = req.params.title;
    const result = await this.eventService.getEventByTitle(title);
    return res.status(200).send(result);
  };
}
