import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  oldPassword!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
