import { IsObject, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsObject()
  title!: Record<string, string>;

  @IsNotEmpty()
  @IsObject()
  description!: Record<string, string>;

  @IsOptional()
  @IsString()
  icon?: string;
}