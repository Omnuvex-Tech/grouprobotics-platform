import { IsObject, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateConnectDto {
  @IsOptional()
  @IsObject()
  title?: Record<string, string>;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsOptional()
  @IsObject()
  cta?: Record<string, string>;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/, { message: 'bgColor #rrggbb formatında olmalıdır' })
  bgColor?: string;

  @IsOptional()
  @IsString()
  imageLeft?: string;

  @IsOptional()
  @IsString()
  imageRight?: string;
}