import { Router } from "express";
import { AttendeeController } from "./attendee.controller";

export class AttendeeRouter {
  router: Router;
  attendeeController: AttendeeController;

  constructor() {
    this.router = Router();
    this.attendeeController = new AttendeeController();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/:id", this.attendeeController.getAttendeesByEvent);
  };

  getRouter = () => {
    return this.router;
  };
}
