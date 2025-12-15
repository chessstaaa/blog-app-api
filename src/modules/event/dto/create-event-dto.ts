import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateEventDTO {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  categoryId!: number;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  price!: number;

  @IsNotEmpty()
  @IsDateString()
  startAt!: string;

  @IsNotEmpty()
  @IsDateString()
  endAt!: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  totaSeats!: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  isFree!: boolean;
}
