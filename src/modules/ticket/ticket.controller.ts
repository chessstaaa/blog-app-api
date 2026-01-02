import { NextFunction, Request, Response } from "express"
import { TicketService } from "./ticket.service"

export class TicketController {
  service = new TicketService()

  getByEvent = async (req: Request, res: Response) => {
    const eventId = Number(req.query.eventId)
    const tickets = await this.service.getTicketsByEvent(eventId)
    return res.send(tickets)
  }

  create = async (req: Request, res: Response) => {
    const ticket = await this.service.createTicket(req.body)
    return res.status(201).send(ticket)
  }

  deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // Mengonversi id string ke number
      const result = await this.service.deleteTicket(Number(id));
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

}
