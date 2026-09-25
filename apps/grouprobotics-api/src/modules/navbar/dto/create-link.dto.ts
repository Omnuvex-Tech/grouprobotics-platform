import { IsObject, IsNotEmpty, IsString } from 'class-validator';

export class CreateLinkDto {
  @IsNotEmpty()
  @IsObject()
  label!: Record<string, string>;

  @IsNotEmpty()
  @IsString()
  href!: string;
}