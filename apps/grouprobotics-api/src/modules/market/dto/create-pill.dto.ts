import { IsObject, IsNotEmpty } from 'class-validator';

export class CreatePillDto {
  @IsNotEmpty()
  @IsObject()
  label!: Record<string, string>;
}