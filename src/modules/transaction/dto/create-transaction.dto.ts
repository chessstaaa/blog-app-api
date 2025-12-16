import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionDTO {
  @IsNotEmpty()
  @IsNumber()
  eventId!: number;

  @IsNotEmpty()
  @IsNumber()
  qty!: number;
}