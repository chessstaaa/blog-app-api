import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getOverview = async (req: Request, res: Response) => {
    const filter = req.query.filter as "year" | "month" | "day";
    const date = req.query.date as string;
    const result = await this.dashboardService.getOverview(
      res.locals.user.id,
      filter,
      date
    );
    return res.status(200).send(result);
  };
}
