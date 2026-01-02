import { User } from "@prisma/client";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { comparePassword, hashPassword } from "../../utils/password";
import { sign } from "jsonwebtoken";

export class AuthService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  registerService = async (body: Pick<User, "name" | "email" | "password">) => {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (user) throw new ApiError("email already exist", 400);

    const hashedPassword = await hashPassword(body.password);

    await this.prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
        role: "user",
        referralCode: "",
        pointsBalance: 0,
      },
    });

    return { message: "register success" };
  };

  loginService = async (body: Pick<User, "email" | "password">) => {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (!user) throw new ApiError("Invalid credentials", 400);

    const isPassValid = await comparePassword(body.password, user.password);

    if (!isPassValid) throw new ApiError("Invalid credentials", 400);

    const payload = { id: user.id, role: user.role };
    const accessToken = sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "2h",
    });

    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      accessToken,
    };
  };

  // Additional
  getProfile = async (id: number) => {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        referralCode: true,
        pointsBalance: true,
        createdAt: true
      }
    })
  }

  updateProfile = async (id: number, body: Partial<User>) => {
    if (body.password) body.password = await hashPassword(body.password)

    return this.prisma.user.update({
      where: { id },
      data: body,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        referralCode: true,
        pointsBalance: true
      }
    })
  }

}
