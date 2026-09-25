import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsObject()
  title?: Record<string, string>;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsOptional()
  @IsString()
  icon?: string;
}