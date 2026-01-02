import { IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateTicketDTO {
  @IsInt()
  eventId!: number

  @IsNotEmpty()
  @IsString()
  name!: string

  @IsInt()
  price!: number

  @IsInt()
  quantityAvailable!: number
}
