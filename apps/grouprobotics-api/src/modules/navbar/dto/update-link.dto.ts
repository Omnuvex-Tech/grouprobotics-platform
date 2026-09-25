import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateLinkDto {
  @IsOptional()
  @IsObject()
  label?: Record<string, string>;

  @IsOptional()
  @IsString()
  href?: string;
}