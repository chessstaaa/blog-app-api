import { PrismaService } from "../prisma/prisma.service";

export class DashboardService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async getOverview(userId: number) {
    const salesStats = await this.prisma.transaction.aggregate({
      _sum: {
        price: true,
      },
      where: {
        status: "PAID",
        event: {
          organizerId: userId,
        },
      },
    });

    const ticketStats = await this.prisma.transactionItem.aggregate({
      _sum: {
        qty: true,
      },
      where: {
        transaction: {
          status: "PAID",
          event: {
            organizerId: userId,
          },
        },
      },
    });

    const activeEventsCount = await this.prisma.event.count({
      where: {
        organizerId: userId,
        endAt: {
          gte: new Date(),
        },
      },
    });

    const ratingStats = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        event: {
          organizerId: userId,
        },
      },
    });

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(new Date().setFullYear(currentYear, 0, 1));
    const endOfYear = new Date(new Date().setFullYear(currentYear, 11, 31));
    const monthNames = [
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
    const monthlyData = monthNames.map((name) => ({ name, total: 0 }));

    const yearlyTransactions = await this.prisma.transaction.findMany({
      where: {
        status: "PAID",
        event: {
          organizerId: userId,
        },
        createdAt: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        price: true,
        createdAt: true,
      },
    });

    yearlyTransactions.forEach((trx) => {
      const monthIndex = new Date(trx.createdAt).getMonth();
      monthlyData[monthIndex].total += trx.price;
    });

    return {
      data: {
        totalSales: salesStats._sum.price || 0,
        ticketsSold: ticketStats._sum.qty || 0,
        activeEvents: activeEventsCount,
        avgRating: ratingStats._avg.rating
          ? parseFloat(ratingStats._avg.rating.toFixed(1))
          : 0,
        monthlySales: monthlyData,
      },
    };
  }
}
