import { Request, Response } from "express";
import { VoucherService } from "./voucher.service";
import { GetVoucherQuery } from "../../types/voucher";

export class VoucherController {
  voucherService: VoucherService;

  constructor() {
    this.voucherService = new VoucherService();
  }

  getVouchers = async (req: Request, res: Response) => {
    const result = await this.voucherService.getVouchers();
    return res.status(200).send(result);
  };

  getVouchersByEvent = async (req: Request, res: Response) => {
    const query: GetVoucherQuery = {
      event_id: parseInt(req.query.eventId as string),
    };
    const result = await this.voucherService.getVouchersByEvent(query);
    return res.status(200).send(result);
  };

  createVoucher = async (req: Request, res: Response) => {
    const result = await this.voucherService.createVoucher(
      req.body,
      res.locals.user.id
    );
    return res.status(200).send(result);
  };

  updateCountVoucher = async (req: Request, res: Response) => {
    const code = req.params.code;
    const result = await this.voucherService.updateCountVoucher(code);
    return res.status(200).send(result);
  };

  deleteVoucher = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await this.voucherService.deleteVoucher(id);
    return res.status(200).send(result);
  };
}
