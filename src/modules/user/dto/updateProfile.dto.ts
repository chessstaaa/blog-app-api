import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProfileDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
