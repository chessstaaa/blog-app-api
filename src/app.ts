import "reflect-metadata"
import cors from "cors"
import express, { Express } from "express"
import path from "path"
import { PORT } from "./config/env"
import { errorMiddleware } from "./middlewares/error.middleware"

import { EventRouter } from "./modules/event/event.router"
import { AuthRouter } from "./modules/auth/auth.router"
import { ReviewRouter } from "./modules/review/review.router"
import { CategoryRouter } from "./modules/category/category.router"
import { VoucherRouter } from "./modules/voucher/voucher.router"
import { TransactionRouter } from "./modules/transaction/transaction.router"
import { TicketRouter } from "./modules/ticket/ticket.router"
import { UserRouter } from "./modules/user/user.router"

export class App {
  app: Express

  constructor() {
    this.app = express()
    this.configure()
    this.routes()
    this.handleError()
  }

  private configure() {
    this.app.use(cors())

    // 🔥 INI PENTING (JSON & multipart/form-data SAFE)
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    // 🔥 expose uploaded images
    this.app.use(
      "/uploads",
      express.static(path.join(process.cwd(), "uploads"))
    )
  }

  private routes() {
    const eventRouter = new EventRouter()
    const authRouter = new AuthRouter()
    const reviewRouter = new ReviewRouter()
    const categoryRouter = new CategoryRouter()
    const voucherRouter = new VoucherRouter()
    const transactionRouter = new TransactionRouter()
    const ticketRouter = new TicketRouter()
    const userRouter = new UserRouter()



    this.app.use("/event", eventRouter.getRouter())
    this.app.use("/auth", authRouter.getRouter())
    this.app.use("/review", reviewRouter.getRouter())
    this.app.use("/category", categoryRouter.getRouter())
    this.app.use("/voucher", voucherRouter.getRouter())
    this.app.use("/transactions", transactionRouter.getRouter())
    this.app.use("/tickets", ticketRouter.getRouter())
    this.app.use("/users", userRouter.getRouter())
  }

  private handleError() {
    this.app.use(errorMiddleware)
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`🚀 Server running on port : ${PORT}`)
    })
  }
}