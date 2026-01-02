import { Prisma } from "@prisma/client";
import { GetEventsQuery } from "../../types/event";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateEventDTO } from "./dto/create-event-dto";
import { saveEventImage } from "../../utils/file";
import { plainToInstance } from "class-transformer";
import slugify from "slugify"


export class EventService {
  prisma: PrismaService;
  cloudinaryService: CloudinaryService;

  constructor() {
    this.prisma = new PrismaService();
    this.cloudinaryService = new CloudinaryService();
  };

  getEvents = async () => {
    return this.prisma.event.findMany({
      include: { category: true, organizer: true },
    })
  }

  getEventByTitle = async (title: string) => {
    const event = await this.prisma.event.findFirst({
      where: { title: { contains: title, mode: "insensitive" } },
      include: { category: true, organizer: true },
    })

    if (!event) throw new ApiError("event not found", 404)
    return event
  }

  getEventBySlug = async (slug: string) => {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        category: true,
        organizer: true,
        tickets: true,
      },
    })

    if (!event) throw new ApiError("event not found", 404)

    return event
  }


  createEvent = async (body: CreateEventDTO) => {
    const slug = slugify(body.title, { lower: true })

    await this.prisma.event.create({
      data: {
        ...body,
        slug,
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        availableSeats: body.totalSeats,
      },
    })

    return { message: "create event success" }
  }

  deleteEvent = async (id: number) => {
    const exist = await this.prisma.event.findUnique({ where: { id } })
    if (!exist) throw new ApiError("event not found", 404)

    await this.prisma.event.delete({ where: { id } })
    return { message: "delete event success" }
  }
}
