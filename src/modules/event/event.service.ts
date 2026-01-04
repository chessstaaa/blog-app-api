import { Prisma } from "@prisma/client";
import { GetEventsQuery } from "../../types/event";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateEventDTO } from "./dto/create-event-dto";
import { plainToInstance } from "class-transformer";
import slugify from "slugify";
import { UpdateEventDTO } from "./dto/update-event-dto";

export class EventService {
  prisma: PrismaService;
  cloudinaryService: CloudinaryService;

  constructor() {
    this.prisma = new PrismaService();
    this.cloudinaryService = new CloudinaryService();
  }

  getEvents = async () => {
    return this.prisma.event.findMany({
      include: { category: true, organizer: true },
    });
  };

  getEventsDashboard = async (query: GetEventsQuery, userId: number) => {
    const { page, take, search } = query;

    const whereClause: Prisma.EventWhereInput = {
      organizerId: userId,
    };

    if (search) whereClause.title = { contains: search, mode: "insensitive" };

    const events = await this.prisma.event.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      include: {
        category: true,
      },
    });

    const total = await this.prisma.event.count({
      where: { organizerId: userId },
    });

    return {
      data: events,
      meta: {
        page,
        take,
        total,
      },
    };
  };

  getEventByTitle = async (title: string) => {
    const event = await this.prisma.event.findFirst({
      where: { title: { contains: title, mode: "insensitive" } },
      include: { category: true, organizer: true },
    });

    if (!event) throw new ApiError("event not found", 404);
    return event;
  };

  getEventBySlug = async (slug: string) => {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        category: true,
        organizer: true,
        tickets: true,
      },
    });

    if (!event) throw new ApiError("event not found", 404);

    return event;
  };

  createEvent = async (
    body: CreateEventDTO,
    userId: number,
    file?: Express.Multer.File
  ) => {
    const slug = slugify(body.title, { lower: true });

    let imageUrl = body.image;

    // Upload image to Cloudinary if file provided
    if (file) {
      const uploadResult = await this.cloudinaryService.upload(file);
      imageUrl = uploadResult.secure_url;
    }

    await this.prisma.event.create({
      data: {
        ...body,
        image: imageUrl,
        slug,
        organizerId: userId,
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        availableSeats: body.totalSeats,
      },
    });

    return { message: "create event success" };
  };

  updateEvent = async (
    body: UpdateEventDTO,
    userId: number,
    file?: Express.Multer.File
  ) => {
    const getData = this.prisma.event.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!getData) throw new ApiError("Event not found", 404);

    const slug = slugify(body.title, { lower: true });

    let imageUrl = body.image;

    if (file) {
      const uploadResult = await this.cloudinaryService.upload(file);
      imageUrl = uploadResult.secure_url;
    }

    await this.prisma.event.update({
      where: { id: body.id },
      data: {
        ...body,
        image: imageUrl,
        slug,
        organizerId: userId,
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        availableSeats: body.totalSeats,
      },
    });

    return { message: "update event success" };
  };

  deleteEvent = async (id: number) => {
    const exist = await this.prisma.event.findUnique({ where: { id } });
    if (!exist) throw new ApiError("event not found", 404);

    await this.prisma.event.delete({ where: { id } });
    return { message: "delete event success" };
  };
}
