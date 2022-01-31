import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";

export class UpdateTodoDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
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