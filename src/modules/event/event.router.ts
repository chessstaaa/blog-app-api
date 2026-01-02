import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware, JwtMiddleware } from "../../middlewares/jwt.middleware";
import { uploader, UploaderMiddleware } from "../../middlewares/uploader.middleware";

export class EventRouter {
  router: Router;
  eventController: EventController;
  jwtMiddleware: JwtMiddleware;
  uploaderMiddleware: UploaderMiddleware;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.jwtMiddleware = new JwtMiddleware();
    this.uploaderMiddleware = new UploaderMiddleware();
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
