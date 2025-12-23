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

    const whereClause: Prisma.AttendeeWhereInput = {
      eventId: parseInt(eventIdStr),
      transaction: { status: "DONE" },
    };

    if (search) {
      whereClause.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { ticketCode: { contains: search, mode: "insensitive" } },
      ];
    }

    const attendees = await this.prisma.attendee.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      include: {
        user: { select: { name: true, email: true } },
        ticket: { select: { name: true } },
        transaction: { select: { totalPrice: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await this.prisma.attendee.count();

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
