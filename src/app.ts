import "reflect-metadata";
import cors from "cors";
import express, { Express } from "express";
import { PORT } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { EventRouter } from "./modules/event/event.router";
import { AuthRouter } from "./modules/auth/auth.router";
import { ReviewRouter } from "./modules/review/review.router";

export class App {
  app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes() {
    const eventRouter = new EventRouter();
    const authRouter = new AuthRouter();
    const reviewRouter = new ReviewRouter();

    this.app.use("/event", eventRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/review", reviewRouter.getRouter());
  }

  private handleError() {
    this.app.use(errorMiddleware);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`Server running on port : ${PORT}`);
    });
  }
}
