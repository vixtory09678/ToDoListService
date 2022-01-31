import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";

export class UpdateTodoDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  detail: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pictureName: string;

  @IsOptional()
  @IsBoolean()
  isDone: boolean;

}