import { Router } from "express";
import { EventController } from "./event.controller";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateEventDTO } from "./dto/create-event-dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

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
    this.router.post(
      "/",
      this.jwtMiddleware.verifyToken(process.env.JWT_SECRET!),
      this.uploaderMiddleware.upload().fields([{ name: "image", maxCount: 1 }]),
      validateBody(CreateEventDTO),
      this.eventController.createEvent
    );
  };

  getRouter = () => {
    return this.router;
  };
}
