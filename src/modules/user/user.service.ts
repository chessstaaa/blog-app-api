import { PrismaService } from "../prisma/prisma.service"
import argon from "argon2"
import { CreateUserDTO } from "./dto/create-user.dto"
import { UpdateUserDTO } from "./dto/update-user.dto"
import { ApiError } from "../../utils/api-error"

export class UserService {
  prisma = new PrismaService()

  create = async (body: CreateUserDTO) => {
    const exist = await this.prisma.user.findUnique({ where: { email: body.email } })
    if (exist) throw new ApiError("Email already used", 400)

    const hash = await argon.hash(body.password)

    return this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hash,
        role: "USER",
        referralCode: "",
        pointsBalance: 0
      }
    })
  }

  me = (id: number) => {
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

  updateMe = async (id: number, body: UpdateUserDTO) => {
    if (body.password) body.password = await argon.hash(body.password)

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

  public = (id: number) => {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        events: true
      }
    })
  }
}
