import { IsObject, IsNotEmpty } from 'class-validator';

export class UpdateOptionDto {
  @IsNotEmpty()
  @IsObject()
  label!: Record<string, string>;
}