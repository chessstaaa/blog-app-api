import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";

export class TransactionService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  getTransaction = async () => {
    const transactions = await this.prisma.transaction.findMany({
      include: {
        event: true,
        user: true,
      },
    });
    return transactions;
  };

  acceptTransaction = async (id: number) => {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
      },
    });

    if (!transaction) throw new ApiError("Transaction not found", 404);

    transaction.status = "DONE";

    return { message: "Accept payment success" };
  };

  rejectTransaction = async (id: number) => {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
      },
    });

    if (!transaction) throw new ApiError("Transaction not found", 404);

    transaction.status = "REJECTED";

    return { message: "Reject payment success" };
  };
}
