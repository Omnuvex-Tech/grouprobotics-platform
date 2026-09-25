import { IsObject, IsOptional } from 'class-validator';

export class UpdateCapabilitiesSettingsDto {
  @IsOptional()
  @IsObject()
  badge?: Record<string, string>;

  @IsOptional()
  @IsObject()
  title?: Record<string, string>;
}