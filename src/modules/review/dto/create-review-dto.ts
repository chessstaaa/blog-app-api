import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDTO {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  eventId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  rating!: number;

  @IsNotEmpty()
  @IsString()
  comment!: string;
}
