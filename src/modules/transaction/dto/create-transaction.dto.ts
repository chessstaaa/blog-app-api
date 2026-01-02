import { IsArray, ValidateNested, IsInt, Min, IsOptional } from "class-validator"
import { Type } from "class-transformer"

class TicketItemDTO {
  @IsInt()
  ticketId!: number

  @IsInt()
  @Min(1)
  qty!: number
}

export class CreateTransactionDTO {
  @IsInt()
  eventId!: number

  @IsOptional()
  @IsInt()
  voucherId?: number

  @IsOptional()
  @IsInt()
  pointsUsed?: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketItemDTO)
  items!: TicketItemDTO[]

  // legacy (tidak divalidasi, aman)
  ticketId?: number
  qty?: number
}
