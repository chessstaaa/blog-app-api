<<<<<<< HEAD
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
=======
import { Request, Response } from "express"
import { TransactionService } from "./transaction.service"

export class TransactionController {
  service = new TransactionService()

  createTransaction = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id)
    const trx = await this.service.createTransaction(req.body, userId)
    return res.status(201).send(trx)
  }

  uploadProof = async (req: Request, res: Response) => {
    const trx = await this.service.uploadPaymentProof(
      Number(req.params.id),
      req.file!.filename
    )
    return res.send(trx)
  }

  accept = async (req: Request, res: Response) => {
    const trx = await this.service.acceptTransaction(Number(req.params.id))
    return res.send(trx)
  }

  reject = async (req: Request, res: Response) => {
    const trx = await this.service.rejectTransaction(Number(req.params.id))
    return res.send(trx)
  }

  getPending = async (_: Request, res: Response) => {
    const result = await this.service.getPending()
    return res.send(result)
  }

  getMyHistory = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id)
    const result = await this.service.getMyHistory(userId)
    return res.send(result)
  }


>>>>>>> git-chesta
}
