import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTodoDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  detail: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pictureUrl: string;

}