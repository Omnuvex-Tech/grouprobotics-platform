import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsObject()
  label?: Record<string, string>;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsOptional()
  @IsString()
  image?: string;
}