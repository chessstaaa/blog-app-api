import { PrismaService } from "../prisma/prisma.service"

export class TicketService {
  prisma = new PrismaService()

  getTicketsByEvent = async (eventId: number) => {
    return this.prisma.ticket.findMany({
      where: { eventId }
    })
  }

  createTicket = async (body: {
    eventId: number
    name: string
    price: number
    quantityAvailable: number
  }) => {
    return this.prisma.ticket.create({ data: body })
  }

  deleteTicket = async (id: number) => {
    return this.prisma.ticket.delete({ where: { id } })
  }
}
