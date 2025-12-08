import { Router } from "express";
import { EventController } from "./event.controller";

export class EventRouter {
  router: Router;
  eventController: EventController;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/", this.eventController.getEvents);
    this.router.get("/:id", this.eventController.getEventByTitle);
  };

  getRouter = () => {
    return this.router;
  };
}
