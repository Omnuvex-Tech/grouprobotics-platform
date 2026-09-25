import { IsObject, IsOptional } from 'class-validator';

export class UpdatePartnersSettingsDto {
  @IsOptional()
  @IsObject()
  badge?: Record<string, string>;

  @IsOptional()
  @IsObject()
  title?: Record<string, string>;
}