import { IsObject, IsNotEmpty } from 'class-validator';

export class UpdatePillDto {
  @IsNotEmpty()
  @IsObject()
  label!: Record<string, string>;
}