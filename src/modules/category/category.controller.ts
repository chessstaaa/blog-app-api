import { Request, Response } from "express";
import { CategoryService } from "./category.service";

export class CategoryController {
  categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getCategories = async (req: Request, res: Response) => {
    const result = await this.categoryService.getCategories();
    return res.status(200).send(result);
  };
}
