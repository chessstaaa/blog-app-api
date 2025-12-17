import { Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateVoucherDTO {
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  eventId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  discountAmount!: number;

  @IsNotEmpty()
  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  usageLimit!: number;
}
