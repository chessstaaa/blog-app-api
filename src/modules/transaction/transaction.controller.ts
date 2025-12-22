import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";

export class TransactionController {
  transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  getTransactions = async (req: Request, res: Response) => {
    const result = await this.transactionService.getTransaction();
    return res.status(200).send(result);
  };

  acceptTransaction = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.transactionService.acceptTransaction(id);
    return res.status(200).send(result);
  };

  rejectTransaction = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.transactionService.rejectTransaction(id);
    return res.status(200).send(result);
  };
}
