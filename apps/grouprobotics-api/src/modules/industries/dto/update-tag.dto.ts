import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsObject()
  label?: Record<string, string>;

  @IsOptional()
  @IsString()
  icon?: string;
}