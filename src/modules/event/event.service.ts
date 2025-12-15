import { Prisma } from "@prisma/client";
import { GetEventsQuery } from "../../types/event";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateEventDTO } from "./dto/create-event-dto";

export class EventService {
  prisma: PrismaService;
  cloudinaryService: CloudinaryService;

  constructor() {
    this.prisma = new PrismaService();
    this.cloudinaryService = new CloudinaryService();
  }

  getEvents = async (query: GetEventsQuery) => {
    const { page, take, search } = query;

    const whereClause: Prisma.EventWhereInput = {};

    if (search) whereClause.title = { contains: search, mode: "insensitive" };

    const events = await this.prisma.event.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
    });
    return events;
  };

  getEventByTitle = async (title: string) => {
    const event = await this.prisma.event.findFirst({
      where: { title },
    });

    if (!event) throw new ApiError("Event not found", 404);

    return event;
  };

  createEvent = async (
    body: CreateEventDTO,
    userId: number,
    image: Express.Multer.File
  ) => {
    const { secure_url } = await this.cloudinaryService.upload(image);

    await this.prisma.event.create({
      data: {
        ...body,
        organizerId: userId,
        availableSeats: body.totaSeats,
        image: secure_url,
      },
    });

    return {
      message: "Create event success",
    };
  };
}
