import { User } from "@prisma/client";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { comparePassword, hashPassword } from "../../utils/password";
import { sign } from "jsonwebtoken";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";
import { MailService } from "../mail/mail.service";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { generateReferralCode } from "../../utils/referal";
import { VoucherService } from "../voucher/voucher.service";

export class AuthService {
  prisma: PrismaService;
  mailService: MailService;
  voucherService: VoucherService;

  constructor() {
    this.prisma = new PrismaService();
    this.mailService = new MailService();
    this.voucherService = new VoucherService();
  }

  registerService = async (
    body: Pick<User, "name" | "email" | "password" | "referralCode">
  ) => {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (user) throw new ApiError("email already exist", 400);

    const hashedPassword = await hashPassword(body.password);

    let referralCode = "";
    let isReferralCodeUnique = false;

    while (!isReferralCodeUnique) {
      referralCode = generateReferralCode(7);

      const existingCode = await this.prisma.user.findUnique({
        where: { referralCode },
      });

      if (!existingCode) isReferralCodeUnique = true;
    }

    const userCreated = await this.prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
        role: "user",
        referralCode: referralCode,
        pointsBalance: 0,
      },
    });

    if (body.referralCode) {
      const referralUser = await this.prisma.user.findUnique({
        where: { referralCode: body.referralCode },
      });

      if (!referralUser) throw new ApiError("referral code invalid", 404);

      const dateNow = referralUser.pointsExpired
        ? new Date(referralUser.pointsExpired)
        : new Date();
      dateNow.setMonth(dateNow.getMonth() + 3);
      await this.prisma.user.update({
        where: { referralCode: body.referralCode },
        data: {
          pointsBalance: { increment: 10000 },
          pointsExpired: dateNow,
        },
      });

      const dateNowReferral = new Date();
      dateNowReferral.setMonth(dateNowReferral.getMonth() + 3);
      await this.voucherService.createVoucher(
        {
          code: "",
          eventId: null,
          discountAmount: 10000,
          startAt: new Date().toISOString(),
          endAt: dateNowReferral.toISOString(),
          usageLimit: 1,
        },
        userCreated.id
      );
    }

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

  forgotPassword = async (body: ForgotPasswordDTO) => {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (!user) throw new ApiError("User not found", 404);

    const payload = { id: user.id };
    const accessToken = sign(payload, process.env.JWT_SECRET_RESET!, {
      expiresIn: "15m",
    });

    await this.mailService.sendEmail(
      body.email,
      "Forgot Password",
      "forgot-password",
      {
        resetUrl: `http://localhost:3000/reset-password/${accessToken}`,
      }
    );

    return { message: "send email success" };
  };

  resetPassword = async (body: ResetPasswordDTO, authUserId: number) => {
    const hashedPassword = await hashPassword(body.password);

    await this.prisma.user.update({
      where: { id: authUserId },

      data: { password: hashedPassword },
    });

    return { message: "reset password success" };
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
        createdAt: true,
      },
    });
  };

  updateProfile = async (id: number, body: Partial<User>) => {
    if (body.password) body.password = await hashPassword(body.password);

    return this.prisma.user.update({
      where: { id },
      data: body,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        referralCode: true,
        pointsBalance: true,
      },
    });
  };
}
