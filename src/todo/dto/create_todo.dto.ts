import { IsString, IsNotEmpty } from "class-validator";

export class CreateTodoDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  detail: string;

  @IsString()
  picture_url: string;

}