import { Router } from "express"
import { TicketController } from "./ticket.controller"

export class TicketRouter {
  router = Router()
  controller = new TicketController()

  constructor() {
    this.router.get("/", this.controller.getByEvent)
    this.router.post("/", this.controller.create)
    this.router.delete('/:id', this.controller.deleteTicket);
  }

  getRouter() {
    return this.router
  }
}
