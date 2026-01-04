import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { GetVoucherQuery } from "../../types/voucher";
import { CreateVoucherDTO } from "./dto/create-voucher-dto";
import { generateCodeVoucher } from "../../utils/voucher";
import { ApiError } from "../../utils/api-error";

export class VoucherService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  getVouchers = async () => {
    const vouchers = await this.prisma.voucher.findMany({
      include: {
        event: true,
      },
    });

    return vouchers;
  };

  getVouchersByEvent = async (query: GetVoucherQuery) => {
    const { event_id } = query;

    const whereClause: Prisma.VoucherWhereInput = {
      eventId: {
        equals: event_id,
      },
    };

    const vouchers = await this.prisma.voucher.findMany({
      where: whereClause,
    });

    return vouchers;
  };

  createVoucher = async (body: CreateVoucherDTO, userId: number) => {
    let code = "";
    let check = false;
    if (!body.code) {
      while (!check) {
        const tempCode = generateCodeVoucher();
        const voucher = await this.prisma.voucher.findFirst({
          where: {
            code: tempCode,
          },
        });

        if (!voucher) {
          check = true;
          code = tempCode;
        }
      }
    } else {
      code = body.code;
    }
    await this.prisma.voucher.create({
      data: { ...body, code, usedCount: 0, organizerId: userId },
    });

    return { message: "Create voucher success" };
  };

  updateCountVoucher = async (code: string) => {
    const voucher = await this.prisma.voucher.findFirst({
      where: { code },
    });

    if (!voucher) throw new ApiError("Voucher not found", 404);

    await this.prisma.voucher.update({
      where: { code },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });

    return { message: "Update used count voucher success" };
  };

  deleteVoucher = async (id: number) => {
    const voucher = await this.prisma.voucher.findFirst({
      where: { id },
    });

    if (!voucher) throw new ApiError("Voucher not found", 404);

    await this.prisma.voucher.delete({
      where: { id },
    });

    return { message: "Delete voucher success" };
  };
}
