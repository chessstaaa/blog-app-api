import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../../middlewares/jwt.middleware";
import { uploader } from "../../middlewares/uploader.middleware";

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
    this.router.post("/", authMiddleware, uploader.single("image"), this.eventController.createEvent);
    this.router.delete("/:id", authMiddleware, this.eventController.deleteEvent);
    this.router.get("/slug/:slug", this.eventController.getEventBySlug)
  };

  getRouter = () => {
    return this.router;
  };
}
