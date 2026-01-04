import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getOverview = async (req: Request, res: Response) => {
    const result = await this.dashboardService.getOverview(res.locals.user.id);
    return res.status(200).send(result);
  };
}
