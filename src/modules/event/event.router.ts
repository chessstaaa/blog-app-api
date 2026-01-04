import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../../middlewares/jwt.middleware";
import {
  uploader,
  UploaderMiddleware,
} from "../../middlewares/uploader.middleware";

export class EventRouter {
  router: Router;
  eventController: EventController;
  uploaderMiddleware: UploaderMiddleware;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.uploaderMiddleware = new UploaderMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/", this.eventController.getEvents);
    this.router.get(
      "/dashboard",
      authMiddleware,
      this.eventController.getEventsDashboard
    );
    this.router.get("/:id", this.eventController.getEventByTitle);
    this.router.post(
      "/",
      authMiddleware,
      uploader.single("image"),
      this.eventController.createEvent
    );
    this.router.patch(
      "/",
      authMiddleware,
      uploader.single("image"),
      this.eventController.updateEvent
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      this.eventController.deleteEvent
    );
    this.router.get("/slug/:slug", this.eventController.getEventBySlug);
  };

  getRouter = () => {
    return this.router;
  };
}
