import { PrismaService } from "../prisma/prisma.service";

export class DashboardService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  private getDateRange(filter: "year" | "month" | "day", date: Date) {
    const start = new Date(date);
    const end = new Date(date);
    let labels: string[] = [];
    let formatLabel: (date: Date) => string;

    if (filter === "year") {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      formatLabel = (d) => labels[d.getMonth()];
    } else if (filter === "month") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);

      const daysInMonth = end.getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      formatLabel = (d) => `${d.getDate()}`;
    } else {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      formatLabel = (d) => `${d.getHours()}:00`;
    }

    return { start, end, labels, formatLabel };
  }

  async getOverview(
    userId: number,
    filter: "year" | "month" | "day" = "year",
    dateStr?: string
  ) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const { start, end, labels, formatLabel } = this.getDateRange(filter, date);

    const salesStats = await this.prisma.transaction.aggregate({
      _sum: { price: true },
      where: {
        status: "PAID",
        event: { organizerId: userId },
        createdAt: { gte: start, lte: end },
      },
    });

    const ticketStats = await this.prisma.transactionItem.aggregate({
      _sum: { qty: true },
      where: {
        transaction: {
          status: "PAID",
          event: { organizerId: userId },
          createdAt: { gte: start, lte: end },
        },
      },
    });

    const activeEventsCount = await this.prisma.event.count({
      where: {
        organizerId: userId,
        startAt: { lte: end },
        endAt: { gte: start },
      },
    });

    const ratingStats = await this.prisma.review.aggregate({
      _avg: { rating: true },
      where: {
        event: { organizerId: userId },
        createdAt: { gte: start, lte: end },
      },
    });

    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: "PAID",
        event: { organizerId: userId },
        createdAt: { gte: start, lte: end },
      },
      select: { price: true, createdAt: true },
    });

    const chartData = labels.map((label) => ({ name: label, total: 0 }));

    transactions.forEach((trx) => {
      const label = formatLabel(new Date(trx.createdAt));
      const index = labels.indexOf(label);
      if (index !== -1) {
        chartData[index].total += trx.price;
      }
    });

    return {
      totalSales: salesStats._sum.price || 0,
      ticketsSold: ticketStats._sum.qty || 0,
      activeEvents: activeEventsCount,
      avgRating: ratingStats._avg.rating
        ? parseFloat(ratingStats._avg.rating.toFixed(1))
        : 0,
      salesChart: chartData,
    };
  }
}
