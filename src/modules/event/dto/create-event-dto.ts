import { Transform } from "class-transformer"
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsInt,
  Min,
} from "class-validator"

export class CreateEventDTO {

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  organizerId!: number

  @IsNotEmpty()
  @IsString()
  title!: string

  @IsNotEmpty()
  @IsString()
  description!: string

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  categoryId!: number

  @IsNotEmpty()
  @IsString()
  location!: string

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price!: number

  @IsNotEmpty()
  @IsDateString()
  startAt!: string

  @IsNotEmpty()
  @IsDateString()
  endAt!: string

  @IsNotEmpty()
<<<<<<< HEAD
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  totalSeats!: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  isFree!: boolean;
=======
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  totalSeats!: number

  // akan dipakai juga sebagai availableSeats default
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  availableSeats!: number

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true" || value === true || value === 1 || value === "1") return true
    return false
  })
  isFree!: boolean

  @IsNotEmpty()
  @IsString()
  image!: string
>>>>>>> git-chesta
}
