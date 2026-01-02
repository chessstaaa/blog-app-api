import { Router } from "express";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { validateBody } from "../../middlewares/validation.middleware";
import { uploader } from "../../middlewares/uploader.middleware";
import { CreateTransactionDTO } from "./dto/create-transaction.dto";
import { TransactionController } from "./transaction.controller";

export class TransactionRouter {
  router = Router();
  controller = new TransactionController();
  jwt = new JwtMiddleware();

  constructor() {
    // 🔥 CREATE TRANSACTION (CHECKOUT)
    this.router.post(
      "/",
      this.jwt.verifyToken(process.env.JWT_SECRET!),
      validateBody(CreateTransactionDTO),
      this.controller.createTransaction
    );

    // upload bukti bayar
    this.router.post(
      "/:id/proof",
      this.jwt.verifyToken(process.env.JWT_SECRET!),
      uploader.single("image"),
      this.controller.uploadProof
    );

    // admin accept
    this.router.post(
      "/:id/accept",
      this.jwt.verifyToken(process.env.JWT_SECRET!),
      this.controller.accept
    );

    // admin reject
    this.router.post(
      "/:id/reject",
      this.jwt.verifyToken(process.env.JWT_SECRET!),
      this.controller.reject
    );

    this.router.get(
      "/pending",
      this.jwt.verifyToken(process.env.JWT_SECRET!),
      this.controller.getPending
    );

    this.router.get(
      "/my",
      this.jwt.verifyToken(process.env.JWT_SECRET!),
      this.controller.getMyHistory
    );

    this.router.get("/dashboard", this.controller.getTransactions);
  }

  getRouter() {
    return this.router;
  }
}
