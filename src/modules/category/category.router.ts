import { Router } from "express";
import { CategoryController } from "./category.controller";

export class CategoryRouter {
  router: Router;
  categoryController: CategoryController;

  constructor() {
    this.router = Router();
    this.categoryController = new CategoryController();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/", this.categoryController.getCategories);
  };

  getRouter = () => {
    return this.router;
  };
}
