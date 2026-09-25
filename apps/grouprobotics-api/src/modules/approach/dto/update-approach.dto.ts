import { IsObject, IsOptional } from 'class-validator';

export class UpdateApproachDto {
  @IsOptional()
  @IsObject()
  badge?: Record<string, string>;

  @IsOptional()
  @IsObject()
  title?: Record<string, string>;

  @IsOptional()
  @IsObject()
  paragraph?: Record<string, string>;

  @IsOptional()
  @IsObject()
  highlight?: Record<string, string>;

  @IsOptional()
  @IsObject()
  quote?: Record<string, string>;
}