import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateFooterSettingsDto {
  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsObject()
  companyName?: Record<string, string>;

  @IsOptional()
  @IsObject()
  location?: Record<string, string>;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsObject()
  copyrightLine?: Record<string, string>;

  @IsOptional()
  @IsObject()
  tagline?: Record<string, string>;
}