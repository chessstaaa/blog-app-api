import { Router } from "express";
import { VoucherController } from "./voucher.controller";

export class VoucherRouter {
  router: Router;
  voucherController: VoucherController;

  constructor() {
    this.router = Router();
    this.voucherController = new VoucherController();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/", this.voucherController.getVouchersByEvent);
    this.router.post("/", this.voucherController.createVoucher);
    this.router.patch("/", this.voucherController.updateCountVoucher);
  };

  getRouter = () => {
    return this.router;
  };
}
