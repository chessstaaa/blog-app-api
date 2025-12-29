import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ApiError } from "../../utils/api-error";
import { UpdatePasswordDTO } from "./dto/updatePassword.dto";
import { hashPassword } from "../../utils/password";
import { UpdateProfileDTO } from "./dto/updateProfile.dto";

export class UserService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  getUser = async (userId: number) => {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    return user;
  };

  updatePassword = async (body: UpdatePasswordDTO, userId: number) => {
    const oldPassword = await hashPassword(body.oldPassword);
    const newPassword = await hashPassword(body.password);

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (user?.password === oldPassword)
      throw new ApiError("The old password you entered is incorrect", 400);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
      },
    });

    return { message: "update password success" };
  };

  updateProfile = async (body: UpdateProfileDTO, userId: number) => {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: body.name,
      },
    });

    return { message: "update profile success" };
  };
}
