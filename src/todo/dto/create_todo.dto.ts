import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTodoDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  detail: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  picture_url: string;

}