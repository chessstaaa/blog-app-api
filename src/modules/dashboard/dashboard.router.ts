import { Router } from "express";
import { authMiddleware } from "../../middlewares/jwt.middleware";
import { DashboardController } from "./dashboard.controller";

export class DashboardRouter {
  router: Router;
  dashboardController: DashboardController;

  constructor() {
    this.router = Router();
    this.dashboardController = new DashboardController();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/", authMiddleware, this.dashboardController.getOverview);
  };

  getRouter = () => {
    return this.router;
  };
}
