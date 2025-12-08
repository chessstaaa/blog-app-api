import { PrismaService } from "../prisma/prisma.service";

export class CategoryService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  getCategories = async () => {
    const categories = await this.prisma.category.findMany();

    return categories;
  };
}
