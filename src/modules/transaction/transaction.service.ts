import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTransactionDTO } from "./dto/create-transaction.dto";
import { MailService } from "../mail/mail.service";

export class TransactionService {
  prisma = new PrismaService();
  mailService = new MailService();

  createTransaction = async (body: CreateTransactionDTO, userId: number) => {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: body.eventId } });
      if (!event) throw new ApiError("Event not found", 404);
      if (event.startAt < new Date())
        throw new ApiError("Event already started", 400);

      const items = body.items ?? [
        { ticketId: body.ticketId!, qty: body.qty! },
      ];

      let total = 0;
      const rows: any[] = [];

      for (const i of items) {
        const t = await tx.ticket.findUnique({ where: { id: i.ticketId } });
        if (!t || t.eventId !== event.id)
          throw new ApiError("Invalid ticket", 400);
        if (t.quantityAvailable < i.qty)
          throw new ApiError("Not enough ticket", 400);

        const subtotal = event.isFree ? 0 : t.price * i.qty;
        total += subtotal;

        rows.push({
          ticketId: t.id,
          name: t.name,
          price: t.price,
          qty: i.qty,
          subtotal,
        });

        await tx.ticket.update({
          where: { id: t.id },
          data: { quantityAvailable: { decrement: i.qty } },
        });
      }

      // voucher + point logic kamu tetap dipakai
      if (body.voucherId) {
        const v = await tx.voucher.findUnique({
          where: { id: body.voucherId },
        });
        if (!v || v.eventId !== event.id)
          throw new ApiError("Invalid voucher", 400);
        if (v.usedCount >= v.usageLimit)
          throw new ApiError("Voucher quota exceeded", 400);

        total = Math.max(0, total - v.discountAmount);
        await tx.voucher.update({
          where: { id: v.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      if (body.pointsUsed) {
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user || user.pointsBalance < body.pointsUsed)
          throw new ApiError("Not enough points", 400);
        total = Math.max(0, total - body.pointsUsed);
        await tx.user.update({
          where: { id: userId },
          data: { pointsBalance: { decrement: body.pointsUsed } },
        });
      }

      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      const trx = await tx.transaction.create({
        data: {
          userId,
          eventId: event.id,
          price: total,
          voucherId: body.voucherId,
          pointsUsed: body.pointsUsed ?? 0,
          expiresAt,
          items: { create: rows },
        },
        include: { items: true },
      });

      return trx;
    });
  };

  uploadPaymentProof = async (id: number, file: string) => {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        paymentProofUrl: file,
        status: "WAITING_FOR_ADMIN_CONFIRMATION",
      },
    });
  };

  acceptTransaction = async (id: number) => {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
      },
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true, createdAt: true } },
        items: true,
      },
    });

    if (!transaction) throw new ApiError("Transaction not found", 404);

    await this.prisma.transaction.update({
      where: { id },
      data: {
        status: "PAID",
      },
    });

    const totalTicket = transaction.items.reduce((total, item) => {
      return total + item.qty;
    }, 0);

    await this.prisma.event.update({
      where: { id: transaction.eventId },
      data: {
        availableSeats: {
          decrement: totalTicket,
        },
      },
    });

    const dateNow = new Date();
    dateNow.setMonth(dateNow.getMonth() + 3);
    await this.prisma.user.update({
      where: { id: transaction.userId },
      data: {
        pointsBalance: Math.floor(transaction.price * 0.1),
        pointsExpired: dateNow,
      },
    });

    await this.mailService.sendEmail(
      transaction.user.email,
      "Payment Success",
      "email-payment-success",
      {
        userName: transaction.user.name,
        transactionId: transaction.id,
        eventName: transaction.event.title,
        eventDate: transaction.event.createdAt,
        ticketQty: totalTicket,
        totalAmount: transaction.price,
        currentYear: new Date().getFullYear().toString(),
      }
    );

    return { message: "Accept payment success" };
  };

  rejectTransaction = async (id: number) => {
    const trx = await this.prisma.transaction.findFirst({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true } },
        items: true,
        voucher: true,
      },
    });

    if (!trx) throw new ApiError("Transaction not found", 404);

    for (const i of trx!.items) {
      await this.prisma.ticket.update({
        where: { id: i.ticketId },
        data: { quantityAvailable: { increment: i.qty } },
      });
    }

    await this.prisma.transaction.update({
      where: { id },
      data: {
        status: "REJECTED",
      },
    });

    await this.mailService.sendEmail(
      trx.user.email,
      "Payment Rejected",
      "email-payment-rejected",
      {
        userName: trx.user.name,
        transactionId: trx.id,
        eventName: trx.event.title,
        pointsUsed: trx.pointsUsed,
        voucherCode: trx.voucher?.code || "",
        currentYear: new Date().getFullYear().toString(),
      }
    );

    return { message: "Reject payment success" };
  };

  getPending = async () => {
    return this.prisma.transaction.findMany({
      where: { status: "WAITING_FOR_ADMIN_CONFIRMATION" },
      include: { user: true, event: true, ticket: true },
    });
  };

  getMyHistory = async (userId: number) => {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        event: true,
        ticket: true,
      },
    });
  };

  getTransaction = async () => {
    const transactions = await this.prisma.transaction.findMany({
      include: {
        event: true,
        user: true,
      },
    });
    return transactions;
  };
}
