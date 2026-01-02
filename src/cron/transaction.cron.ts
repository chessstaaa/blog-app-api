import cron from "node-cron"
import { PrismaClient, TransactionStatus } from "@prisma/client"

const prisma = new PrismaClient()

cron.schedule("*/30 * * * * *", async () => {
  const now = new Date()
  console.log("⏰ CRON RUN", now.toISOString())

  // ============================
  // 1. USER TIDAK UPLOAD BUKTI
  // ============================
  const expiredByUser = await prisma.transaction.findMany({
    where: {
      status: TransactionStatus.WAITING_FOR_PAYMENT,
      expiresAt: { lt: now }
    },
    include: { items: true }
  })

  for (const trx of expiredByUser) {
    await prisma.$transaction(async tx => {

      // restore ALL tickets
      for (const item of trx.items) {
        await tx.ticket.update({
          where: { id: item.ticketId },
          data: { quantityAvailable: { increment: item.qty } }
        })
      }

      if (trx.voucherId) {
        await tx.voucher.update({
          where: { id: trx.voucherId },
          data: { usedCount: { decrement: 1 } }
        })
      }

      if (trx.pointsUsed > 0) {
        await tx.user.update({
          where: { id: trx.userId },
          data: { pointsBalance: { increment: trx.pointsUsed } }
        })
      }

      await tx.transaction.update({
        where: { id: trx.id },
        data: { status: TransactionStatus.EXPIRED }
      })
    })
  }

  // ============================
  // 2. ADMIN DIAM > 3 HARI
  // ============================
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  const expiredByAdmin = await prisma.transaction.findMany({
    where: {
      status: TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION,
      updatedAt: { lt: threeDaysAgo }
    },
    include: { items: true }
  })

  for (const trx of expiredByAdmin) {
    await prisma.$transaction(async tx => {

      for (const item of trx.items) {
        await tx.ticket.update({
          where: { id: item.ticketId },
          data: { quantityAvailable: { increment: item.qty } }
        })
      }

      if (trx.voucherId) {
        await tx.voucher.update({
          where: { id: trx.voucherId },
          data: { usedCount: { decrement: 1 } }
        })
      }

      if (trx.pointsUsed > 0) {
        await tx.user.update({
          where: { id: trx.userId },
          data: { pointsBalance: { increment: trx.pointsUsed } }
        })
      }

      await tx.transaction.update({
        where: { id: trx.id },
        data: { status: TransactionStatus.EXPIRED }
      })
    })
  }
})
