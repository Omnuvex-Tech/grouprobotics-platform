import { IsObject, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsObject()
  label!: Record<string, string>;

  @IsOptional()
  @IsString()
  icon?: string;
}