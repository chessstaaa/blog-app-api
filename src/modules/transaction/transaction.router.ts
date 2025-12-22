import { Router } from "express";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { TransactionController } from "./transaction.controller";

export class TransactionRouter {
  router: Router;
  transactionController: TransactionController;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/", this.transactionController.getTransactions);
    this.router.post("/approve", this.transactionController.acceptTransaction);
    this.router.post("/reject", this.transactionController.rejectTransaction);
  };

  getRouter = () => {
    return this.router;
  };
}
