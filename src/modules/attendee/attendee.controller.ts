import { Request, Response, NextFunction } from "express";
import { AttendeeService } from "./attendee.service";
import { GetAttendeeQuery } from "../../types/attendee";

export class AttendeeController {
  attendeeService: AttendeeService;

  constructor() {
    this.attendeeService = new AttendeeService();
  }

  getAttendeesByEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const query: GetAttendeeQuery = {
      page: parseInt(req.query.page as string) || 1,
      take: parseInt(req.query.take as string) || 3,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
    };
    const result = await this.attendeeService.getAttendeesByEventId(id, query);
    return res.status(200).send(result);
  };
}
