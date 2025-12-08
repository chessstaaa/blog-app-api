import { Request, Response } from "express";
import { VoucherService } from "./voucher.service";
import { GetVoucherQuery } from "../../types/voucher";

export class VoucherController {
  voucherService: VoucherService;

  constructor() {
    this.voucherService = new VoucherService();
  }

  getVouchersByEvent = async (req: Request, res: Response) => {
    const query: GetVoucherQuery = {
      event_id: parseInt(req.query.eventId as string),
    };
    const result = await this.voucherService.getVouchersByEvent(query);
    return res.status(200).send(result);
  };

  createVoucher = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.voucherService.createVoucher(req.body);
    return res.status(200).send(result);
  };

  updateCountVoucher = async (req: Request, res: Response) => {
    const code = req.params.code;
    const result = await this.voucherService.updateCountVoucher(code);
    return res.status(200).send(result);
  };
}
