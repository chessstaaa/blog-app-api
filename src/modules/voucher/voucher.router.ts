import { Router } from "express";
import { VoucherController } from "./voucher.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

export class VoucherRouter {
  router: Router;
  voucherController: VoucherController;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.voucherController = new VoucherController();
    this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/", this.voucherController.getVouchers);
    this.router.get("/:id", this.voucherController.getVouchersByEvent);
    this.router.post(
      "/",
      this.jwtMiddleware.verifyToken(process.env.JWT_SECRET!),
      this.voucherController.createVoucher
    );
    this.router.patch("/", this.voucherController.updateCountVoucher);
    this.router.delete("/:id", this.voucherController.deleteVoucher);
  };

  getRouter = () => {
    return this.router;
  };
}
