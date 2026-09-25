import { IsObject, IsNotEmpty } from 'class-validator';

export class CreateOptionDto {
  @IsNotEmpty()
  @IsObject()
  label!: Record<string, string>;
}