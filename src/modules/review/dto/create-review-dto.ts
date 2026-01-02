import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

export class CreateReviewDTO {
  @IsInt()
  eventId!: number

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number

  @IsNotEmpty()
  @IsString()
  comment!: string
}
