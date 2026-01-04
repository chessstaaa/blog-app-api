import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { GetAttendeeQuery } from "../../types/attendee";

export class AttendeeService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async getAttendeesByEventId(eventIdStr: string, query: GetAttendeeQuery) {
    const { page, take, search } = query;

    const whereClause: Prisma.TransactionWhereInput = {
      eventId: parseInt(eventIdStr),
      status: "PAID",
    };

    if (search) {
      whereClause.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const attendees = await this.prisma.transaction.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { createdAt: "desc" },
    });

    const total = await this.prisma.transaction.count();

    return {
      data: attendees,
      meta: {
        page,
        take,
        total,
      },
    };
  }
}
