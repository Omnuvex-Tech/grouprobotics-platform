import { IsOptional, IsString } from 'class-validator';

export class UpdateNavbarSettingsDto {
  @IsOptional()
  @IsString()
  logo?: string;
}